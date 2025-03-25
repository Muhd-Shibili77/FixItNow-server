import Booking from "../../domain/entity/Booking";
import Wallet from "../../domain/entity/Wallet";
import Worker from "../../domain/entity/Worker";
import { IWorkerRepository } from "../Interfaces/IWorkerRepository";
import Stripe from "stripe";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing from environment variables");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class WorkerUseCase {
  constructor(private WorkerRepository: IWorkerRepository) {}

  async fetchWorker(workerId: string): Promise<Worker> {
    if (!workerId) {
      throw new Error("workerId is empty");
    }
    const workerData = await this.WorkerRepository.findById(workerId);

    if (!workerData) {
      throw new Error("worker not found");
    }

    return workerData;
  }

  async WorkerProfileEdit(data: Worker): Promise<Worker> {
    const { id, username, service, experience, phone, about, profileImage } =
      data;

    if (!username || !service || !experience || !phone || !about) {
      throw new Error("All fields are required");
    }

    if (username.length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }

    if (service.trim().length === 0) {
      throw new Error("Service field is required");
    }

    if (isNaN(experience) || experience <= 0) {
      throw new Error("Experience must be a positive number");
    }

    const phoneString = String(phone);

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneString)) {
      throw new Error("Invalid phone number. It must be exactly 10 digits.");
    }

    if (about.length < 10) {
      throw new Error("About section must be at least 10 characters long");
    }

    const editedWorker = await this.WorkerRepository.editWorker(data);

    if (!editedWorker) {
      throw new Error("Failed to edit worker");
    }

    return editedWorker;
  }

  async getWorker(query: object, pageNumber: number, pageSize: number) {
    const worker = await this.WorkerRepository.getWorker(
      query,
      pageNumber,
      pageSize
    );
    if (!worker) {
      throw new Error("Failed to get worker");
    }

    return worker;
  }

  async getJob(workerId: string): Promise<Booking[] | null> {
    if (!workerId) {
      throw new Error("userid is empty");
    }
    const jobs = await this.WorkerRepository.getJob(workerId);

    return jobs;
  }

  async updateJob(jobId: string, isAccepted: boolean) {
    const job = await this.WorkerRepository.updateJob(jobId, isAccepted);
    return job;
  }

  async toggleWorkStatus(bookingId: string, workStatus: string) {
    await this.WorkerRepository.toggleWorkStatus(bookingId, workStatus);
  }
  async toggleReachStatus(bookingId: string, reachStatus: string) {
    await this.WorkerRepository.toggleReachStatus(bookingId, reachStatus);
  }
  async updateAmount(bookingId: string, amount: string) {
    await this.WorkerRepository.updateAmount(bookingId, amount);
  }

  async getWallet(workerId: string): Promise<Wallet | null> {
    if (!workerId) {
      throw new Error("workerId is empty");
    }
    const wallet = await this.WorkerRepository.getWallet(workerId);
    return wallet;
  }

  async createStripeAccount(userId: string) {
    if (!userId) {
      throw new Error("workerId is empty");
    }

    await this.WorkerRepository.createStripeAccount(userId);
    return;
  }
  async onboardingLink(userId: string) {
    if (!userId) {
      throw new Error("workerId is empty");
    }
    const worker = await this.WorkerRepository.findById(userId);
    if (!worker?.stripeAccountId) {
      throw new Error("worker does not have stripe account!");
    }

    const accountLink = await stripe.accountLinks.create({
      account: worker?.stripeAccountId,
      refresh_url: "http://localhost:5173/wallet",
      return_url: "http://localhost:5173/wallet",
      type: "account_onboarding",
    });

    return accountLink;
  }

  async testPayout(userId: string) {
    if (!userId) {
      throw new Error("workerId is empty");
    }

    await this.WorkerRepository.testPayout(userId);
    return;
  }

  async updateWorkerPassword(
    userId: string,
    newPassword: string,
    currentPassword: string
  ) {
    if (!userId) {
      throw new Error("user id is not provided");
    }
    const worker = await this.WorkerRepository.findById(userId);
    if (!worker || !worker.password) {
      throw new Error("worker not found");
    }
    const isPasswordCorrect = await bcrypt.compare(
     currentPassword,
      worker.password
    );
    if (!isPasswordCorrect) {
      throw new Error("incorrect current password,try again!");
    }
    const samePassword = await bcrypt.compare(newPassword, worker.password);
    if (samePassword) {
      throw new Error("new password is same as current password!");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.WorkerRepository.updateWorkerPassword(userId,hashedPassword)
    return
  }
}

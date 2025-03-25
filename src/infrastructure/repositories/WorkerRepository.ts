import { IWorkerRepository } from "../../application/Interfaces/IWorkerRepository";
import WorkerModel from "../../infrastructure/models/workerModel";
import Worker from "../../domain/entity/Worker";
import Booking from "../../domain/entity/Booking";
import bookingModel from "../models/bookModel";
import { WorkStatus } from "../models/bookModel";  // Adjust path if needed
import Wallet from "../../domain/entity/Wallet";
import walletModel from "../models/walletModel";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing from environment variables");
  }
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class WorkerRepository implements IWorkerRepository{

    async findById(workerId:string):Promise<Worker | null>{
        const worker = await WorkerModel.findOne({_id:workerId}).populate("service", "name")
        
        if (!worker) {
            return null; 
        }

         return worker
    }

    async editWorker(data:Worker):Promise<Worker>{
        
        const { id, ...updateData } = data; // Extract email and remaining fields

        if (!id) {
            throw new Error("Worker ID is required for updating details");
        }
      
        const updatedWorker = await WorkerModel.findByIdAndUpdate(
            id,                
            { $set: updateData }, 
            { new: true, runValidators: true }
        );
        if (!updatedWorker) {
            throw new Error("Worker not found or update failed");
        }

        return new Worker(updatedWorker);
    }

    async getWorker(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{ workers: Worker[], totalPages: number }> {
        const totalCount = await WorkerModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / pageSize);
        
        const workers = await WorkerModel.find(query)
            .populate("service", "name")
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

          
            
        return {
            workers: workers.map(worker => new Worker({
                id: worker.id,
                username: worker.username,
                profileImage: worker.profileImage,
                experience:worker.experience,
                service : (worker.service as any)?.name,
                averageRating:worker.averageRating,
                totalReviews:worker.totalReviews
            })),
            totalPages
        };
    }
    async getJob(workerId: string): Promise<Booking[] | null> {
        
        const jobs = await bookingModel.find({ workerId: workerId }).populate("userId", "username phone profileImage").sort({ placedAt: -1 });;
        if (!jobs.length) {
            return null;
        }
        return jobs.map((booking) => new Booking({
            id: String(booking._id),
            placedAt: booking.placedAt,
            workerId: booking.workerId,
            serviceId: booking.serviceId,
            userId: booking.userId,
            bookingType: booking.bookingType,
            date: booking.date,
            workStatus: booking.workStatus,
            reachingStatus: booking.reachingStatus,
            isAccepted: booking.isAccepted,
            isFeedback: booking.isAccepted,
            amount: booking.amount,
            paymentStatus:booking.paymentStatus,
            bookingNo:booking.bookingNo,
            address: {
                name: booking.address.name,
                address: booking.address.address,
                city: booking.address.city,
                state: booking.address.state,
                pincode: booking.address.pincode,
                country: booking.address.country,
                phone: booking.address.phone,
            },
            
        }));
    }

    async updateJob(jobId: string, isAccepted: boolean): Promise<void | null> {
       
        const jobs = await bookingModel.updateOne(
            { _id: jobId }, 
            { 
                $set: { 
                    isAccepted: isAccepted,
                    workStatus: isAccepted ? WorkStatus.PENDING : WorkStatus.REJECTED 
                } 
            }
        ).populate("userId", "username phone");
        
        if (jobs.modifiedCount === 0) {
            return null;
        }
       
    }

    async toggleWorkStatus(bookingId: string, workStatus: string): Promise<void> {
        await bookingModel.findByIdAndUpdate(bookingId,{workStatus:workStatus})
    }

    async toggleReachStatus(bookingId: string, reachStatus: string): Promise<void> {
        await bookingModel.findByIdAndUpdate(bookingId,{reachingStatus:reachStatus})
    }
    async updateAmount(bookingId: string, amount: string): Promise<void> {
        await bookingModel.findByIdAndUpdate(bookingId,{amount:amount})
    }

    async getWallet(workerId: string): Promise<Wallet | null> {

        let wallet = await walletModel.findOne({worker:workerId}).populate("worker")
        if(!wallet){
            wallet = new walletModel({
                worker:workerId,
                balanceAmount:0,
                walletHistory:[],
            })
        }
        await wallet.save()
        return wallet.toObject() as Wallet;
    }
    async createStripeAccount(userId: string): Promise<void> {
        let worker = await WorkerModel.findById(userId)
        
        if (!worker) {
            throw new Error("Worker not found");
        }
        if (!worker.email) {
            throw new Error("Worker email is missing. Cannot create Stripe account.");
        }
        if (worker?.stripeAccountId) {
            throw new Error('worker already have stripe account')
        }
       
        try {
            const account = await stripe.accounts.create({
                type: "standard",
                country: "IN", 
                email: worker?.email,
            });
            
            worker.stripeAccountId = account.id;
            await worker.save();
        } catch (error) {
            console.error("Stripe Error:", error);
            throw new Error("Failed to create Stripe account.");
        }
          return
    }
     

    async testPayout(userId: string): Promise<void> {
        const wallet = await walletModel.findOne({worker:userId})
        if(wallet){
            const amount = wallet.balanceAmount;
            wallet.balanceAmount -= amount
            wallet.walletHistory.push({
                date: new Date(),
                amount:-amount,
                description:`payout to worker`,
                transactionType:'debited'
              });
            await wallet.save();
        }
        return

    }

    async updateWorkerPassword(userId: string, newPassword: string): Promise<void> {
        await WorkerModel.findByIdAndUpdate(userId,{password:newPassword})
    }

}

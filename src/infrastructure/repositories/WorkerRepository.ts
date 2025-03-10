import { IWorkerRepository } from "../../application/Interfaces/IWorkerRepository";
import WorkerModel from "../../infrastructure/models/workerModel";
import Worker from "../../domain/entity/Worker";
import Booking from "../../domain/entity/Booking";
import bookingModel from "../models/bookModel";
import { WorkStatus } from "../models/bookModel";  // Adjust path if needed

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
                name: worker.name,
                profileImage: worker.profileImage,
                experience:worker.experience,
                service : (worker.service as any)?.name
            })),
            totalPages
        };
    }
    async getJob(workerId: string): Promise<Booking[] | null> {
        
        const jobs = await bookingModel.find({ workerId: workerId }).populate("userId", "username phone").sort({ placedAt: -1 });;
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
}
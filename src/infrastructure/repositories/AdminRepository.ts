import AdminModel from "../models/adminModel";
import { IAdminRepository } from "../../application/Interfaces/IAdminRepository";
import Admin from "../../domain/entity/Admin";
import User from "../../domain/entity/User";
import UserModel from "../models/userModel";
import Worker from "../../domain/entity/Worker";
import WorkerModel from "../models/workerModel";
import Booking from "../../domain/entity/Booking";
import bookingModel from "../models/bookModel";

export class AdminRespository implements IAdminRepository {
   async findAdminByEmail(email: string): Promise<Admin | null> {
       const admin = await AdminModel.findOne({email:email})
       if(!admin){
        return null
       }
       return new Admin({id:admin.id,name: admin.name, email: admin.email,password:admin.password})
   }

   async fetchUsers(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{users:Partial<User>[],totalPages:number}> {

    const totalCount = await UserModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);  
    const users = await UserModel.find(query)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

    if (!users || users.length === 0) {
        return { users: [], totalPages: 0 }; // Return an empty list instead of `null`
    }
    
      return {
        users: users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          isBlock: user.isBlock
        }as Partial<User>)), 
        totalPages
      };
   } 


   async toggleBlockUser(actions: string, id: string): Promise<void> {
       
    await UserModel.findByIdAndUpdate(id,{isBlock:actions})
    
   }



   async fetchWorkers(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{workers:Partial<Worker>[],totalPages:number}> {
   
    
    if (Object.keys(query).length === 0 && pageNumber===0 && pageSize==0) { 

     
      const workers = await WorkerModel.find().populate('service', 'name');
      
      return {
        workers: workers.map(worker => ({
          id: worker.id,
          name: worker.name,
          email: worker.email,
          isBlock: worker.isBlock,
          experience: worker.experience,
          service: worker.service,
          phone: worker.phone,
          about: worker.about,
          profileImage:worker.profileImage
        }) as Partial<Worker>),
        totalPages: 1, 
      };

    }

   
    const totalCount = await UserModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);   
    const worker = await WorkerModel.find(query).populate('service','name')
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
       
       if(!worker || worker.length === 0){
        return {workers:[],totalPages:0}
       }
       return {
        workers:worker.map(worker=>({
          id:worker.id,
          name:worker.name,
          email:worker.email,
          isBlock:worker.isBlock,
          experience:worker.experience,
          service:worker.service,
          phone:worker.phone,
          about:worker.about
        }as Partial<Worker>)),
        totalPages
       }
   }

   async toggleBlockWorker(actions: string, id: string): Promise<void> {
     await WorkerModel.findByIdAndUpdate(id,{isBlock:actions})
   }

   async fetchBookings(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{bookings:Booking[] | null,totalPages:number}> {


    const totalCount = await bookingModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);   
    
    
   

       const bookings = await bookingModel.find(query).populate("workerId",'name phone').populate('userId','username')
       .skip((pageNumber - 1) * pageSize)
       .limit(pageSize);

       if(!bookings){
            return {bookings:null,totalPages:0}
       }
       
       return {
        bookings:bookings.map((booking) =>({
          id: String(booking._id),
          placedAt: booking.placedAt,
          workerId: booking.workerId,
          serviceId: booking.serviceId,
          userId: booking.userId,
          bookingType: booking.bookingType,
          bookingNo:booking.bookingNo,
          workStatus: booking.workStatus,
          reachingStatus: booking.reachingStatus,
          isAccepted: booking.isAccepted,
          isFeedback: booking.isAccepted,
          paymentStatus:booking.paymentStatus,
          amount: booking.amount,
          date: booking.date,
          address: {
              name: booking.address.name,
              address: booking.address.address,
              city: booking.address.city,
              state: booking.address.state,
              pincode: booking.address.pincode,
              country: booking.address.country,
              phone: booking.address.phone,
          },
          
        })),
         totalPages
       }
       
       
   }

   async toggleCancelBooking(bookingId: string): Promise<void> {
     await bookingModel.findByIdAndUpdate(bookingId,{workStatus:'Cancelled'})
   }
}

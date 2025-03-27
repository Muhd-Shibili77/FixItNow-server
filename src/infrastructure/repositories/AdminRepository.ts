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
          phone:user.phone,
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
          username: worker.username,
          email: worker.email,
          isBlock: worker.isBlock,
          experience: worker.experience,
          service: worker.service,
          phone: worker.phone,
          about: worker.about,
          profileImage:worker.profileImage,
          averageRating:worker.averageRating,
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
          username: worker.username,
          email:worker.email,
          isBlock:worker.isBlock,
          experience:worker.experience,
          service:worker.service,
          phone:worker.phone,
          about:worker.about,
          averageRating:worker.averageRating,
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
    
    
   

       const bookings = await bookingModel.find(query).populate("workerId",'username phone').populate('userId','username')
       .skip((pageNumber - 1) * pageSize)
       .limit(pageSize)
       .sort({placedAt:-1})

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

   async toggleCancelBooking(bookingId: string){
     await bookingModel.findByIdAndUpdate(bookingId,{workStatus:'Cancelled'})
   }

   async fetchDashboardData(): Promise<{ totalServices: number; todayServices: number; serviceCompleted: number; servicePending: number; yearlyBreakup: number; monthly: number; todays: number; }> {
      const bookings = await bookingModel.countDocuments();

      const now = new Date()
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0); 
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999); 
      const stateOfYear = new Date(new Date().getFullYear(),0,1);
      const endOfYear = new Date(new Date().getFullYear(),11,31,23,59,999)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);


      const todayBookings = await bookingModel.countDocuments({
        placedAt :{$gt :startOfDay , $lt:endOfDay}
      })

      const completedService = await bookingModel.countDocuments({
        workStatus:'Completed'
      })
      const pendingService = await bookingModel.countDocuments({
        workStatus:'Pending'
      })
      const yearlyBookings = await bookingModel.countDocuments({
        workStatus: "Completed",
        placedAt:{$gt:stateOfYear,$lt:endOfYear}
      })
      const yearlyBreakup = yearlyBookings*40

      const monthlyCompletedBookings  = await bookingModel.countDocuments({
        workStatus: "Completed",
        placedAt:{$gt:startOfMonth,$lt:endOfMonth}
      })
      const monthlyProfit = monthlyCompletedBookings*40

      const todayCompletedBookings = await bookingModel.countDocuments({
        workStatus: "Completed",
        placedAt :{$gt :startOfDay , $lt:endOfDay}
      })

      const dailyProfit = todayCompletedBookings*40

      return{
        totalServices:bookings,
        todayServices:todayBookings,
        serviceCompleted:completedService,
        servicePending:pendingService,
        yearlyBreakup:yearlyBreakup,
        monthly:monthlyProfit,
        todays:dailyProfit,
      }
   }

   async fetchChartData(): Promise<{ dataPoints: number[]; }> {
       const currentYear = new Date().getFullYear();
       const monthlyData = await bookingModel.aggregate([
        {
          $match:{
            placedAt:{
              $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
              $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$placedAt" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
       ])

       const monthlyBookings = Array(12).fill(0);
       

       monthlyData.forEach(({ _id, count }) => {
            monthlyBookings[_id - 1] = count;
       });
       

       return {dataPoints:monthlyBookings}
   }



   async fetchEarnings(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{bookings:Partial<Booking>[] | null,totalPages:number}> {


    const totalCount = await bookingModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);   
    
    
   

       const bookings = await bookingModel.find(query,{_id:1,placedAt:1,paymentStatus:1,bookingNo:1,amount:1})
       .skip((pageNumber - 1) * pageSize)
       .limit(pageSize)
       .sort({placedAt:-1})

       if(!bookings){
            return {bookings:null,totalPages:0}
       }
       
       return {
        bookings:bookings.map((booking) =>({
          id: String(booking._id),
          placedAt: booking.placedAt,
          bookingNo:booking.bookingNo,
          paymentStatus:booking.paymentStatus,
          amount: booking.amount,
          commision:40,
        })),
         totalPages
       }
       
       
   }

   
}

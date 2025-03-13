import { IUserRepository } from "../../application/Interfaces/IUserRepository";
import AddressModel from "../models/addressModel";
import UserModel from "../models/userModel";
import WorkerModel from "../models/workerModel";
import Address from "../../domain/entity/Address";
import User from "../../domain/entity/User";
import Worker from "../../domain/entity/Worker";
import Service from "../../domain/entity/Service";
import ServiceModel from "../models/serviceModel";
import Booking from "../../domain/entity/Booking";
import bookingModel from "../models/bookModel";
import CounterModel from "../models/counterModel";
import walletModel from "../models/walletModel";
import Wallet from "../../domain/entity/Wallet";
import reviewModel from "../models/reviewModel";
import Review from "../../domain/entity/Review";

async function generateBookingNo(){

  const counter = await CounterModel.findOneAndUpdate(
    {name:'bookingCounter'},
    {$inc:{value:1}},
    {new:true,upsert:true}
  )

  const prefix ='FIX'
  const number = String(counter.value).padStart(4,"0")
  return `${prefix}${number}`

}

export class UserRepository implements IUserRepository {
  async addAddress(address: Address): Promise<Address> {
    const createdAddress = await AddressModel.create(address); // Save to DB

    if (!createdAddress) {
      throw new Error("Database insertion failed");
    }
    return new Address(address);
  }
  async getAddress(userId: string): Promise<Address[]> {
    const addresses = await AddressModel.find({ userId: userId });

    return addresses.map(
      (address) =>
        new Address({
          id: String(address._id),
          name: String(address.name),
          address: String(address.address),
          city: String(address.city),
          state: String(address.state),
          pincode: Number(address.pincode),
          country: String(address.country),
          phone: Number(address.phone),
          userId: String(address.userId),
        })
    );
  }
  async findAddressById(addressId: string): Promise<Address | null> {
    const address = await AddressModel.findById(addressId);

    if (!address) {
      return null;
    }

    return new Address({
      id: String(address._id),
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      phone: address.phone,
      userId: String(address.userId),
    });
  }

  async findUserById(UserId: string): Promise<User | null> {
    const user = await UserModel.findById(UserId);

    if (!user) {
      return null;
    }
    return user;
  }
  async findWorkerById(WorkerId: string): Promise<Worker | null> {
    const worker = await WorkerModel.findById(WorkerId);

    if (!worker) {
      return null;
    }

    return worker;
  }
  async findServiceById(serviceId: string): Promise<Service | null> {
    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return null;
    }

    return new Service(service);
  }

  async bookAnWorker(
    
  workerId: string,
  serviceId: string,
  userId: string,
  bookingType: string,
  date:string,
  address: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: number;
    country: string;
    phone: number;
  }
): Promise<Booking> {

  const bookingNo = await generateBookingNo()
    
  const createBooking = await bookingModel.create({
    placedAt: new Date(),
    workerId,
    serviceId,
    userId,
    bookingType,
    date,
    address,
    bookingNo, 
  });

  return new Booking({
    id: String(createBooking._id),
    bookingNo:String(createBooking.bookingNo),
    placedAt: createBooking.placedAt,
    workerId: String(createBooking.workerId),
    serviceId: String(createBooking.serviceId),
    userId: String(createBooking.userId),
    bookingType: createBooking.bookingType,
    date: createBooking.date,
    workStatus: createBooking.workStatus,
    reachingStatus: createBooking.reachingStatus,
    isAccepted: createBooking.isAccepted,
    amount: createBooking.amount,
    paymentStatus:createBooking.paymentStatus,
    address: {
      name: createBooking.address.name,
      address: createBooking.address.address,
      city: createBooking.address.city,
      state: createBooking.address.state,
      pincode: createBooking.address.pincode,
      country: createBooking.address.country,
      phone: createBooking.address.phone,
    },
  });
}
async findBookings(userId: string): Promise<Booking[] | null> {
  const bookings = await bookingModel.find({ userId: userId }).populate("serviceId", "name").populate('workerId',"name phone").populate('userId','username').sort({ placedAt: -1 });

  if (!bookings.length) {
      return null;
  }

  return bookings.map((booking) => new Booking({
      id: String(booking._id),
      placedAt: booking.placedAt,
      workerId: booking.workerId,
      serviceId: booking.serviceId,
      userId: booking.userId,
      bookingType: booking.bookingType,
      date: booking.date,
      bookingNo:booking.bookingNo,
      workStatus: booking.workStatus,
      reachingStatus: booking.reachingStatus,
      isAccepted: booking.isAccepted,
      isFeedback: booking.isFeedback,
      amount: booking.amount,
      paymentStatus:booking.paymentStatus,
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

async makePayment(bookingId: string, amount: number): Promise<void> {

    
    const workerCharge = (amount/100)-40;
    
    
    const booking = await bookingModel.findByIdAndUpdate(bookingId,{paymentStatus:true})
    
    if(!booking){
      throw new Error('booking not found')
    }
    let wallet = await walletModel.findOne({worker:booking.workerId})
    
    if(!wallet){
      wallet = new walletModel({
        worker:booking.workerId,
        balanceAmount:0,
        walletHistory:[],
      })
    }
    wallet.balanceAmount += workerCharge;
    wallet.walletHistory.push({
      date: new Date(),
      amount:workerCharge,
      description:`Service payment(${booking.bookingNo})`,
      transactionType:'credited'
    })

    await wallet.save()

}

async sentReview(user: string, worker: string, booking: string, rating: number, review: string): Promise<void> {
    const job = await bookingModel.findById(booking,{workStatus:'Completed',paymentStatus:true})
    if(!job){
      throw new Error('booking is not available!')
    }
    const rateReview = await reviewModel.create({
      user,
      worker,
      booking,
      rating,
      review
    })

    const reviews = await reviewModel.find({worker:worker})
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((sum,b)=> sum + b.rating ,0) / totalReviews;
    await WorkerModel.findByIdAndUpdate(worker,{averageRating:avgRating,totalReviews})
    job.isFeedback = true
    await job.save()
    return
}

async getReview(workerId: string): Promise<Review[] | null> {
    const reviews = await reviewModel.find({worker:workerId}).populate('user','username')
    
    return reviews.map((review)=> new Review({
        id:review.id,
        user:review.user,
        worker:review.worker,
        booking:review.booking,
        rating:review.rating,
        review:review.review
    }))
}

} 

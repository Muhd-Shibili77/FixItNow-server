import Address from "../../domain/entity/Address";
import Booking from "../../domain/entity/Booking";
import { IUserRepository } from "../Interfaces/IUserRepository";
import Stripe from "stripe";
import dotenv from "dotenv";
import Review from "../../domain/entity/Review";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing from environment variables");
  }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class UserUseCase{
    constructor(private userRepository : IUserRepository){}

    async addAddress(address:Address):Promise<Address>{
      
       
       if(!address){
            throw new Error('address is empty')
       }
       const createdAddress = await this.userRepository.addAddress(address)       
       if (!createdAddress) {
            throw new Error("Failed to add address");
        }
        return createdAddress
    }

    async getAddress(userId:string):Promise<Address[]>{
      
       
       if(!userId){
            throw new Error('userId is empty')
       }
       const address = await this.userRepository.getAddress(userId)       
       if (!address) {
            throw new Error("Failed to get address");
        }
        return address
    }

    async bookWorker(bookingType:string,date:string,workerId:string,userId:string,bookAddress:string):Promise<Booking>{
        if(!bookAddress || !bookingType || !workerId || !userId){
            throw new Error("All fields are required");
        }
        const findAddress = await this.userRepository.findAddressById(bookAddress)
        if(!findAddress){
            throw new Error('Address not found')
        }
        
    
        const addressArray = {
            name: findAddress.name,
            address: findAddress.address,
            pincode: findAddress.pincode,
            phone: findAddress.phone,
            city: findAddress.city,
            state: findAddress.state,
            country: findAddress.country,
            userId: findAddress.userId
        };
        
        
    

        const findWorker = await this.userRepository.findWorkerById(workerId)
        if(!findWorker){
            throw new Error('worker not found')
        }
        const findUser = await this.userRepository.findUserById(userId)
        if(!findUser){
            throw new Error('user not found')
        }
        const service_id = findWorker?.service
        
        const findService = await this.userRepository.findServiceById(service_id)
        if(!findService){
            throw new Error('service not found')
        }
        

       const bookAnWorker = await this.userRepository.bookAnWorker(workerId,service_id,userId,bookingType,date,addressArray)
       if(!bookAnWorker){
         throw new Error('failed to book')
        }
   
    return bookAnWorker

    }

    async getBookings(userId:string):Promise<Booking[] | null>{
        if(!userId){
            throw new Error('userid is empty')
        }
        const findUser = await this.userRepository.findUserById(userId)
        if(!findUser){
            throw new Error('user not found')
        }

        const bookings = await this.userRepository.findBookings(userId)
        if(!bookings){
            return null
        }
        return bookings
    }

    async createPayment(bookingId:string,bookingNO:string,amount:number,user:string,address:any){
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount:(amount + 40)*100,
            currency:'inr',
            metadata:{bookingId},
            description:`Payment for booking ${bookingNO}`,
            shipping:{
                name:user,
                address:{
                    line1:address.address,
                    city:address.city,
                    state:address.state,
                    postal_code:address.pincode,
                    country:'IN',
                }
            }
        });
        return paymentIntent
    }

    async makePayment(bookingId:string,amount:number){
        if(!bookingId){
            throw new Error('bookingid is empty')
        }
        if(!amount){
            throw new Error('amount is empty')
        }
        await this.userRepository.makePayment(bookingId,amount)
    }

    async rateReview(user: string, worker: string, booking: string, rating: number, review: string){
        if(!user){
            throw new Error('user id is empty')
        }
        if(!worker){
            throw new Error('worker id is empty')
        }
        if(!booking){
            throw new Error('booking id is empty')
        }
        if(!rating){
            throw new Error('rating is empty')
        }
        if(!review){
            throw new Error('review is empty')
        }
        await this.userRepository.sentReview(user,worker,booking,rating,review)
        
    }

    async getReview(workerId:string):Promise<Review[] | null>{
        if(!workerId){
            throw new Error("workerId is empty")
        }

        const review = await this.userRepository.getReview(workerId)

        return review
    }
}
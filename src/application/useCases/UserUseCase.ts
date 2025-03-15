import bcrypt from "bcrypt";
import Address from "../../domain/entity/Address";
import Booking from "../../domain/entity/Booking";
import { IUserRepository } from "../Interfaces/IUserRepository";
import Stripe from "stripe";
import dotenv from "dotenv";
import Review from "../../domain/entity/Review";
import User from "../../domain/entity/User";

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

    async bookWorker(bookingType:string,date:string,workerId:string,userId:string,bookAddress:string,userLocation:string):Promise<Booking>{
        if(!bookAddress || !bookingType || !workerId || !userId || !userLocation){
            throw new Error("All fields are required");
        }
        // if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
        //     throw new Error("Location is required");
        //   }
        console.log(typeof userLocation)
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
        

       const bookAnWorker = await this.userRepository.bookAnWorker(workerId,service_id,userId,bookingType,date,addressArray,userLocation)
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

    async userInfo(userId:string):Promise<User | null>{
        if(!userId){
            throw new Error('user id is empty')
        }
        const userInfo = await this.userRepository.userInfo(userId)
        return userInfo
    }

    async updateUserInfo(userId:string,username:string,phone:number,profileImage:string){
        if(!userId){
            throw new Error('user id is empty')
        }
        
        const updatedUser = await this.userRepository.updateUser(userId,username,phone,profileImage)
        return updatedUser
    }

    async updateUserPassword(userId:string,newPassword:string,currentPassword:string){
        if(!userId){
            throw new Error('user id is not provided')
        }
        const user = await this.userRepository.userInfo(userId)
        if(!user){
            throw new Error('user not found')
        }
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        )
        if(!isPasswordCorrect){
            throw new Error('incorrect current password,try again!')
        }
        const samePassword = await bcrypt.compare(
            newPassword,
            user.password
        )
        if(samePassword){
            throw new Error('new password is same as current password!')
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);
        await this.userRepository.updateUserPassword(userId,hashedPassword)
        return
    }

    async userLocation(bookingId:string){
        if(!bookingId){
            throw new Error('bookingId is not provided')
        }
        const booking = await this.userRepository.getLocation(bookingId)
        return booking
    }
}
import Address from "../../domain/entity/Address";
import Service from "../../domain/entity/Service";
import User from "../../domain/entity/User";
import Worker from "../../domain/entity/Worker";
import Booking from "../../domain/entity/Booking";
import Review from "../../domain/entity/Review";

export interface IUserRepository {
  addAddress(address: Address): Promise<Address>;
  getAddress(userId: string): Promise<Address[]>;
  findAddressById(addressId: string): Promise<Address | null>;
  findUserById(UserId: string): Promise<User | null>;
  findWorkerById(WorkerId: string): Promise<Worker | null>;
  findServiceById(serviceId: string): Promise<Service | null>;
  bookAnWorker(
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
  ): Promise<Booking>;
  findBookings(userId:string):Promise<Booking[] | null>
  makePayment(bookingId:string,amount:number):Promise<void>
  sentReview(user:string,worker:string,booking:string,rating:number,review:string):Promise<void>
  getReview(workerId:string):Promise<Review[] | null>
}

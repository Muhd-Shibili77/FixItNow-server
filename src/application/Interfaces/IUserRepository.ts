import Address from "../../domain/entity/Address";
import Service from "../../domain/entity/Service";
import User from "../../domain/entity/User";
import Worker from "../../domain/entity/Worker";
import Booking from "../../domain/entity/Booking";

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
}

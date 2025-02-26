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

    
  const createBooking = await bookingModel.create({
    placedAt: new Date(),
    workerId,
    serviceId,
    userId,
    bookingType,
    address, 
  });

  return new Booking({
    id: String(createBooking._id),
    placedAt: createBooking.placedAt,
    workerId: String(createBooking.workerId),
    serviceId: String(createBooking.serviceId),
    userId: String(createBooking.userId),
    bookingType: createBooking.bookingType,
    workStatus: createBooking.workStatus,
    reachingStatus: createBooking.reachingStatus,
    isAccepted: createBooking.isAccepted,
    amount: createBooking.amount,
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
  const bookings = await bookingModel.find({ userId: userId }).populate("serviceId", "name").populate('workerId',"name phone").sort({ placedAt: -1 });

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
      workStatus: booking.workStatus,
      reachingStatus: booking.reachingStatus,
      isAccepted: booking.isAccepted,
      amount: booking.amount,
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


} 

import { ObjectId } from "mongoose";

class Booking {
  public readonly id!: string;
  public workerId!: string;
  public serviceId!: string;
  public bookingNo!:string;
  public amount!: number;
  public paymentStatus!: boolean;
  public userId!: string;
  public workStatus!: boolean;
  public reachingStatus!: string;
  public bookingType!: string;
  public date!: string;
  public address!: {
    id?: string; 
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: number;
    country: string;
    phone: number;
  };
  public isAccepted!: boolean;
  public placedAt!: Date;

  constructor(data: Partial<Booking>) {
    Object.assign(this, data);
  }
}

export default Booking;

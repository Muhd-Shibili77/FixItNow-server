import { ObjectId } from "mongoose";

class Booking {
  public readonly id!: string;
  public workerId!: string;
  public serviceId!: string;
  public amount!: number;
  public userId!: string;
  public workStatus!: boolean;
  public reachingStatus!: string;
  public bookingType!: string;
  public address!: {
    id?: string; // Optional, since MongoDB generates `_id`
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

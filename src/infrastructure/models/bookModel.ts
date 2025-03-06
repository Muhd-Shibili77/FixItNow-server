import mongoose, { Schema, Document, ObjectId } from "mongoose";


export enum WorkStatus {
  REQUESTED ='Requested',
  REJECTED ='Rejected',
    PENDING = 'Pending',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
    CANCELLED ='Cancelled'
  }
  
  // Enum for reachingStatus
  export enum ReachingStatus {
    NOT_STARTED = 'notStarted',
    ON_THE_WAY = 'onTheWay',
    ARRIVED = 'arrived',
  }
  export enum BookingType {
    INSTANT = 'instant',
    SCHEDULED = 'scheduled',
  }


export interface IBooking extends Document {
  workerId: string;
  serviceId: string;
  amount: number;
  userId: string;
  bookingNo:string,
  workStatus: boolean;
  reachingStatus: string;
  bookingType: string;
  address: {
    pincode: number;
    state: string;
    country: string;
    address: string;
    phone: number;
    name: string;
    city: string;
  };
  isAccepted: boolean;
  placedAt: Date;
}

const bookingSchema: Schema = new Schema({
    placedAt: { type: Date, required: true },
    workerId: { type: Schema.Types.ObjectId, required: true, ref: "Workers" },
    serviceId: { type: Schema.Types.ObjectId, required: true, ref: "Service" },
    amount: { type: Number, required: true, default: 0 },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    workStatus: {
      type: String,
      required: true,
      enum: Object.values(WorkStatus),
      default: WorkStatus.REQUESTED,
    },
    reachingStatus: {
      type: String,
      required: true,
      enum: Object.values(ReachingStatus),
      default: ReachingStatus.NOT_STARTED,
    },
    bookingType: { type: String, required: true, enum: Object.values(BookingType) },
    bookingNo: { type: String, required: true, },
 
    address: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      pincode: { type: Number, required: true },
      phone: { type: Number, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
  
    isAccepted: { type: Boolean, required: true, default: false },
  });
  
  

const bookingModel = mongoose.model<IBooking>("Booking", bookingSchema);

export default bookingModel;

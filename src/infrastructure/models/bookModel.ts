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
    SCHEDULED = 'schedule',
  }


export interface IBooking extends Document {
  workerId: string;
  serviceId: string;
  amount: number;
  paymentStatus: boolean;
  userId: string;
  bookingNo:string,
  workStatus: boolean;
  reachingStatus: string;
  bookingType: string;
  date: string;
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
  isFeedback: boolean;
  placedAt: Date;
  userLocation:{
    latitude:number,
    longitude:number
  }
}

const bookingSchema: Schema = new Schema({
    placedAt: { type: Date, required: true },
    workerId: { type: Schema.Types.ObjectId, required: true, ref: "Workers" },
    serviceId: { type: Schema.Types.ObjectId, required: true, ref: "Service" },
    amount: { type: Number },
    paymentStatus:{ type: Boolean,default:false },
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
    date: { type: String},
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
  
    isAccepted: { type: Boolean },
    isFeedback:{type:Boolean,default:false},
    userLocation:{
      latitude:{type:Number},
      longitude:{type:Number}
    }
  });
  
  

const bookingModel = mongoose.model<IBooking>("Booking", bookingSchema);

export default bookingModel;

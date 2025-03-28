import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  user: string; 
  sender: string;
  senderModel: "Users" | "Workers"; 
  type: "message" | "reaction";
  message: string; 
  isRead: boolean;
  timestamp: Date; 
}

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  sender: { type: Schema.Types.ObjectId, required: true },
  senderModel: { type: String, enum: ["Users", "Workers"], required: true },
  type: { type: String, enum: ["message", "reaction"], required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);

export default NotificationModel;

import mongoose from "mongoose";
import { INotificationRepository } from "../../application/Interfaces/INotificationRepository";
import Notification from "../../domain/entity/Notification";
import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";
import WorkerModel from "../models/workerModel";

export class NotificationRepository implements INotificationRepository {

    async createNotification(data: Partial<Notification>): Promise<Notification> {
        const notification = new NotificationModel(data);
        const newNotification = await notification.save();

        let senderDetails;
        if(newNotification.senderModel === 'Users'){
            senderDetails = await UserModel.findById(newNotification.sender,"username profileImage")            
        }else{
            senderDetails = await WorkerModel.findById(newNotification.sender,"username profileImage")
        }
        
        return new Notification({
            id:newNotification.id,
            sender:newNotification.sender,
            type:newNotification.type,
            message:newNotification.message,
            isRead:newNotification.isRead,
            timestamp:newNotification.timestamp,
            senderDetails:senderDetails,
            // senderName: senderDetails?.username || "Unknown",
            // senderProfileImage: senderDetails?.profileImage || "",
        })
    }

    async getUserNotifications(userId: string): Promise<Notification[]> {
        const notifications = await NotificationModel.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $sort: { timestamp: -1 } },
            {
                $lookup: {
                    from: "users", 
                    localField: "sender",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $lookup: {
                    from: "workers", 
                    localField: "sender",
                    foreignField: "_id",
                    as: "workerInfo"
                }
            },
            {
                $addFields: {
                    senderDetails: {
                        $cond: {
                            if: { $eq: ["$senderModel", "Users"] },
                            then: { $arrayElemAt: ["$userInfo", 0] },
                            else: { $arrayElemAt: ["$workerInfo", 0] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    sender: 1,
                    senderModel: 1,
                    type: 1,
                    message: 1,
                    isRead: 1,
                    timestamp: 1,
                    "senderDetails.username": 1,
                    "senderDetails.profileImage": 1
                }
            }
        ]);
    
        return notifications;
    }
    

    async markNotificationsAsRead(userId: string): Promise<void> {
        await NotificationModel.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } });
    }
}
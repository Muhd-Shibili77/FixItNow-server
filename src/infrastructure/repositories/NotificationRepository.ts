import { INotificationRepository } from "../../application/Interfaces/INotificationRepository";
import Notification from "../../domain/entity/Notification";
import NotificationModel from "../models/notificationModel";

export class NotificationRepository implements INotificationRepository {

    async createNotification(data: Partial<Notification>): Promise<Notification> {
        const notification = new NotificationModel(data);
        const newNotification = await notification.save();

        return new Notification({
            id:newNotification.id,
            sender:newNotification.sender,
            type:newNotification.type,
            message:newNotification.message,
            isRead:newNotification.isRead,
            timestamp:newNotification.timestamp,
        })
    }

    async getUserNotifications(userId: string): Promise<Notification[]> {
        const notifications = await NotificationModel.find({ user: userId }).sort({ timestamp: -1 });

        return notifications.map((not)=> new Notification({
            id:not.id,
            sender:not.sender,
            type:not.type,
            message:not.message,
            isRead:not.isRead,
            timestamp:not.timestamp,
        }))
    }

    async markNotificationsAsRead(userId: string): Promise<void> {
        await NotificationModel.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } });
    }
}
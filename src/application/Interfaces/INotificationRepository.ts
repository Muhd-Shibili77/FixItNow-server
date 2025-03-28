import Notification from "../../domain/entity/Notification"

export interface INotificationRepository{
    createNotification(data: Partial<Notification>): Promise<Notification>
    getUserNotifications(userId: string): Promise<Notification[]>
    markNotificationsAsRead(userId: string): Promise<void>
}
import { INotificationRepository } from "../Interfaces/INotificationRepository";

export class NotificationUseCase{
    constructor (private NotificationRepository:INotificationRepository){}

    async saveNotification(data:object){

        if(!data){
            throw new Error('something missing from the data')
        }
        return await this.NotificationRepository.createNotification(data)
    }

    async getNotification(userId:string){

        if(!userId){
            throw new Error('userId is missing')
        }
        return await this.NotificationRepository.getUserNotifications(userId)
    }

    async markAsRead(userId:string){
        if(!userId){
            throw new Error('userId is missing')
        }
        
        return await this.NotificationRepository.markNotificationsAsRead(userId)
    }
}
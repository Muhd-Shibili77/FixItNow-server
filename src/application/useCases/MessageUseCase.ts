import Message from "../../domain/entity/Message";
import Chatlist from "../../domain/entity/Chatlist";
import { IMessageRepository } from "../Interfaces/IMessageRepository";

export class MessageUseCase{
    constructor(private MessageRepository:IMessageRepository){}

    async saveMessage(sender:string,senderModel:string,receiver:string,receiverModel:string,message:string){
       
        
        if(!sender || !senderModel || !receiver || !receiverModel || !message){
            throw new Error('something is missing')
        }

        const messageData = {
            sender,
            senderModel,
            receiver,
            receiverModel,
            message,
            timestamp: new Date()
        };
        return await this.MessageRepository.saveMessage(messageData);
        

        
    }

    async getMessage(sender:string,receiver:string):Promise<Message[]>{
        if(!sender || !receiver){
            throw new Error('senderId or receiverId is missing')
        }
        return  await this.MessageRepository.getMessage(sender,receiver);
    }

    async getChatList(userId:string):Promise<Chatlist | null>{
        if(!userId){
            throw new Error('userId is not found')
        }
        const data = await this.MessageRepository.getChatList(userId)
        
        return data
    }
    async addReaction(messageId:string,userId:string,reaction:string){
        
        if(!messageId || !userId || !reaction  ){
            throw new Error('something is empty')
        }
        
        return await this.MessageRepository.addReaction(messageId,userId,reaction);
    }
}
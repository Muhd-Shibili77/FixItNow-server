import Message from "../../domain/entity/Message";
import Chatlist from "../../domain/entity/Chatlist";
export interface IMessageRepository{
    saveMessage(message:Partial<Message>):Promise<Message>
    getMessage(sender:string,receiver:string):Promise<Message[]>
    getChatList(userId:string):Promise<Chatlist | null>
    addReaction(messageId:string,userId:string,reaction:string):Promise<Message>
}
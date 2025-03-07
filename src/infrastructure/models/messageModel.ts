import mongoose,{Schema,Document} from "mongoose";

export interface IMessage extends Document{
    sender:string,
    senderModel:'Users'|'Workers',
    receiver:string,
    receiverModel:'Users'|'Workers',
    message:string,
    timestamp:Date
}

const messageSchema:Schema = new Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,required:true},
    senderModel:{type:String,enum:['Users','Wokers'],required:true},
    receiver:{type:mongoose.Schema.Types.ObjectId,required:true},
    receiverModel:{type:String,enum:['Users','Wokers'],required:true},
    message:{type:String},
    timestamp: { type: Date, default: Date.now }
})

const messageModel = mongoose.model<IMessage>('Message',messageSchema)
export default messageModel;
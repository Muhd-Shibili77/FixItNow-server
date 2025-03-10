import mongoose,{Schema,Document} from "mongoose";

export interface IMessage extends Document{
    sender:string,
    senderModel:'Users'|'Workers',
    receiver:string,
    receiverModel:'Users'|'Workers',
    message:string,
    timestamp:Date,
    reactions:{
        user:string,
        reaction:string
    }[]
}

const messageSchema:Schema = new Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,required:true},
    senderModel:{type:String,enum:['Users','Workers'],required:true},
    receiver:{type:mongoose.Schema.Types.ObjectId,required:true},
    receiverModel:{type:String,enum:['Users','Workers'],required:true},
    message:{type:String},
    timestamp: { type: Date, default: Date.now },
    reactions:[{
        user:{type:mongoose.Schema.Types.ObjectId},
        reaction:{type:String,enum:['❤️','😂','😢','💯','👍','👎']}
    }]
})

const messageModel = mongoose.model<IMessage>('Message',messageSchema)
export default messageModel;
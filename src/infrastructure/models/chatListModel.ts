import mongoose,{Schema,Document} from "mongoose";

export interface IChatList extends Document{
    user:string;
    userModel:'Users'|"Workers";
    chats:{
        contact:string,
        contactModel:'Users'|'Workers',
        lastMessage:string,
        timestamp:Date
    }[];
}

const chatlistSchema:Schema = new Schema({
    user:{type:mongoose.Schema.Types.ObjectId,required:true},
    userModel:{type:String,enum:["Users","Workers"],required:true},
    chats:[{
        contact: { type: mongoose.Schema.Types.ObjectId },
        contactModel:{type:String,enum:["Users","Workers"],required:true},
        lastMessage: { type: String },
        timestamp: { type: Date }
    }]
})

const chatModel = mongoose.model<IChatList>('ChatList',chatlistSchema)
export default chatModel;
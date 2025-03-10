import MessageModel from "../models/messageModel";
import Message from "../../domain/entity/Message";
import { IMessageRepository } from "../../application/Interfaces/IMessageRepository";
import chatModel from "../models/chatListModel";
import Chatlist from "../../domain/entity/Chatlist";
import mongoose from "mongoose";

interface ChatList {
  user: string;
  userModel: "Users" | "Workers";
  contact: string;
  contactModel: "Users" | "Workers";
  lastMessage: string;
  timestamp: Date;
}

export class MessageRepository implements IMessageRepository {

  async saveMessage(message: Partial<Message>): Promise<Message> {

    const savedMessage = await MessageModel.create({
      sender: message.sender,
      senderModel: message.senderModel,
      receiver: message.receiver,
      receiverModel: message.receiverModel,
      message: message.message,
      timestamp: message.timestamp,
    });

    await this.updateChatlist({
      user: message.sender!,
      userModel: message.senderModel as "Users" | "Workers",
      contact: message.receiver!,
      contactModel: message.receiverModel as "Users" | "Workers",
      lastMessage: message.message!,
      timestamp: savedMessage.timestamp,
    });

    await this.updateChatlist({
        user: message.receiver!,
        userModel: message.receiverModel as "Users" | "Workers",
        contact: message.sender!,
        contactModel: message.senderModel as "Users" | "Workers",
        lastMessage: message.message!,
        timestamp: savedMessage.timestamp
      });

    return new Message({
      id: savedMessage.id,
      sender: savedMessage.sender,
      senderModel: savedMessage.senderModel,
      receiver: savedMessage.receiver,
      receiverModel: savedMessage.receiverModel,
      message: savedMessage.message,
      timestamp: savedMessage.timestamp,
    }); 
  }
 
  async getMessage(sender: string, receiver: string): Promise<Message[]> {
    
    const messages = await MessageModel.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 });

   
    

    return messages.map(
      (msg) =>
        new Message({
          id: msg.id,
          sender: msg.sender,
          senderModel: msg.senderModel,
          receiver: msg.receiver,
          receiverModel: msg.receiverModel,
          message: msg.message,
          timestamp: msg.timestamp,
          reactions: msg.reactions.map((r) => ({
            user: r.user,
            reaction: r.reaction
        }))
        })
    );
  }


  private async updateChatlist(message: ChatList) {
    const chatlist = await chatModel.findOne({
      user: message.user,
      userModel: message.userModel,
    });

    if (chatlist) {
      const existingChatIndex = chatlist.chats.findIndex(
        (chat) =>
          chat.contact.toString() === message.contact.toString() &&
          chat.contactModel === message.contactModel
      );

      if (existingChatIndex !== -1) {
        chatlist.chats[existingChatIndex].lastMessage = message.lastMessage;
        chatlist.chats[existingChatIndex].timestamp = message.timestamp;
      } else {
        chatlist.chats.push({
          contact: message.contact,
          contactModel: message.contactModel,
          lastMessage: message.lastMessage,
          timestamp: message.timestamp,
        });
      }
      await chatlist.save();
    } else {
      await chatModel.create({
        user: message.user,
        userModel: message.userModel,
        chats: [
          {
            contact: message.contact,
            contactModel: message.contactModel,
            lastMessage: message.lastMessage,
            timestamp: message.timestamp,
          },
        ],
      });
      
    }
  }


  async getChatList(userId: string): Promise<Chatlist | null> {
    
   const chatlist = await chatModel.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $unwind: "$chats" }, 
    {
      $lookup: {
          from: "users", 
          localField: "chats.contact",
          foreignField: "_id",
          as: "userDetails"
      }
  },
  {
      $lookup: {
          from: "workers", 
          localField: "chats.contact",
          foreignField: "_id",
          as: "workerDetails"
      }
  },

  {
    $addFields: {
        "chats.contact": {
            $cond: {
                if: { $eq: ["$chats.contactModel", "Users"] },
                then: { $arrayElemAt: ["$userDetails", 0] },
                else: { $arrayElemAt: ["$workerDetails", 0] }
            }
        }
    }
  },

  {
    $project: {
      "userDetails": 0,
      "workerDetails": 0,
      "chats.contact.password": 0 
    }
  },
  {
    $group: {
      _id: "$_id",
      user: { $first: "$user" },
      userModel: { $first: "$userModel" },
      chats: { $push: "$chats" }
    }
  }
   ])
   
   return chatlist.length > 0 ? chatlist[0] : null;
  }

  async addReaction(messageId: string, userId: string, reaction: string): Promise<Message> {

    const message = await MessageModel.findById(messageId)

    if(!message) throw new Error('message not found');
    
    const existReaction = message.reactions.findIndex((v)=>
    v.user.toString()===userId
    );

    if(existReaction !== -1){
      
      message.reactions[existReaction].reaction = reaction;
    }else{
      message.reactions.push({user:userId,reaction:reaction});
    }

    await message.save()
    
    return {
      id: message.id,
      sender: message.sender,
      senderModel: message.senderModel,
      receiver: message.receiver,
      receiverModel: message.receiverModel,
      message: message.message,
      timestamp: message.timestamp,
      reactions: message.reactions.map((r) => ({
          user: r.user,
          reaction: r.reaction
      }))
    }
    
      
  }
}

import { Server } from "socket.io";
import { MessageUseCase } from "../../application/useCases/MessageUseCase";
import { MessageRepository } from "../repositories/MessageRepository";

export function initializeSocket(io:Server){
    const messageRepository = new MessageRepository();
    const messageUseCase = new MessageUseCase(messageRepository);


    io.on('connection',(socket)=>{
        console.log('user is connected:',socket.id)

        socket.on('joinRoom', (userId) => {
            socket.join(userId); 
        });

        socket.on('sendMessage',async (data)=>{

            const {sender,senderModel,receiver,receiverModel,message} = data
            
            io.to(receiver).emit('receiveMessage',data)
            const savedMessage = await messageUseCase.saveMessage(sender,senderModel,receiver,receiverModel,message)
            
            
        })


        socket.on('getMessage',async(data,Cb)=>{
            const {sender,receiver}=data
            const messages = await messageUseCase.getMessage(sender,receiver)
            Cb(messages)
        })

        socket.on('addReaction',async (data)=>{
            const {messageId,userId,receiverId,reaction}=data
            try {
                console.log(data)
                
                io.to(receiverId).emit("reactionUpdated",{
                    messageId,
                    userId,
                    reaction
                })
                
                await messageUseCase.addReaction(messageId,userId,reaction)
            } catch (error) {
                console.error("Error adding reaction:", error);
            }
        })

        socket.on('disconnect',()=>{
            console.log('user is disconnected:',socket.id);
        })
    })

}
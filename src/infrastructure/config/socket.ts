import { Server } from "socket.io";
import { MessageUseCase } from "../../application/useCases/MessageUseCase";
import { MessageRepository } from "../repositories/MessageRepository";
import { NotificationUseCase } from "../../application/useCases/NotificationUseCase";
import { NotificationRepository } from "../repositories/NotificationRepository";

export function initializeSocket(io: Server) {
    const messageRepository = new MessageRepository();
    const messageUseCase = new MessageUseCase(messageRepository);
    const notificationRepository = new NotificationRepository()
    const notificationUseCase = new NotificationUseCase(notificationRepository)

    // Keep track of active calls
    const activeCallsMap = new Map();

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('joinRoom', (userId) => {
            socket.join(userId);
            console.log('User joined room:', userId);
        });

        socket.on('sendMessage', async (data) => {
            const { sender, senderModel, receiver, receiverModel, message } = data;
            
            io.to(receiver).emit('receiveMessage', data);
            io.to(receiver).emit('newNotification', { sender, message });
            
            await messageUseCase.saveMessage(sender, senderModel, receiver, receiverModel, message);
            const notification = await notificationUseCase.saveNotification({
                user: receiver,
                sender,
                senderModel,
                type: "message",
                message: "new message",
            })

            io.to(receiver).emit('notificationListUpdated', notification);
        });

        socket.on('getMessage', async (data, callback) => {
            const { sender, receiver } = data;
            const messages = await messageUseCase.getMessage(sender, receiver);
            callback(messages);
        });

        socket.on('addReaction', async (data) => {
            const { messageId, userId, receiverId, reaction } = data;
            try {
                io.to(receiverId).emit("reactionUpdated", {
                    messageId,
                    userId,
                    reaction
                });
                
                await messageUseCase.addReaction(messageId, userId, reaction);
            } catch (error) {
                console.error("Error adding reaction:", error);
                
            }
        });

        socket.on("getNotifications", async (userId, callback) => {
            const notifications = await notificationUseCase.getNotification(userId)
            callback(notifications);
        });

        
        socket.on("markNotificationsRead", async (userId) => {
            await notificationUseCase.markAsRead(userId)
        });

      
        socket.on('callUser', ({ from, to, callType }) => {
            console.log(`Call initiated from ${from} to ${to} (${callType})`);
            
  
            activeCallsMap.set(`${from}-${to}`, { from, to, callType, status: 'calling' });
          
            io.to(to).emit("incomingCall", { from, callType });
        });

        socket.on('callAccepted', ({ from, to }) => {
            console.log(`Call accepted from ${from} to ${to}`);
            
           
            const callKey = `${to}-${from}`;
            if (activeCallsMap.has(callKey)) {
                const callData = activeCallsMap.get(callKey);
                activeCallsMap.set(callKey, { ...callData, status: 'active' });
            }
            
            
            io.to(to).emit("callAccepted", { from });
        });

        socket.on('rejectCall', ({ from, to }) => {
            console.log(`Call rejected by ${from} to ${to}`);
            activeCallsMap.delete(`${to}-${from}`);
            io.to(to).emit("callRejected", { to: from });
        });

        socket.on('webrtc-signaling', ({ to, from, signal }) => {
            console.log(`WebRTC ${signal.type} signal from ${from} to ${to}`);
            io.to(to).emit("webrtc-signaling", { from, signal });
        });

        socket.on('ice-candidate', ({ to, from, candidate }) => {
            console.log(`ICE candidate from ${from} to ${to}`);
            io.to(to).emit("ice-candidate", { from, candidate });
        });

        socket.on('endCall', ({ from, to }) => {
            console.log(`Call ended between ${from} and ${to}`);
            activeCallsMap.delete(`${from}-${to}`);
            activeCallsMap.delete(`${to}-${from}`);
            
            // Notify both parties that the call has ended
            io.to(to).emit("callEnded", { from });
            io.to(from).emit("callEnded", { to });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            
            // Find and clean up any active calls for this user
            // This would require mapping socket.id to userId
        });
    });
}
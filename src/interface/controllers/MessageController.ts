import { Request,Response } from "express";
import { MessageUseCase } from "../../application/useCases/MessageUseCase";

export class MessageContoller{
    constructor(private MessageUseCase:MessageUseCase){}

    async sendMessage(req:Request,res:Response){
        try {

            const {sender,senderModel,receiver,receiverModel,message}=req.body
            const messageDate = await this.MessageUseCase.saveMessage(sender,senderModel,receiver,receiverModel,message)
            res.status(201).json({message:'message send successfully',messageDate});

        } catch (error:any) {
            console.error(error);
            res.status(500).json({ message: "Error sending message", error })
        }
    }

    async getMessage(req:Request,res:Response){
        try {
            const sender = req.params.sender as string
            const receiver = req.params.receiver as string
           
            const messages = await this.MessageUseCase.getMessage(sender,receiver)
            
            res.status(201).json({message:"message getting successfull",messages})

        } catch (error:any) {
            console.error(error);
            res.status(500).json({ message: "Error geting message", error })
        }
    }

    async getChatList(req:Request,res:Response){
        try {
            const userId = req.query.userId as string
            
            const chatlist = await this.MessageUseCase.getChatList(userId)
            res.status(201).json({message:"chatlist getting successfull",chatlist})

        } catch (error:any) {
            console.error(error);
            res.status(500).json({ message: "Error geting chatlist", error })
        }
    }

    async uploadChatMedia(req:Request,res:Response){
        try {
            if(!req.file){
                throw new Error('file is missing')
            }
            res.json({ url: req.file.path }); 
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ message: 'File upload failed' });
        }
    }
}
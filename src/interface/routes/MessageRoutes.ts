import { Request,Response,Router } from "express";
import { MessageContoller } from "../controllers/MessageController";
import { MessageUseCase } from "../../application/useCases/MessageUseCase";
import { MessageRepository } from "../../infrastructure/repositories/MessageRepository";
import cloudinaryUpload from "../../infrastructure/config/cloundinaryStorage";

const messageRepository = new MessageRepository()
const messageUseCase = new MessageUseCase(messageRepository)
const messageContoller = new MessageContoller(messageUseCase)
const router = Router()

router.post('/send',async (req:Request,res:Response)=>{
    await messageContoller.sendMessage(req,res)
})
router.get("/:sender/:receiver",async (req:Request,res:Response)=>{
    await messageContoller.getMessage(req,res)
})
router.get("/chatlist",async (req:Request,res:Response)=>{
    await messageContoller.getChatList(req,res)
})

router.post('/upload',cloudinaryUpload.single('file'),async (req:Request,res:Response)=>{
    await messageContoller.uploadChatMedia(req,res)
})

export default router; 
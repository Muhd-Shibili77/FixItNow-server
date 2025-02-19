import express from "express";

export class WorkerController{
    constructor(WorkerUseCase){
        this.WorkerUseCase =WorkerUseCase
    }

    async fetchWorker(req,res){
        try {

            const {email}=req.body  
            const response = await this.WorkerUseCase.fetchWorker(email)
            res.json({ success: true, message: "worker details fetched" ,response});
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async editProfile(req,res){
        try {

            const {_id,name,service,experience,phone,about}=req.body
            
            const image = req.file ? req.file.filename : undefined;
            const updateData = { _id, name, service, experience, phone, about };

            if (image) {
                updateData.profileImage = image;
            }

            const response = await this.WorkerUseCase.WorkerProfileEdit(updateData)
            res.json({ success: true, message: "worker profile edited successfully" ,response});


        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, message: error.message });
        }
    }


}
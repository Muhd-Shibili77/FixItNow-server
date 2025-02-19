import express from "express";
import Worker from '../../infrastructure/models/workerModel.js'

export class WorkerUseCase{
    constructor(WorkerRepository){
        this.WorkerRepository = WorkerRepository;
    }

    async fetchWorker(email){
        if(!email){
            throw new Error("email is empty")
        }
        const workerData = await this.WorkerRepository.findByEmail(email)

        if(!workerData){
            throw new Error('worker not found')
        }

        return workerData

    }

    async WorkerProfileEdit(data){

        const {_id,name,service,experience,phone,about} = data 
        
        if (!name || !service || !experience || !phone || !about) {
            throw new Error("All fields are required");
        }
    
      
        if (name.length < 3) {
            throw new Error("Name must be at least 3 characters long");
        }
    
     
        if (service.trim().length === 0) {
            throw new Error("Service field is required");
        }
    
      
        if (isNaN(experience) || experience <= 0) {
            throw new Error("Experience must be a positive number");
        }
    
       
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error("Invalid phone number. It must be exactly 10 digits.");
        }
    
       
        if (about.length < 10) {
            throw new Error("About section must be at least 10 characters long");
        }

       
       
        const editedWorker = await this.WorkerRepository.editWorker(data);
       
        if (!editedWorker._id) {
            throw new Error("Failed to edit worker");
          }
       
        return { editedWorker };


    }


}
import express from "express";
import Worker from "../../infrastructure/models/workerModel.js";

export class WorkerRepository{
    constructor(){}

    async findByEmail(email){
        const worker = await Worker.findOne({email:email})
        return worker ? worker : null
    }

    async editWorker(data){
        
        const { _id, ...updateData } = data; // Extract email and remaining fields

        if (!_id) {
            throw new Error("Worker ID is required for updating details");
        }

        const updatedWorker = await Worker.findByIdAndUpdate(
            _id,                 // Find worker by ID
            { $set: updateData }, // Update only provided fields
            { new: true, runValidators: true } // Return updated document & apply validation
        );
        if (!updatedWorker) {
            throw new Error("Worker not found or update failed");
        }

        return updatedWorker;
    }
}
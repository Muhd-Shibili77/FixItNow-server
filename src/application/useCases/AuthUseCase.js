import express from "express";
import bcrypt from 'bcrypt'
import User from '../../infrastructure/models/userModel.js'

export class AuthUseCase{
    constructor(AuthRepository){
        this.AuthRepository = AuthRepository;
    }

    async register(newUser){
        
        const { username, email, password, conformpassword } = newUser;

        // Validation: Check if all fields are provided
        if (!username || !email || !password || !conformpassword) {
            throw new Error("All fields are required");
        }

        // Validation: Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        // Validation: Password and Confirm Password match
        if (password !== conformpassword) {
            throw new Error("Passwords do not match");
        }

        // Validation: Password strength (min 6 characters)
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }



        
        const hashedPassword = await bcrypt.hash(newUser.password,10)
        const newUserObj  = new User({username: newUser.username, email: newUser.email, password: hashedPassword});
        
        const createdUser = await this.AuthRepository.create(newUserObj );
       
        if (!createdUser._id) {
            throw new Error("Failed to create user");
          }
       
        return { createdUser };
    }    
}
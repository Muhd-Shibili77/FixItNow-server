import express from "express";
import User from '../../infrastructure/models/userModel.js'

export class AuthRepository{
    constructor(){}

    async create(newUser){
        
        const createdUser = await User.create({
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
        });
        
        return new User({ username:createdUser.username, email:createdUser.email,password:createdUser.password});
    }
}
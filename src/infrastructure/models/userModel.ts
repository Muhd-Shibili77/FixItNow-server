import mongoose, { Document, Schema, Model } from "mongoose";

 export interface IUser extends Document{
    username:string,
    email:string,
    password:string,
    phone?:number,
    isBlock?:boolean,
}

const UsersSchema:Schema<IUser> = new Schema({
  username:{
     type: String, required: true 
  },
  email:{
     type: String, required: true, unique: true 
  },
  password:{
     type: String, required: true
  },
  phone:{
     type: Number 
  },
  isBlock:{
     type: Boolean, required: true ,default:false
  },

});

const UserModel:Model<IUser> = mongoose.model<IUser>("Users", UsersSchema);

export default UserModel;

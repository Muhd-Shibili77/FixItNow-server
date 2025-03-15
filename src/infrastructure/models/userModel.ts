import mongoose, { Document, Schema, Model } from "mongoose";

 export interface IUser extends Document{
    username:string,
    email:string,
    password:string,
    phone?:number,
    isBlock?:boolean,
    isGoogleAuth?:boolean
    profileImage?:string
}

const UsersSchema:Schema<IUser> = new Schema({
  username:{
     type: String, required: true 
  },
  email:{
     type: String, required: true, unique: true 
  },
  password:{
     type: String,
  },
  phone:{
     type: Number 
  },
  isBlock:{
     type: Boolean, required: true ,default:false
  },
  isGoogleAuth:{
   type:Boolean ,required:true,default:false
  },
  profileImage:{
    type:String
  }
});

const UserModel:Model<IUser> = mongoose.model<IUser>("Users", UsersSchema);

export default UserModel;

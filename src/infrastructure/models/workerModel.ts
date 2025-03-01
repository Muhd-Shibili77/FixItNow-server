import mongoose, { Document, Schema, Model } from "mongoose";

export interface IWorker extends Document{
    username:string,
    email:string,
    password?:string,
    phone:number,
    isBlock?:boolean,
    name:string,
    service:string,
    experience:number,
    about:string,
    profileImage:string,
    isGoogleAuth?:boolean
    

}


const WorkerSchema:Schema = new Schema({
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
  name:{
    type:String,required:true
  },
  service:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Service'
  },
  experience:{
    type:Number,required:true
  },
  about:{
    type:String,required:true
  },
  profileImage:{
    type:String,
},
isGoogleAuth:{
  type:Boolean ,required:true,default:false
 }
});

const WorkerModel:Model<IWorker> = mongoose.model<IWorker>("Workers", WorkerSchema);

export default WorkerModel;

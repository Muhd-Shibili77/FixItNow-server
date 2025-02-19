import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
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
  name:{
    type:String,required:true
  },
  service:{
    type:String,required:true
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
});

const Workers = mongoose.model("Workers", WorkerSchema);

export default Workers;

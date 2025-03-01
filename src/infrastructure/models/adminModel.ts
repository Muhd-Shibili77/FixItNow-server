import mongoose, { Document, Schema, Model } from "mongoose";


interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
  }


const AdminSchema:Schema<IAdmin> = new Schema({

  name:{
     type: String, required: true 
  },
  email:{
     type: String, required: true, unique: true 
  },
  password:{
     type: String, required: true
  },
});

const AdminModel:Model<IAdmin> = mongoose.model<IAdmin>("Admin", AdminSchema);

export default AdminModel;

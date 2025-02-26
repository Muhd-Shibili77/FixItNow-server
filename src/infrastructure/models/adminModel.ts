import mongoose, { Document, Schema, Model } from "mongoose";


interface IAdmin extends Document {
    name: string;
    Email: string;
    Password: string;
  }


const AdminSchema:Schema<IAdmin> = new Schema({

  name:{
     type: String, required: true 
  },
  Email:{
     type: String, required: true, unique: true 
  },
  Password:{
     type: String, required: true
  },
});

const Admin:Model<IAdmin> = mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;

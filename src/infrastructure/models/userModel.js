import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
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
  location:{
     type: Number 
  },
});

const Users = mongoose.model("Users", UsersSchema);

export default Users;

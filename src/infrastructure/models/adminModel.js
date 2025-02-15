const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
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

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;

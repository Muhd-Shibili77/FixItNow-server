const mongoose = require('mongoose');
const ServicesSchema = new mongoose.Schema({
  Name:{
     type: String, required: true 
    },
  IsDelete:{
     type: Boolean, required: true
     },
  
},{timestamps:true});

const Services = mongoose.model('Services', ServicesSchema);

export default Services;


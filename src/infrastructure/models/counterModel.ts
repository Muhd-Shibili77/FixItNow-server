import mongoose, { Schema, Document } from "mongoose";

export interface ICounter extends Document{
    name:string,
    value:number
}

const counterSchema:Schema = new Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true, default: 1 }
  });
  
  const CounterModel = mongoose.model<ICounter>("Counter", counterSchema);

  export default CounterModel;
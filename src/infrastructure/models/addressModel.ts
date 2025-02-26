import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IAddress extends Document {
  pincode: number;
  state: string;
  userId: string;
  country: string;
  address: string;
  phone: number;
  name: string;
  city: string;
}

const AddressSchema: Schema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: Number, required: true },
    phone: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true,ref:'Users'},
});

const AddressModel = mongoose.model<IAddress>('Address', AddressSchema);

export default AddressModel;

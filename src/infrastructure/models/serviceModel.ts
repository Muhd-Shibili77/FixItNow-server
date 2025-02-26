import mongoose, { Document, Schema, Model } from "mongoose";

interface IService extends Document {
    name: string;
    isDelete: boolean;
    icon?: string;
}

const ServiceSchema: Schema<IService> = new Schema(
    {
        name: { type: String, required: true },
        isDelete: { type: Boolean, required: true, default: false },
        icon: { type: String },
    },
    { timestamps: true }
);

const ServiceModel: Model<IService> = mongoose.model<IService>("Service", ServiceSchema);

export default ServiceModel;
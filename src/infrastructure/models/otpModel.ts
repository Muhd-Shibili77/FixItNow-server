import mongoose, { Document, Schema, Model } from "mongoose";



interface IOtp extends Document{
    email:string,
    otp:string,
    createdAt:Date
}

const otpSchema:Schema<IOtp> = new Schema({
    email: {
        type:String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 });
const OTP:Model<IOtp> = mongoose.model<IOtp>('OTP', otpSchema);

export default OTP;
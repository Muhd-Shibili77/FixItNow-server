import mongoose,{Document,Schema,Model} from "mongoose";


export interface IReview extends Document{
    user:string,
    worker:string,
    booking:string,
    rating:number,
    review:string
}

const reviewSchema:Schema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,ref:'Users',required:true,
    },
    worker:{
        type:mongoose.Schema.Types.ObjectId,ref:"Workers",required:true,
    },
    booking:{
        type:mongoose.Schema.Types.ObjectId,ref:"Booking",required:true
    },
    rating:{
        type:Number,required:true,
    },
    review:{
        type:String,required:true
    },
},{timestamps:true})

const reviewModel:Model<IReview> = mongoose.model<IReview>("Review",reviewSchema)

export default reviewModel;
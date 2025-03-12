import mongoose, { Document, Schema, Model } from "mongoose";

export interface IWallet extends Document{
    worker:string,
    balanceAmount:number,
    walletHistory:{
        date:Date,
        amount:number,
        description:string,
        transactionType:string
    }[]
}

const walletSchema:Schema = new Schema({

    worker:{type:mongoose.Schema.Types.ObjectId,ref:'Workers',required:true},
    balanceAmount: {
        type: Number,
        default: 0,
        required: true
      },
      walletHistory: [
        {
          date: {
            type: Date,
            required: true,
            default: Date.now
          },
          amount: {
            type: Number,
            required: true
          },
          description: {
            type: String,
            required: true
          },
          transactionType: {
            type: String,
            required: true,
            enum: ['credited', 'debited']
          }
        }
      ]

},{timestamps: true}) 

const walletModel:Model<IWallet> = mongoose.model<IWallet>('wallet',walletSchema)
export default walletModel
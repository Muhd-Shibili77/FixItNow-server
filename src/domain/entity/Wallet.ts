class Wallet{
    public id!:string;
    public worker!:string;
    public balanceAmount!:number;
    public walletHistory!:{
        date:Date,
        amount:number,
        description:string,
        transactionType:string,
    }[];
    constructor(data: Partial<Wallet>) {
        Object.assign(this, data);
      }

}
export default Wallet
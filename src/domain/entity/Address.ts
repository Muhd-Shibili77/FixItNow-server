import { ObjectId } from "mongoose";


class Address {
    public readonly id!: string;
    public pincode!: number;
    public name!: string;
    public phone!: number;
    public address!: string;
    public country!: string;
    public state!: string;
    public city!: string;
    public userId!: string;
    

    constructor(data: Partial<Address>) {
        Object.assign(this, data);
    }
}

export default Address
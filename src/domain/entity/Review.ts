class Review {
    public id!:string;
    public user!:string;
    public worker!:string;
    public booking!:string;
    public rating!:number;
    public review!:string;

    constructor(data:Partial<Review>){
        Object.assign(this,data);
    }
}

export default Review;
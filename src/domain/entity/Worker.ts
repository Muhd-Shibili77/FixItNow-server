
class Worker {
    public readonly id?:string;
    public name! :string;
    public service!:string;
    public experience!:number;
    public phone!:number;
    public about!:string;
    public profileImage!:string;
    public username?:string;
    public password?:string; 
    public conformpassword?:string; 
    public email?:string;
    public isGoogleAuth?: boolean;


    constructor(data: Partial<Worker>) {
       Object.assign(this, data);
    }
}

export default Worker;
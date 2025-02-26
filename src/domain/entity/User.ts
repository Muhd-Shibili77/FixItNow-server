
class User {
    public readonly id?:string;
    public username!:string;
    public email!:string;
    public password!:string;
    public phone?:number;
    public isBlock?:boolean;
    public conformpassword?: string;
    constructor(data:Partial<User>){
        Object.assign(this,data);
    }

}

export default User
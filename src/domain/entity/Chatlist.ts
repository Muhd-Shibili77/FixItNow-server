class Chatlist{
    public id!: string;
    public user!:string;
    public userModel!:string;
    public chats!:{
         contact:string;
         contactModel:string;
         lastMessage:string;
         timestamp:Date
    };

    constructor(data: Partial<Chatlist>) {
        Object.assign(this, data);
      }
}

export default Chatlist;
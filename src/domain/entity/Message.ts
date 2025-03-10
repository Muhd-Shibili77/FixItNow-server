
class Message{
    public id!: string;
    public sender!: string;
    public senderModel!: string;
    public receiver!: string;
    public receiverModel!: string;
    public message!: string;
    public timestamp!: Date;
    public reactions?:{
      user:string,
      reaction:string
    }[];
    
    constructor(data: Partial<Message>) {
        Object.assign(this, data);
      }
}

export default Message;
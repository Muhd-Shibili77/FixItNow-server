
class Notification{
    public id!: string;
    public user!: string;
    public sender!: string;
    public senderModel!: string;
    public type!: string;
    public message!: string;
    public isRead!: boolean;
    public timestamp!: Date;
    
    constructor(data: Partial<Notification>) {
        Object.assign(this, data);
      }
}

export default Notification;
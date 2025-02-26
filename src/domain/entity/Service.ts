class Service {
    public readonly id!: string;
    public name!: string;
    public isDelete!: boolean;
    icon?: string;

    constructor(data: Partial<Service>) {
        Object.assign(this, data);
    }
}

export default Service
import Service from "../../domain/entity/Service";

export interface IServiceRepository {
    addService(name: string, icon: string): Promise<Service>;
    fetchService(): Promise<Service[]>;
    getService(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{ services: Service[], totalPages: number }>;
    delService(serviceId:string,isDelete:string):Promise<void>
    updateService(serviceId:string,name:string,icon:string):Promise<void>
}
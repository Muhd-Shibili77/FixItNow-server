import { IServiceRepository } from "../../application/Interfaces/IServiceRepository";
import Service from "../../domain/entity/Service";
import ServiceModel from "../models/serviceModel";

export class ServiceRepository implements IServiceRepository {
    async addService(name: string, icon: string): Promise<Service> {

        const serviceExist = await ServiceModel.findOne({name:name})

        if(serviceExist){
            throw new Error('service is already exist')
        }

        const createdService = await ServiceModel.create({
            name: name,
            icon: icon,
        });
       
        return new Service({id:createdService.id,name: createdService.name, icon: createdService.icon})
    }

    async fetchService(): Promise<Service[]> {
        const services = await ServiceModel.find()
        
        
        return services.map(service => new Service({
            id: service.id,
            name: service.name,
            icon: service.icon,
            isDelete:service.isDelete
        }))
    }


    async getService(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{ services: Service[], totalPages: number }> {
        const totalCount = await ServiceModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / pageSize);

        const services = await ServiceModel.find(query)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        return {
            services: services.map(service => new Service({
                id: service.id,
                name: service.name,
                icon: service.icon,
                isDelete:service.isDelete
            })),
            totalPages
        };
    }

    async delService(serviceId: string, isDelete: string): Promise<void> {
        
        const service = await ServiceModel.findById(serviceId)
        if(!service){
            throw new Error('service not found')
        }
       
        await ServiceModel.findByIdAndUpdate(serviceId,{isDelete:isDelete})
    }

    async updateService(serviceId: string, name: string, icon: string): Promise<void> {
        await ServiceModel.findByIdAndUpdate(serviceId,{name:name,icon:icon})
        return
    }
}
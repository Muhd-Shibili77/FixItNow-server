import { IServiceRepository } from "../../application/Interfaces/IServiceRepository";
import Service from "../../domain/entity/Service";
import ServiceModel from "../models/serviceModel";

export class ServiceRepository implements IServiceRepository {
    async addService(name: string, icon: string): Promise<Service> {
        const createdService = await ServiceModel.create({
            name: name,
            icon: icon,
        });
        // return new Service(createdService)
        return new Service({id:createdService.id,name: createdService.name, icon: createdService.icon})
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
                icon: service.icon
            })),
            totalPages
        };
    }
}
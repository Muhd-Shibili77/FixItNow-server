import Service from "../../domain/entity/Service"
import { IServiceRepository } from "../Interfaces/IServiceRepository";

interface ServiceDTO {
  id: string;
  name: string;
  icon: string;
  isDeleted: boolean;
}


export class ServiceUseCase {
    constructor(private serviceRepository: IServiceRepository) {}

    async addService(name: string, icon: string): Promise<Service> {

        if (!name || !icon) {
            throw new Error("All fields are required");
        }
        const createdService = await this.serviceRepository.addService(name, icon);
        if (!createdService.id) {
            throw new Error("Failed to add service");
        }
        return createdService
    }

    async getService(query:object,pageNumber: number, pageSize: number) {
        const allService = await this.serviceRepository.getService(query,pageNumber,pageSize);

        if (!allService) {
            throw new Error("Failed to get service");
            }
        
        return allService;
    }

}
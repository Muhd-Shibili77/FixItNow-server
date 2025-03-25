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

       
        if (!name) {
            throw new Error("name is required");
          }
        if (!icon) {
            throw new Error("Image file is required");
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

    async fetchService(){
        const services = await this.serviceRepository.fetchService();
        if(!services){
            throw new Error('failed to fetch the services or service not found')
        }
        return services
    }

    async delService(serviceId:string,isDelete:string){
        if(!serviceId){
            throw new Error('serivce id not found')
        }
        if(!isDelete){
            throw new Error('action required')
        }
     
        await this.serviceRepository.delService(serviceId,isDelete)
        return 
    }

    async updateService(serviceId:string,name:string,icon:string){
        if (!name) {
            throw new Error("name is required");
          }
        if (!icon) {
            throw new Error("Image file is required");
          }

          await this.serviceRepository.updateService(serviceId,name,icon)
          return 
    }

}
import Service from "../../domain/entity/Service";

export interface IServiceRepository {
    addService(name: string, icon: string): Promise<Service>;
    getService(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{ services: Service[], totalPages: number }>;
}
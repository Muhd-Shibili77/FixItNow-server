import Worker from "../../domain/entity/Worker";
import Booking from "../../domain/entity/Booking";

export interface IWorkerRepository{
    findById(userId: string): Promise<Worker | null>;
    editWorker(data: Worker): Promise<Worker>;
    getWorker(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{ workers: Worker[], totalPages: number }>
    getJob(workerId:string):Promise<Booking[]|null>;
    updateJob(jobId:string,isAccepted:boolean):Promise<void | null>
}

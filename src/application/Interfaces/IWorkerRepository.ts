import Worker from "../../domain/entity/Worker";
import Booking from "../../domain/entity/Booking";
import Wallet from "../../domain/entity/Wallet";

export interface IWorkerRepository{
    findById(userId: string): Promise<Worker | null>;
    editWorker(data: Worker): Promise<Worker>;
    getWorker(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{ workers: Worker[], totalPages: number }>
    getJob(workerId:string):Promise<Booking[]|null>;
    updateJob(jobId:string,isAccepted:boolean):Promise<void | null>
    toggleWorkStatus(bookingId:string,workStatus:string):Promise<void>
    toggleReachStatus(bookingId:string,reachStatus:string):Promise<void>
    updateAmount(bookingId:string,amount:string):Promise<void>
    getWallet(workerId:string):Promise<Wallet | null>
}

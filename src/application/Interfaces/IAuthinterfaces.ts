import User from "../../domain/entity/User";
import Worker from "../../domain/entity/Worker";

export interface IAuthRepository {
    findUserByEmail(email: string): Promise<User | null>;
    findWorkerByEmail(email: string): Promise<Worker | null>;
    generateOtp(email: string): Promise<string>;
    getStoredOtp(email: string): Promise<string | null>;
    deleteOtp(email: string): Promise<{ message: string }>;
    create(user: User): Promise<User>;
    createWorker(worker: Worker): Promise<Worker>;
}
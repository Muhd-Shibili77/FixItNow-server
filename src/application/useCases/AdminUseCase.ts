import { IAdminRepository } from '../Interfaces/IAdminRepository';
import bcrypt from 'bcrypt'
import jwtService from '../../infrastructure/services/jwtService';

interface LoginAdmin {
    email: string;
    password: string;
  }

export class AdminUseCase{
    constructor(private adminRepository:IAdminRepository){}
 

    async login(admin:LoginAdmin){
       
        const foundAdmin = await this.adminRepository.findAdminByEmail(admin.email)
        if(!foundAdmin || !foundAdmin.id){
            throw new Error("Email doesn't exist")
        }
        const isPasswordCorrect = await bcrypt.compare(
            admin.password,
            foundAdmin.password
        )
        
        if (!isPasswordCorrect) {

            throw new Error("Incorrect password"); 
        }
        const role = 'Admin'
        const Token = jwtService.generateToken(foundAdmin.id,role)
        const refreshToken = jwtService.generateRefreshToken(foundAdmin.id,role)
        return {
            name : foundAdmin.name,
            email : foundAdmin.email,
            role,
            Token,
            refreshToken,
        }
    }

    async fetchUsers(query:object,pageNumber:number,pageSize:number){
        const users = await this.adminRepository.fetchUsers(query,pageNumber,pageSize)
        if(!users){
            throw new Error("user is empty")
        }
        return users
    }

    async toggleBlockUser(actions:string,id:string){
         await this.adminRepository.toggleBlockUser(actions,id)    
    }

    async fetchWorkers(query:object,pageNumber:number,pageSize:number){
        
        const workers = await this.adminRepository.fetchWorkers(query,pageNumber,pageSize)
        if(!workers){
            throw new Error("worker is empty")
        }
        
        return workers
    }

   async toggleBlockWorker(actions:string,id:string){
        await this.adminRepository.toggleBlockWorker(actions,id)    
   }

    async fetchBookings(query:object,pageNumber:number,pageSize:number){
        const bookings = await this.adminRepository.fetchBookings(query,pageNumber,pageSize)
        if(!bookings){
            throw new Error("booking list is empty")
        }
        return bookings
    }

    async toggleCancelBooking(bookingId:string){
        await this.adminRepository.toggleCancelBooking(bookingId)
    }

    async fetchDashboardData(){
        const response = await this.adminRepository.fetchDashboardData()
        return response;
    }
    async fetchChartData(){
        const response = await this.adminRepository.fetchChartData()
        return response;
    }
}
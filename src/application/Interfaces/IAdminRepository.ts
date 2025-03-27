import Admin from "../../domain/entity/Admin"
import User from "../../domain/entity/User"
import Worker from "../../domain/entity/Worker"
import Booking from "../../domain/entity/Booking"

export interface IAdminRepository{
    findAdminByEmail(email:string):Promise<Admin | null>
    fetchUsers(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{users:Partial<User>[],totalPages:number}>
    fetchWorkers(query: Record<string, any>, pageNumber: number, pageSize: number):Promise<{workers:Partial<Worker>[],totalPages:number}>
    fetchBookings(query: Record<string, any>, pageNumber: number, pageSize: number):Promise<{bookings:Booking[] | null,totalPages:number}>
    toggleBlockUser(actions:string,id:string):Promise<void>
    toggleBlockWorker(actions:string,id:string):Promise<void>
    toggleCancelBooking(bookingId:string):Promise<void>
    fetchDashboardData():Promise<{totalServices: number,todayServices:number,serviceCompleted:number,servicePending:number,yearlyBreakup:number,monthly:number,todays:number}>
    fetchChartData():Promise<{dataPoints:number[]}>
    fetchEarnings(query: Record<string, any>, pageNumber: number, pageSize: number): Promise<{bookings:Partial<Booking>[] | null,totalPages:number}>
}
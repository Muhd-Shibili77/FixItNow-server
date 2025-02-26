import { ServiceUseCase } from "../../application/useCases/ServiceUseCase";
import { Request, Response } from "express";

export class ServiceController {
    constructor(private serviceUseCase: ServiceUseCase) {}

    async addService(req:Request, res:Response) {
          try {
            const { name } = req.body;
           
            if (!req.file || !req.file.filename) {
                throw new Error("Image file is required");
              }
    
            const image = req.file.filename;
      
            const response = await this.serviceUseCase.addService(name, image);
            res.json({
              success: true,
              message: "service added successfull",
              response,
            });
          } catch (error:any) {
            console.error(error);
            res.status(400).json({ success: false, message: error.message });
          }
    }
    async getService(req:Request, res:Response): Promise<void> {
        try {
        
          const search: string = (req.query.search as string) || "";
          const page: number = parseInt(req.query.page as string) || 1;
          const limit: number = parseInt(req.query.limit as string) || 10;
  
          const query = search ? { name: { $regex: search, $options: "i" } } : {};
  
          // Fetch paginated services and total pages
          const { services, totalPages } = await this.serviceUseCase.getService(query, page, limit);
  
          const parsedResponse = services.map(service => ({
              id: service.id,
              name: service.name,
              icon: service.icon
          }));
  
          res.json({
              success: true,
              message: "Service fetched successfully",
              response: parsedResponse,
              currentPage: page,
              totalPages: totalPages
          });
        } catch (error:any) {
            console.error(error);
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
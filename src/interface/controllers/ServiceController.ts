import { ServiceUseCase } from "../../application/useCases/ServiceUseCase";
import { Request, Response } from "express";

export class ServiceController {
    constructor(private serviceUseCase: ServiceUseCase) {}

    async uploadIcon(req:Request,res:Response){
      try {
        if(!req.file){
          throw new Error('file is missing')
        }
        res.json({url:req.file.path})
      } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'File upload failed' });
    }
    }


    async addService(req:Request, res:Response) {
          try {
            const { name,icon } = req.body;

            const response = await this.serviceUseCase.addService(name, icon);
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

    async fetchService(req:Request,res:Response):Promise<void>{
      try {
        const response = await this.serviceUseCase.fetchService()
        
        
        res.json({
          success: true,
          message: "service fetching successfull",
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
              icon: service.icon,
              isDelete:service.isDelete
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

    async delService(req:Request,res:Response){
      try {
          const serviceId = req.query.serviceId as string
          const isDelete = req.query.action as string | undefined
        
          if (!isDelete || !serviceId) {
            return res.status(400).json({ success: false, message: "Missing actions or id" });
          }

          await this.serviceUseCase.delService(serviceId,isDelete)
          return res.json({
            success: true,
            message: "service toggle delete successfull",
        });
      } catch (error:any) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
    }

    async updateService(req:Request,res:Response){
      try {
        const serviceId = req.query.serviceId as string
        const { name,icon } = req.body;
        if (!serviceId) {
          return res.status(400).json({ message: 'Service ID is required' });
        }
        
        await this.serviceUseCase.updateService(serviceId,name,icon)

        return res.status(200).json({
          success: true, 
          message: 'Service updated successfully', 
        });
      } catch (error:any) {
        console.error('Error updating service:', error);
        res.status(400).json({ success: false, message: error.message });
       }
    }
}
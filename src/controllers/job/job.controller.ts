import { Request, Response, NextFunction } from "express";
import jobService from "../../service/job.service";

export default class JobController {


  









  
  protected async getAllUnsettleShiftOneGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      
      const obj = await jobService.getAllUnsettleShiftOneGuard(data);
      
      return res.status(200).json({
        status: 200,
        message: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }




  protected async getGeneralUnsettleShift(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const myData={
        limit:Number(req.query.limit),
        offset:Number(req.query.offset),
        settlement:req.query.settlement
      }

      const obj = await jobService.getGeneralUnsettleShift(myData);
      
      return res.status(200).json({
        status: 200,
        message: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }

  protected async settleShift(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      const obj = await jobService.settleShift(data);
      
      return res.status(200).json({
        status: 200,
        message: `updated successfully`,
      });
      
    } catch (error) {
      next(error);
    }
  }








  
  protected async updateJobStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      const obj = await jobService.updateJobStatus(data);
      
      return res.status(200).json({
        status: 200,
        message: `job status has been updated successfully`,
      });
      
    } catch (error) {
      next(error);
    }
  }



  
  protected async getLogPerGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      const obj = await jobService.getLogPerGuard(data);


      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        message: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }



  protected async getShiftPerGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      const obj = await jobService.getShiftPerGuard(data);


      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        message: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  protected async getGeneralShift(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      const obj = await jobService.getGeneralShift(data);


      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        message: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }


  protected async getOneShedulePerGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      const obj = await jobService.getOneShedulePerGuard(data);


      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        message: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }
  protected async getGuardPerJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      const obj = await jobService.getGuardPerJob(data);


      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        message: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }
  



  

  protected async RemoveGuardSheduleLog(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      const obj = await jobService.RemoveGuardSheduleLog(data);


      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        message: `log has been removed successfully`,
      });
      
    } catch (error) {
      next(error);
    }
  }




  protected async RemoveGuardShedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      const obj = await jobService.RemoveGuardShedule(data);


      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        message: `Guard has been removed successfully`,
      });
      
    } catch (error) {
      next(error);
    }
  }

  
  protected async checkInCheckOutAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      const obj = await jobService.checkInCheckOutAdmin(data);


      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        message: `Check ${data.check_in ? 'in' : 'out'} successful`,
      });
      
    } catch (error) {
      next(error);
    }
  }



  protected async checkInCheckOut(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      const obj = await jobService.checkIn(data);


      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        message: `Check ${data.check_in ? 'in' : 'out'} successful`,
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  protected async acceptDeclineJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //NOTE WHEN YOU MOVE OUT OF POST MAN REMOVE THIS PART
      req.user=req.body.guard_id;

      const obj = await jobService.acceptDeclineJob(req);

      return res.status(200).json({
        status: 200,
        message: `Job ${data.accept ? 'accepted' : 'declined'} successful`,
      });
    } catch (error) {

      console.log(error)
      next(error);
    }
  }

  protected async acceptDeclineJobAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await jobService.acceptDeclineJobAdmin(req);

      return res.status(200).json({
        status: 200,
        message: `Job ${data.accept ? 'deleted' : 're-asigned'} successfully`,
      });
    } catch (error) {

      console.log(error)
      next(error);
    }
  }
  
  
  
  protected async deleteJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await jobService.deleteJob(data);

      return res.status(200).json({
        status: 200,
        message: "Job deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  protected async sheduleAgenda(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await jobService.sheduleAgenda(data);

      return res.status(200).json({
        status: 200,
        message: "Job created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  protected async sheduleDate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await jobService.sheduleDate(data);

      return res.status(200).json({
        status: 200,
        message: "Job created successfully",
      });
    } catch (error) {
      next(error);
    }
  }


  protected async updateMaxCheckInTime(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await jobService.updateMaxCheckInTime(data);

      return res.status(200).json({
        status: 200,
        message: "Job created successfully",
      });
    } catch (error) {
      next(error);
    }
  }



  protected async createJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await jobService.createJob(data);

      return res.status(200).json({
        status: 200,
        message: "Job created successfully",
      });
    } catch (error) {
      next(error);
    }
  }








  protected async getAllJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await jobService.getAllJobsAdmin(req);
      console.log(obj?.length);
      if(obj?.length != 0 && obj?.length == null){
        return res.status(400).json({
          status: 400,
          data: obj ?? "Failed to process request",
        });
      }

      return res.status(200).json({
        status: 200,
        data: obj,
      });
    } catch (error) {
      next(error);
    }
  }
  

 
 
 
 
  protected async getMyJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;
      const id = req.user.id;

      const obj = await jobService.getJobsForStaff(id);
      console.log(obj?.length);
      if(obj?.length != 0 && obj?.length == null){
        return res.status(400).json({
          status: 400,
          data: obj ?? "Failed to process request",
        });
      }

      return res.status(200).json({
        status: 200,
        data: obj,
      });
    } catch (error) {
      next(error);
    }
  }
}

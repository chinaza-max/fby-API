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

  
      const myData={
        limit:Number(req.query.limit),
        offset:Number(req.query.offset),
      }
      
      const obj = await jobService.getAllUnsettleShiftOneGuard(data,myData);
      
      return res.status(200).json({
        status: 200,
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }



  
  protected async getDeclinedJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;
      const obj = await jobService.getDeclinedJob();
      
      return res.status(200).json({
        status: 200,
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }




  


  protected async getDashBoardInfoGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {

      console.log("kkkkkkkkkkkkkkkkkkk")


      
      const obj = await jobService.getDashBoardInfoGuard(req);
      
      return res.status(200).json({
        status: 200,
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }
  


  protected async getDashBoardInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;


      const obj = await jobService.getDashBoardInfo(req);
      
      return res.status(200).json({
        status: 200,
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  protected async getAllSite(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;


      const obj = await jobService.getAllSite(req);
      
      return res.status(200).json({
        status: 200,
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }

  protected async getAllGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;


      const obj = await jobService.getAllGuard(req);
      
      return res.status(200).json({
        status: 200,
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }

  protected async getGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;


      const obj = await jobService.getGuard(data);
      
      return res.status(200).json({
        status: 200,
        data: obj,
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
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }

  
 
  

  protected async performSecurityCheck(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data =req.body
      
      const data2 ={
        ...data,
        my_time_zone:req["user_time_zone"],
        longitude:req["objLatLon"][1],
        latitude:req["objLatLon"][0],
      }

      const obj = await jobService.performSecurityCheck(data2);
      
      return res.status(200).json({
        status: 200,
        message: `location good`,
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  protected async checkPositionQRcode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data =req.body
      
      const data2 ={
        ...data,
        my_time_zone:req["user_time_zone"],
        longitude:req["objLatLon"][1],
        latitude:req["objLatLon"][0],
      }

      const obj = await jobService.checkPositionQRcode(data2);
      
      return res.status(200).json({
        status: 200,
        message: `location good`,
      });
      
    } catch (error) {
      next(error);
    }
  }


  protected async deleteAgenda(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data =req.body
      
      const data2 ={
        ...data,
        my_time_zone:req["user_time_zone"],
        longitude:req["objLatLon"][1],
        latitude:req["objLatLon"][0],
      }

      const obj = await jobService.deleteAgenda(data2);
      
      return res.status(200).json({
        status: 200,
        message: `deleted  successfully`,
      });
      
    } catch (error) {
      next(error);
    }
  }

  
  protected async checkTaskGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data =req.body
      
      const data2 ={
        ...data,
        my_time_zone:req["user_time_zone"],
        longitude:req["objLatLon"][1],
        latitude:req["objLatLon"][0],
      }

      const obj = await jobService.checkTaskGuard(data2);
      
      return res.status(200).json({
        status: 200,
        message: `done successfully`,
      });
      
    } catch (error) {
      next(error);
    }
  }

  
  protected async verifySecurityCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data =req.body
      
      const data2 ={
        ...data,
        my_time_zone:req["user_time_zone"],
        longitude:req["objLatLon"][1],
        latitude:req["objLatLon"][0],
      }

      console.log(data2)
    

      const obj = await jobService.verifySecurityCode(data2);
      
      return res.status(200).json({
        status: 200,
        message: `done successfully`,
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
      const data =JSON.parse(req.body.schedule_id)
      const data2 ={
        schedule_id:data
      }

      const obj = await jobService.settleShift(data2);
      
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





  

  protected async getPerformSecurityCheckLog(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;
    
      const obj = await jobService.getPerformSecurityCheckLog(data);
      
      return res.status(200).json({
        status: 200,
        data: obj,
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
      req.user = req.body.guard_id;

      const obj = await jobService.getLogPerGuard(data);


      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }



  


  protected async shiftPerGuardAllJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;
      

      const obj = await jobService.shiftPerGuardAllJob(data);



      console.log("lllllllllllllllllllllllllllllllll")

      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        data: obj,
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


  
  protected async generalshiftStarted(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await jobService.generalshiftStarted(data);    
      

      return res.status(200).json({
        status: 200,
        data: obj,
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

      return res.status(200).json({
        status: 200,
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }



    protected async submitReportAndAttachment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {

      //console.log(req)
      const { id } = req.user;
      const data = req.body;
      const { file } = req;
     
      
      const user = await jobService.submitReportAndAttachment(id, data, file);

      return res.status(200).json({
        status: 200,
        message: "Repost posted successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }



  protected async getOneAgendaPerGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await jobService.getOneAgendaPerGuard(data);

      return res.status(200).json({
        status: 200,
        data: obj,
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

      return res.status(200).json({
        status: 200,
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }


  
  protected async getSingleReportGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await jobService.getSingleReportGuard(data);


      console.log(obj)
      return res.status(200).json({
        status: 200,
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }

  

  protected async getSecurityCodePerJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await jobService.getSecurityCodePerJob(data);

      return res.status(200).json({
        status: 200,
        data: obj,
      });
      
    } catch (error) {
      next(error);
    }
  }




  
  protected async getGuardIdFromJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
     
      const data =JSON.parse(req.body.jobs_id)
      //const data =req.body.jobs_id

      const data2 ={
        jobs_id:data
      }

      const obj = await jobService.getGuardIdFromJob(data2);
      
      return res.status(200).json({
        status:200,
        data: obj
      })
      
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
      
      return res.status(200).json({
        status:200,
        data: obj
      })
      
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


  
  protected async RemoveGuardSingleShedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      //REMOVE THIS AFTER TEST
      req.user = req.body.guard_id;

      console.log(data)

      const obj = await jobService.RemoveGuardSingleShedule(data);

      
      return res.status(200).json({
        status: 200,
        message: `schedule removed successfully`,
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

      const data2 ={
        ...data,
        my_time_zone:req["user_time_zone"],
        longitude:req["objLatLon"][1],
        latitude:req["objLatLon"][0]
      }

      const obj = await jobService.checkInCheckOutAdmin(data2);

      return res.status(200).json({
        status: 200,
        message: `Check ${data.check_in=="true" ? 'in' : 'out'} successful`,
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


      let guard_id = req.user.id;
      let myObj2={
        guard_id,
        ...data
      }

      //REMOVE THIS AFTER TEST
     
      const obj = await jobService.checkIn(myObj2);

      console.log(obj)
      
      return res.status(200).json({
        status: 200,
        message: `Check ${data.check_in=="true" ? 'in' : 'out'} successful`,
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
        message: `Job ${data.accept=="true" ? 'deleted' : 're-asigned'} successfully`,
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




  protected async createMemo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {


      const data =JSON.parse(req.body.guards_details)

      //const data =req.body.guards_details
      let data2={
        guards_details:data,
        message:req.body.message,
        send_date:req.body.send_date,
        created_by_id:req.user.id,
        my_time_zone:req["user_time_zone"]
      }
    
      console.log(data2)
      const obj = await jobService.createMemo(data2);

      return res.status(200).json({
        status: 200,
        message: "uploaded successfully",
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

      const data =JSON.parse(req.body.shedule_agenda)
      let data2={
        shedule_agenda:data,
        created_by_id:req.user.id,
        my_time_zone:req["user_time_zone"]
      }
    
      const obj = await jobService.sheduleAgenda(data2);

      return res.status(200).json({
        status: 200,
        message: "schedule created successfully",
      });
    } catch (error) {
      next(error);
    }
  }



  protected async scheduleDateJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
    
      const data =req.body
    


      const data2 ={
        ...data,
        created_by_id:28,
        my_time_zone:req["user_time_zone"]
      }
     /* const data2 ={
        ...data,
        created_by_id:req.user.id,
        my_time_zone:req["user_time_zone"]
      }*/

      const obj = await jobService.scheduleDateJob(data2);

      return res.status(200).json({
        status: 200,
        message: "Schedule created successfully",
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
    
      const data =JSON.parse(req.body.date_time_staff_shedule)
    
      const data2 ={
        date_time_staff_shedule:data,
        created_by_id:req.user.id,
        my_time_zone:req["user_time_zone"]
      }

      const obj = await jobService.sheduleDate(data2);

      return res.status(200).json({
        status: 200,
        message: "Schedule created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  

  protected async updateScheduleAcceptStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const data2 ={
        ...data,
        my_time_zone:req["user_time_zone"],
      }

      const obj = await jobService.updateScheduleAcceptStatus(data2);

      return res.status(200).json({
        status: 200,
        message: "updated successfully",
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

      let my_bj={
        ...data,
        created_by_id:req.user.id,
        my_time_zone:req["user_time_zone"]
      }

      const obj = await jobService.createJob(my_bj);

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
  

 
 
 
  

  protected async getSinglejob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;
      const id = req.user.id;


      let myObj={
        job_id:req.query.job_id ,
        guard_id:id
      }


      const obj = await jobService.getSinglejob(myObj);


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

   

      const obj = await jobService.getJobsForStaff(req);

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

import { Request, Response, NextFunction } from "express";
import jobService from "../../service/job.service";

export default class JobController {

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

      const obj = await jobService.getAllJobsAdmin();
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

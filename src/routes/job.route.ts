import { Router } from "express";
import JobController from "../controllers/job/job.controller";

class JobRoutes extends JobController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/check-in", this.checkInCheckOut);
    this.router.post("/accept-decline-job", this.acceptDeclineJob);
    this.router.post("/add_shedule_data_", this.createJob);
    this.router.get("/allJobs", this.getAllJobs);
    this.router.get("/myJobs", this.getMyJobs);
    this.router.post("/", this.createJob);
  }
}

export default new JobRoutes().router;

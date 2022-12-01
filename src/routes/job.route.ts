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


    this.router.post("/remove_guard_shedule", this.RemoveGuardShedule);
    this.router.post("/check-in", this.checkInCheckOut);
    this.router.post("/accept-decline-job", this.acceptDeclineJob);
    this.router.post("/re_asign_or_delete-job", this.acceptDeclineJobAdmin);
    this.router.post("/add_shedule_date_staff", this.sheduleDate);
    this.router.post("/add_agenda", this.sheduleAgenda);
    this.router.post("/delete_job", this.deleteJob);
    this.router.get("/allJobs", this.getAllJobs);
    this.router.post("/allJobs/guard", this.getGuardPerJob);
    this.router.get("/myJobs", this.getMyJobs);


   // this.router.get("/myJobsAdminDetail", this.getMyJobsAdminDetail);
    this.router.post("/", this.createJob);
  }
}

export default new JobRoutes().router;

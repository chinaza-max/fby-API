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
    this.router.post("/remove_guard_shedule_log", this.RemoveGuardSheduleLog);
    this.router.post("/check-in", this.checkInCheckOut);
    this.router.post("/check_in_admin", this.checkInCheckOutAdmin);
    this.router.post("/accept-decline-job", this.acceptDeclineJob);
    this.router.post("/re_asign_or_delete-job", this.acceptDeclineJobAdmin);
    this.router.post("/add_shedule_date_staff", this.sheduleDate);
    this.router.post("/update_Max_Check_InTime", this.updateMaxCheckInTime);
    this.router.post("/add_agenda", this.sheduleAgenda);
    this.router.post("/delete_job", this.deleteJob);
    this.router.get("/allJobs", this.getAllJobs);
    this.router.post("/allJobs/guard", this.getGuardPerJob);
    this.router.post("/allJobs/oneShedulePerGuard", this.getOneShedulePerGuard);
    this.router.get("/allJobs/generalshift", this.getGeneralShift);
    this.router.post("/allJobs/shiftPerGuard", this.getShiftPerGuard);
    this.router.post("/allJobs/logPerGuard", this.getLogPerGuard);
    this.router.post("/updateJobStatus", this.updateJobStatus);
    this.router.post("/settleShift", this.settleShift);
    this.router.get("/getGeneralUnsettleShift", this.getGeneralUnsettleShift);
    this.router.get("/getGuard", this.getGuard);

    this.router.post("/getAllUnsettleShiftOneGuard", this.getAllUnsettleShiftOneGuard);




    this.router.get("/myJobs", this.getMyJobs);
    

   // this.router.get("/myJobsAdminDetail", this.getMyJobsAdminDetail);
    this.router.post("/", this.createJob);
  }
}

export default new JobRoutes().router;

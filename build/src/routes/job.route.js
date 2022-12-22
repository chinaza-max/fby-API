"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = __importDefault(require("../controllers/job/job.controller"));
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
class JobRoutes extends job_controller_1.default {
    constructor() {
        super();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.post("/remove_guard_shedule", this.RemoveGuardShedule);
        this.router.post("/remove_guard_single_shedule", this.RemoveGuardSingleShedule);
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
        //GET ALL REPORT FOR A SINGLE GUARD ON A PARTICULAR JOB
        this.router.post("/getSingleReportGuard", this.getSingleReportGuard);
        this.router.post("/allJobs/oneShedulePerGuard", this.getOneShedulePerGuard);
        this.router.get("/allJobs/generalshift", this.getGeneralShift);
        this.router.get("/allJobs/generalshiftStarted", this.generalshiftStarted);
        //SUBMIT REPORT FROM GUARD
        this.router.put("/submitReportAttachment", upload_middleware_1.default.uploads.single("file"), this.submitReportAndAttachment);
        //THIS GET SHIFT PER GUARD PER JOB
        this.router.post("/allJobs/shiftPerGuard", this.getShiftPerGuard);
        //THIS GET SHIFT PER GUARD FOR ALL JOB
        this.router.post("/allJobs/shiftPerGuardAllJob", this.shiftPerGuardAllJob);
        this.router.post("/allJobs/logPerGuard", this.getLogPerGuard);
        this.router.post("/updateJobStatus", this.updateJobStatus);
        this.router.post("/settleShift", this.settleShift);
        this.router.get("/getGeneralUnsettleShift", this.getGeneralUnsettleShift);
        //THIS IS FOR AVAILABLE GUARD
        this.router.post("/getGuard", this.getGuard);
        //THIS IS FOR ALL GUARD
        this.router.get("/getAllGuard", this.getAllGuard);
        this.router.get("/getAllSite", this.getAllSite);
        this.router.get("/getDashBoardInfo", this.getDashBoardInfo);
        this.router.get("/getDashBoardInfoGuard", this.getDashBoardInfoGuard);
        this.router.get("/getDeclinedJob", this.getDeclinedJob);
        this.router.post("/getAllUnsettleShiftOneGuard", this.getAllUnsettleShiftOneGuard);
        this.router.get("/myJobs", this.getMyJobs);
        this.router.get("/myJobs/getSinglejob", this.getSinglejob);
        // this.router.get("/myJobsAdminDetail", this.getMyJobsAdminDetail);
        this.router.post("/", this.createJob);
    }
}
exports.default = new JobRoutes().router;
//# sourceMappingURL=job.route.js.map
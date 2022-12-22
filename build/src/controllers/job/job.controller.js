"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_service_1 = __importDefault(require("../../service/job.service"));
class JobController {
    getAllUnsettleShiftOneGuard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const myData = {
                    limit: Number(req.query.limit),
                    offset: Number(req.query.offset),
                };
                console.log("------------------------");
                console.log(myData);
                console.log("------------------------");
                const obj = yield job_service_1.default.getAllUnsettleShiftOneGuard(data, myData);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDeclinedJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.getDeclinedJob(req);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDashBoardInfoGuard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("kkkkkkkkkkkkkkkkkkk");
                const obj = yield job_service_1.default.getDashBoardInfoGuard(req);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDashBoardInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.getDashBoardInfo(req);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllSite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.getAllSite(req);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllGuard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.getAllGuard(req);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getGuard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.getGuard(data);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getGeneralUnsettleShift(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const myData = {
                    limit: Number(req.query.limit),
                    offset: Number(req.query.offset),
                    settlement: req.query.settlement
                };
                const obj = yield job_service_1.default.getGeneralUnsettleShift(myData);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    settleShift(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = JSON.parse(req.body.schedule_id);
                const data2 = {
                    schedule_id: data
                };
                console.log(data2);
                const obj = yield job_service_1.default.settleShift(data2);
                return res.status(200).json({
                    status: 200,
                    message: `updated successfully`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateJobStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                //REMOVE THIS AFTER TEST
                req.user = req.body.guard_id;
                const obj = yield job_service_1.default.updateJobStatus(data);
                return res.status(200).json({
                    status: 200,
                    message: `job status has been updated successfully`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getLogPerGuard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                req.user = req.body.guard_id;
                const obj = yield job_service_1.default.getLogPerGuard(data);
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    shiftPerGuardAllJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                //REMOVE THIS AFTER TEST
                req.user = req.body.guard_id;
                const obj = yield job_service_1.default.shiftPerGuardAllJob(data);
                console.log("lllllllllllllllllllllllllllllllll");
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getShiftPerGuard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                //REMOVE THIS AFTER TEST
                req.user = req.body.guard_id;
                const obj = yield job_service_1.default.getShiftPerGuard(data);
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    message: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    generalshiftStarted(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.generalshiftStarted(data);
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getGeneralShift(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                //REMOVE THIS AFTER TEST
                req.user = req.body.guard_id;
                const obj = yield job_service_1.default.getGeneralShift(data);
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    submitReportAndAttachment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log(req)
                const { id } = req.user;
                const data = req.body;
                const { file } = req;
                const user = yield job_service_1.default.submitReportAndAttachment(id, data, file);
                return res.status(200).json({
                    status: 200,
                    message: "Repost posted successfully.",
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getOneShedulePerGuard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                //REMOVE THIS AFTER TEST
                req.user = req.body.guard_id;
                const obj = yield job_service_1.default.getOneShedulePerGuard(data);
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSingleReportGuard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.getSingleReportGuard(data);
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getGuardPerJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                //REMOVE THIS AFTER TEST
                req.user = req.body.guard_id;
                const obj = yield job_service_1.default.getGuardPerJob(data);
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    RemoveGuardSheduleLog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                //REMOVE THIS AFTER TEST
                req.user = req.body.guard_id;
                const obj = yield job_service_1.default.RemoveGuardSheduleLog(data);
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    message: `log has been removed successfully`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    RemoveGuardSingleShedule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                //REMOVE THIS AFTER TEST
                req.user = req.body.guard_id;
                console.log(data);
                const obj = yield job_service_1.default.RemoveGuardSingleShedule(data);
                return res.status(200).json({
                    status: 200,
                    message: `schedule removed successfully`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    RemoveGuardShedule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                //REMOVE THIS AFTER TEST
                req.user = req.body.guard_id;
                const obj = yield job_service_1.default.RemoveGuardShedule(data);
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    message: `Guard has been removed successfully`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    checkInCheckOutAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                //REMOVE THIS AFTER TEST
                req.user = req.body.guard_id;
                const obj = yield job_service_1.default.checkInCheckOutAdmin(data);
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    message: `Check ${data.check_in ? 'in' : 'out'} successful`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    checkInCheckOut(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                let guard_id = req.user.id;
                let myObj2 = Object.assign({ guard_id }, data);
                //REMOVE THIS AFTER TEST
                const obj = yield job_service_1.default.checkIn(myObj2);
                console.log(obj);
                return res.status(200).json({
                    status: 200,
                    message: `Check ${data.check_in == "true" ? 'in' : 'out'} successful`,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    acceptDeclineJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.acceptDeclineJob(req);
                return res.status(200).json({
                    status: 200,
                    message: `Job ${data.accept ? 'accepted' : 'declined'} successful`,
                });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    acceptDeclineJobAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.acceptDeclineJobAdmin(req);
                return res.status(200).json({
                    status: 200,
                    message: `Job ${data.accept == "true" ? 'deleted' : 're-asigned'} successfully`,
                });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    deleteJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.deleteJob(data);
                return res.status(200).json({
                    status: 200,
                    message: "Job deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    sheduleAgenda(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.sheduleAgenda(data);
                return res.status(200).json({
                    status: 200,
                    message: "Job created successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    sheduleDate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //\ 
                const data = JSON.parse(req.body.date_time_staff_shedule);
                const data3 = req.body;
                const data2 = {
                    date_time_staff_shedule: data,
                    latitude: data3.latitude,
                    longitude: data3.longitude
                };
                console.log(data2);
                const obj = yield job_service_1.default.sheduleDate(data2);
                return res.status(200).json({
                    status: 200,
                    message: "Schedule created successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateMaxCheckInTime(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.updateMaxCheckInTime(data);
                return res.status(200).json({
                    status: 200,
                    message: "Job created successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.createJob(data);
                return res.status(200).json({
                    status: 200,
                    message: "Job created successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllJobs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.getAllJobsAdmin(req);
                console.log(obj === null || obj === void 0 ? void 0 : obj.length);
                if ((obj === null || obj === void 0 ? void 0 : obj.length) != 0 && (obj === null || obj === void 0 ? void 0 : obj.length) == null) {
                    return res.status(400).json({
                        status: 400,
                        data: obj !== null && obj !== void 0 ? obj : "Failed to process request",
                    });
                }
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSinglejob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const id = req.user.id;
                let myObj = {
                    job_id: req.query.job_id,
                    guard_id: id
                };
                console.log(myObj);
                const obj = yield job_service_1.default.getSinglejob(myObj);
                console.log("llllllllllllllllllllllllllllllllllllllllllllllll");
                console.log(obj);
                console.log(obj === null || obj === void 0 ? void 0 : obj.length);
                if ((obj === null || obj === void 0 ? void 0 : obj.length) != 0 && (obj === null || obj === void 0 ? void 0 : obj.length) == null) {
                    return res.status(400).json({
                        status: 400,
                        data: obj !== null && obj !== void 0 ? obj : "Failed to process request",
                    });
                }
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMyJobs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield job_service_1.default.getJobsForStaff(req);
                console.log(obj === null || obj === void 0 ? void 0 : obj.length);
                if ((obj === null || obj === void 0 ? void 0 : obj.length) != 0 && (obj === null || obj === void 0 ? void 0 : obj.length) == null) {
                    return res.status(400).json({
                        status: 400,
                        data: obj !== null && obj !== void 0 ? obj : "Failed to process request",
                    });
                }
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = JobController;
//# sourceMappingURL=job.controller.js.map
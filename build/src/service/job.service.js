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
const models_1 = require("../db/models");
const errors_1 = require("../errors");
const sequelize_1 = require("sequelize");
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const schedule_model_1 = __importDefault(require("../db/models/schedule.model"));
const job_util_1 = __importDefault(require("../utils/job.util"));
const server_config_1 = __importDefault(require("../config/server.config"));
class UserService {
    constructor() {
        this.UserModel = models_1.Admin;
        this.JobModel = models_1.Job;
        this.ScheduleModel = schedule_model_1.default;
        this.JobOperationsModel = models_1.JobOperations;
        this.AssignedStaffsModel = models_1.AssignedStaffs;
        this.CustomerModel = models_1.Customer;
        this.JobLogsModel = models_1.JobLogs;
        this.LocationModel = models_1.Location;
        this.CoordinatesModel = models_1.Coordinates;
        this.FacilityModel = models_1.Facility;
        this.FacilityLocationModel = models_1.FacilityLocation;
        this.AgendasModel = models_1.Agendas;
        this.JobReportsModel = models_1.JobReports;
        this.JobSecurityModel = models_1.JobSecurityCode;
    }
    /*
    async getJobsForStaff(staffId: number): Promise<any[]> {
      try {
        const jobs = [];
        const relatedAssignments = await this.AssignedStaffsModel.findAll({
          where: {
            staff_id: staffId,
          },
        })
        for (const assignment of relatedAssignments) {
          const relatedJobs = await this.JobModel.findAll({
            where: {
              id: assignment.job_id,
              job_status: {
                [Op.ne]: "CANCELED",
              },
            },
          });
          if (relatedJobs == null) continue;
          const relatedJob = relatedJobs[0];
          const facility = await this.FacilityModel.findByPk(
            relatedJob.facility_id
          );
          if (facility == null) continue;
          const facilityLocation = await this.FacilityLocationModel.findByPk(
            facility.id
          );
          if (relatedJob == null) continue;
          const coodinates = await this.CoordinatesModel.findByPk(
            facilityLocation.coordinates_id
          );
          if (coodinates == null) continue;
          let getStaffJobStatus = () => {
            if (relatedJob.job_status == "COMPLETED")
              return relatedJob.job_status;
            else if (assignment.accept_assignment === true) return "ACTIVE";
            else if (assignment.accept_assignment === null) return "PENDING";
          };
          const currentJob = {
            id: relatedJob.id,
            description: relatedJob.description,
            payment: relatedJob.staff_charge,
            job_type: relatedJob.job_type,
            accepted: assignment.accept_assignment,
            status: getStaffJobStatus(),
            statistics: {
              hours_worked: 0.0,
              payment: 0.0,
            },
            facility: {
              id: facility.id,
              name: facility.name,
              location: {
                address: facilityLocation.address,
                latitude: coodinates.latitude,
                longitude: coodinates.longitude,
              },
            },
            schedule: [],
          };
          const relatedSchedules = await this.ScheduleModel.findAll({
            where: {
              job_id: relatedJob.id,
            },
          });
          var scheduleRes = [];
          for (const iSchedule of relatedSchedules) {
            const latestRelatedJobOperation =
              await this.JobOperationsModel.findOrCreate({
                where: {
                  staff_id: staffId,
                  schedule_id: iSchedule.id,
                },
                defaults: {
                  staff_id: staffId,
                  schedule_id: iSchedule.id,
                },
              });
            scheduleRes.push({
              id: iSchedule.id,
              start_time: iSchedule.start_time,
              end_time: iSchedule.end_time,
              check_in_date: iSchedule.check_in_date,
              schedule_length: iSchedule.schedule_length,
              operations: {
                id: latestRelatedJobOperation[0].id,
                checked_in: latestRelatedJobOperation[0].checked_in,
                checked_out: latestRelatedJobOperation[0].checked_out,
              },
            });
          }
          currentJob.schedule = [...scheduleRes];
          jobs.push(currentJob);
        }
        return jobs;
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  
  */
    getSinglejob(myObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let jobDetail = [];
                let myHours_worked = 0;
                let foundJL = yield this.JobLogsModel.findAll({
                    where: { [sequelize_1.Op.and]: [{ check_in_status: true },
                            { guard_id: myObj.guard_id },
                            { check_out_status: true }
                        ] }
                });
                if (foundJL.length != 0) {
                    for (let l = 0; l < foundJL.length; l++) {
                        myHours_worked += foundJL[l].hours_worked;
                    }
                }
                const foundS = yield this.ScheduleModel.findAll({
                    where: { [sequelize_1.Op.and]: [{ job_id: myObj.job_id },
                            { guard_id: myObj.guard_id },
                            { status_per_staff: 'ACTIVE' }] },
                    order: [
                        ["check_in_date", "ASC"],
                    ],
                });
                if (foundS.length != 0) {
                    let schedule = [];
                    for (let j = 0; j < foundS.length; j++) {
                        let obj = {};
                        let sheduleObj = foundS[j];
                        obj["check_in_date"] = yield this.getDateOnly(sheduleObj.check_in_date);
                        obj["check_out_date"] = yield this.getDateOnly(sheduleObj.check_out_date);
                        obj["start_time"] = yield this.getTimeOnly(sheduleObj.check_in_date);
                        obj["end_time"] = yield this.getTimeOnly(sheduleObj.check_out_date);
                        schedule.push(obj);
                        if (j == foundS.length - 1) {
                            const foundJ2 = yield this.JobModel.findOne({
                                where: { id: sheduleObj.job_id }
                            });
                            const foundF = yield this.FacilityModel.findOne({
                                where: { id: foundJ2.facility_id }
                            });
                            const foundFL = yield this.FacilityLocationModel.findOne({
                                where: { id: foundF.facility_location_id }
                            });
                            jobDetail.push({ schedule,
                                job_id: sheduleObj.job_id,
                                description: foundJ2.description,
                                job_type: foundJ2.job_type,
                                guard_charge: "$" + foundJ2.staff_charge,
                                time_zone: foundF.time_zone,
                                facility_name: foundF.name,
                                address: foundFL.address,
                                job_status: foundFL.address,
                                hours_worked: myHours_worked,
                                earn: "$" + (myHours_worked * foundJ2.staff_charge).toFixed(2),
                                guard_id: myObj.guard_id
                            });
                        }
                        if (j == foundS.length - 1) {
                            return jobDetail;
                        }
                    }
                }
                else {
                    return jobDetail;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getJobsForStaff(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.user.id;
            let myObj = {
                id,
                jobType: req.query.jobType
            };
            try {
                let jobDetail = [];
                if (myObj.jobType == "ACTIVE") {
                    const foundJ = yield this.JobModel.findAll({
                        where: { job_status: 'ACTIVE' }
                    });
                    if (foundJ.length != 0) {
                        for (let i = 0; i < foundJ.length; i++) {
                            const foundS = yield this.ScheduleModel.findAll({
                                where: { [sequelize_1.Op.and]: [{ job_id: foundJ[i].id },
                                        { guard_id: myObj.id },
                                        { status_per_staff: 'ACTIVE' }] }
                            });
                            if (foundS.length != 0) {
                                let schedule = [];
                                for (let j = 0; j < foundS.length; j++) {
                                    let obj = {};
                                    let sheduleObj = foundS[j];
                                    obj["check_in_date"] = yield this.getDateOnly(sheduleObj.check_in_date);
                                    obj["check_out_date"] = yield this.getDateOnly(sheduleObj.check_out_date);
                                    obj["start_time"] = yield this.getTimeOnly(sheduleObj.check_in_date);
                                    obj["end_time"] = yield this.getTimeOnly(sheduleObj.check_out_date);
                                    schedule.push(obj);
                                    if (j == foundS.length - 1) {
                                        const foundJ2 = yield this.JobModel.findOne({
                                            where: { id: sheduleObj.job_id }
                                        });
                                        const foundF = yield this.FacilityModel.findOne({
                                            where: { id: foundJ2.facility_id }
                                        });
                                        const foundFL = yield this.FacilityLocationModel.findOne({
                                            where: { id: foundF.facility_location_id }
                                        });
                                        jobDetail.push({ schedule,
                                            job_id: sheduleObj.job_id,
                                            description: foundJ2.description,
                                            job_type: foundJ2.job_type,
                                            guard_charge: foundJ2.staff_charge,
                                            time_zone: foundF.time_zone,
                                            facility_name: foundF.name,
                                            address: foundFL.address,
                                            job_status: foundFL.address,
                                        });
                                    }
                                }
                            }
                            if (i == foundJ.length - 1) {
                                console.log(jobDetail);
                                return jobDetail;
                            }
                        }
                    }
                    else {
                        return jobDetail;
                    }
                }
                else if (myObj.jobType == "PENDING") {
                    const foundJ = yield this.JobModel.findAll({
                        where: { job_status: 'ACTIVE' }
                    });
                    if (foundJ.length != 0) {
                        for (let i = 0; i < foundJ.length; i++) {
                            const foundS = yield this.ScheduleModel.findAll({
                                where: { [sequelize_1.Op.and]: [{ job_id: foundJ[i].id },
                                        { guard_id: myObj.id },
                                        { status_per_staff: 'PENDING' }] }
                            });
                            if (foundS.length != 0) {
                                let schedule = [];
                                for (let j = 0; j < foundS.length; j++) {
                                    let obj = {};
                                    let sheduleObj = foundS[j];
                                    obj["check_in_date"] = yield this.getDateOnly(sheduleObj.check_in_date);
                                    obj["check_out_date"] = yield this.getDateOnly(sheduleObj.check_out_date);
                                    obj["start_time"] = yield this.getTimeOnly(sheduleObj.check_in_date);
                                    obj["end_time"] = yield this.getTimeOnly(sheduleObj.check_out_date);
                                    schedule.push(obj);
                                    if (j == foundS.length - 1) {
                                        const foundJ2 = yield this.JobModel.findOne({
                                            where: { id: sheduleObj.job_id }
                                        });
                                        const foundF = yield this.FacilityModel.findOne({
                                            where: { id: foundJ2.facility_id }
                                        });
                                        const foundFL = yield this.FacilityLocationModel.findOne({
                                            where: { id: foundF.facility_location_id }
                                        });
                                        jobDetail.push({ schedule,
                                            job_id: sheduleObj.job_id,
                                            description: foundJ2.description,
                                            job_type: foundJ2.job_type,
                                            guard_charge: foundJ2.staff_charge,
                                            time_zone: foundF.time_zone,
                                            facility_name: foundF.name,
                                            address: foundFL.address,
                                            job_status: foundFL.address,
                                        });
                                    }
                                }
                            }
                            if (i == foundJ.length - 1) {
                                console.log(jobDetail);
                                return jobDetail;
                            }
                        }
                    }
                    else {
                        return jobDetail;
                    }
                }
                else if (myObj.jobType == "COMPLETED") {
                    const myData = {
                        limit: Number(req.query.limit),
                        offset: Number(req.query.offset)
                    };
                    const foundJ = yield this.JobModel.findAll({
                        where: { job_status: 'COMPLETED' }
                    });
                    if (foundJ.length != 0) {
                        for (let i = 0; i < foundJ.length; i++) {
                            const foundS = yield this.ScheduleModel.findAll({
                                limit: myData.limit,
                                offset: myData.offset,
                                where: { [sequelize_1.Op.and]: [{ job_id: foundJ[i].id },
                                        { guard_id: myObj.id },
                                        { status_per_staff: 'ACTIVE' }] },
                                order: [
                                    ['created_at', 'ASC']
                                ]
                            });
                            if (foundS.length != 0) {
                                let schedule = [];
                                for (let j = 0; j < foundS.length; j++) {
                                    let obj = {};
                                    let sheduleObj = foundS[j];
                                    obj["check_in_date"] = yield this.getDateOnly(sheduleObj.check_in_date);
                                    obj["check_out_date"] = yield this.getDateOnly(sheduleObj.check_out_date);
                                    obj["start_time"] = yield this.getTimeOnly(sheduleObj.check_in_date);
                                    obj["end_time"] = yield this.getTimeOnly(sheduleObj.check_out_date);
                                    schedule.push(obj);
                                    if (j == foundS.length - 1) {
                                        const foundJ2 = yield this.JobModel.findOne({
                                            where: { id: sheduleObj.job_id }
                                        });
                                        const foundF = yield this.FacilityModel.findOne({
                                            where: { id: foundJ2.facility_id }
                                        });
                                        const foundFL = yield this.FacilityLocationModel.findOne({
                                            where: { id: foundF.facility_location_id }
                                        });
                                        jobDetail.push({ schedule,
                                            job_id: sheduleObj.job_id,
                                            description: foundJ2.description,
                                            job_type: foundJ2.job_type,
                                            guard_charge: foundJ2.staff_charge,
                                            time_zone: foundF.time_zone,
                                            facility_name: foundF.name,
                                            address: foundFL.address,
                                            job_status: foundFL.address,
                                        });
                                    }
                                }
                            }
                            if (i == foundJ.length - 1) {
                                console.log(jobDetail);
                                return jobDetail;
                            }
                        }
                    }
                    else {
                        return jobDetail;
                    }
                }
                else {
                    return jobDetail;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getAllJobsAdmin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data.query);
            let mytype = data.query.type;
            try {
                const jobs = [];
                let availableJobs;
                console.log(data.query.limit);
                if (mytype == 'ACTIVE') {
                    availableJobs = yield this.JobModel.findAll({
                        limit: parseInt(data.query.limit),
                        offset: parseInt(data.query.offset),
                        where: {
                            is_deleted: false,
                            job_status: 'ACTIVE',
                        },
                        order: [
                            ['created_at', 'DESC'],
                        ],
                    });
                }
                else if (mytype == 'PENDING') {
                    availableJobs = yield this.JobModel.findAll({
                        limit: parseInt(data.query.limit),
                        offset: parseInt(data.query.offset),
                        where: {
                            is_deleted: false,
                            job_status: 'PENDING',
                        },
                        order: [
                            ['created_at', 'DESC'],
                        ],
                    });
                }
                else if (mytype == 'COMPLETED') {
                    availableJobs = yield this.JobModel.findAll({
                        limit: parseInt(data.query.limit),
                        offset: parseInt(data.query.offset),
                        where: {
                            is_deleted: false,
                            job_status: 'COMPLETED',
                        },
                        order: [
                            ['created_at', 'DESC'],
                        ],
                    });
                }
                else {
                    availableJobs = yield this.JobModel.findAll({
                        where: {
                            is_deleted: false,
                        },
                        order: [
                            ['created_at', 'DESC'],
                        ],
                    });
                }
                for (const availableJob of availableJobs) {
                    let foundC = yield this.CustomerModel.findOne({
                        where: {
                            id: availableJob.customer_id
                        }
                    });
                    let foundF = yield this.FacilityModel.findOne({
                        where: {
                            id: availableJob.facility_id
                        }
                    });
                    const jobRes = {
                        id: availableJob.id,
                        description: availableJob.description,
                        client_charge: availableJob.client_charge,
                        staff_payment: availableJob.staff_charge,
                        status: availableJob.job_status,
                        customer: foundC.first_name,
                        site: foundF.name,
                        create: availableJob.created_at
                    };
                    jobs.push(jobRes);
                }
                return jobs;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    deleteJob(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { job_id } = yield job_util_1.default.verifyDeleteJob.validateAsync(data);
                console.log("lllllllllllllllllllllllllllllllllllllllllll");
                console.log(job_id);
                console.log("lllllllllllllllllllllllllllllllllllllllllll");
                this.JobModel.destroy({
                    where: {
                        id: job_id
                    }
                })
                    .then(function (deletedRecord) {
                    if (deletedRecord === 1) {
                        return "Deleted successfully";
                    }
                    else {
                        // throw new NotFoundError("record not found");
                    }
                })
                    .catch(function (error) {
                    //throw new NotFoundError(error);
                });
            }
            catch (error) {
                console.log(error);
                throw new errors_1.SystemError(error.toString());
            }
        });
    }
    sheduleAgenda(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { shedule_agenda } = yield job_util_1.default.verifySheduleAgenda.validateAsync(data);
                //GETTING ALL THE THE JOBS SPECIFIC TO THE SHEDULE
                let myShedule = yield this.AgendasModel.findAll({
                    where: { [sequelize_1.Op.and]: [{ job_id: shedule_agenda[0].job_id },
                            { agenda_type: shedule_agenda[0].agenda_type }] }
                });
                console.log(shedule_agenda);
                //CHECK FOR DUBPLICATE
                let cleanShedule = [];
                if (myShedule.length != 0) {
                    for (let i = 0; i < shedule_agenda.length; i++) {
                        let obj = shedule_agenda[i];
                        for (let j = 0; j < myShedule.length; j++) {
                            let obj2 = myShedule[j];
                            // console.log("start check")
                            let newDate = (0, moment_1.default)(new Date(obj.check_in_date));
                            let dateNowFormatted1 = newDate.format('YYYY-MM-DD');
                            // console.log(dateNowFormatted1)
                            let oldDate = (0, moment_1.default)(new Date(obj2.check_in_date));
                            let dateNowFormatted2 = oldDate.format('YYYY-MM-DD');
                            if (obj.agenda_type == "INSTRUCTION") {
                                if ((dateNowFormatted1 == dateNowFormatted2) && (obj.guard_id == obj2.guard_id) && (obj.time == obj2.time)) {
                                    break;
                                }
                            }
                            if (j == myShedule.length - 1) {
                                shedule_agenda[i].status_per_staff = myShedule[0].status_per_staff;
                                cleanShedule.push(shedule_agenda[i]);
                            }
                        }
                        if (i == shedule_agenda.length - 1) {
                            yield this.AgendasModel.bulkCreate(cleanShedule);
                        }
                    }
                }
                else {
                    yield this.AgendasModel.bulkCreate(shedule_agenda);
                }
            }
            catch (error) {
                console.log(error);
                throw new errors_1.SystemError(error.toString());
            }
        });
    }
    updateMaxCheckInTime(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { guard_id, shedule_id, max_check_in_time } = yield job_util_1.default.verifyUpdateMaxCheckInTime.validateAsync(data);
                let schedule = yield this.ScheduleModel.update({ max_check_in_time }, {
                    where: { [sequelize_1.Op.and]: [
                            { guard_id },
                            { id: shedule_id }
                        ] }
                });
                console.log(schedule);
            }
            catch (error) {
                console.log(error);
                throw new errors_1.SystemError(error.toString());
            }
        });
    }
    sheduleDate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { date_time_staff_shedule, latitude, longitude } = yield job_util_1.default.verifysheduleDateCreation.validateAsync(data);
                let my_time_zone = yield this.getTimeZone(latitude, longitude);
                let dateStamp = yield this.getDateAndTimeForStamp(my_time_zone);
                //GETTING ALL THE THE JOBS SPECIFIC TO THE SHEDULE
                let myShedule = yield this.ScheduleModel.findAll({
                    where: { job_id: date_time_staff_shedule[0].job_id }
                });
                if (yield this.checkIfDateAreApart(date_time_staff_shedule)) {
                    //CHECK FOR DUBPLICATE
                    let cleanShedule = [];
                    if (myShedule.length != 0) {
                        for (let i = 0; i < date_time_staff_shedule.length; i++) {
                            let obj = date_time_staff_shedule[i];
                            for (let j = 0; j < myShedule.length; j++) {
                                let obj2 = myShedule[j];
                                //  console.log(moment(new Date(obj.check_in_date)).format('YYYY-MM-DD hh:mm:ss a'))
                                let newDate = (0, moment_1.default)(new Date(obj.check_in_date));
                                let newDate2 = (0, moment_1.default)(new Date(obj.check_out_date));
                                let dateNowFormatted1 = newDate.format('YYYY-MM-DD');
                                let dateNowFormatted2 = newDate2.format('YYYY-MM-DD');
                                let myNewDateIn = new Date((0, moment_1.default)(new Date(obj.check_in_date)).format('YYYY-MM-DD hh:mm:ss a'));
                                let myNewDateOut = (0, moment_1.default)(new Date(obj.check_out_date));
                                // let myNewDateFormatted1 = newDate.format('YYYY-MM-DD hh:mm:ss a');
                                //let myNewDateOutFormatted1 = newDate2.format('YYYY-MM-DD hh:mm:ss a')
                                let oldDate = (0, moment_1.default)(new Date(obj2.check_in_date));
                                let oldDate2 = (0, moment_1.default)(new Date(obj2.check_out_date));
                                let dateNowFormatted3 = oldDate.format('YYYY-MM-DD');
                                let dateNowFormatted4 = oldDate2.format('YYYY-MM-DD');
                                //console.log(dateNowFormatted2)
                                console.log("in : ", dateNowFormatted1, "out : ", dateNowFormatted2, "in : ", dateNowFormatted3, "out : ", dateNowFormatted4);
                                console.log((dateNowFormatted1 == dateNowFormatted3) && (dateNowFormatted2 == dateNowFormatted4) && (obj.guard_id == obj2.guard_id));
                                //THIS CODE PREVENT DATE ENTANGLE MENT   ONE DATE FALLING INSIDE ANOTHE DATE
                                console.log(myNewDateIn);
                                const foundItemS = yield this.ScheduleModel.findOne({
                                    where: { [sequelize_1.Op.and]: [{ check_in_date: { [sequelize_1.Op.lte]: myNewDateIn } },
                                            { check_out_date: { [sequelize_1.Op.gte]: myNewDateIn } },
                                            { job_id: obj.job_id },
                                            { guard_id: obj.guard_id }
                                        ] }
                                });
                                console.log("========================");
                                console.log(foundItemS);
                                console.log("=============---------------===========");
                                if (foundItemS) {
                                    continue;
                                }
                                const foundItemS2 = yield this.ScheduleModel.findOne({
                                    where: { [sequelize_1.Op.and]: [{ check_in_date: { [sequelize_1.Op.lte]: myNewDateOut } },
                                            { check_out_date: { [sequelize_1.Op.gte]: myNewDateOut } },
                                            { job_id: obj.job_id },
                                            { guard_id: obj.guard_id }
                                        ] }
                                });
                                if (foundItemS2) {
                                    continue;
                                }
                                if ((dateNowFormatted1 == dateNowFormatted3) && (dateNowFormatted2 == dateNowFormatted4) && (obj.guard_id == obj2.guard_id)) {
                                    continue;
                                }
                                if (j == myShedule.length - 1) {
                                    date_time_staff_shedule[i].status_per_staff = myShedule[0].status_per_staff;
                                    cleanShedule.push(date_time_staff_shedule[i]);
                                }
                            }
                            if (i == date_time_staff_shedule.length - 1) {
                                if (cleanShedule.length != 0) {
                                    let scheduleWithTimeStamp = yield this.addTimeStampToArr(cleanShedule, dateStamp);
                                    console.log("ooooooooooooooooooooooooooooo");
                                    console.log(scheduleWithTimeStamp);
                                    return yield this.ScheduleModel.bulkCreate(scheduleWithTimeStamp);
                                }
                                else {
                                    throw new errors_1.DateSheduleError("no new shedule was created dublicate found");
                                }
                            }
                        }
                        if (cleanShedule.length != 0) {
                            let scheduleWithTimeStamp = yield this.addTimeStampToArr(cleanShedule, dateStamp);
                            console.log("ooooooooooooooooooooooooooooo");
                            console.log(scheduleWithTimeStamp);
                            yield this.ScheduleModel.bulkCreate(cleanShedule);
                        }
                    }
                    else {
                        let scheduleWithTimeStamp = yield this.addTimeStampToArr(date_time_staff_shedule, dateStamp);
                        console.log("ooooooooooooooooooooooooooooo");
                        console.log(scheduleWithTimeStamp);
                        yield this.ScheduleModel.bulkCreate(date_time_staff_shedule);
                    }
                }
            }
            catch (error) {
                console.log(error);
                throw new errors_1.SystemError(error.toString());
            }
        });
    }
    createJob(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { description, customer_id, site_id, client_charge, staff_charge, payment_status, job_status, job_type, latitude, longitude, } = yield job_util_1.default.verifyJobCreationData.validateAsync(data);
                let my_time_zone = yield this.getTimeZone(latitude, longitude);
                let dateStamp = yield this.getDateAndTimeForStamp(my_time_zone);
                yield this.JobModel.create({
                    description,
                    customer_id,
                    facility_id: site_id,
                    client_charge,
                    staff_charge,
                    payment_status,
                    job_status,
                    job_type,
                    time_zone: my_time_zone,
                    created_at: dateStamp,
                    updated_at: dateStamp
                });
            }
            catch (error) {
                console.log(error);
                throw new errors_1.SystemError(error.toString());
            }
        });
    }
    acceptDeclineJobAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var { job_id, accept, guard_id } = req.body;
            if (accept == "true") {
                let relatedAssignment = yield this.ScheduleModel.destroy({ where: { [sequelize_1.Op.and]: [{ guard_id }, { job_id }] } });
                yield this.AgendasModel.destroy({ where: { [sequelize_1.Op.and]: [{ guard_id }, { job_id }] } });
                if (relatedAssignment == null)
                    throw new errors_1.NotFoundError("No Assignment was found for you.\nIt may not exist anymore");
            }
            else {
                let relatedAssignment = yield this.ScheduleModel.update({
                    status_per_staff: 'PENDING',
                }, {
                    where: { [sequelize_1.Op.and]: [{ guard_id }, { job_id }] }
                });
                yield this.AgendasModel.update({
                    status_per_staff: 'PENDING',
                }, {
                    where: { [sequelize_1.Op.and]: [{ guard_id }, { job_id }] }
                });
                console.log(relatedAssignment);
                if (relatedAssignment == null)
                    throw new errors_1.NotFoundError("No Assignment was found for you.\nIt may not exist anymore");
            }
        });
    }
    acceptDeclineJob(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var { job_id, accept } = req.body;
            let id = req.user.id;
            var relatedAssignment = yield this.ScheduleModel.update({
                status_per_staff: accept == "true" ? 'ACTIVE' : 'DECLINE',
            }, {
                where: { [sequelize_1.Op.and]: [{ guard_id: id }, { job_id }] }
            });
            yield this.AgendasModel.update({
                status_per_staff: accept = "true" ? 'ACTIVE' : 'DECLINE',
            }, {
                where: { [sequelize_1.Op.and]: [{ guard_id: id }, { job_id }] }
            });
            //console.log(relatedAssignment)
            if (relatedAssignment == null)
                throw new errors_1.NotFoundError("No Assignment was found for you.\nIt may not exist anymore");
            return relatedAssignment;
        });
    }
    getLogPerGuard(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { job_id, guard_id } = yield job_util_1.default.verifyGetLogPerGuard.validateAsync(obj);
            const foundJL = yield this.JobLogsModel.findAll({
                where: { [sequelize_1.Op.and]: [
                        { job_id },
                        { guard_id }
                    ] }
            });
            let myLog = [];
            if (foundJL.length != 0) {
                for (let i = 0; i < foundJL.length; i++) {
                    let obj = {};
                    let latLon = yield this.CoordinatesModel.findOne({
                        where: { id: foundJL[i].coordinates_id }
                    });
                    obj["check_in_date"] = yield this.getDateOnly(foundJL[i].check_in_date);
                    obj["check_out_date"] = foundJL[i].check_out_date ? yield this.getDateOnly(foundJL[i].check_out_date) : 'empty';
                    obj["check_in_time"] = foundJL[i].check_in_time ? foundJL[i].check_in_time : "empty";
                    obj["check_out_time"] = foundJL[i].check_out_time ? foundJL[i].check_out_time : "empty";
                    obj["log_id"] = foundJL[i].id;
                    obj["job_id"] = job_id;
                    obj["guard_id"] = guard_id;
                    if ((foundJL[i].check_in_status == true) && (true == foundJL[i].check_out_status)) {
                        obj["hours"] = yield this.calculateHoursSetToWork(foundJL[i].check_out_date, foundJL[i].check_in_date);
                    }
                    else {
                        obj["hours"] = 0;
                    }
                    obj["location_message"] = foundJL[i].message;
                    obj["lat"] = latLon.latitude;
                    obj["log"] = latLon.longitude;
                    myLog.push(obj);
                    if (i == foundJL.length - 1) {
                        return myLog;
                    }
                }
            }
            else {
                return [];
            }
        });
    }
    getAllUnsettleShiftOneGuard(obj, obj2) {
        return __awaiter(this, void 0, void 0, function* () {
            var { guard_id, settlement } = yield job_util_1.default.verifyGetAllUnsettleShiftOneGuard.validateAsync(obj);
            if (settlement) {
                let foundS = yield this.ScheduleModel.findAll({
                    limit: obj2.limit,
                    offset: obj2.offset,
                    where: { settlement_status: settlement }
                });
                console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
                console.log(foundS);
                console.log("==================================");
                let unSettledSucessfullShift = [];
                if (foundS.length != 0) {
                    for (let i = 0; i < foundS.length; i++) {
                        let obj = {};
                        //JUST FOR GETTING THE CHARGE PER JOB
                        // let foundJ=    await this.JobModel.findOne({where:{id: foundS[i].job_id}})
                        let foundJL = yield this.JobLogsModel.findOne({
                            where: { [sequelize_1.Op.and]: [{ check_in_status: true },
                                    { project_check_in_date: foundS[i].check_in_date },
                                    { check_out_status: true }
                                ] }
                        });
                        if (foundJL) {
                            let my_guard_info = yield this.getSingleGuardDetail(foundS[i].guard_id);
                            let foundJ = yield this.JobModel.findOne({
                                where: {
                                    id: foundS[i].job_id
                                }
                            });
                            let foundF = yield this.FacilityModel.findOne({
                                where: {
                                    id: foundJ.facility_id
                                }
                            });
                            obj["hours_worked"] = foundJL.hours_worked;
                            obj["amount"] = foundJL.hours_worked * foundJ.staff_charge;
                            obj["charge"] = foundJ.staff_charge;
                            obj["first_name"] = my_guard_info["first_name"];
                            obj["last_name"] = my_guard_info["last_name"];
                            obj["start_date"] = yield this.getDateOnly(foundS[i].check_in_date);
                            obj["start_time"] = foundS[i].start_time;
                            obj["end_date"] = yield this.getDateOnly(foundS[i].check_out_date);
                            obj["end_time"] = foundS[i].end_time;
                            obj["Job_hours"] = yield this.calculateHoursSetToWork(foundS[i].check_out_date, foundS[i].check_in_date);
                            obj["check_in_date"] = yield this.getDateOnly(foundJL.check_in_date);
                            obj["check_in_time"] = foundJL.check_in_time;
                            obj["check_out_date"] = yield this.getDateOnly(foundJL.check_out_date);
                            obj["check_out_time"] = foundJL.check_out_time;
                            obj["shedule_id"] = foundS[i].id;
                            obj["site_name"] = foundF.name;
                            unSettledSucessfullShift.push(obj);
                            console.log("lllllllllllllll========================");
                            console.log(obj);
                        }
                        if (i == foundS.length - 1) {
                            return unSettledSucessfullShift;
                        }
                    }
                }
                else {
                    return unSettledSucessfullShift;
                }
            }
            else {
                let foundS = yield this.ScheduleModel.findAll({
                    where: { [sequelize_1.Op.and]: [{ guard_id },
                            { settlement_status: settlement }] }
                });
                let unSettledSucessfullShift = [];
                if (foundS.length != 0) {
                    for (let i = 0; i < foundS.length; i++) {
                        let obj = {};
                        //JUST FOR GETTING THE CHARGE PER JOB
                        // let foundJ=    await this.JobModel.findOne({where:{id: foundS[i].job_id}})
                        let foundJL = yield this.JobLogsModel.findOne({
                            where: { [sequelize_1.Op.and]: [{ check_in_status: true },
                                    { project_check_in_date: foundS[i].check_in_date },
                                    { check_out_status: true }
                                ] }
                        });
                        if (foundJL) {
                            let my_guard_info = yield this.getSingleGuardDetail(foundS[i].guard_id);
                            let foundJ = yield this.JobModel.findOne({
                                where: {
                                    id: foundS[i].job_id
                                }
                            });
                            let foundF = yield this.FacilityModel.findOne({
                                where: {
                                    id: foundJ.facility_id
                                }
                            });
                            obj["hours_worked"] = foundJL.hours_worked;
                            obj["amount"] = foundJL.hours_worked * foundJ.staff_charge;
                            obj["charge"] = foundJ.staff_charge;
                            obj["first_name"] = my_guard_info["first_name"];
                            obj["last_name"] = my_guard_info["last_name"];
                            obj["start_date"] = yield this.getDateOnly(foundS[i].check_in_date);
                            obj["start_time"] = foundS[i].start_time;
                            obj["end_date"] = yield this.getDateOnly(foundS[i].check_out_date);
                            obj["end_time"] = foundS[i].end_time;
                            obj["Job_hours"] = yield this.calculateHoursSetToWork(foundS[i].check_out_date, foundS[i].check_in_date);
                            obj["check_in_date"] = yield this.getDateOnly(foundJL.check_in_date);
                            obj["check_in_time"] = foundJL.check_in_time;
                            obj["check_out_date"] = yield this.getDateOnly(foundJL.check_out_date);
                            obj["check_out_time"] = foundJL.check_out_time;
                            obj["shedule_id"] = foundS[i].id;
                            obj["site_name"] = foundF.name;
                            unSettledSucessfullShift.push(obj);
                        }
                        if (i == foundS.length - 1) {
                            return unSettledSucessfullShift;
                        }
                    }
                }
                else {
                    return unSettledSucessfullShift;
                }
            }
        });
    }
    shiftPerGuardAllJob(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { guard_id } = yield job_util_1.default.verifyShiftPerGuardAllJob.validateAsync(obj);
            const foundS = yield this.ScheduleModel.findAll({
                where: { [sequelize_1.Op.and]: [{ guard_id }
                    ] },
                order: [
                    ['check_in_date', 'DESC']
                ],
            });
            let all_shift = [];
            if (foundS.length != 0) {
                for (let i = 0; i < foundS.length; i++) {
                    let obj = {};
                    const foundJ = yield this.JobModel.findOne({
                        where: { id: foundS[i].job_id }
                    });
                    const foundF = yield this.FacilityModel.findOne({
                        where: { id: foundJ.facility_id }
                    });
                    const foundC = yield this.CustomerModel.findOne({
                        where: { id: foundJ.customer_id }
                    });
                    const foundJL = yield this.JobLogsModel.findOne({
                        where: { [sequelize_1.Op.and]: [{ project_check_in_date: foundS[i].check_in_date },
                                { job_id: foundS[i].job_id },
                                { guard_id: foundS[i].guard_id },
                                { check_in_status: true }
                            ] }
                    });
                    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
                    console.log(foundJ);
                    //obj["first_name"]= await this.getDateOnly(foundS[i].check_in_date) 
                    //obj["last_name"]=await this.getDateOnly(foundS[i].check_out_date) 
                    let name = yield this.getSingleGuardDetail(foundS[i].guard_id);
                    let hours = yield this.calculateHoursSetToWork(foundS[i].check_in_date, foundS[i].check_out_date);
                    obj["start_date"] = yield this.getDateOnly(foundS[i].check_in_date);
                    obj["end_date"] = yield this.getDateOnly(foundS[i].check_out_date);
                    obj["start_time"] = foundS[i].start_time;
                    obj["end_time"] = foundS[i].end_time;
                    obj["hours"] = yield this.calculateHoursSetToWork(foundS[i].check_out_date, foundS[i].check_in_date);
                    obj["first_name"] = name["first_name"];
                    obj["last_name"] = name["last_name"];
                    obj["customer"] = foundC.first_name + " " + foundC.last_name;
                    obj["site"] = foundF.name;
                    obj["guard_charge"] = "$" + foundJ.staff_charge;
                    obj["guard_id"] = foundS[i].guard_id;
                    obj["client_charge"] = foundJ.client_charge;
                    console.log("=================================");
                    console.log(foundF);
                    console.log("=================================");
                    if (foundJL) {
                        if (foundJL.check_out_status == true) {
                            obj["check_in"] = yield this.getDateAndTime(foundJL.check_in_date);
                            obj["check_out"] = yield this.getDateAndTime(foundJL.check_out_date);
                            obj["hours_worked"] = foundJL.hours_worked;
                            obj["earned"] = "$" + (foundJL.hours_worked * foundJ.staff_charge).toFixed(2);
                            obj["settlement_status"] = foundS[i].settlement_status;
                        }
                        else {
                            obj["check_in"] = yield this.getDateAndTime(foundJL.check_in_date);
                            obj["check_out"] = "none";
                            obj["hours_worked"] = 0;
                            obj["earned"] = "$" + 0;
                            obj["settlement_status"] = "none";
                        }
                    }
                    else {
                        obj["check_in"] = "none";
                        obj["check_out"] = "none";
                        obj["hours_worked"] = 0;
                        obj["earned"] = "$" + 0;
                        obj["settlement_status"] = "not eligible";
                    }
                    all_shift.push(obj);
                    if (i == foundS.length - 1) {
                        return all_shift;
                    }
                }
            }
            else {
                return [];
            }
        });
    }
    getShiftPerGuard(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { job_id, guard_id } = yield job_util_1.default.verifyGetShiftPerGuard.validateAsync(obj);
            const foundS = yield this.ScheduleModel.findAll({
                where: { [sequelize_1.Op.and]: [
                        { job_id },
                        { guard_id }
                    ] },
                order: [
                    ['check_in_date', 'DESC'],
                ],
            });
            let all_shift = [];
            if (foundS.length != 0) {
                for (let i = 0; i < foundS.length; i++) {
                    let obj = {};
                    const foundJ = yield this.JobModel.findOne({
                        where: { id: foundS[i].job_id }
                    });
                    const foundF = yield this.FacilityModel.findOne({
                        where: { id: foundJ.facility_id }
                    });
                    const foundC = yield this.CustomerModel.findOne({
                        where: { id: foundJ.customer_id }
                    });
                    const foundJL = yield this.JobLogsModel.findOne({
                        where: { [sequelize_1.Op.and]: [{ project_check_in_date: foundS[i].check_in_date },
                                { job_id: foundS[i].job_id },
                                { guard_id: foundS[i].guard_id },
                                { check_in_status: true }
                            ] }
                    });
                    //obj["first_name"]= await this.getDateOnly(foundS[i].check_in_date) 
                    //obj["last_name"]=await this.getDateOnly(foundS[i].check_out_date) 
                    let name = yield this.getSingleGuardDetail(foundS[i].guard_id);
                    let hours = yield this.calculateHoursSetToWork(foundS[i].check_in_date, foundS[i].check_out_date);
                    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkooooooooooo");
                    console.log(hours);
                    obj["start_date"] = yield this.getDateOnly(foundS[i].check_in_date);
                    obj["end_date"] = yield this.getDateOnly(foundS[i].check_out_date);
                    obj["start_time"] = foundS[i].start_time;
                    obj["end_time"] = foundS[i].end_time;
                    obj["hours"] = yield this.calculateHoursSetToWork(foundS[i].check_out_date, foundS[i].check_in_date);
                    obj["First_name"] = name["first_name"];
                    obj["last_name"] = name["last_name"];
                    obj["customer"] = foundC.first_name;
                    obj["site"] = foundF.name;
                    obj["guard_charge"] = foundF.guard_charge;
                    obj["guard_id"] = foundS[i].guard_id;
                    obj["client_charge"] = foundF.client_charge;
                    console.log("=================================");
                    console.log(foundJL);
                    console.log("=================================");
                    if (foundJL) {
                        if (foundJL.check_out_status == true) {
                            obj["check_in"] = yield this.getDateAndTime(foundJL.check_in_date);
                            obj["check_out"] = yield this.getDateAndTime(foundJL.check_out_date);
                            obj["hours_worked"] = foundJL.hours_worked;
                            obj["earned"] = (foundJL.hours_worked * foundF.client_charge).toFixed(2);
                        }
                        else {
                            obj["check_in"] = yield this.getDateAndTime(foundJL.check_in_date);
                            obj["check_out"] = "empty";
                            obj["hours_worked"] = 0;
                            obj["earned"] = 0;
                        }
                    }
                    else {
                        obj["check_in"] = "none";
                        obj["check_out"] = "none";
                        obj["hours_worked"] = 0;
                        obj["earned"] = 0;
                    }
                    all_shift.push(obj);
                    if (i == foundS.length - 1) {
                        return all_shift;
                    }
                }
            }
            else {
                return [];
            }
        });
    }
    generalshiftStarted(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundS = yield this.ScheduleModel.findAll({
                where: { status_per_staff: { [sequelize_1.Op.eq]: 'ACTIVE' } },
                order: [
                    ['created_at', 'DESC']
                ]
            });
            let all_shift = [];
            if (foundS.length != 0) {
                for (let i = 0; i < foundS.length; i++) {
                    let obj = {};
                    const foundJ = yield this.JobModel.findOne({
                        where: { [sequelize_1.Op.and]: [{ id: foundS[i].job_id },
                                { job_status: 'ACTIVE' }
                            ] }
                    });
                    /* const foundJ = await this.JobModel.findOne({
                    where: { id:foundS[i].job_id} });*/
                    console.log("breaking breakingbreaking breaking breaking breaking breaking ");
                    try {
                        console.log(foundJ.time_zone);
                        foundJ.time_zone;
                    }
                    catch (e) {
                        console.log(e);
                    }
                    let dateAndTime = yield this.getDateAndTimeForStamp(foundJ.time_zone);
                    if ((0, moment_1.default)(dateAndTime).isSame(foundS[i].check_in_date) || (0, moment_1.default)(dateAndTime).isSame(foundS[i].check_out_date) || (0, moment_1.default)(dateAndTime).isBetween((0, moment_1.default)(foundS[i].check_in_date), (0, moment_1.default)(foundS[i].check_out_date))) {
                        const foundF = yield this.FacilityModel.findOne({
                            where: { id: foundJ.facility_id }
                        });
                        const foundC = yield this.CustomerModel.findOne({
                            where: { id: foundJ.customer_id }
                        });
                        const foundJL = yield this.JobLogsModel.findOne({
                            where: { [sequelize_1.Op.and]: [{ project_check_in_date: foundS[i].check_in_date },
                                    { job_id: foundS[i].job_id },
                                    { job_id: foundS[i].job_id },
                                    { check_in_status: true }
                                ] }
                        });
                        let name = yield this.getSingleGuardDetail(foundS[i].guard_id);
                        let guard_charge = Number(foundJ.staff_charge).toFixed(2);
                        let client_charge = Number(foundJ.client_charge).toFixed(2);
                        //let hours=await this.calculateHoursSetToWork(foundS[i].check_in_date ,foundS[i].check_out_date)
                        obj["start_date"] = yield this.getDateOnly(foundS[i].check_in_date);
                        obj["end_date"] = yield this.getDateOnly(foundS[i].check_out_date);
                        obj["start_time"] = foundS[i].start_time;
                        obj["end_time"] = foundS[i].end_time;
                        obj["hours"] = yield this.calculateHoursSetToWork(foundS[i].check_out_date, foundS[i].check_in_date);
                        obj["name"] = name["first_name"] + " " + name["last_name"];
                        obj["customer"] = foundC.first_name + " " + foundC.last_name;
                        obj["site"] = foundF.name;
                        obj["guard_charge"] = "$" + guard_charge;
                        obj["guard_id"] = foundS[i].guard_id;
                        obj["client_charge"] = "$" + client_charge;
                        obj["job_status"] = foundJ.job_status;
                        obj["description"] = foundJ.description;
                        obj["settlement_status"] = foundS[i].settlement_status;
                        if (foundJL) {
                            if (foundJL.check_out_status == true) {
                                obj["check_in"] = yield this.getDateAndTime(foundJL.check_in_date);
                                obj["check_out"] = yield this.getDateAndTime(foundJL.check_out_date);
                                obj["hours_worked"] = foundJL.hours_worked;
                                obj["earned"] = "$" + (foundJL.hours_worked * foundJ.staff_charge).toFixed(2);
                            }
                            else {
                                obj["check_in"] = yield this.getDateAndTime(foundJL.check_in_date);
                                obj["check_out"] = "none";
                                obj["hours_worked"] = 0;
                                obj["earned"] = "$0.00";
                            }
                        }
                        else {
                            obj["check_in"] = "none";
                            obj["check_out"] = "none";
                            obj["hours_worked"] = 0;
                            obj["earned"] = "$0.00";
                        }
                        all_shift.push(obj);
                    }
                    if (i == foundS.length - 1) {
                        console.log(all_shift);
                        return all_shift;
                    }
                }
            }
            else {
                return [];
            }
        });
    }
    getGeneralShift(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundS = yield this.ScheduleModel.findAll({
                where: { status_per_staff: { [sequelize_1.Op.ne]: 'DECLINE' } },
                order: [
                    ['created_at', 'DESC']
                ]
            });
            let all_shift = [];
            if (foundS.length != 0) {
                for (let i = 0; i < foundS.length; i++) {
                    let obj = {};
                    const foundJ = yield this.JobModel.findOne({
                        where: { id: foundS[i].job_id }
                    });
                    const foundF = yield this.FacilityModel.findOne({
                        where: { id: foundJ.facility_id }
                    });
                    const foundC = yield this.CustomerModel.findOne({
                        where: { id: foundJ.customer_id }
                    });
                    const foundJL = yield this.JobLogsModel.findOne({
                        where: { [sequelize_1.Op.and]: [{ project_check_in_date: foundS[i].check_in_date },
                                { job_id: foundS[i].job_id },
                                { job_id: foundS[i].job_id },
                                { check_in_status: true }
                            ] }
                    });
                    //obj["first_name"]= await this.getDateOnly(foundS[i].check_in_date) 
                    //obj["last_name"]=await this.getDateOnly(foundS[i].check_out_date) 
                    let name = yield this.getSingleGuardDetail(foundS[i].guard_id);
                    let hours = yield this.calculateHoursSetToWork(foundS[i].check_in_date, foundS[i].check_out_date);
                    let guard_charge = Number(foundJ.staff_charge).toFixed(2);
                    let client_charge = Number(foundJ.client_charge).toFixed(2);
                    obj["start_date"] = yield this.getDateOnly(foundS[i].check_in_date);
                    obj["end_date"] = yield this.getDateOnly(foundS[i].check_out_date);
                    obj["start_time"] = foundS[i].start_time;
                    obj["end_time"] = foundS[i].end_time;
                    obj["hours"] = yield this.calculateHoursSetToWork(foundS[i].check_out_date, foundS[i].check_in_date);
                    obj["name"] = name["first_name"] + " " + name["last_name"];
                    obj["customer"] = foundC.first_name + " " + foundC.last_name;
                    obj["site"] = foundF.name;
                    obj["guard_charge"] = "$" + guard_charge;
                    obj["guard_id"] = foundS[i].guard_id;
                    obj["client_charge"] = "$" + client_charge;
                    obj["job_status"] = foundJ.job_status;
                    obj["description"] = foundJ.description;
                    obj["settlement_status"] = foundS[i].settlement_status;
                    if (foundJL) {
                        if (foundJL.check_out_status == true) {
                            obj["check_in"] = yield this.getDateAndTime(foundJL.check_in_date);
                            obj["check_out"] = yield this.getDateAndTime(foundJL.check_out_date);
                            obj["hours_worked"] = foundJL.hours_worked;
                            obj["earned"] = "$" + (foundJL.hours_worked * foundJ.staff_charge).toFixed(2);
                        }
                        else {
                            obj["check_in"] = yield this.getDateAndTime(foundJL.check_in_date);
                            obj["check_out"] = "none";
                            obj["hours_worked"] = 0;
                            obj["earned"] = "$0.00";
                        }
                    }
                    else {
                        obj["check_in"] = "none";
                        obj["check_out"] = "none";
                        obj["hours_worked"] = 0;
                        obj["earned"] = "$0.00";
                    }
                    all_shift.push(obj);
                    if (i == foundS.length - 1) {
                        return all_shift;
                    }
                }
            }
            else {
                return [];
            }
        });
    }
    submitReportAndAttachment(id, data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const data2 = yield job_util_1.default.verifySubmitReportAndAttachment.validateAsync(data);
            try {
                let foundJ = yield this.JobModel.findOne({
                    where: { id: data2.job_id }
                });
                let dateStamp = yield this.getDateAndTimeForStamp(foundJ.time_zone);
                if (data2.report_type == "MESSAGE") {
                    let createdRes = yield this.JobReportsModel.create({
                        job_id: data2.job_id,
                        guard_id: data2.guard_id,
                        report_type: data2.report_type,
                        message: data2.message,
                        is_emergency: data2.is_emergency,
                        is_read: data2.is_read,
                        who_has_it: data2.who_has_it,
                        created_at: dateStamp,
                        updated_at: dateStamp
                    });
                    return createdRes;
                }
                else {
                    let createdRes = yield this.JobReportsModel.create({
                        job_id: data2.job_id,
                        guard_id: data2.guard_id,
                        report_type: data2.report_type,
                        file_url: server_config_1.default.DOMAIN + file.path.slice(6, file.path.length),
                        is_emergency: data2.is_emergency,
                        is_read: data2.is_read,
                        message: data2.message,
                        who_has_it: data2.who_has_it,
                        mime_type: file.mimetype,
                        created_at: dateStamp,
                        updated_at: dateStamp
                    });
                    return createdRes;
                }
            }
            catch (error) {
                console.log(error);
                throw new errors_1.SystemError(error.toString());
            }
        });
    }
    getOneShedulePerGuard(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { job_id, guard_id } = yield job_util_1.default.verifygetOneShedulePerGuard.validateAsync(obj);
            const foundS = yield this.ScheduleModel.findAll({
                where: { [sequelize_1.Op.and]: [{ job_id },
                        { guard_id }
                    ] },
                order: [
                    ['check_in_date', 'ASC'],
                    ['check_out_date', 'ASC'],
                ],
            });
            let all_shedule = [];
            if (foundS.length != 0) {
                for (let i = 0; i < foundS.length; i++) {
                    let obj = {
                        check_in_date: yield this.getDateOnly(foundS[i].check_in_date),
                        start_time: foundS[i].start_time,
                        check_out_date: yield this.getDateOnly(foundS[i].check_out_date),
                        end_time: foundS[i].end_time,
                        hours: yield this.calculateHoursSetToWork(foundS[i].check_out_date, foundS[i].check_in_date),
                        shedule_id: foundS[i].id,
                        guard_id: foundS[i].guard_id,
                        job_id: foundS[i].job_id
                    };
                    all_shedule.push(obj);
                    if (i == foundS.length - 1) {
                        return all_shedule;
                    }
                }
            }
            else {
                console.log("jjjjjjjjjjjjjjjjj");
                return [];
            }
        });
    }
    getSingleReportGuard(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { job_id, guard_id } = yield job_util_1.default.verifyGetSingleReportGuard.validateAsync(obj);
            let myReport = [];
            let foundJR = yield this.JobReportsModel.findAll({
                where: { [sequelize_1.Op.and]: [
                        { job_id },
                        { guard_id }
                    ] },
                order: [["created_at", "DESC"]],
            });
            console.log(foundJR);
            if (foundJR.length != 0) {
                for (let i = 0; i < foundJR.length; i++) {
                    let obj = {};
                    obj["report_type"] = foundJR[i].report_type;
                    obj["message"] = foundJR[i].message;
                    obj["is_emergency"] = foundJR[i].is_emergency;
                    obj["file_url"] = foundJR[i].file_url;
                    obj["is_read"] = foundJR[i].is_read;
                    obj["who_has_it"] = foundJR[i].who_has_it;
                    obj["mime_type"] = foundJR[i].mime_type;
                    obj["created_at"] = yield this.getDateAndTime(foundJR[i].created_at);
                    obj["report_id"] = foundJR[i].id;
                    myReport.push(obj);
                    if (i == foundJR.length - 1) {
                        return myReport;
                    }
                }
            }
            else {
                return myReport;
            }
        });
    }
    getGuardPerJob(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { job_id, } = yield job_util_1.default.verifygetGuardPerJob.validateAsync(obj);
            const foundS = yield this.ScheduleModel.findAll({
                where: { job_id }
            });
            let all_guard_id = [];
            if (foundS.length != 0) {
                let obj = {};
                for (let i = 0; i < foundS.length; i++) {
                    if (all_guard_id.includes(foundS[i].guard_id)) {
                        //continue
                    }
                    else {
                        console.log(foundS[i].guard_id);
                        all_guard_id.push(foundS[i].guard_id);
                    }
                    if (i == foundS.length - 1) {
                        let foundG = yield this.getMultipleGuardDetail(all_guard_id, job_id);
                        let job = yield this.getJobDetail(job_id);
                        let site = yield this.getSiteDetail(job.facility_id);
                        let detail = {
                            guard: foundG,
                            job,
                            site
                        };
                        return detail;
                    }
                }
            }
            else {
                let job = yield this.getJobDetail(job_id);
                let site = yield this.getSiteDetail(job.facility_id);
                let detail = {
                    guard: [],
                    job,
                    site
                };
                return detail;
            }
        });
    }
    getDeclinedJob(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundS = yield this.ScheduleModel.findAll({
                where: {
                    status_per_staff: 'DECLINE'
                },
                group: ['job_id', 'guard_id']
            });
            let decline = [];
            if (foundS.length != 0) {
                for (let i = 0; i < foundS.length; i++) {
                    let obj = {};
                    let guardName = yield this.getSingleGuardDetail(foundS[i].guard_id);
                    let foundJ = yield this.JobModel.findOne({
                        where: {
                            id: foundS[i].job_id
                        }
                    });
                    let customerF = yield this.getCustomerDetail(foundJ.customer_id);
                    let facilityF = yield this.getSiteDetail(foundJ.facility_id);
                    obj["date"] = yield this.getDateOnly(foundJ.created_at);
                    obj["Name"] = guardName["first_name"] + " " + guardName["last_name"];
                    obj["Phone_number"] = guardName["phone_number"];
                    obj["customer_name"] = customerF["first_name"] + " " + customerF["last_name"];
                    obj["facility_name"] = facilityF["name"];
                    obj["job_id"] = foundS[i].job_id;
                    obj["guard_id"] = foundS[i].guard_id;
                    decline.push(obj);
                    if (i == foundS.length - 1) {
                        return decline;
                    }
                }
            }
            return decline;
        });
    }
    getDashBoardInfoGuard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("lllllllllllllllllllllllll");
            console.log(req.user.id);
            let foundS = yield this.ScheduleModel.findAll({
                where: { guard_id: req.user.id },
                group: ['job_id', 'guard_id']
            });
            let active = 0;
            let completed = 0;
            let pending = 0;
            let obj = {};
            if (foundS.length != 0) {
                for (let i = 0; i < foundS.length; i++) {
                    let foundJ = yield this.JobModel.findOne({
                        where: { id: foundS[i].job_id }
                    });
                    if (foundJ.job_status == 'ACTIVE' && foundS[i].status_per_staff == 'ACTIVE') {
                        active++;
                    }
                    else if (foundJ.job_status == 'COMPLETED' && foundS[i].status_per_staff == 'ACTIVE') {
                        completed++;
                    }
                    else if (foundJ.job_status == 'ACTIVE' && foundS[i].status_per_staff == 'PENDING') {
                        pending++;
                    }
                    if (i == foundS.length - 1) {
                        obj["active"] = active;
                        obj["completed"] = completed;
                        obj["pending"] = pending;
                        return obj;
                    }
                }
            }
            else {
                obj["active"] = active;
                obj["completed"] = completed;
                obj["pending"] = pending;
                return obj;
            }
        });
    }
    getDashBoardInfo(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundC = yield this.CustomerModel.findAll();
            let foundG = yield this.UserModel.findAll({
                where: {
                    role: 'GUARD'
                }
            });
            let foundA = yield this.UserModel.findAll({
                where: {
                    role: 'ADMIN'
                }
            });
            let foundJ = yield this.JobModel.findAll({
                where: {
                    job_status: 'ACTIVE'
                }
            });
            obj = {
                noCustomer: foundC.length,
                noStaff: foundA.length,
                noGuard: foundG.length,
                noActive: foundJ.length
            };
            return obj;
        });
    }
    getAllSite(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundF = yield this.FacilityModel.findAll();
            let availabLeGuard = [];
            if (foundF.length != 0) {
                for (let i = 0; i < foundF.length; i++) {
                    let obj = {};
                    obj["name"] = foundF[i].name;
                    obj["guard"] = foundF[i].id;
                    availabLeGuard.push(obj);
                    if (i == foundF.length - 1) {
                        return availabLeGuard;
                    }
                }
            }
            else {
                return [];
            }
        });
    }
    getAllGuard(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundG = yield this.UserModel.findAll({
                where: {
                    role: 'GUARD'
                }
            });
            let availabLeGuard = [];
            if (foundG.length != 0) {
                for (let i = 0; i < foundG.length; i++) {
                    let obj = {};
                    obj["name"] = foundG[i].first_name + " " + foundG[i].last_name;
                    obj["guard"] = foundG[i].id;
                    availabLeGuard.push(obj);
                    if (i == foundG.length - 1) {
                        return availabLeGuard;
                    }
                }
            }
            else {
                return [];
            }
        });
    }
    getGuard(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
                let foundS= await  this.ScheduleModel.findAll({
                  where:{
                    job_id:obj.job_id
                  }
                })
            */
            let arrayId = [];
            let detail = [];
            /*
                if(foundS.length!=0){
                  for(let i=0;i<foundS.length;i++){
            
                    if(arrayId.includes(foundS[i].guard_id)){
            
                    }
                    else{
                      arrayId.push(foundS[i].guard_id)
                    }
                    if(i==foundS.length-1){
                        //console.log(arrayId)
                        let foundG=await  this.UserModel.findAll({
                          where:
                          {[Op.and]:
                            [
                              {availability:true},
                              {suspended:false},
                            {role:'GUARD'}
                            ]}
                        })
            
            
                        if(foundG.length!=0){
            
                          for(let j=0;j<foundG.length;j++){
                                        
                              if(arrayId.includes(foundG[j].id)){
            
                              }
                              else{
                                arrayId.push(foundG[j].id)
                              }
                            
                            if(j==foundG.length-1){
                              if(arrayId.length!=0){
                                for(let i=0;i<arrayId.length;i++){
                                  let obj={}
                                
                                  let name =await this.getSingleGuardDetail(arrayId[i])
                        
                                  obj["guard_id"]=arrayId[i]
                                  obj["full_name"]=name["first_name"]+" "+name["last_name"]
                                  detail.push(obj)
                        
                                  if(i==arrayId.length-1){
                                      return detail
                                  }
                                }
                               }
                               else{
                                return detail
                              }
                            }
                          }
                        }
                        else{
                          if(arrayId.length!=0){
                            for(let i=0;i<arrayId.length;i++){
                              let obj={}
                            
                              let name =await this.getSingleGuardDetail(arrayId[i])
                    
                              obj["guard_id"]=arrayId[i]
                              obj["full_name"]=name["first_name"]+" "+name["last_name"]
                              detail.push(obj)
                    
                              if(i==arrayId.length-1){
                                  return detail
                              }
                            }
                           }
                           else{
                            return detail
                          }
                        }
                    }
                  }
                }
            
                else{
            */
            let foundG = yield this.UserModel.findAll({
                where: { [sequelize_1.Op.and]: [
                        { availability: true },
                        { suspended: false },
                        { role: 'GUARD' }
                    ] }
            });
            if (foundG.length != 0) {
                for (let j = 0; j < foundG.length; j++) {
                    if (arrayId.includes(foundG[j].id) || (yield this.checkIfGuardIsInAnyActiveJob(foundG[j].id, obj.job_id))) {
                    }
                    else {
                        arrayId.push(foundG[j].id);
                    }
                    if (j == foundG.length - 1) {
                        if (arrayId.length != 0) {
                            for (let i = 0; i < arrayId.length; i++) {
                                let obj = {};
                                let name = yield this.getSingleGuardDetail(arrayId[i]);
                                obj["guard_id"] = arrayId[i];
                                obj["full_name"] = name["first_name"] + " " + name["last_name"];
                                detail.push(obj);
                                if (i == arrayId.length - 1) {
                                    return detail;
                                }
                            }
                        }
                        else {
                            return detail;
                        }
                    }
                }
            }
            else {
                if (arrayId.length != 0) {
                    for (let i = 0; i < arrayId.length; i++) {
                        let obj = {};
                        let name = yield this.getSingleGuardDetail(arrayId[i]);
                        obj["guard_id"] = arrayId[i];
                        obj["full_name"] = name["first_name"] + " " + name["last_name"];
                        detail.push(obj);
                        if (i == arrayId.length - 1) {
                            return detail;
                        }
                    }
                }
                else {
                    return detail;
                }
            }
            //  }
            /*
              let foundG=await  this.UserModel.findAll({
                where:
                {[Op.and]:
                  [
                    {availability:true},
                    {suspended:false},
                  {role:'GUARD'}
                  ]}
              })
          
             
              let availabLeGuard=[]
              if(foundG.length!=0){
          
          
                let foundJ= await this.JobModel.findAll({where:{job_status:"ACTIVE"}})
          
          
                    for(let i=0; i<foundG.length; i++){
          
                      let obj={}
                      for(let j=0; j<foundJ.length; j++){
          
                            
                        let foundS= await this.ScheduleModel.findOne({
                          
                          where: {[Op.and]:
                            [
                              {guard_id:foundG[i].id},
                            {job_id:foundJ[j].id }
                            ]}
                        })
          
          
                        if(foundS){
                          break;
                        }
          
                        if(j==foundJ.length-1){
          
                          let name =await this.getSingleGuardDetail(foundG[i].id)
          
                          obj["guard_id"]=foundG[i].id
                          obj["full_name"]=name["first_name"]+" "+name["last_name"]
                          availabLeGuard.push(obj)
          
                        }
          
                      }
          
                      if(i==foundG.length-1){
                        return  availabLeGuard
          
          
                      }
                    }
              }
              else{
                return "NO GUARD AVAILABLE"
              }
          
          
              */
        });
    }
    getGeneralUnsettleShift(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundS = yield this.ScheduleModel.findAll({
                limit: obj.limit,
                offset: obj.offset,
                where: { settlement_status: obj.settlement }
            });
            let unSettledSucessfullShift = [];
            if (foundS.length != 0) {
                for (let i = 0; i < foundS.length; i++) {
                    let obj = {};
                    //JUST FOR GETTING THE CHARGE PER JOB
                    let foundJ = yield this.JobModel.findOne({ where: { id: foundS[i].job_id } });
                    let foundJL = yield this.JobLogsModel.findOne({
                        where: { [sequelize_1.Op.and]: [{ check_in_status: true },
                                { project_check_in_date: foundS[i].check_in_date },
                                { check_out_status: true }
                            ] }
                    });
                    if (foundJL) {
                        let my_guard_info = yield this.getSingleGuardDetail(foundS[i].guard_id);
                        let myAmount = foundJL.hours_worked * foundJ.staff_charge;
                        obj["hours_worked"] = foundJL.hours_worked;
                        obj["amount"] = myAmount;
                        obj["first_name"] = my_guard_info["first_name"];
                        obj["last_name"] = my_guard_info["last_name"];
                        obj["id"] = foundS[i].guard_id;
                        obj["foundJL_id"] = foundJL.id;
                        obj["shedule_id"] = foundS[i].id;
                        unSettledSucessfullShift.push(obj);
                    }
                    else {
                        //continue;
                    }
                    if (i == foundS.length - 1) {
                        if (unSettledSucessfullShift.length == 0) {
                            return unSettledSucessfullShift;
                        }
                        else {
                            return yield this.combineUnsettleShift(unSettledSucessfullShift);
                        }
                    }
                }
            }
            else {
                return unSettledSucessfullShift;
            }
        });
    }
    settleShift(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { schedule_id } = yield job_util_1.default.verifySettleShift.validateAsync(obj);
            for (let i = 0; i < schedule_id.length; i++) {
                let foundS = yield this.ScheduleModel.findOne({
                    where: { id: schedule_id[i] }
                });
                yield this.ScheduleModel.update({ settlement_status: !foundS.settlement_status }, {
                    where: { id: schedule_id[i] }
                });
            }
        });
    }
    updateJobStatus(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { job_id, status_value } = yield job_util_1.default.verifyUpdateJobStatus.validateAsync(obj);
            yield this.JobModel.update({ job_status: status_value }, {
                where: { id: job_id }
            });
        });
    }
    RemoveGuardSheduleLog(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { log_id } = yield job_util_1.default.verifyRemoveGuardSheduleLog.validateAsync(obj);
            const item1 = yield this.JobLogsModel.destroy({
                where: { id: log_id }
            });
        });
    }
    RemoveGuardSingleShedule(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { schedule_id, guard_id, } = yield job_util_1.default.verifyRemoveGuardSingleShedule.validateAsync(obj);
            yield this.ScheduleModel.destroy({
                where: { [sequelize_1.Op.and]: [{ guard_id },
                        { id: schedule_id }
                    ] }
            });
        });
    }
    RemoveGuardShedule(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { job_id, guard_id, } = yield job_util_1.default.verifyRemoveGuardShedule.validateAsync(obj);
            const item1 = yield this.ScheduleModel.destroy({
                where: { [sequelize_1.Op.and]: [{ job_id },
                        { guard_id }
                    ] }
            });
            const item2 = yield this.AgendasModel.destroy({
                where: { [sequelize_1.Op.and]: [{ job_id },
                        { guard_id }
                    ] }
            });
        });
    }
    checkInCheckOutAdmin(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { shedule_id, check_in, latitude, longitude, job_id, date, guard_id } = yield job_util_1.default.verifyCheckInCheckOutAdmin.validateAsync(obj);
            // console.log(latitude, longitude )
            let time = (0, moment_1.default)(date).format('hh:mm:ss a');
            const foundItemS = yield this.ScheduleModel.findOne({ where: { id: shedule_id } });
            if (foundItemS) {
                const foundItemJL = yield this.JobLogsModel.findOne({
                    where: { [sequelize_1.Op.and]: [{ project_check_in_date: { [sequelize_1.Op.eq]: foundItemS.check_in_date } },
                            { job_id },
                            { guard_id },
                            { check_in_status: true }
                        ] }
                });
                if (foundItemJL) {
                    if (check_in) {
                        const foundItemS2 = yield this.ScheduleModel.findOne({
                            where: { [sequelize_1.Op.and]: [{ check_in_date: { [sequelize_1.Op.lte]: date } },
                                    { check_out_date: { [sequelize_1.Op.gt]: date } },
                                    { job_id },
                                    { guard_id }
                                ] }
                        });
                        if (foundItemS2) {
                            if (yield this.isBefore(date, foundItemJL.check_out_date)) {
                                let obj = {
                                    check_in_time: time,
                                    check_in_date: date,
                                    check_in_status: true
                                };
                                this.JobLogsModel.update(obj, {
                                    where: { id: foundItemJL.id }
                                });
                            }
                            else {
                                throw new errors_1.ConflictError("cant use date ");
                            }
                        }
                        else {
                            throw new errors_1.ConflictError("cant use date ");
                        }
                    }
                    else {
                        const foundItemS2 = yield this.ScheduleModel.findOne({
                            where: { [sequelize_1.Op.and]: [{ check_in_date: { [sequelize_1.Op.lte]: date } },
                                    { check_out_date: { [sequelize_1.Op.gte]: date } },
                                    { job_id },
                                    { guard_id }
                                ] }
                        });
                        if (foundItemS2) {
                            if (yield this.isAfter(date, foundItemJL.check_in_date)) {
                                let obj = {
                                    check_out_time: time,
                                    check_out_date: date,
                                    check_out_status: true
                                };
                                this.JobLogsModel.update(obj, {
                                    where: { id: foundItemJL.id }
                                });
                            }
                            else {
                                throw new errors_1.ConflictError("cant use date ");
                            }
                        }
                        else {
                            throw new errors_1.ConflictError("cant use date ");
                        }
                    }
                }
                else {
                    if (check_in) {
                        const foundItemS2 = yield this.ScheduleModel.findOne({
                            where: { [sequelize_1.Op.and]: [{ check_in_date: { [sequelize_1.Op.lte]: date } },
                                    { check_out_date: { [sequelize_1.Op.gt]: date } },
                                    { job_id },
                                    { guard_id }
                                ] }
                        });
                        if (foundItemS2) {
                            let coordinates_res = yield this.CoordinatesModel.create({
                                longitude,
                                latitude
                            });
                            let obj = {
                                message: "in location",
                                check_in_time: time,
                                check_in_status: true,
                                job_id,
                                guard_id,
                                coordinates_id: coordinates_res.id,
                                check_in_date: date,
                                project_check_in_date: foundItemS.check_in_date
                            };
                            this.JobLogsModel.create(obj).then((myRes) => {
                                console.log(myRes);
                            });
                        }
                        else {
                            throw new errors_1.ConflictError("cant use date ");
                        }
                    }
                    else {
                        throw new errors_1.ConflictError("you have not check in ");
                    }
                }
            }
            else {
            }
        });
    }
    checkIn(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var { job_id, guard_id, check_in, latitude, longitude, } = yield job_util_1.default.verifyCheckinData.validateAsync(obj);
            // console.log(latitude, longitude )
            const foundItemJob = yield this.JobModel.findOne({ where: { id: job_id } });
            const foundItemFac = yield this.FacilityModel.findOne({ where: { id: foundItemJob.facility_id } });
            const foundItemFacLo = yield this.FacilityLocationModel.findOne({ where: { id: foundItemFac.facility_location_id } });
            const foundItemCoor = yield this.CoordinatesModel.findOne({ where: { id: foundItemFacLo.coordinates_id } });
            let my_time_zone = foundItemFac.time_zone || "Africa/Lagos" || "America/Tijuana";
            let dateStamp = yield this.getDateAndTimeForStamp(my_time_zone);
            let con_fig_time_zone = moment_timezone_1.default.tz(my_time_zone);
            let date = new Date(con_fig_time_zone.format('YYYY-MM-DD hh:mm:ss a'));
            let time = String(con_fig_time_zone.format('hh:mm:ss a'));
            let full_date = con_fig_time_zone.format('YYYY-MM-DD hh:mm:ss a');
            let objLatLog = {
                latitude: foundItemCoor.latitude,
                longitude: foundItemCoor.longitude,
                radius: foundItemFacLo.operations_area_constraint
            };
            if (check_in) {
                const foundItemS = yield this.ScheduleModel.findOne({
                    where: { [sequelize_1.Op.and]: [{ check_in_date: { [sequelize_1.Op.lte]: date } },
                            { check_out_date: { [sequelize_1.Op.gte]: date } },
                            { job_id },
                            { guard_id }
                        ] }
                });
                if (foundItemS) {
                    //CHECK IF IT IS TIME TO START 
                    let storedDate = foundItemS.check_in_date;
                    let retrivedate = full_date;
                    if ((0, moment_1.default)(new Date(retrivedate), 'YYYY-MM-DD  hh:mm:ss a').isSameOrAfter(new Date(storedDate))) {
                        if (this.isInlocation(latitude, longitude, objLatLog)) {
                            let foundItemJL = yield this.JobLogsModel.findOne({
                                where: { [sequelize_1.Op.and]: [{ job_id },
                                        { guard_id }, { check_in_status: true }, { project_check_in_date: foundItemS.check_in_date }] }
                            });
                            if (!foundItemJL) {
                                if (this.checkIfGuardIsLate(storedDate, retrivedate, foundItemS.max_check_in_time)) {
                                    let coordinates_res = yield this.CoordinatesModel.create({
                                        longitude,
                                        latitude,
                                        created_at: dateStamp,
                                        updated_at: dateStamp
                                    });
                                    let obj = {
                                        message: "in location",
                                        check_in_time: time,
                                        check_in_status: true,
                                        job_id,
                                        guard_id,
                                        coordinates_id: coordinates_res.id,
                                        check_in_date: date,
                                        schedule_id: foundItemS.id,
                                        project_check_in_date: foundItemS.check_in_date,
                                        created_at: dateStamp,
                                        updated_at: dateStamp
                                    };
                                    this.JobLogsModel.create(obj).then((myRes) => {
                                        console.log(myRes);
                                    });
                                }
                                else {
                                    throw new errors_1.LocationError("you are late cant check in");
                                }
                            }
                            else {
                                throw new errors_1.LocationError("you have check in already");
                            }
                        }
                        else {
                            let coordinates_res = yield this.CoordinatesModel.create({
                                longitude,
                                latitude,
                                created_at: dateStamp,
                                updated_at: dateStamp
                            });
                            if (check_in) {
                                let obj = {
                                    message: "not in location",
                                    check_in_time: time,
                                    check_in_status: false,
                                    job_id,
                                    guard_id,
                                    coordinates_id: coordinates_res.id,
                                    check_in_date: date,
                                    project_check_in_date: date,
                                    created_at: dateStamp,
                                    updated_at: dateStamp
                                };
                                yield this.JobLogsModel.create(obj);
                                throw new errors_1.LocationError("You are not in location");
                            }
                            else {
                                let obj = {
                                    message: "not in location",
                                    check_out_time: time,
                                    check_out_status: false,
                                    job_id,
                                    guard_id,
                                    coordinates_id: coordinates_res.id,
                                    check_out_date: date,
                                    project_check_in_date: date,
                                    created_at: dateStamp,
                                    updated_at: dateStamp
                                };
                                yield this.JobLogsModel.create(obj);
                                throw new errors_1.LocationError("You are not in location");
                            }
                        }
                    }
                    else {
                        throw new errors_1.LocationError("not yet time to check");
                    }
                }
                else {
                    throw new errors_1.LocationError("no shift available for check in");
                }
            }
            else {
                if (this.isInlocation(latitude, longitude, objLatLog)) {
                    //FOR ALLOWING LATE CHECK OUT 30
                    let con_fig_time_zone2 = moment_timezone_1.default.tz(my_time_zone).subtract(1, 'minutes');
                    let date2 = new Date(con_fig_time_zone2.format('YYYY-MM-DD hh:mm:ss a'));
                    const foundItemS = yield this.ScheduleModel.findOne({
                        where: { [sequelize_1.Op.and]: [{ check_in_date: { [sequelize_1.Op.lte]: date } },
                                { check_out_date: { [sequelize_1.Op.or]: [{ [sequelize_1.Op.gte]: date2 }, { [sequelize_1.Op.gte]: date }] } },
                                { job_id },
                                { guard_id }
                            ] }
                    });
                    if (foundItemS) {
                        const foundItemJL = yield this.JobLogsModel.findOne({
                            where: { [sequelize_1.Op.and]: [{ job_id },
                                    { guard_id }, { check_in_status: true }, { project_check_in_date: foundItemS.check_in_date }] }
                        });
                        if (!foundItemJL) {
                            throw new errors_1.LocationError("you have not check in yet");
                        }
                        else {
                            if (!foundItemJL.check_out_status) {
                                let my_log_date_check_in = foundItemJL.check_in_date;
                                let my_date_now_check_out = full_date;
                                let my_shedule_date_check_in = foundItemS.check_in_date;
                                let my_shedule_date_check_out = foundItemS.check_out_date;
                                console.log(full_date);
                                /*
                        retrivedate='2022-01-07 08:00:00 am'
                          storedDate='2022-01-10 11:40:00 pm'*/
                                let my_job_H_worked = yield this.calculateHoursSetToWork(my_date_now_check_out, my_log_date_check_in);
                                if (this.timePositionForCheckOut(my_date_now_check_out, my_shedule_date_check_out)) {
                                    my_job_H_worked = yield this.calculateHoursSetToWork(my_date_now_check_out, my_log_date_check_in);
                                    let obj = {
                                        check_out_time: time,
                                        hours_worked: my_job_H_worked,
                                        check_out_status: true,
                                        check_out_date: new Date(full_date),
                                        updated_at: dateStamp
                                    };
                                    let whereOptions = { [sequelize_1.Op.and]: [{ job_id }, { guard_id }, { check_in_status: true }, { project_check_in_date: foundItemS.check_in_date }] };
                                    this.JobLogsModel.update(obj, {
                                        where: whereOptions
                                    });
                                }
                                else {
                                    my_job_H_worked = yield this.calculateHoursSetToWork(my_shedule_date_check_out, my_log_date_check_in);
                                    let obj = {
                                        check_out_time: foundItemS.end_time,
                                        hours_worked: my_job_H_worked,
                                        check_out_status: true,
                                        check_out_date: foundItemS.check_out_date,
                                        updated_at: dateStamp
                                    };
                                    let whereOptions = { [sequelize_1.Op.and]: [{ job_id }, { guard_id }, { check_in_status: true }, { project_check_in_date: foundItemS.check_in_date }] };
                                    this.JobLogsModel.update(obj, {
                                        where: whereOptions
                                    });
                                }
                            }
                            else {
                                throw new errors_1.LocationError("you have check out already");
                            }
                        }
                    }
                    else {
                        throw new errors_1.LocationError("cant check out no shift available");
                    }
                }
                else {
                    let coordinates_res = yield this.CoordinatesModel.create({
                        longitude,
                        latitude,
                        created_at: dateStamp,
                        updated_at: dateStamp
                    });
                    if (check_in) {
                        let obj = {
                            message: "not in location",
                            check_in_time: time,
                            check_in_status: false,
                            job_id,
                            guard_id,
                            coordinates_id: coordinates_res.id,
                            check_in_date: date,
                            project_check_in_date: date,
                            created_at: dateStamp,
                            updated_at: dateStamp
                        };
                        yield this.JobLogsModel.create(obj);
                        throw new errors_1.LocationError("You are not in location");
                    }
                    else {
                        let obj = {
                            message: "not in location",
                            check_out_time: time,
                            check_out_status: false,
                            job_id,
                            guard_id,
                            coordinates_id: coordinates_res.id,
                            check_out_date: date,
                            project_check_in_date: date,
                            created_at: dateStamp,
                            updated_at: dateStamp
                        };
                        yield this.JobLogsModel.create(obj);
                        throw new errors_1.LocationError("You are not in location");
                    }
                }
            }
        });
    }
    checkIfGuardIsLate(val1, val2, added_time) {
        console.log(added_time);
        let stored_time = (0, moment_1.default)(new Date(val1), 'YYYY-MM-DD hh:mm:ss a');
        let my_check_in_time = (0, moment_1.default)(new Date(val2), 'YYYY-MM-DD hh:mm:ss a').subtract(added_time, 'minutes');
        console.log("============here her here here =========");
        let stored_time2 = (0, moment_1.default)(new Date(val1)).format('YYYY-MM-DD hh:mm:ss a');
        let my_check_in_time2 = (0, moment_1.default)(new Date(val2)).subtract(added_time, 'minutes').format('YYYY-MM-DD hh:mm:ss a');
        console.log(stored_time2);
        console.log(my_check_in_time2);
        return my_check_in_time.isSameOrBefore(stored_time);
    }
    timePositionForCheckOut(val1, val2) {
        let startTime1 = (0, moment_1.default)(new Date(val1), 'YYYY-MM-DD HH:mm:ss a');
        let startTime2 = (0, moment_1.default)(new Date(val2), 'YYYY-MM-DD HH:mm:ss a');
        return startTime1.isSameOrBefore(startTime2);
    }
    isAfter(val1, val2) {
        return __awaiter(this, void 0, void 0, function* () {
            let startTime1 = (0, moment_1.default)(new Date(val1), 'YYYY-MM-DD HH:mm:ss a');
            let startTime2 = (0, moment_1.default)(new Date(val2), 'YYYY-MM-DD HH:mm:ss a');
            return startTime1.isAfter(startTime2);
        });
    }
    isBefore(val1, val2) {
        return __awaiter(this, void 0, void 0, function* () {
            let startTime1 = (0, moment_1.default)(new Date(val1), 'YYYY-MM-DD HH:mm:ss a');
            let startTime2 = (0, moment_1.default)(new Date(val2), 'YYYY-MM-DD HH:mm:ss a');
            return startTime1.isBefore(startTime2);
        });
    }
    /*
      timePositionForCheckIn(val ,val2){
        
        let startTime1 = moment(val, 'HH:mm:ss a');
        let startTime2 = moment(val2, 'HH:mm:ss a');
    
        return startTime1.isSameOrBefore(startTime2)
    
    }
    
    */
    isInlocation(latitude, longitude, objLatLog) {
        function getDistanceBetween(lat1, long1, lat2, long2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1); // deg2rad below
            var dLon = deg2rad(long2 - long1);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            d = d * 1000; //Distance in meters
            return d;
        }
        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }
        //console.log(getDistanceBetween(latitude,longitude,objLatLog.latitude,objLatLog.longitude))
        if (getDistanceBetween(latitude, longitude, objLatLog.latitude, objLatLog.longitude) > objLatLog.radius) {
            return true;
        }
        else {
            return true;
        }
        /*
    if (fence.inside(lat, lon)) {
      // do some logic
      console.log("i am in location")
      return true
    }
    else{
      console.log("am out of location")
      return true
    }
*/
        /*
        class CircularGeofenceRegion {
          
          latitude:number;
          longitude:number;
          radius:number;
    
          constructor(opts) {
            Object.assign(this, opts)
            
          }
        
          inside(lat2, lon2) {
            const lat1 = this.latitude
            const lon1 = this.longitude
                const R = 63710; // Earth's radius in m
        
            return Math.acos(Math.sin(lat1)*Math.sin(lat2) +
                             Math.cos(lat1)*Math.cos(lat2) *
                             Math.cos(lon2-lon1)) * R < this.radius;
          }
        }
    
        const fenceA = new CircularGeofenceRegion(objLatLog);
        const fenceB = new CircularGeofenceRegion(objLatLog);
    
        const fences = [fenceA, fenceB]
        const options = {}
    
        
        for (const fence of fences) {
          const lat = latitude
          const lon =longitude
          console.log(lat)
          console.log(lon)
      
      
          if (fence.inside(lat, lon)) {
            // do some logic
            console.log("i am in location")
            return true
          }
          else{
            console.log("am out of location")
            return true
          }
        }
    */
    }
    getSingleGuardDetail(val) {
        return __awaiter(this, void 0, void 0, function* () {
            let obj = {};
            const foundU = yield this.UserModel.findOne({
                where: { id: val }
            });
            if (foundU) {
                obj["first_name"] = foundU.first_name,
                    obj["last_name"] = foundU.last_name;
                obj["phone_number"] = foundU.phone_number;
            }
            else {
                obj["first_name"] = "deleted",
                    obj["last_name"] = "deleted";
            }
            return obj;
        });
    }
    getMultipleGuardDetail(val, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let guard_detail = [];
            for (let i = 0; i < val.length; i++) {
                const foundU = yield this.UserModel.findOne({
                    where: { id: val[i] }
                });
                const foundJL = yield this.JobLogsModel.findAll({
                    where: { [sequelize_1.Op.and]: [{ check_in_status: true },
                            { check_out_status: true },
                            { job_id },
                            { guard_id: val[i] }
                        ] }
                });
                console.log(foundJL);
                let hours_worked = 0;
                if (foundJL.length == 0) {
                    let foundJR = yield this.JobReportsModel.findAll({
                        where: { [sequelize_1.Op.and]: [
                                { job_id },
                                { guard_id: val[i] }
                            ] },
                    });
                    let guard = {
                        first_name: foundU.first_name,
                        last_name: foundU.last_name,
                        image: foundU.image,
                        email: foundU.email,
                        phone_number: foundU.phone_number,
                        hours_worked,
                        guard_id: foundU.id,
                        no_of_report: foundJR.length
                    };
                    guard_detail.push(guard);
                }
                else {
                    for (let j = 0; j < foundJL.length; j++) {
                        hours_worked += foundJL[j].hours_worked;
                        if (j == foundJL.length - 1) {
                            let foundJR = yield this.JobReportsModel.findAll({
                                where: { [sequelize_1.Op.and]: [
                                        { job_id },
                                        { guard_id: val[i] }
                                    ] },
                            });
                            let guard = {
                                first_name: foundU.first_name,
                                last_name: foundU.last_name,
                                image: foundU.image,
                                email: foundU.email,
                                hours_worked,
                                guard_id: foundU.id,
                                no_of_report: foundJR.length
                            };
                            guard_detail.push(guard);
                        }
                    }
                }
                if (i == val.length - 1) {
                    return guard_detail;
                }
            }
        });
    }
    getDateOnly(val) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, moment_1.default)(val).format('YYYY-MM-DD');
        });
    }
    getDateAndTime(val) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, moment_1.default)(val).format('YYYY-MM-DD hh:mm:ss a');
        });
    }
    getTimeOnly(val) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, moment_1.default)(val).format('hh:mm:ss a');
        });
    }
    getJobDetail(val) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundj = yield this.JobModel.findOne({
                where: { id: val }
            });
            let job = {
                description: foundj.description,
                customer_id: foundj.customer_id,
                facility_id: foundj.facility_id,
                guard_charge: foundj.staff_charge
            };
            return job;
        });
    }
    getSiteDetail(val) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundF = yield this.FacilityModel.findOne({
                where: { id: val }
            });
            let site = {
                name: foundF.name,
                time_zone: foundF.time_zone
            };
            return site;
        });
    }
    getCustomerDetail(val) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundC = yield this.CustomerModel.findOne({
                where: { id: val }
            });
            let Customer = {
                first_name: foundC.first_name,
                last_name: foundC.last_name
            };
            return Customer;
        });
    }
    getDateAndTimeForStamp(my_time_zone) {
        return __awaiter(this, void 0, void 0, function* () {
            let con_fig_time_zone = moment_timezone_1.default.tz(my_time_zone);
            let date = new Date(con_fig_time_zone.format('YYYY-MM-DD hh:mm:ss a'));
            return date;
        });
    }
    combineUnsettleShift(val) {
        return __awaiter(this, void 0, void 0, function* () {
            let hash = {};
            let sum_of_guard_shift = [];
            for (let i = 0; i < val.length; i++) {
                let amount = 0;
                let hours = 0;
                let obj = {};
                let id2 = [];
                let id3 = [];
                for (let j = 0; j < val.length; j++) {
                    if (hash[val[i].id]) {
                        break;
                    }
                    else {
                        if (val[i].id == val[j].id) {
                            amount += val[j].amount;
                            hours += val[j].hours_worked;
                            id2.push(val[j].foundJL_id);
                            id3.push(val[j].shedule_id);
                        }
                    }
                    if (j == val.length - 1) {
                        console.log(amount);
                        obj["id"] = val[i].id;
                        obj["amount"] = amount;
                        obj["hours_worked"] = hours;
                        obj["first_name"] = val[i].first_name;
                        obj["last_name"] = val[i].last_name;
                        obj["foundJL_id"] = id2;
                        obj["shedule_id"] = id3;
                        sum_of_guard_shift.push(obj);
                        hash[val[i].id] = true;
                    }
                }
                if (i == val.length - 1) {
                    return sum_of_guard_shift;
                }
            }
        });
    }
    checkIfDateAreApart(postedDate) {
        return __awaiter(this, void 0, void 0, function* () {
            let myShedule = yield this.ScheduleModel.findAll({
                where: { job_id: postedDate[0].job_id }
            });
            let combinedArray = [...postedDate, ...myShedule];
            console.log(combinedArray);
            for (let i = 0; i < combinedArray.length; i++) {
                for (let j = 0; j < combinedArray.length; j++) {
                    if (i == j || combinedArray[i].guard_id != combinedArray[j].guard_id) {
                        continue;
                    }
                    if ((0, moment_1.default)(combinedArray[i].check_in_date).isBefore(combinedArray[j].check_out_date)) {
                        if ((0, moment_1.default)(combinedArray[i].check_out_date).add(60, 'minutes').isBefore(combinedArray[j].check_in_date)) {
                        }
                        else {
                            let name = yield this.getSingleGuardDetail(combinedArray[i].guard_id);
                            let data = {
                                message: `This schedule (start date:${(0, moment_1.default)(combinedArray[i].check_in_date).format("YYYY-MM-DD  hh:mm:ss a")},end date:${(0, moment_1.default)(combinedArray[i].check_out_date).format("YYYY-MM-DD  hh:mm:ss a")} )  is clashing with (start date:${(0, moment_1.default)(combinedArray[j].check_in_date).format("YYYY-MM-DD  hh:mm:ss a")},end date:${(0, moment_1.default)(combinedArray[j].check_out_date).format("YYYY-MM-DD  hh:mm:ss a")} ) or they are not far apart `,
                                solution: `SOLUTION :remove this guard (${name["first_name"]} ${name["last_name"]}) from the schedule or adjust the date`
                            };
                            throw new errors_1.TimeError(JSON.stringify(data));
                        }
                    }
                    else if ((0, moment_1.default)(combinedArray[i].check_in_date).subtract(60, 'minutes').isAfter(combinedArray[j].check_out_date)) {
                    }
                    else {
                        let name = yield this.getSingleGuardDetail(combinedArray[i].guard_id);
                        let data = {
                            message: `This schedule (start date:${(0, moment_1.default)(combinedArray[i].check_in_date).format("YYYY-MM-DD  hh:mm:ss a")},end date:${(0, moment_1.default)(combinedArray[i].check_out_date).format("YYYY-MM-DD  hh:mm:ss a")} )  is clashing with (start date:${(0, moment_1.default)(combinedArray[j].check_in_date).format("YYYY-MM-DD  hh:mm:ss a")},end date:${(0, moment_1.default)(combinedArray[j].check_out_date).format("YYYY-MM-DD  hh:mm:ss a")} ) or they are not far apart `,
                            solution: `SOLUTION :remove this guard (${name["first_name"]} ${name["last_name"]}) from the schedule or adjust the date`
                        };
                        throw new errors_1.TimeError(JSON.stringify(data));
                    }
                }
                if (i == combinedArray.length - 1) {
                    return true;
                }
            }
        });
    }
    checkIfGuardIsInAnyActiveJob(guard_id, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundJ = yield this.JobModel.findAll({
                where: { [sequelize_1.Op.and]: [
                        { job_status: 'ACTIVE' },
                        { id: { [sequelize_1.Op.ne]: job_id } }
                    ] }
            });
            /**{
                where:{ job_status:'ACTIVE'}
              } */
            if (foundJ.length != 0) {
                for (let i = 0; i < foundJ.length; i++) {
                    let foundS = yield this.ScheduleModel.findAll({
                        where: { [sequelize_1.Op.and]: [{ job_id: foundJ[i].id },
                                { guard_id }] }
                    });
                    if (foundS.length != 0) {
                        return true;
                    }
                    if (i == foundJ.length - 1) {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        });
    }
    calculateHoursSetToWork(to, from) {
        return __awaiter(this, void 0, void 0, function* () {
            let init2 = (0, moment_1.default)(from).format('YYYY-MM-DD hh:mm:ss a');
            let now2 = (0, moment_1.default)(to).format('YYYY-MM-DD hh:mm:ss a');
            console.log(init2);
            console.log(now2);
            let init = (0, moment_1.default)(from, 'YYYY-MM-DD hh:mm:ss a');
            let now = (0, moment_1.default)(to, 'YYYY-MM-DD hh:mm:ss a');
            // calculate total duration
            let duration = moment_1.default.duration(now.diff(init));
            // duration in hours
            let hours = duration.asHours();
            return Number(hours.toFixed(2));
        });
    }
    getTimeZone(lat, log) {
        return __awaiter(this, void 0, void 0, function* () {
            let timestamp = (0, moment_1.default)(new Date()).unix();
            try {
                let response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${log}&timestamp=${timestamp}&key=${server_config_1.default.GOOGLE_KEY}`);
                // console.log(response.data.url);
                // console.log(response.data.explanation);
                console.log(response.data);
                return response.data.timeZoneId;
            }
            catch (error) {
                console.log(error);
                throw new errors_1.NotFoundError("Failed to resolve query");
            }
        });
    }
    addTimeStampToArr(schedule, dateAndTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let obj = {};
            obj["created_at"] = dateAndTime;
            obj["updated_at"] = dateAndTime;
            let mySchedule = [];
            for (let i = 0; i < schedule.length; i++) {
                mySchedule.push(Object.assign(Object.assign({}, schedule[i]), obj));
                if (i == schedule.length - 1) {
                    return mySchedule;
                }
            }
        });
    }
    isSameDay(date1, date2) {
        if (date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()) {
            return true;
        }
        else {
            return false;
        }
    }
    checkTime(time1, time2) {
        var time1Times = time1.split(":");
        var time2Times = time2.split(":");
        var time1Total = Number(time1Times[0]) + Number(time1Times[1]);
        var time2Total = Number(time2Times[0]) + Number(time2Times[1]);
        var difference = time2Total - time1Total;
        // if(difference == 20){}
    }
    updateJob(data) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = new UserService();
//https://stackoverflow.com/questions/30452977/sequelize-query-compare-dates-in-two-columns
//# sourceMappingURL=job.service.js.map
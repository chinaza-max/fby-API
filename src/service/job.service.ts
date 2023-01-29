import {
  Admin,
  AssignedStaffs,
  Coordinates,
  Customer,
  Facility,
  FacilityLocation,
  Location,
  Job,
  JobOperations,
  Agendas,
  JobSecurityCode,
  JobLogs,
  JobReports,
  SecurityCheckLog,
  Memo,
  MemoReceiver,
} from "../db/models";
import {
  Admin as AdminDeleted,
  AssignedStaffs as AssignedStaffsDeleted,
  Coordinates as CoordinatesDeleted,
  Customer as CustomerDeleted,
  Facility as FacilityDeleted,
  FacilityLocation as FacilityLocationDeleted,
  Location as LocationDeleted,
  Job as JobDeleted,
  JobOperations as JobOperationsDeleted,
  Agendas as AgendasDeleted,
  JobSecurityCode as JobSecurityCodeDeleted,
  JobLogs as JobLogsDeleted,
  JobReports as JobReportsDeleted,
  SecurityCheckLog as SecurityCheckLogDeleted,
  Memo as MemoDeleted,
  MemoReceiver as MemoReceiverDeleted,
  Shift_comments as Shift_commentsDeleted
} from "../db/modelsDeleted";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  SystemError,
  TimeError,
  DateSheduleError,
  LocationError,
  SecurityCodeVerificationError,
  AgendaSheduleError,
} from "../errors";
import { fn, col, Op, QueryError, where, FLOAT, Sequelize } from "sequelize";
import moment from "moment";
import axios from "axios";
import momentTimeZone from "moment-timezone";
import Schedule from "../db/models/schedule.model";
import ScheduleDeleted from "../db/modelsDeleted/schedule.model";
import jobUtil from "../utils/job.util";
import serverConfig from "../config/server.config";
import { JobStatus } from "../interfaces/types.interface";
import { IJobSecurityCode } from "../interfaces/job_security_code.interface";
import authService from "./auth.service";
import { func, number } from "joi";
import Shift_comments from "../db/models/shift_comments.model";

class UserService {
  private UserModel = Admin;
  private JobModel = Job;
  private ScheduleModel = Schedule;
  private JobOperationsModel = JobOperations;
  private AssignedStaffsModel = AssignedStaffs;
  private CustomerModel = Customer;
  private JobLogsModel = JobLogs;
  private LocationModel = Location;
  private CoordinatesModel = Coordinates;
  private FacilityModel = Facility;
  private FacilityLocationModel = FacilityLocation;
  private AgendasModel = Agendas;
  private JobReportsModel = JobReports;
  private JobSecurityCodeModel = JobSecurityCode;
  private SecurityCheckLogModel = SecurityCheckLog;
  private MemoModel = Memo;
  private MemoReceiverModel = MemoReceiver;
  private Shift_commentsModel = Shift_comments;

  private JobDeletedModel = JobDeleted;
  private ScheduleDeletedModel = ScheduleDeleted;
  private JobLogsDeletedModel = JobLogsDeleted;
  private AgendasDeletedModel = AgendasDeleted;
  private JobSecurityDeletedModel = JobSecurityCodeDeleted;
  private MemoDeletedModel = MemoDeleted;
  private MemoReceiverDeletedModel = MemoReceiverDeleted;
  private Shift_commentsDeletedModel = Shift_commentsDeleted;

  async getSinglejob(myObj: any): Promise<any[]> {
    try {
      let jobDetail = [];
      let myHours_worked = 0;

      let foundJL = await this.JobLogsModel.findAll({
        where: {
          [Op.and]: [
            { check_in_status: true },
            { guard_id: myObj.guard_id },
            { job_id: myObj.job_id },
            { check_out_status: true },
          ],
        },
      });

      if (foundJL.length != 0) {
        for (let l = 0; l < foundJL.length; l++) {
          myHours_worked += foundJL[l].hours_worked;
        }
      }

      const foundS = await this.ScheduleModel.findAll({
        where: {
          [Op.and]: [
            { job_id: myObj.job_id },
            { guard_id: myObj.guard_id },
            { status_per_staff: "ACTIVE" },
          ],
        },
        order: [["check_in_date", "ASC"]],
      });

      if (foundS.length != 0) {
        let schedule = [];
        for (let j = 0; j < foundS.length; j++) {
          let obj = {};
          let sheduleObj = foundS[j];

          obj["check_in_date"] = await this.getDateOnly(
            sheduleObj.check_in_date
          );
          obj["check_out_date"] = await this.getDateOnly(
            sheduleObj.check_out_date
          );
          obj["start_time"] = await this.getTimeOnly(sheduleObj.check_in_date);
          obj["end_time"] = await this.getTimeOnly(sheduleObj.check_out_date);

          schedule.push(obj);
          if (j == foundS.length - 1) {
            const foundJ2 = await this.JobModel.findOne({
              where: { id: sheduleObj.job_id },
            });
            const foundF = await this.FacilityModel.findOne({
              where: { id: foundJ2.facility_id },
            });

            const foundFL = await this.FacilityLocationModel.findOne({
              where: { id: foundF.facility_location_id },
            });

            jobDetail.push({
              schedule,
              job_id: sheduleObj.job_id,
              description: foundJ2.description,
              job_type: foundJ2.job_type,
              guard_charge: "$" + foundJ2.staff_charge,
              time_zone: foundF.time_zone,
              facility_name: foundF.name,
              address: foundFL.address,
              job_status: foundJ2.job_status,
              hours_worked: myHours_worked,
              earn: "$" + (myHours_worked * foundJ2.staff_charge).toFixed(2),
              guard_id: myObj.guard_id,
            });
          }

          if (j == foundS.length - 1) {
            return jobDetail;
          }
        }
      } else {
        return jobDetail;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getJobsForStaff(req: any): Promise<any[]> {
    const id = req.user.id;

    let myObj = {
      id,
      jobType: req.query.jobType,
    };

    try {
      let jobDetail = [];

      if (myObj.jobType == "ACTIVE") {
        const foundJ = await this.JobModel.findAll({
          where: { job_status: "ACTIVE" },
        });

        if (foundJ.length != 0) {
          for (let i = 0; i < foundJ.length; i++) {
            const foundS = await this.ScheduleModel.findAll({
              where: {
                [Op.and]: [
                  { job_id: foundJ[i].id },
                  { guard_id: myObj.id },
                  { status_per_staff: "ACTIVE" },
                ],
              },
            });

            if (foundS.length != 0) {
              let schedule = [];
              for (let j = 0; j < foundS.length; j++) {
                let obj = {};
                let sheduleObj = foundS[j];

                obj["check_in_date"] = await this.getDateOnly(
                  sheduleObj.check_in_date
                );
                obj["check_out_date"] = await this.getDateOnly(
                  sheduleObj.check_out_date
                );
                obj["start_time"] = await this.getTimeOnly(
                  sheduleObj.check_in_date
                );
                obj["end_time"] = await this.getTimeOnly(
                  sheduleObj.check_out_date
                );

                schedule.push(obj);
                if (j == foundS.length - 1) {
                  const foundJ2 = await this.JobModel.findOne({
                    where: { id: sheduleObj.job_id },
                  });
                  const foundF = await this.FacilityModel.findOne({
                    where: { id: foundJ2.facility_id },
                  });

                  const foundFL = await this.FacilityLocationModel.findOne({
                    where: { id: foundF.facility_location_id },
                  });

                  const foundI = await this.AgendasModel.findAll({
                    where: {
                      [Op.and]: [
                        { agenda_type: "INSTRUCTION" },
                        { guard_id: myObj.id },
                        { job_id: sheduleObj.job_id },
                      ],
                    },
                  });

                  let Instruction = [];
                  for (let k = 0; k < foundI.length; k++) {
                    let obj2 = {};
                    obj2["id"] = foundI[k].id;
                    obj2["title"] = foundI[k].title;
                    obj2["description"] = foundI[k].description;
                    obj2["operation_date"] = moment(
                      foundI[k].operation_date
                    ).format("YYYY-MM-DD hh:mm:ss a");
                    obj2["agenda_done"] = foundI[k].agenda_done;
                    obj2["time"] = moment(foundI[k].operation_date).format(
                      "hh:mm:ss a"
                    );

                    Instruction.push(obj2);
                  }

                  const foundT = await this.AgendasModel.findAll({
                    where: {
                      [Op.and]: [
                        { agenda_type: "TASK" },
                        { guard_id: myObj.id },
                        { job_id: sheduleObj.job_id },
                      ],
                    },
                  });

                  let Task = [];
                  for (let l = 0; l < foundT.length; l++) {
                    let obj3 = {};
                    obj3["id"] = foundT[l].id;
                    obj3["title"] = foundT[l].title;
                    obj3["description"] = foundT[l].description;
                    obj3["operation_date"] = moment(
                      foundT[l].operation_date
                    ).format("YYYY-MM-DD");
                    obj3["agenda_done"] = foundT[l].agenda_done;

                    Task.push(obj3);
                  }

                  jobDetail.push({
                    schedule,
                    Task,
                    Instruction,
                    job_id: sheduleObj.job_id,
                    description: foundJ2.description,
                    job_type: foundJ2.job_type,
                    guard_charge: foundJ2.staff_charge,
                    time_zone: foundF.time_zone,
                    facility_name: foundF.name,
                    address: foundFL.address,
                    job_status: foundJ[i].job_status,
                  });
                }
              }
            }

            if (i == foundJ.length - 1) {
              console.log(jobDetail);

              return jobDetail;
            }
          }
        } else {
          return jobDetail;
        }
      } else if (myObj.jobType == "PENDING") {
        const foundJ = await this.JobModel.findAll({
          where: { job_status: "ACTIVE" },
        });

        if (foundJ.length != 0) {
          for (let i = 0; i < foundJ.length; i++) {
            const foundS = await this.ScheduleModel.findAll({
              where: {
                [Op.and]: [
                  { job_id: foundJ[i].id },
                  { guard_id: myObj.id },
                  { status_per_staff: "PENDING" },
                ],
              },
            });
            if (foundS.length != 0) {
              let schedule = [];
              for (let j = 0; j < foundS.length; j++) {
                let obj = {};
                let sheduleObj = foundS[j];

                obj["check_in_date"] = await this.getDateOnly(
                  sheduleObj.check_in_date
                );
                obj["check_out_date"] = await this.getDateOnly(
                  sheduleObj.check_out_date
                );
                obj["start_time"] = await this.getTimeOnly(
                  sheduleObj.check_in_date
                );
                obj["end_time"] = await this.getTimeOnly(
                  sheduleObj.check_out_date
                );

                schedule.push(obj);
                if (j == foundS.length - 1) {
                  const foundJ2 = await this.JobModel.findOne({
                    where: { id: sheduleObj.job_id },
                  });
                  const foundF = await this.FacilityModel.findOne({
                    where: { id: foundJ2.facility_id },
                  });

                  const foundFL = await this.FacilityLocationModel.findOne({
                    where: { id: foundF.facility_location_id },
                  });

                  const foundI = await this.AgendasModel.findAll({
                    where: {
                      [Op.and]: [
                        { agenda_type: "INSTRUCTION" },
                        { guard_id: myObj.id },
                        { job_id: sheduleObj.job_id },
                      ],
                    },
                  });

                  let Instruction = [];
                  for (let k = 0; k < foundI.length; k++) {
                    let obj2 = {};
                    obj2["id"] = foundI[k].id;
                    obj2["title"] = foundI[k].title;
                    obj2["description"] = foundI[k].description;
                    obj2["operation_date"] = moment(
                      foundI[k].operation_date
                    ).format("YYYY-MM-DD hh:mm:ss a");
                    obj2["agenda_done"] = foundI[k].agenda_done;
                    obj2["time"] = moment(foundI[k].operation_date).format(
                      "hh:mm:ss a"
                    );

                    Instruction.push(obj2);
                  }

                  const foundT = await this.AgendasModel.findAll({
                    where: {
                      [Op.and]: [
                        { agenda_type: "TASK" },
                        { guard_id: myObj.id },
                        { job_id: sheduleObj.job_id },
                      ],
                    },
                  });

                  let Task = [];
                  for (let l = 0; l < foundT.length; l++) {
                    let obj3 = {};
                    obj3["id"] = foundT[l].id;
                    obj3["title"] = foundT[l].title;
                    obj3["description"] = foundT[l].description;
                    obj3["operation_date"] = moment(
                      foundT[l].operation_date
                    ).format("YYYY-MM-DD");
                    obj3["agenda_done"] = foundT[l].agenda_done;

                    Task.push(obj3);
                  }

                  jobDetail.push({
                    schedule,
                    Task,
                    Instruction,
                    job_id: sheduleObj.job_id,
                    description: foundJ2.description,
                    job_type: foundJ2.job_type,
                    guard_charge: foundJ2.staff_charge,
                    time_zone: foundF.time_zone,
                    facility_name: foundF.name,
                    address: foundFL.address,
                    job_status: foundJ[i].job_status,
                  });
                }
              }
            }

            if (i == foundJ.length - 1) {
              console.log(jobDetail);

              return jobDetail;
            }
          }
        } else {
          return jobDetail;
        }
      } else if (myObj.jobType == "COMPLETED") {
        const myData = {
          limit: Number(req.query.limit),
          offset: Number(req.query.offset),
        };

        const foundJ = await this.JobModel.findAll({
          where: { job_status: "COMPLETED" },
        });

        if (foundJ.length != 0) {
          for (let i = 0; i < foundJ.length; i++) {
            const foundS = await this.ScheduleModel.findAll({
              limit: myData.limit,
              offset: myData.offset,
              where: {
                [Op.and]: [
                  { job_id: foundJ[i].id },
                  { guard_id: myObj.id },
                  { status_per_staff: "ACTIVE" },
                ],
              },
              order: [["created_at", "ASC"]],
            });

            if (foundS.length != 0) {
              let schedule = [];
              for (let j = 0; j < foundS.length; j++) {
                let obj = {};
                let sheduleObj = foundS[j];

                obj["check_in_date"] = await this.getDateOnly(
                  sheduleObj.check_in_date
                );
                obj["check_out_date"] = await this.getDateOnly(
                  sheduleObj.check_out_date
                );
                obj["start_time"] = await this.getTimeOnly(
                  sheduleObj.check_in_date
                );
                obj["end_time"] = await this.getTimeOnly(
                  sheduleObj.check_out_date
                );

                schedule.push(obj);
                if (j == foundS.length - 1) {
                  const foundJ2 = await this.JobModel.findOne({
                    where: { id: sheduleObj.job_id },
                  });
                  const foundF = await this.FacilityModel.findOne({
                    where: { id: foundJ2.facility_id },
                  });

                  const foundFL = await this.FacilityLocationModel.findOne({
                    where: { id: foundF.facility_location_id },
                  });

                  const foundI = await this.AgendasModel.findAll({
                    where: {
                      [Op.and]: [
                        { agenda_type: "INSTRUCTION" },
                        { guard_id: myObj.id },
                        { job_id: sheduleObj.job_id },
                      ],
                    },
                  });

                  let Instruction = [];
                  for (let k = 0; k < foundI.length; k++) {
                    let obj2 = {};
                    obj2["id"] = foundI[k].id;
                    obj2["title"] = foundI[k].title;
                    obj2["description"] = foundI[k].description;
                    obj2["operation_date"] = moment(
                      foundI[k].operation_date
                    ).format("YYYY-MM-DD hh:mm:ss a");
                    obj2["agenda_done"] = foundI[k].agenda_done;
                    obj2["time"] = moment(foundI[k].operation_date).format(
                      "hh:mm:ss a"
                    );

                    Instruction.push(obj2);
                  }

                  const foundT = await this.AgendasModel.findAll({
                    where: {
                      [Op.and]: [
                        { agenda_type: "TASK" },
                        { guard_id: myObj.id },
                        { job_id: sheduleObj.job_id },
                      ],
                    },
                  });

                  let Task = [];
                  for (let l = 0; l < foundT.length; l++) {
                    let obj3 = {};
                    obj3["id"] = foundT[l].id;
                    obj3["title"] = foundT[l].title;
                    obj3["description"] = foundT[l].description;
                    obj3["operation_date"] = moment(
                      foundT[l].operation_date
                    ).format("YYYY-MM-DD");
                    obj3["agenda_done"] = foundT[l].agenda_done;

                    Task.push(obj3);
                  }

                  jobDetail.push({
                    schedule,
                    Task,
                    Instruction,
                    job_id: sheduleObj.job_id,
                    description: foundJ2.description,
                    job_type: foundJ2.job_type,
                    guard_charge: foundJ2.staff_charge,
                    time_zone: foundF.time_zone,
                    facility_name: foundF.name,
                    address: foundFL.address,
                    job_status: foundJ[i].job_status,
                  });
                }
              }
            }

            if (i == foundJ.length - 1) {
              console.log(jobDetail);

              return jobDetail;
            }
          }
        } else {
          return jobDetail;
        }
      } else {
        return jobDetail;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async allMemoDetailGuard(data: any) {
    let myType = data.query.type;

    try {
      if (myType == "unAnsweredMemo") {
        let foundMR = await this.MemoReceiverModel.findOne({
          where: {
            [Op.and]: [
              { reply_message: { [Op.eq]: "" } },
              { staff_id: data.user.id },
            ],
          },
        });

        if (foundMR) {
          let foundM = await this.MemoModel.findOne({
            where: {
              id: foundMR.memo_id,
            },
          });

          let obj = {};

          obj["message"] = foundM.memo_message;
          obj["send_date"] = await this.getDateAndTime(foundM.send_date);
          obj["memo_id"] = foundM.id;
          obj["memo_receiver_id"] = foundMR.id;

          const dateStamp = await this.getDateAndTimeForStamp(foundM.time_zone);
          if (moment(foundM.send_date).isAfter(dateStamp)) {
            return [];
          } else {
            return obj;
          }
        } else {
          return [];
        }
      } else if (myType == "allMemo") {
        let detail = [];

        let foundMR = await this.MemoReceiverModel.findAll({
          where: {
            [Op.and]: [
              { reply_message: { [Op.ne]: "" } },
              { staff_id: data.query.id||data.user.id },
            ],
          },
        });

        if (foundMR.length != 0) {
          for (let i = 0; i < foundMR.length; i++) {
            let foundM = await this.MemoModel.findOne({
              where: {
                id: foundMR[i].memo_id,
              },
            });

            let adminDetails = await this.getSingleGuardDetail(
              foundM.created_by_id
            );

            let obj = {};

            obj["message"] = foundM.memo_message;
            obj["send_date"] = await this.getDateAndTime(foundM.send_date);
            obj["memo_id"] = foundM.id;
            obj["memo_receiver_id"] = foundMR[i].id;
            obj["Created"] = await this.getDateAndTime(foundM.created_at);
            obj["CreatedBy"] = adminDetails["first_name"] + " " + adminDetails["last_name"];
            const dateStamp = await this.getDateAndTimeForStamp(
              foundM.time_zone
            )
            
            if (moment(foundM.send_date).isAfter(dateStamp)) {
              obj["send_status"] = "Pending";
            } else {
              obj["send_status"] = "Sent";
            }


            detail.push(obj);
            if (i == foundMR.length - 1) {
              return detail;
            }
          }
        } else {
          return [];
        }
      } else if (myType == "repliedMessage") {
        let foundMR = await this.MemoReceiverModel.findOne({
          where: {
            id: data.query.id,
          },
        });
        let obj = {};
        obj["message"] = foundMR.reply_message;
        obj["date"] = await this.getDateAndTime(foundMR.updated_at);

        return obj;
      }
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async allMemoDetail(data: any): Promise<any[]> {
    let myType = data.query.type;

    try {
      if (myType == "allMemo") {
        let foundM = await this.MemoModel.findAll({
          order: [["created_at", "DESC"]],
        });

        let detail = [];
        if (foundM.length != 0) {
          for (let i = 0; i < foundM.length; i++) {
            let adminDetails = await this.getSingleGuardDetail(
              foundM[i].created_by_id
            );
            let obj = {};

            obj["message"] = foundM[i].memo_message;
            obj["message_length"] = foundM[i].memo_message.length;
            obj["send_date"] = await this.getDateAndTime(foundM[i].send_date);
            obj["id"] = foundM[i].id;
            obj["Created"] = await this.getDateAndTime(foundM[i].created_at);
            obj["CreatedBy"] =
              adminDetails["first_name"] + " " + adminDetails["last_name"];

            const dateStamp = await this.getDateAndTimeForStamp(
              foundM[i].time_zone
            );

            if (moment(foundM[i].send_date).isAfter(dateStamp)) {
              obj["send_status"] = "Pending";
            } else {
              obj["send_status"] = "Sent";
            }

            detail.push(obj);

            if (i == foundM.length - 1) {
              return detail;
            }
          }
        } else {
          return detail;
        }
      } else if (myType == "memoMessageOnly") {
        let foundM = await this.MemoModel.findOne({
          where: {
            id: data.query.id,
          },
        });

        return [foundM.memo_message];
      } else if (myType == "guardDetails") {
        let foundM = await this.MemoModel.findOne({
          where: {
            id: data.query.id,
          },
        });

        let foundMR = await this.MemoReceiverModel.findAll({
          where: {
            memo_id: foundM.id,
          },
        });

        let guards = [];
        for (let i = 0; i < foundMR.length; i++) {
          let obj = {};
          let guardFullDetail = await this.getSingleGuardDetail(
            foundMR[i].staff_id
          );

          obj["full_name"] =
            guardFullDetail["first_name"] + " " + guardFullDetail["last_name"];
          obj["id"] = foundMR[i].id;
          obj["is_message"] = foundMR[i].reply_message == "" ? false : true;
          obj["number_of_guard"] = foundMR.length;
          obj["guard_id"] = foundMR[i].staff_id;

          guards.push(obj);

          if (i == foundMR.length - 1) {
            return guards;
          }
        }
      } else if (myType == "guardMessageOnly") {
        let foundMR = await this.MemoReceiverModel.findOne({
          where: {
            id: data.query.id,
          },
        });
        let guardFullDetail = await this.getSingleGuardDetail(
          data.query.guard_id
        );

        let obj = {};
        obj["read_date"] = await this.getDateAndTime(foundMR.updated_at);
        obj["message"] = foundMR.reply_message;
        obj["full_name"] =
          guardFullDetail["first_name"] + " " + guardFullDetail["last_name"];

        return [obj];
      }
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async getAllJobsAdmin(data: any): Promise<any[]> {
    let mytype = data.query.type;
    try {
      const jobs = [];
      let availableJobs;

      if (mytype == "ACTIVE") {
        availableJobs = await this.JobModel.findAll({
          limit: parseInt(data.query.limit),
          offset: parseInt(data.query.offset),
          where: {
            is_deleted: false,
            job_status: "ACTIVE",
          } as any,
          order: [["created_at", "DESC"]],
        });

        setTimeout(() => {
          this.shiftJobToCompleted();
        }, 1000 * 60 * 60);
      } else if (mytype == "PENDING") {
        availableJobs = await this.JobModel.findAll({
          limit: parseInt(data.query.limit),
          offset: parseInt(data.query.offset),
          where: {
            is_deleted: false,
            job_status: "PENDING",
          } as any,
          order: [["created_at", "DESC"]],
        });
      } else if (mytype == "COMPLETED") {
        availableJobs = await this.JobModel.findAll({
          limit: parseInt(data.query.limit),
          offset: parseInt(data.query.offset),
          where: {
            is_deleted: false,
            job_status: "COMPLETED",
          } as any,
          order: [["created_at", "DESC"]],
        });
      } else {
        availableJobs = await this.JobModel.findAll({
          where: {
            is_deleted: false,
          } as any,
          order: [["created_at", "DESC"]],
        });
      }

      for (const availableJob of availableJobs) {
        let foundC = await this.CustomerModel.findOne({
          where: {
            id: availableJob.customer_id,
          },
        });
        let foundF = await this.FacilityModel.findOne({
          where: {
            id: availableJob.facility_id,
          },
        });
        let job_progress = await this.returnJobPercentage(availableJob.id);

        const jobRes = {
          id: availableJob.id,
          job_progress: job_progress,
          description: availableJob.description,
          client_charge: availableJob.client_charge,
          staff_payment: availableJob.staff_charge,
          status: availableJob.job_status,
          customer: foundC.company_name,
          site: foundF.name,
          create: await this.getDateAndTime(availableJob.created_at),
        };

        jobs.push(jobRes);
      }

      return jobs;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async replyMemo(data: any): Promise<any> {
    try {
      const { message, memo_receiver_id, my_time_zone } =
        await jobUtil.verifyReplyMemo.validateAsync(data);

      let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);

      console.log("kkkkkkkkkkkkkiiiiiiiiiiiikkkkkkkkkkkkkkkk");

      console.log(dateStamp);

      console.log("kkkkkkkkkkkkkkiiiiiiiiiiiiikkkkkkkkkkkkkkk");

      let obj = {
        reply_message: message,
        updated_at: dateStamp,
      };

      await this.MemoReceiverModel.update(obj, {
        where: {
          id: memo_receiver_id,
        },
      });
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async deleteMemo(data: any): Promise<any> {
    try {
      const { memo_id } = await jobUtil.verifyDeleteMemo.validateAsync(data);

      const record = await this.MemoReceiverModel.findOne({
        where: {
          memo_id,
        },
      });
      if (record) {
        await this.MemoReceiverDeletedModel.create(record.dataValues);
      }

      await this.MemoReceiverModel.destroy({
        where: {
          memo_id,
        },
      });

      const record2 = await this.MemoModel.findOne({
        where: {
          id: memo_id,
        },
      });
      if (record2) {
        await this.MemoDeletedModel.create(record2.dataValues);
      }

      await this.MemoModel.destroy({
        where: {
          id: memo_id,
        },
      });
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async deleteJob(data: any): Promise<any> {
    try {
      const { job_id } = await jobUtil.verifyDeleteJob.validateAsync(data);

      const record = await this.JobModel.findOne({
        where: {
          id: job_id,
        },
      });
      if (record) {
        const deleted_Job = await this.JobDeletedModel.create(record.dataValues);
      }

      this.JobModel.destroy({
        where: {
          id: job_id,
        },
      })
        .then(function (deletedRecord) {
          if (deletedRecord === 1) {
            return "Deleted successfully";
          } else {
            // throw new NotFoundError("record not found");
          }
        })

        .catch(function (error) {
          //throw new NotFoundError(error);
        });
    } catch (error) {
      console.log(error);
      throw new SystemError(error.toString());
    }
  }

  async createMemo(data: any): Promise<any> {
    try {
      let { guards_details, message, send_date, created_by_id, my_time_zone } =
        await jobUtil.verifyCreateMemo.validateAsync(data);

      let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);

      let obj = {
        memo_message: message,
        created_by_id,
        time_zone: my_time_zone,
        send_date: send_date == "" ? dateStamp : send_date,
        created_at: dateStamp,
        updated_at: dateStamp,
      };

      let createdM = await this.MemoModel.create(obj);

      for (let i = 0; i < guards_details.length; i++) {
        let obj2 = {
          staff_id: guards_details[i],
          memo_id: createdM.id,
          created_at: dateStamp,
          updated_at: dateStamp,
        };

        await this.MemoReceiverModel.create(obj2);
      }
    } catch (error) {
      throw new SystemError(error.toString());
      //throw new AgendaSheduleError(JSON.stringify(error));
    }
  }

  async sheduleAgenda(data: any): Promise<any> {
    try {
      let { shedule_agenda, created_by_id, my_time_zone } =
        await jobUtil.verifySheduleAgenda.validateAsync(data);

      shedule_agenda = await this.addCreatorsId(shedule_agenda, created_by_id);
      let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);
      let isAgendaOk = await this.checkifAgendaDateIsInScheduleDate(
        shedule_agenda
      );

      if (isAgendaOk.status) {
        //GETTING ALL THE JOBS SPECIFIC TO THE SHEDULE
        let myShedule = await this.AgendasModel.findAll({
          where: {
            [Op.and]: [
              { job_id: shedule_agenda[0].job_id },
              { agenda_type: shedule_agenda[0].agenda_type },
            ],
          },
        });

        //CHECK FOR DUBPLICATE
        let cleanShedule = [];
        if (myShedule.length != 0) {
          for (let i = 0; i < shedule_agenda.length; i++) {
            let obj = shedule_agenda[i];
            for (let j = 0; j < myShedule.length; j++) {
              let obj2 = myShedule[j];

              let newDate = moment(new Date(obj.operation_date));
              let dateNowFormatted1 = newDate.format("YYYY-MM-DD hh:mm:ss a");

              let oldDate = moment(new Date(obj2.operation_date));
              let dateNowFormatted2 = oldDate.format("YYYY-MM-DD hh:mm:ss a");

              if (obj.agenda_type == "INSTRUCTION") {
                if (
                  dateNowFormatted1 == dateNowFormatted2 &&
                  obj.guard_id == obj2.guard_id
                ) {
                  break;
                }
              }

              if (j == myShedule.length - 1) {
                shedule_agenda[i].status_per_staff =
                  myShedule[0].status_per_staff;
                cleanShedule.push(shedule_agenda[i]);
              }
            }
            if (i == shedule_agenda.length - 1) {
              if (cleanShedule.length != 0) {
                let scheduleWithTimeStamp = await this.addTimeStampToArr(
                  cleanShedule,
                  dateStamp
                );
                await this.AgendasModel.bulkCreate(scheduleWithTimeStamp);
              } else {
                let obj = {
                  info: {
                    fullName: "",
                    operation_date: "",
                    issues: "no new shedule was created dublicate found",
                  },
                };
                throw obj;
              }
            }
          }
        } else {
          let scheduleWithTimeStamp = await this.addTimeStampToArr(
            shedule_agenda,
            dateStamp
          );

          let createdA = await this.AgendasModel.bulkCreate(
            scheduleWithTimeStamp
          );

          if (
            createdA[0].agenda_type == "INSTRUCTION" &&
            createdA[0].title == "scan-QR-code"
          ) {
            for (let k = 0; k < createdA.length; k++) {
              let security_code = ("" + createdA[k].operation_date).replace(
                /\s+/g,
                ""
              );
              let myObj = {
                agenda_id: createdA[k].id,
                guard_id: createdA[k].guard_id,
                job_id: createdA[k].job_id,
                security_code,
                created_at: dateStamp,
                updated_at: dateStamp,
              };
              await this.JobSecurityCodeModel.create(myObj);
            }
          }
        }
      } else {
        throw isAgendaOk;
      }
    } catch (error) {
      //throw new SystemError(error.toString());
      throw new AgendaSheduleError(JSON.stringify(error));
    }
  }

  async updateScheduleAcceptStatus(data: any): Promise<any> {
    try {
      const { schedule_id, my_time_zone, status } =
        await jobUtil.verifyUpdateScheduleAcceptStatus.validateAsync(data);

      let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);

      let obj = {
        schedule_accepted_by_admin: status,
        updated_at: dateStamp,
      };

      this.ScheduleModel.update(obj, {
        where: {
          id: schedule_id,
        },
      });
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async updateMaxCheckInTime(data: any): Promise<any> {
    try {
      const { guard_id, shedule_id, max_check_in_time } =
        await jobUtil.verifyUpdateMaxCheckInTime.validateAsync(data);

      let schedule = await this.ScheduleModel.update(
        { max_check_in_time },
        {
          where: {
            [Op.and]: [{ guard_id }, { id: shedule_id }],
          },
        }
      );
    } catch (error) {
      console.log(error);
      throw new SystemError(error.toString());
    }
  }

  async scheduleDateJob(data: any): Promise<any> {
    let {
      description,
      customer_id,
      site_id,
      client_charge,
      staff_charge,
      my_time_zone,
      created_by_id,
      check_in_date,
      check_out_date,
    } = await jobUtil.verifyScheduleDateJob.validateAsync(data);

    let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);

    let createdJ = await this.JobModel.create({
      description,
      customer_id,
      facility_id: site_id,
      client_charge,
      staff_charge,
      payment_status: "Awaiting Payment",
      job_status: "ACTIVE",
      job_type: "INSTANT",
      created_by_id,
      time_zone: my_time_zone,
      created_at: dateStamp,
      updated_at: dateStamp,
    });

    let obj = {
      start_time: moment(check_in_date).format("hh:mm:ss a"),
      end_time: moment(check_out_date).format("hh:mm:ss a"),
      status_per_staff: "ACTIVE",
      check_in_date: check_in_date,
      check_out_date: check_out_date,
      job_id: createdJ.id,
      created_by_id,
      guard_id: created_by_id,
      schedule_accepted_by_admin: false,
      created_at: dateStamp,
      updated_at: dateStamp,
    };

    await this.ScheduleModel.create(obj);
  }

  async sheduleDate(data: any): Promise<any> {
    let { date_time_staff_shedule, my_time_zone, created_by_id } =
      await jobUtil.verifysheduleDateCreation.validateAsync(data);

    let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);
    date_time_staff_shedule = await this.addCreatorsId(
      date_time_staff_shedule,
      created_by_id
    );

    //GETTING ALL THE THE JOBS SCHEDULE SPECIFIC TO THE SHEDULE
    let myShedule = await this.ScheduleModel.findAll({
      where: { job_id: date_time_staff_shedule[0].job_id },
    });

    //THIS CHECK IF DATE SCHEDULE ARE WELL SPACED FOR EACH STAFF
    if (await this.checkIfDateAreApart(date_time_staff_shedule)) {
      //CHECK FOR DUBPLICATE
      let cleanShedule = [];

      if (myShedule.length != 0) {
        for (let i = 0; i < date_time_staff_shedule.length; i++) {
          let obj = date_time_staff_shedule[i];

          for (let j = 0; j < myShedule.length; j++) {
            let obj2 = myShedule[j];

            let newDate = moment(new Date(obj.check_in_date));
            let newDate2 = moment(new Date(obj.check_out_date));
            let dateNowFormatted1 = newDate.format("YYYY-MM-DD");
            let dateNowFormatted2 = newDate2.format("YYYY-MM-DD");

            let myNewDateIn = new Date(
              moment(new Date(obj.check_in_date)).format(
                "YYYY-MM-DD hh:mm:ss a"
              )
            );
            let myNewDateOut = moment(new Date(obj.check_out_date));

            let oldDate = moment(new Date(obj2.check_in_date));
            let oldDate2 = moment(new Date(obj2.check_out_date));
            let dateNowFormatted3 = oldDate.format("YYYY-MM-DD");
            let dateNowFormatted4 = oldDate2.format("YYYY-MM-DD");

            //THIS CODE PREVENT DATE ENTANGLE MENT   ONE DATE FALLING INSIDE ANOTHE DATE

            const foundItemS = await this.ScheduleModel.findOne({
              where: {
                [Op.and]: [
                  { check_in_date: { [Op.lte]: myNewDateIn } },
                  { check_out_date: { [Op.gte]: myNewDateIn } },
                  { job_id: obj.job_id },
                  { guard_id: obj.guard_id },
                ],
              },
            });

            if (foundItemS) {
              continue;
            }

            const foundItemS2 = await this.ScheduleModel.findOne({
              where: {
                [Op.and]: [
                  { check_in_date: { [Op.lte]: myNewDateOut } },
                  { check_out_date: { [Op.gte]: myNewDateOut } },
                  { job_id: obj.job_id },
                  { guard_id: obj.guard_id },
                ],
              },
            });
            if (foundItemS2) {
              continue;
            }

            if (
              dateNowFormatted1 == dateNowFormatted3 &&
              dateNowFormatted2 == dateNowFormatted4 &&
              obj.guard_id == obj2.guard_id
            ) {
              continue;
            }

            if (j == myShedule.length - 1) {
              date_time_staff_shedule[i].status_per_staff =
                myShedule[0].status_per_staff;
              cleanShedule.push(date_time_staff_shedule[i]);
            }
          }
          if (i == date_time_staff_shedule.length - 1) {
            if (cleanShedule.length != 0) {
              let scheduleWithTimeStamp = await this.addTimeStampToArr(
                cleanShedule,
                dateStamp
              );

              return await this.ScheduleModel.bulkCreate(scheduleWithTimeStamp);
            } else {
              throw new DateSheduleError(
                "no new shedule was created dublicate found"
              );
            }
          }
        }

        /*
        if(cleanShedule.length!=0){
          let scheduleWithTimeStamp=await this.addTimeStampToArr(cleanShedule,dateStamp)
          //console.log("ooooooooooooooooooooooooooooo")
          //console.log(scheduleWithTimeStamp)
          await this.ScheduleModel.bulkCreate(scheduleWithTimeStamp);
        }
        else{
          throw new DateSheduleError("no new shedule was created dublicate found");
        }

        */
      } else {
        let scheduleWithTimeStamp = await this.addTimeStampToArr(
          date_time_staff_shedule,
          dateStamp
        );
        await this.ScheduleModel.bulkCreate(scheduleWithTimeStamp);
      }
    }
  }

  async createJob(data: any): Promise<any> {
    try {
      const {
        description,
        customer_id,
        site_id,
        client_charge,
        staff_charge,
        payment_status,
        job_status,
        job_type,
        my_time_zone,
        created_by_id,
      } = await jobUtil.verifyJobCreationData.validateAsync(data);

      let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);

      await this.JobModel.create({
        description,
        customer_id,
        facility_id: site_id,
        client_charge,
        staff_charge,
        payment_status,
        job_status,
        job_type,
        created_by_id,
        time_zone: my_time_zone,
        created_at: dateStamp,
        updated_at: dateStamp,
      });
    } catch (error) {
      console.log(error);
      throw new SystemError(error.toString());
    }
  }

  async acceptDeclineJobAdmin(req) {
    var { job_id, accept, guard_id } = req.body;

    if (accept == "true") {
      let relatedAssignment = await this.ScheduleModel.destroy({
        where: { [Op.and]: [{ guard_id }, { job_id }] },
      });

      await this.AgendasModel.destroy({
        where: { [Op.and]: [{ guard_id }, { job_id }] },
      });

      if (relatedAssignment == null)
        throw new NotFoundError(
          "No Assignment was found for you.\nIt may not exist anymore"
        );
    } else {
      let relatedAssignment = await this.ScheduleModel.update(
        {
          status_per_staff: "PENDING",
        },
        {
          where: { [Op.and]: [{ guard_id }, { job_id }] },
        }
      );

      await this.AgendasModel.update(
        {
          status_per_staff: "PENDING",
        },
        {
          where: { [Op.and]: [{ guard_id }, { job_id }] },
        }
      );

      if (relatedAssignment == null)
        throw new NotFoundError(
          "No Assignment was found for you.\nIt may not exist anymore"
        );
    }
  }

  async acceptDeclineJob(req) {
    var { job_id, accept } = req.body;
    let id = req.user.id;

    var relatedAssignment = await this.ScheduleModel.update(
      {
        status_per_staff: accept == "true" ? "ACTIVE" : "DECLINE",
      },
      {
        where: { [Op.and]: [{ guard_id: id }, { job_id }] },
      }
    );

    await this.AgendasModel.update(
      {
        status_per_staff: (accept = "true" ? "ACTIVE" : "DECLINE"),
      },
      {
        where: { [Op.and]: [{ guard_id: id }, { job_id }] },
      }
    );

    //console.log(relatedAssignment)

    if (relatedAssignment == null)
      throw new NotFoundError(
        "No Assignment was found for you.\nIt may not exist anymore"
      );

    return relatedAssignment;
  }

  async getPerformSecurityCheckLog(obj) {
    var { job_id, guard_id } =
      await jobUtil.verifyGetPerformSecurityCheckLog.validateAsync(obj);

    const foundSCL = await this.SecurityCheckLogModel.findAll({
      where: {
        [Op.and]: [{ job_id }, { guard_id }],
      },
    });

    let myLog = [];
    if (foundSCL.length != 0) {
      for (let i = 0; i < foundSCL.length; i++) {
        let obj = {};

        let latLon = await this.CoordinatesModel.findOne({
          where: { id: foundSCL[i].coordinates_id },
        });

        let lat = Number(latLon.latitude);
        let lon = Number(latLon.longitude);

        obj["date"] = await this.getDateAndTime(foundSCL[i].created_at);
        obj["status"] = foundSCL[i].status;
        obj["message"] = "Security check";
        obj["lat"] = lat.toFixed(5);
        obj["log"] = lon.toFixed(5);

        myLog.push(obj);

        if (i == foundSCL.length - 1) {
          return myLog;
        }
      }
    } else {
      return myLog;
    }
  }

  async getLogPerGuard(obj) {
    var { job_id, guard_id } = await jobUtil.verifyGetLogPerGuard.validateAsync(
      obj
    );

    const foundJL = await this.JobLogsModel.findAll({
      where: {
        [Op.and]: [{ job_id }, { guard_id }],
      },
    });

    let myLog = [];
    if (foundJL.length != 0) {
      for (let i = 0; i < foundJL.length; i++) {
        let obj = {};

        let latLon = await this.CoordinatesModel.findOne({
          where: { id: foundJL[i].coordinates_id },
        });

        obj["check_in_date"] = await this.getDateOnly(foundJL[i].check_in_date);
        obj["check_out_date"] = foundJL[i].check_out_status
          ? await this.getDateOnly(foundJL[i].check_out_date)
          : "None";
        obj["check_in_time"] = foundJL[i].check_in_time;
        obj["check_out_time"] = foundJL[i].check_out_status
          ? foundJL[i].check_out_time
          : "None";
        obj["log_id"] = foundJL[i].id;
        obj["job_id"] = job_id;
        obj["guard_id"] = guard_id;

        if (
          foundJL[i].check_in_status == true &&
          true == foundJL[i].check_out_status
        ) {
          obj["hours"] = await this.calculateHoursSetToWork(
            foundJL[i].check_out_date,
            foundJL[i].check_in_date
          );
        } else {
          obj["hours"] = 0.0;
        }
        obj["location_message"] = foundJL[i].message;
        obj["lat"] = latLon.latitude;
        obj["log"] = latLon.longitude;

        myLog.push(obj);

        if (i == foundJL.length - 1) {
          return myLog;
        }
      }
    } else {
      return [];
    }
  }

  async getAllUnsettleShiftOneGuard(obj, obj2) {
    var { guard_id, settlement } =
      await jobUtil.verifyGetAllUnsettleShiftOneGuard.validateAsync(obj);

    if (settlement) {
      let foundS = await this.ScheduleModel.findAll({
        limit: obj2.limit,
        offset: obj2.offset,
        where: { settlement_status: settlement },
      });

      let unSettledSucessfullShift = [];
      if (foundS.length != 0) {
        for (let i = 0; i < foundS.length; i++) {
          let obj = {};
          //JUST FOR GETTING THE CHARGE PER JOB
          let foundJL = await this.JobLogsModel.findOne({
            where: {
              [Op.and]: [
                { check_in_status: true },
                { schedule_id: foundS[i].id },
                { check_out_status: true },
              ],
            },
          });

          if (foundJL) {
            let my_guard_info = await this.getSingleGuardDetail(
              foundS[i].guard_id
            );
            let foundJ = await this.JobModel.findOne({
              where: {
                id: foundS[i].job_id,
              },
            });

            let foundF = await this.FacilityModel.findOne({
              where: {
                id: foundJ.facility_id,
              },
            });

            obj["hours_worked"] = foundJL.hours_worked;
            obj["amount"] = foundJL.hours_worked * foundJ.staff_charge;
            obj["charge"] = foundJ.staff_charge;
            obj["first_name"] = my_guard_info["first_name"];
            obj["last_name"] = my_guard_info["last_name"];
            obj["start_date"] = await this.getDateOnly(foundS[i].check_in_date);
            obj["start_time"] = foundS[i].start_time;
            obj["end_date"] = await this.getDateOnly(foundS[i].check_out_date);
            obj["end_time"] = foundS[i].end_time;
            obj["Job_hours"] = await this.calculateHoursSetToWork(
              foundS[i].check_out_date,
              foundS[i].check_in_date
            );
            obj["check_in_date"] = await this.getDateOnly(
              foundJL.check_in_date
            );
            obj["check_in_time"] = foundJL.check_in_time;
            obj["check_out_date"] = await this.getDateOnly(
              foundJL.check_out_date
            );
            obj["check_out_time"] = foundJL.check_out_time;
            obj["shedule_id"] = foundS[i].id;
            obj["site_name"] = foundF.name;

            unSettledSucessfullShift.push(obj);
          }

          if (i == foundS.length - 1) {
            return unSettledSucessfullShift;
          }
        }
      } else {
        return unSettledSucessfullShift;
      }
    } else {
      let foundS = await this.ScheduleModel.findAll({
        where: {
          [Op.and]: [
            { guard_id },
            { settlement_status: settlement },
            { schedule_accepted_by_admin: true },
          ],
        },
      });

      let unSettledSucessfullShift = [];
      if (foundS.length != 0) {
        for (let i = 0; i < foundS.length; i++) {
          let obj = {};

          let foundJL = await this.JobLogsModel.findOne({
            where: {
              [Op.and]: [
                { check_in_status: true },
                { schedule_id: foundS[i].id },
                { check_out_status: true },
              ],
            },
          });

          if (foundJL) {
            let my_guard_info = await this.getSingleGuardDetail(
              foundS[i].guard_id
            );
            let foundJ = await this.JobModel.findOne({
              where: {
                id: foundS[i].job_id,
              },
            });

            let foundF = await this.FacilityModel.findOne({
              where: {
                id: foundJ.facility_id,
              },
            });

            obj["hours_worked"] = foundJL.hours_worked;
            obj["amount"] = foundJL.hours_worked * foundJ.staff_charge;
            obj["charge"] = foundJ.staff_charge;
            obj["first_name"] = my_guard_info["first_name"];
            obj["last_name"] = my_guard_info["last_name"];
            obj["start_date"] = await this.getDateOnly(foundS[i].check_in_date);
            obj["start_time"] = foundS[i].start_time;
            obj["end_date"] = await this.getDateOnly(foundS[i].check_out_date);
            obj["end_time"] = foundS[i].end_time;
            obj["Job_hours"] = await this.calculateHoursSetToWork(
              foundS[i].check_out_date,
              foundS[i].check_in_date
            );
            obj["check_in_date"] = await this.getDateOnly(
              foundJL.check_in_date
            );
            obj["check_in_time"] = foundJL.check_in_time;
            obj["check_out_date"] = await this.getDateOnly(
              foundJL.check_out_date
            );
            obj["check_out_time"] = foundJL.check_out_time;
            obj["shedule_id"] = foundS[i].id;
            obj["site_name"] = foundF.name;

            unSettledSucessfullShift.push(obj);
          }

          if (i == foundS.length - 1) {
            return unSettledSucessfullShift;
          }
        }
      } else {
        return unSettledSucessfullShift;
      }
    }
  }

  async shiftPerGuardAllJob(obj) {
    var { guard_id } = await jobUtil.verifyShiftPerGuardAllJob.validateAsync(
      obj
    );

    const foundS = await this.ScheduleModel.findAll({
      where: {
        [Op.and]: [{ guard_id }],
      },
      order: [["check_in_date", "DESC"]],
    });

    let all_shift = [];
    if (foundS.length != 0) {
      for (let i = 0; i < foundS.length; i++) {
        let obj = {};

        const foundJ = await this.JobModel.findOne({
          where: { id: foundS[i].job_id },
        });

        const foundF = await this.FacilityModel.findOne({
          where: { id: foundJ.facility_id },
        });

        const foundC = await this.CustomerModel.findOne({
          where: { id: foundJ.customer_id },
        });

        const foundJL = await this.JobLogsModel.findOne({
          where: {
            [Op.and]: [
              { project_check_in_date: foundS[i].check_in_date },
              { job_id: foundS[i].job_id },
              { guard_id: foundS[i].guard_id },
              { check_in_status: true },
            ],
          },
        });

        let name = await this.getSingleGuardDetail(foundS[i].guard_id);
        let hours = await this.calculateHoursSetToWork(
          foundS[i].check_in_date,
          foundS[i].check_out_date
        );

        obj["start_date"] = await this.getDateOnly(foundS[i].check_in_date);
        obj["end_date"] = await this.getDateOnly(foundS[i].check_out_date);
        obj["start_time"] = foundS[i].start_time;
        obj["end_time"] = foundS[i].end_time;
        obj["hours"] = await this.calculateHoursSetToWork(
          foundS[i].check_out_date,
          foundS[i].check_in_date
        );
        obj["first_name"] = name["first_name"];
        obj["last_name"] = name["last_name"];
        obj["customer"] = foundC.company_name;
        obj["site"] = foundF.name;

        obj["guard_charge"] = "$" + foundJ.staff_charge;
        obj["guard_id"] = foundS[i].guard_id;
        obj["client_charge"] = foundJ.client_charge;

        if (foundJL) {
          if (foundJL.check_out_status == true) {
            obj["check_in"] = await this.getDateAndTime(foundJL.check_in_date);
            obj["check_out"] = await this.getDateAndTime(
              foundJL.check_out_date
            );
            obj["hours_worked"] = foundJL.hours_worked;
            obj["earned"] =
              "$" + (foundJL.hours_worked * foundJ.staff_charge).toFixed(2);
            obj["settlement_status"] = foundS[i].settlement_status;
          } else {
            obj["check_in"] = await this.getDateAndTime(foundJL.check_in_date);
            obj["check_out"] = "None";
            obj["hours_worked"] = 0.0;
            obj["earned"] = "$" + 0.0;
            obj["settlement_status"] = "None";
          }
        } else {
          obj["check_in"] = "None";
          obj["check_out"] = "None";
          obj["hours_worked"] = 0.0;
          obj["earned"] = "$" + 0.0;
          obj["settlement_status"] = "not eligible";
        }
        all_shift.push(obj);
        if (i == foundS.length - 1) {
          return all_shift;
        }
      }
    } else {
      return [];
    }
  }

  async getShiftPerGuard(obj) {
    var { job_id, guard_id } =
      await jobUtil.verifyGetShiftPerGuard.validateAsync(obj);

    const foundS = await this.ScheduleModel.findAll({
      where: {
        [Op.and]: [{ job_id }, { guard_id }],
      },
      order: [["check_in_date", "DESC"]],
    });

    let all_shift = [];
    if (foundS.length != 0) {
      for (let i = 0; i < foundS.length; i++) {
        let obj = {};

        const foundJ = await this.JobModel.findOne({
          where: { id: foundS[i].job_id },
        });

        const foundF = await this.FacilityModel.findOne({
          where: { id: foundJ.facility_id },
        });

        const foundC = await this.CustomerModel.findOne({
          where: { id: foundJ.customer_id },
        });

        const foundJL = await this.JobLogsModel.findOne({
          where: {
            [Op.and]: [
              { project_check_in_date: foundS[i].check_in_date },
              { job_id: foundS[i].job_id },
              { guard_id: foundS[i].guard_id },
              { check_in_status: true },
            ],
          },
        });

        let name = await this.getSingleGuardDetail(foundS[i].guard_id);
        let hours = await this.calculateHoursSetToWork(
          foundS[i].check_in_date,
          foundS[i].check_out_date
        );

        obj["start_date"] = await this.getDateOnly(foundS[i].check_in_date);
        obj["end_date"] = await this.getDateOnly(foundS[i].check_out_date);
        obj["start_time"] = foundS[i].start_time;
        obj["end_time"] = foundS[i].end_time;
        obj["hours"] = await this.calculateHoursSetToWork(
          foundS[i].check_out_date,
          foundS[i].check_in_date
        );
        obj["First_name"] = name["first_name"];
        obj["last_name"] = name["last_name"];
        obj["customer"] = foundC.company_name;
        obj["site"] = foundF.name;
        obj["guard_charge"] = foundF.guard_charge;
        obj["guard_id"] = foundS[i].guard_id;
        obj["client_charge"] = foundF.client_charge;

        if (foundJL) {
          if (foundJL.check_out_status == true) {
            obj["check_in"] = await this.getDateAndTime(foundJL.check_in_date);
            obj["check_out"] = await this.getDateAndTime(
              foundJL.check_out_date
            );
            obj["hours_worked"] = foundJL.hours_worked;
            obj["earned"] = (
              foundJL.hours_worked * foundF.client_charge
            ).toFixed(2);
          } else {
            obj["check_in"] = await this.getDateAndTime(foundJL.check_in_date);
            obj["check_out"] = "empty";
            obj["hours_worked"] = 0;
            obj["earned"] = 0;
          }
        } else {
          obj["check_in"] = "None";
          obj["check_out"] = "None";
          obj["hours_worked"] = 0;
          obj["earned"] = 0;
        }

        all_shift.push(obj);
        if (i == foundS.length - 1) {
          return all_shift;
        }
      }
    } else {
      return [];
    }
  }

  async generalshiftStarted(obj) {
    const foundS = await this.ScheduleModel.findAll({
      where: { status_per_staff: { [Op.eq]: "ACTIVE" } },
      order: [["created_at", "DESC"]],
    });

    let all_shift = [];

    if (foundS.length != 0) {
      for (let i = 0; i < foundS.length; i++) {
        let obj = {};

        const foundJ = await this.JobModel.findOne({
          where: {
            [Op.and]: [{ id: foundS[i].job_id }, { job_status: "ACTIVE" }],
          },
        });

        if (foundJ) {
          let dateAndTime = await this.getDateAndTimeForStamp(foundJ.time_zone);

          if (
            moment(dateAndTime).isSame(foundS[i].check_in_date) ||
            moment(dateAndTime).isSame(foundS[i].check_out_date) ||
            moment(dateAndTime).isBetween(
              moment(foundS[i].check_in_date),
              moment(foundS[i].check_out_date)
            )
          ) {
            const foundF = await this.FacilityModel.findOne({
              where: { id: foundJ.facility_id },
            });

            const foundC = await this.CustomerModel.findOne({
              where: { id: foundJ.customer_id },
            });

            const foundJL = await this.JobLogsModel.findOne({
              where: {
                [Op.and]: [
                  { schedule_id: foundS[i].id },
                  { job_id: foundS[i].job_id },
                  { job_id: foundS[i].job_id },
                  { check_in_status: true },
                ],
              },
            });

            let name = await this.getSingleGuardDetail(foundS[i].guard_id);
            let guard_charge = Number(foundJ.staff_charge).toFixed(2);
            let client_charge = Number(foundJ.client_charge).toFixed(2);
            //let hours=await this.calculateHoursSetToWork(foundS[i].check_in_date ,foundS[i].check_out_date)

            obj["start_date"] = await this.getDateOnly(foundS[i].check_in_date);
            obj["end_date"] = await this.getDateOnly(foundS[i].check_out_date);
            obj["start_time"] = foundS[i].start_time;
            obj["end_time"] = foundS[i].end_time;
            obj["hours"] = await this.calculateHoursSetToWork(
              foundS[i].check_out_date,
              foundS[i].check_in_date
            );
            obj["name"] = name["first_name"] + " " + name["last_name"];
            obj["customer"] = foundC.company_name;
            obj["site"] = foundF.name;
            obj["guard_charge"] = "$" + guard_charge;
            obj["guard_id"] = foundS[i].guard_id;
            obj["client_charge"] = "$" + client_charge;
            obj["job_status"] = foundJ.job_status;
            obj["description"] = foundJ.description;
            obj["settlement_status"] = foundS[i].settlement_status;

            if (foundJL) {
              if (foundJL.check_out_status == true) {
                obj["check_in"] = await this.getDateAndTime(
                  foundJL.check_in_date
                );
                obj["check_out"] = await this.getDateAndTime(
                  foundJL.check_out_date
                );
                obj["hours_worked"] = foundJL.hours_worked;
                obj["earned"] =
                  "$" + (foundJL.hours_worked * foundJ.staff_charge).toFixed(2);
              } else {
                obj["check_in"] = await this.getDateAndTime(
                  foundJL.check_in_date
                );
                obj["check_out"] = "None";
                obj["hours_worked"] = 0.0;
                obj["earned"] = "$0.00";
              }
            } else {
              obj["check_in"] = "None";
              obj["check_out"] = "None";
              obj["hours_worked"] = 0.0;
              obj["earned"] = "$0.00";
            }

            all_shift.push(obj);
          }
        }

        if (i == foundS.length - 1) {
          return all_shift;
        }
      }
    } else {
      return [];
    }
  }

  async getGeneralShift(obj) {
    const foundS = await this.ScheduleModel.findAll({
      where: { status_per_staff: { [Op.ne]: "DECLINE" } },
      order: [["created_at", "DESC"]],
    });

    let all_shift = [];
    if (foundS.length != 0) {
      for (let i = 0; i < foundS.length; i++) {
        let obj = {};
        const foundJ = await this.JobModel.findOne({
          where: { id: foundS[i].job_id },
        });

        const foundF = await this.FacilityModel.findOne({
          where: { id: foundJ.facility_id },
        });

        const foundC = await this.CustomerModel.findOne({
          where: { id: foundJ.customer_id },
        });

        const foundJL = await this.JobLogsModel.findOne({
          where: {
            [Op.and]: [
              { schedule_id: foundS[i].id },
              { job_id: foundS[i].job_id },
              { job_id: foundS[i].job_id },
              { check_in_status: true },
            ],
          },
        });

        let name = await this.getSingleGuardDetail(foundS[i].guard_id);
        let guard_charge = Number(foundJ.staff_charge).toFixed(2);
        let client_charge = Number(foundJ.client_charge).toFixed(2);

        obj["start_date"] = await this.getDateOnly(foundS[i].check_in_date);
        obj["end_date"] = await this.getDateOnly(foundS[i].check_out_date);
        obj["start_time"] = foundS[i].start_time;
        obj["end_time"] = foundS[i].end_time;
        obj["hours"] = await this.calculateHoursSetToWork(
          foundS[i].check_out_date,
          foundS[i].check_in_date
        );
        obj["name"] = name["first_name"] + " " + name["last_name"];
        obj["customer"] = foundC.company_name;
        obj["site"] = foundF.name;
        obj["guard_charge"] = "$" + guard_charge;
        obj["guard_id"] = foundS[i].guard_id;
        obj["client_charge"] = "$" + client_charge;
        obj["job_status"] = foundJ.job_status;
        obj["description"] = foundJ.description;
        obj["settlement_status"] = foundS[i].settlement_status;

        if (foundJL) {
          if (foundJL.check_out_status == true) {
            obj["check_in"] = await this.getDateAndTime(foundJL.check_in_date);
            obj["check_out"] = await this.getDateAndTime(
              foundJL.check_out_date
            );
            obj["hours_worked"] = foundJL.hours_worked;
            obj["earned"] =
              "$" + (foundJL.hours_worked * foundJ.staff_charge).toFixed(2);
          } else {
            obj["check_in"] = await this.getDateAndTime(foundJL.check_in_date);
            obj["check_out"] = "None";
            obj["hours_worked"] = 0.0;
            obj["earned"] = "$0.00";
          }
        } else {
          obj["check_in"] = "None";
          obj["check_out"] = "None";
          obj["hours_worked"] = 0.0;
          obj["earned"] = "$0.00";
        }

        all_shift.push(obj);

        if (i == foundS.length - 1) {
          return all_shift;
        }
      }
    } else {
      return [];
    }
  }

  async submitReportAndAttachment(
    id: number,
    data: any,
    file?: Express.Multer.File
  ): Promise<JobReports> {
    const data2 = await jobUtil.verifySubmitReportAndAttachment.validateAsync(
      data
    );

    try {
      let foundJ = await this.JobModel.findOne({
        where: { id: data2.job_id },
      });

      let dateStamp = await this.getDateAndTimeForStamp(foundJ.time_zone);

      if (data2.report_type == "MESSAGE") {
        let createdRes = await this.JobReportsModel.create({
          job_id: data2.job_id,
          guard_id: data2.guard_id,
          report_type: data2.report_type,
          message: data2.message,
          is_emergency: data2.is_emergency,
          is_read: data2.is_read,
          who_has_it: data2.who_has_it,
          created_at: dateStamp,
          updated_at: dateStamp,
        });
        return createdRes;
      } else {
        //let accessPath=serverConfig.DOMAIN +file.path.replace("public", "")
        let accessPath =
          serverConfig.DOMAIN +
          file.path.replace("/home/fbyteamschedule/public_html", "");

        let createdRes = await this.JobReportsModel.create({
          job_id: data2.job_id,
          guard_id: data2.guard_id,
          report_type: data2.report_type,
          file_url: accessPath,
          is_emergency: data2.is_emergency,
          is_read: data2.is_read,
          message: data2.message,
          who_has_it: data2.who_has_it,
          mime_type: file.mimetype,
          created_at: dateStamp,
          updated_at: dateStamp,
        });

        return createdRes;
      }
    } catch (error) {
      console.log(error);
      throw new SystemError(error.toString());
    }
  }

  async getOneAgendaPerGuard(obj) {
    var { job_id, guard_id, type } =
      await jobUtil.verifyGetOneAgendaPerGuard.validateAsync(obj);

    try {
      if (type == "INSTRUCTION") {
        const foundI = await this.AgendasModel.findAll({
          where: {
            [Op.and]: [
              { agenda_type: "INSTRUCTION" },
              { guard_id },
              { job_id },
            ],
          },
          order: [["operation_date", "ASC"]],
        });

        let Instruction = [];
        if (foundI.length != 0) {
          for (let k = 0; k < foundI.length; k++) {
            let obj = {};
            obj["agenda_id"] = foundI[k].id;
            obj["guard_id"] = guard_id;
            obj["job_id"] = job_id;
            obj["title"] = foundI[k].title;
            obj["description"] = foundI[k].description;
            obj["operation_date"] = moment(foundI[k].operation_date).format(
              "YYYY-MM-DD hh:mm:ss a"
            );
            obj["agenda_done"] = foundI[k].agenda_done;
            obj["time"] = moment(foundI[k].operation_date).format("hh:mm:ss a");
            obj["scanned_at"] = foundI[k].agenda_done
              ? moment(foundI[k].updated_at).format("YYYY-MM-DD hh:mm:ss a")
              : "None";

            Instruction.push(obj);

            if (k == foundI.length - 1) {
              return Instruction;
            }
          }
        } else {
          return Instruction;
        }
      } else {
        const foundT = await this.AgendasModel.findAll({
          where: {
            [Op.and]: [{ agenda_type: "TASK" }, { guard_id }, { job_id }],
          },
          order: [["operation_date", "ASC"]],
        });

        let Task = [];

        if (foundT.length != 0) {
          for (let l = 0; l < foundT.length; l++) {
            let obj = {};
            obj["agenda_id"] = foundT[l].id;
            obj["guard_id"] = guard_id;
            obj["job_id"] = job_id;
            obj["title"] = "Task";
            obj["description"] = foundT[l].description;
            obj["operation_date"] = moment(foundT[l].operation_date).format(
              "YYYY-MM-DD"
            );
            obj["agenda_done"] = foundT[l].agenda_done;
            obj["done_at"] = foundT[l].agenda_done
              ? moment(foundT[l].updated_at).format("YYYY-MM-DD hh:mm:ss a")
              : "None";

            Task.push(obj);
            if (l == foundT.length - 1) {
              return Task;
            }
          }
        } else {
          return Task;
        }
      }
    } catch (error) {
      console.log(error.parent);

      throw error;
    }
  }

  async getOneShedulePerGuard(obj) {
    var { job_id, guard_id } =
      await jobUtil.verifyGetOneShedulePerGuard.validateAsync(obj);

    const foundS = await this.ScheduleModel.findAll({
      where: {
        [Op.and]: [{ job_id }, { guard_id }],
      },
      order: [
        ["check_in_date", "ASC"],
        ["check_out_date", "ASC"],
      ],
    });

    let all_shedule = [];
    if (foundS.length != 0) {
      for (let i = 0; i < foundS.length; i++) {
        let obj = {
          check_in_date: await this.getDateOnly(foundS[i].check_in_date),
          start_time: foundS[i].start_time,
          check_out_date: await this.getDateOnly(foundS[i].check_out_date),
          end_time: foundS[i].end_time,
          hours: (await this.calculateHoursSetToWork(foundS[i].check_out_date,foundS[i].check_in_date
            )
          ).toFixed(2),
          guard_id: foundS[i].guard_id,
          schedule_id: foundS[i].id,
          schedule_accepted_by_admin: foundS[i].schedule_accepted_by_admin,
          job_id: foundS[i].job_id,
          is_started:await this.checkIfShiftHasStarted(foundS[i].job_id,foundS[i].check_in_date)

        };
        all_shedule.push(obj);

        if (i == foundS.length - 1) {
          let allScheduleStarted=await this.checkIfAllShiftHasStarted(all_shedule)
          all_shedule.forEach(function(obj){
                  obj.is_started_all=allScheduleStarted
                })
        
          return  all_shedule  
        }
      }
    } else {
      return [];
    }
  }

  async getSingleReportGuard(obj) {
    var { job_id, guard_id } =
      await jobUtil.verifyGetSingleReportGuard.validateAsync(obj);

    let myReport = [];

    let foundJR = await this.JobReportsModel.findAll({
      where: {
        [Op.and]: [{ job_id }, { guard_id }],
      },
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
        obj["created_at"] = await this.getDateAndTime(foundJR[i].created_at);
        obj["report_id"] = foundJR[i].id;

        myReport.push(obj);
        if (i == foundJR.length - 1) {
          return myReport;
        }
      }
    } else {
      return myReport;
    }
  }

  async getSecurityCodePerJob(obj) {
    var { job_id } = await jobUtil.verifygetGetSecurityCodePerJob.validateAsync(
      obj
    );

    let foundJC = await this.JobSecurityCodeModel.findAll({
      where: {
        job_id,
      },
      attributes: ["job_id", "security_code"],
      group: ["job_id", "security_code"],
    });

    let detail = [];

    if (foundJC.length != 0) {
      for (let i = 0; i < foundJC.length; i++) {
        let foundJC2 = await this.JobSecurityCodeModel.findOne({
          where: {
            security_code: foundJC[i].security_code,
          },
        });

        let foundA = await this.AgendasModel.findOne({
          where: {
            id: foundJC2.agenda_id,
          },
        });

        let foundJSC = await this.JobSecurityCodeModel.findAll({
          where: {
            security_code: foundJC[i].security_code,
          },
        });

        let guard_image = [];
        for (let k = 0; k < foundJSC.length; k++) {
          let foundU = await this.UserModel.findOne({
            where: {
              id: foundJSC[k].guard_id,
            },
          });
          guard_image.push(foundU.image);
        }

        let obj = {
          job_id: foundJC[i].job_id,
          security_code: foundJC[i].security_code,
          agenda_id: foundJC[i].agenda_id,
          image: guard_image,
          message: foundA.description,
          operation_date: await this.getDateAndTime(foundA.operation_date),
        };

        detail.push(obj);
        if (i == foundJC.length - 1) {
          return detail;
        }
      }
    } else {
      return detail;
    }
  }

  async getGuardIdFromJob(obj) {
    var { jobs_id } = await jobUtil.verifyGetGuardIdFromJob.validateAsync(obj);

    let guards_id = [];

    for (let i = 0; i < jobs_id.length; i++) {
      guards_id = [...guards_id, ...(await this.getGuardIdArray(jobs_id[i]))];

      if (i == jobs_id.length - 1) {
        return await this.removeDuplicateID(guards_id);
      }
    }
  }

  async getGuardPerJob(data) {
    var { job_id } = await jobUtil.verifygetGuardPerJob.validateAsync(data);

    const foundS = await this.ScheduleModel.findAll({
      where: { job_id },
    });

    let all_guard_id = [];

    if (foundS.length != 0) {
      let obj = {};

      for (let i = 0; i < foundS.length; i++) {
        if (all_guard_id.includes(foundS[i].guard_id)) {
          //continue
        } else {
          all_guard_id.push(foundS[i].guard_id);
        }
        if (i == foundS.length - 1) {
          let foundG = await this.getMultipleGuardDetail(all_guard_id, job_id);
          let job = await this.getJobDetail(job_id);
          let site = await this.getSiteDetail(job.facility_id);

          let detail = {
            guard: foundG,
            job,
            site,
          };
          return detail;
        }
      }
    } else {
      let job = await this.getJobDetail(job_id);
      let site = await this.getSiteDetail(job.facility_id);

      let detail = {
        guard: [],
        job,
        site,
      };

      return detail;
    }
  }

  async getDeclinedJob() {
    let foundS = await this.ScheduleModel.findAll({
      where: {
        status_per_staff: "DECLINE",
      },
      attributes: ["job_id", "guard_id"],
      group: ["job_id", "guard_id"],
    });

    let decline = [];

    if (foundS.length != 0) {
      for (let i = 0; i < foundS.length; i++) {
        let obj = {};

        let guardName = await this.getSingleGuardDetail(foundS[i].guard_id);

        let foundJ = await this.JobModel.findOne({
          where: {
            id: foundS[i].job_id,
          },
        });

        let customerF = await this.getCustomerDetail(foundJ.customer_id);
        let facilityF = await this.getSiteDetail(foundJ.facility_id);

        obj["date"] = await this.getDateOnly(foundJ.created_at);
        obj["Name"] = guardName["first_name"] + " " + guardName["last_name"];
        obj["Phone_number"] = guardName["phone_number"];
        obj["customer_name"] =
          customerF["first_name"] + " " + customerF["last_name"];
        obj["facility_name"] = facilityF["name"];
        obj["job_id"] = foundS[i].job_id;
        obj["guard_id"] = foundS[i].guard_id;

        decline.push(obj);

        if (i == foundS.length - 1) {
          return decline;
        }
      }
    } else {
      return decline;
    }
  }
  async  getFreeGuard(obj) {

    let arrayId=[]
    let detail=[]
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

          if(arrayId.includes(foundG[j].id)||await this.checkIfGuardIsInAnyActiveJob2(foundG[j].id,obj.job_id)){

          }
          else{
            arrayId.push(foundG[j].id)
          }
          
          if(j==foundG.length-1){
            
            if(arrayId.length!=0){
              for(let i=0;i<arrayId.length;i++){
                let obj2={}
              
                let name =await this.getSingleGuardDetail(arrayId[i])
      
                obj2["guard_id"]=arrayId[i]
                obj2["full_name"]=name["first_name"]+" "+name["last_name"]
                detail.push(obj2)
      
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
            let obj2={}
          
            let name =await this.getSingleGuardDetail(arrayId[i])
  
            obj2["guard_id"]=arrayId[i]
            obj2["full_name"]=name["first_name"]+" "+name["last_name"]
            detail.push(obj2)
  
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

  async  rescheduleAndRemoveGuard(data: any): Promise<any> {
    try {
      const {
        job_id,
        my_time_zone,
        array_guard_id,
        old_guard_id
      } = await jobUtil.verifyRescheduleAndRemoveGuard.validateAsync(data);


      let dateStamp=await this.getDateAndTimeForStamp(my_time_zone)

      for (let i = 0; i < array_guard_id.length; i++) {

              await  this.ScheduleModel.findAll({
                  where: {[Op.and]:[ 
                    { job_id},
                    {guard_id:old_guard_id}
                    ]}

              }).then(existingRecord => {
                if(existingRecord.length!==0){


                  existingRecord.map(existingId => {
                      this.ScheduleModel.findOne({where: {id:existingId.id },
                  attributes: ['start_time', 'settlement_status'
                  , 'end_time', 
                  'status_per_staff', 'check_in_date', 
                  'check_out_date', 'job_id', 'created_by_id',
                   'guard_id', 'schedule_accepted_by_admin',
                    'created_at', 'updated_at']
                      }).then(existingRecord => {
                      // Create a new object with the updated parameter
                      const newRecord = { ...existingRecord.dataValues, created_at:dateStamp,
                        updated_at:dateStamp,guard_id:array_guard_id[i],status_per_staff:'PENDING'};
                      // Use the create method to create a new record in the table
                        this.ScheduleModel.create(newRecord)
                    });
                  });

  

                }
              })


              await  this.AgendasModel.findAll({
                where: {[Op.and]:[ 
                  { job_id},
                  {guard_id:old_guard_id}
                  ]}
              }).then(existingRecord => {
              if(existingRecord.length!==0){
             
                existingRecord.map(existingId => {
                  this.AgendasModel.findOne({where: {id:existingId.id } ,
                  attributes: ['title', 'description'
                  , 'job_id', 
                  'guard_id', 'created_by_id','date_schedule_id', 
                  'agenda_type', 'status_per_staff', 'operation_date',
                   'agenda_done', 'coordinates_id',
                    'created_at', 'updated_at']
                  }).then(existingRecord => {
                  // Create a new object with the updated parameter
                  const newRecord = { ...existingRecord.dataValues, created_at:dateStamp,
                    updated_at:dateStamp,guard_id:array_guard_id[i]};
                  // Use the create method to create a new record in the table
                    this.AgendasModel.create(newRecord);
                });
              })




              }
            })

            await  this.JobSecurityCodeModel.findAll({
              where: {[Op.and]:[ 
                { job_id},
                {guard_id:old_guard_id}
                ]}
            }).then(existingRecord => {
            if(existingRecord.length!==0){

              existingRecord.map(existingId => {
                this.JobSecurityCodeModel.findOne({where: {id:existingId.id }
                  ,
                  attributes: ['agenda_id', 'guard_id'
                  , 'job_id', 
                  'security_code',
                    'created_at', 'updated_at']
                }).then(existingRecord => {
                // Create a new object with the updated parameter
                const newRecord = { ...existingRecord.dataValues, created_at:dateStamp,
                  updated_at:dateStamp,guard_id:array_guard_id[i]};
                // Use the create method to create a new record in the table
                  this.JobSecurityCodeModel.create(newRecord);
              });
            })

            }
            })
            if(i==array_guard_id.length-1){


              await  this.ScheduleModel.destroy({
                where: {[Op.and]:[ 
                  { job_id},
                  {guard_id:old_guard_id}
                  ]}
              })
             
            await  this.AgendasModel.destroy({
              where: {[Op.and]:[ 
                { job_id},
                {guard_id:old_guard_id}
                ]}
            })

            await  this.JobSecurityCodeModel.destroy({
              where: {[Op.and]:[ 
                { job_id},
                {guard_id:old_guard_id}
                ]}
            })

          }
      }

      
    } catch (error) {
      console.log(error);
      throw new SystemError(error.toString());
    }
  }
  async getDashBoardInfoGuard(req) {
    let foundS = await this.ScheduleModel.findAll({
      where: { guard_id: req.user.id },
      attributes: ["job_id", "guard_id", "status_per_staff"],
      group: ["job_id", "guard_id", "status_per_staff"],
    });
    let active = 0;
    let completed = 0;
    let pending = 0;
    let obj = {};

    if (foundS.length != 0) {
      for (let i = 0; i < foundS.length; i++) {
        console.log(foundS);
        console.log(foundS.length);

        console.log("my schedules my schedules");

        let foundJ = await this.JobModel.findOne({
          where: { id: foundS[i].job_id },
        });

        console.log(foundJ.job_status);
        console.log(foundS[i].status_per_staff);
        console.log("foundS[i].status_per_staff");

        if (
          foundJ.job_status == "ACTIVE" &&
          foundS[i].status_per_staff == "ACTIVE"
        ) {
          active++;
        } else if (
          foundJ.job_status == "COMPLETED" &&
          foundS[i].status_per_staff == "ACTIVE"
        ) {
          completed++;
        } else if (
          foundJ.job_status == "ACTIVE" &&
          foundS[i].status_per_staff == "PENDING"
        ) {
          pending++;
        }

        if (i == foundS.length - 1) {
          obj["active"] = active;
          obj["completed"] = completed;
          obj["pending"] = pending;

          return obj;
        }
      }
    } else {
      obj["active"] = active;
      obj["completed"] = completed;
      obj["pending"] = pending;

      return obj;
    }
  }

  async getDashBoardInfo(obj) {
    try {
      let foundC = await this.CustomerModel.findAll();
      let foundG = await this.UserModel.findAll({
        where: {
          role: "GUARD",
        },
      });
  
      let foundA = await this.UserModel.findAll({
        where: {
          role: "ADMIN",
        },
      });
      let foundJ = await this.JobModel.findAll({
        where: {
          job_status: "ACTIVE",
        },
      });
      
      obj = {
        noCustomer: foundC.length,
        noStaff: foundA.length,
        noGuard: foundG.length,
        noActive: foundJ.length,
      };
  
      return obj;
    } catch (error) {
        console.log(error)
    }
  }

  async getAllSite(obj) {
    let foundF = await this.FacilityModel.findAll();

    let availabLeGuard = [];
    if (foundF.length != 0) {
      for (let i = 0; i < foundF.length; i++) {
        let obj = {};


        let myCustomer=await this.getCustomerName(foundF[i].customer_id)

        obj["name"] = foundF[i].name;
        obj["site_id"] = foundF[i].id;
        obj["customer_name"] = myCustomer.company_name;


        availabLeGuard.push(obj);

        if (i == foundF.length - 1) {
          return availabLeGuard;
        }
      }
    } else {
      return [];
    }
  }

  async getAllGuard(obj) {
    let foundG = await this.UserModel.findAll({
      where: {
        role: "GUARD",
      },
    });

    let availabLeGuard = [];
    if (foundG.length != 0) {
      for (let i = 0; i < foundG.length; i++) {
        let obj = {};
        obj["name"] = foundG[i].first_name + " " + foundG[i].last_name;
        obj["guard"] = foundG[i].id;

          console.log(foundG[i].suspended)
        if(foundG[i].suspended){
          obj["suspension_status"] ="Suspended";

        }else{
          obj["suspension_status"] = "";
        }


        availabLeGuard.push(obj);

        if (i == foundG.length - 1) {
          return availabLeGuard;
        }
      }
    } else {
      return [];
    }
  }

  async getGuard(obj) {
    let arrayId = [];
    let detail = [];
    let foundG = await this.UserModel.findAll({
      where: {
        [Op.and]: [
          { availability: true },
          { suspended: false },
          { role: "GUARD" },
        ],
      },
    });

    if (foundG.length != 0) {
      for (let j = 0; j < foundG.length; j++) {
        if (
          arrayId.includes(foundG[j].id) ||
          (await this.checkIfGuardIsInAnyActiveJob(foundG[j].id, obj.job_id))
        ) {
        } else {
          arrayId.push(foundG[j].id);
        }

        if (j == foundG.length - 1) {
          if (arrayId.length != 0) {
            for (let i = 0; i < arrayId.length; i++) {
              let obj = {};

              let name = await this.getSingleGuardDetail(arrayId[i]);

              obj["guard_id"] = arrayId[i];
              obj["full_name"] = name["first_name"] + " " + name["last_name"];
              detail.push(obj);

              if (i == arrayId.length - 1) {
                return detail;
              }
            }
          } else {
            return detail;
          }
        }
      }
    } else {
      if (arrayId.length != 0) {
        for (let i = 0; i < arrayId.length; i++) {
          let obj = {};

          let name = await this.getSingleGuardDetail(arrayId[i]);

          obj["guard_id"] = arrayId[i];
          obj["full_name"] = name["first_name"] + " " + name["last_name"];
          detail.push(obj);

          if (i == arrayId.length - 1) {
            return detail;
          }
        }
      } else {
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
  }

  async getGeneralUnsettleShift(obj) {
    let foundS = await this.ScheduleModel.findAll({
      limit: obj.limit,
      offset: obj.offset,
      where: {
        [Op.and]: [
          { settlement_status: obj.settlement },
          { schedule_accepted_by_admin: true },
        ],
      },
    });

    let unSettledSucessfullShift = [];
    if (foundS.length != 0) {
      for (let i = 0; i < foundS.length; i++) {
        let obj = {};
        //JUST FOR GETTING THE CHARGE PER JOB
        let foundJ = await this.JobModel.findOne({
          where: { id: foundS[i].job_id },
        });

        let foundJL = await this.JobLogsModel.findOne({
          where: {
            [Op.and]: [
              { check_in_status: true },
              { schedule_id: foundS[i].id },
              { check_out_status: true },
            ],
          },
        });

        if (foundJL) {
          let my_guard_info = await this.getSingleGuardDetail(
            foundS[i].guard_id
          );
          let myAmount = foundJL.hours_worked * foundJ.staff_charge;

          obj["hours_worked"] = foundJL.hours_worked;
          obj["amount"] = myAmount;
          obj["first_name"] = my_guard_info["first_name"];
          obj["last_name"] = my_guard_info["last_name"];
          obj["id"] = foundS[i].guard_id;
          obj["foundJL_id"] = foundJL.id;
          obj["shedule_id"] = foundS[i].id;

          unSettledSucessfullShift.push(obj);
        } else {
          //continue;
        }

        if (i == foundS.length - 1) {
          if (unSettledSucessfullShift.length == 0) {
            return unSettledSucessfullShift;
          } else {
            return await this.combineUnsettleShift(unSettledSucessfullShift);
          }
        }
      }
    } else {
      return unSettledSucessfullShift;
    }
  }

  async performSecurityCheck(obj) {
    var { job_id, guard_id, longitude, latitude, my_time_zone } =
      await jobUtil.verifyPerformSecurityCheck.validateAsync(obj);

    const foundItemJob = await this.JobModel.findOne({ where: { id: job_id } });

    const foundItemFac = await this.FacilityModel.findOne({
      where: { id: foundItemJob.facility_id },
    });

    const foundItemFacLo = await this.FacilityLocationModel.findOne({
      where: { id: foundItemFac.facility_location_id },
    });

    const foundItemCoor = await this.CoordinatesModel.findOne({
      where: { id: foundItemFacLo.coordinates_id },
    });

    let objLatLog = {
      latitude: foundItemCoor.latitude,
      longitude: foundItemCoor.longitude,
      radius: foundItemFacLo.operations_area_constraint,
    };

    let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);

    const createdC = await this.CoordinatesModel.create({
      longitude,
      latitude,
      created_at: dateStamp,
      updated_at: dateStamp,
    });

    if (this.isInlocation(latitude, longitude, objLatLog)) {
      let obj = {
        job_id,
        guard_id,
        coordinates_id: createdC.id,
        status: true,
        created_at: dateStamp,
        updated_at: dateStamp,
      };

      await this.SecurityCheckLogModel.create(obj);
    } else {
      let obj = {
        job_id,
        guard_id,
        coordinates_id: createdC.id,
        status: false,
        created_at: dateStamp,
        updated_at: dateStamp,
      };
      await this.SecurityCheckLogModel.create(obj);

      throw new LocationError("You are not in location");
    }
  }

  async checkPositionQRcode(obj) {
    var { job_id, longitude, latitude, my_time_zone } =
      await jobUtil.verifyCheckPositionQRcode.validateAsync(obj);

    const foundItemJob = await this.JobModel.findOne({ where: { id: job_id } });

    const foundItemFac = await this.FacilityModel.findOne({
      where: { id: foundItemJob.facility_id },
    });

    const foundItemFacLo = await this.FacilityLocationModel.findOne({
      where: { id: foundItemFac.facility_location_id },
    });

    const foundItemCoor = await this.CoordinatesModel.findOne({
      where: { id: foundItemFacLo.coordinates_id },
    });

    let objLatLog = {
      latitude: foundItemCoor.latitude,
      longitude: foundItemCoor.longitude,
      radius: foundItemFacLo.operations_area_constraint,
    };

    if (this.isInlocation(latitude, longitude, objLatLog)) {
    } else {
      throw new LocationError("You are not in location");
    }
  }

  async deleteAgenda(obj) {
    try {
      var { agenda_id, longitude, latitude, my_time_zone } =
        await jobUtil.verifyDeleteAgenda.validateAsync(obj);

      const foundA = await this.AgendasModel.findOne({
        where: { id: agenda_id },
      });

      if (foundA) {
        if (foundA.agenda_type == "INSTRUCTION") {
          const record = await this.JobSecurityCodeModel.findOne({
            where: { agenda_id: foundA.id },
          });
          if (record) {
            await this.JobSecurityDeletedModel.create(record.dataValues);
          }
          await this.JobSecurityCodeModel.destroy({
            where: { agenda_id: foundA.id },
          });

          await this.AgendasDeletedModel.create(foundA.dataValues);

          await this.AgendasModel.destroy({
            where: { id: agenda_id },
          });
        } else {
          await this.AgendasDeletedModel.create(foundA.dataValues);
          await this.AgendasModel.destroy({
            where: { id: agenda_id },
          });
        }
      } else {
        throw new SecurityCodeVerificationError(
          "No Instruction or Task was found"
        );
      }
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async checkTaskGuard(obj) {
    var { agenda_id, longitude, latitude, my_time_zone } =
      await jobUtil.verifyCheckTaskGuard.validateAsync(obj);

    const foundA = await this.AgendasModel.findOne({
      where: { id: agenda_id },
    });

    if (foundA) {
      const foundJ2 = await this.JobModel.findOne({
        where: { id: foundA.job_id },
      });

      let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);
      let currentTimeOfFacility = moment(
        new Date(
          new Date().toLocaleString("en", { timeZone: foundJ2.time_zone })
        ),
        "YYYY-MM-DD"
      );
      let operation_date = moment(
        new Date(foundA.operation_date),
        "YYYY-MM-DD"
      );
      if (currentTimeOfFacility.isSameOrAfter(operation_date)) {
        const createdC = await this.CoordinatesModel.create({
          longitude,
          latitude,
          created_at: dateStamp,
          updated_at: dateStamp,
        });

        let obj = {
          agenda_done: !foundA.agenda_done,
          coordinates_id: createdC.id,
          updated_at: dateStamp,
        };

        await this.AgendasModel.update(obj, {
          where: { id: agenda_id },
        });
      } else {
        throw new SecurityCodeVerificationError("not yet time");
      }
    } else {
      throw new SecurityCodeVerificationError("no schedule task found");
    }
  }

  async getAllJobsdoneByGaurd(data: any) {
    try {
      var { guard_id } = await jobUtil.verifyAllJobsdoneByGaurd.validateAsync(data);
      const returned_data = await this.ScheduleModel.sequelize.query(`SELECT DISTINCT customers.company_name, guard_id, job_id,
       customers.id as customer_id  FROM schedule INNER JOIN jobs
      ON schedule.job_id = jobs.id INNER JOIN customers ON jobs.customer_id = customers.id
      WHERE schedule.guard_id = ${guard_id}
      `)
      // const returned_dat =   await this.ScheduleModel.findAll({
      //   include:[
      //     {
      //       model: this.JobModel,
      //       as: "job",
      //       attributes: ["id"],
      //       include: [
      //         {
      //           model: this.CustomerModel,
      //           as: 'customer',
      //           attributes: ["id", [Sequelize.fn('DISTINCT', Sequelize.col('job.customer.company_name')) ,'company_name']]
                
      //         }
      //       ]
      //     }
      //   ],
      //   attributes: ["guard_id"],
      //   where: {guard_id:guard_id}
      // })
      return returned_data[0]
    } catch (error) {
      throw new SystemError(error)
    }
  }

  async getAllSiteWorkByGaurdForCompany(data: any) {
    try {
      var { job_id } = await jobUtil.getAllSiteWorkByGaurdForCompany.validateAsync(data);

      const returned_data = await this.ScheduleModel.sequelize.query(`SELECT facility.name, jobs.id as job_id FROM jobs INNER JOIN facility
      ON jobs.facility_id = facility.id
      WHERE jobs.id = ${job_id}
      `)
      return returned_data[0]
    } catch (error) {
      throw new SystemError(error)
    }
  }

  async getJobDetails(data: any) {
    try {
      var { job_id } = await jobUtil.getJobDetails.validateAsync(data);

      const returned_data = await (await this.JobModel.findOne({ where: { id: job_id } })).dataValues
      return returned_data
    } catch (error) {
      throw new SystemError(error)
    }
  }
  async verifySecurityCode(obj) {
    var { job_id, guard_id, security_code, longitude, latitude, my_time_zone } =
      await jobUtil.verifyVerifySecurityCode.validateAsync(obj);

    const foundSC = await this.JobSecurityCodeModel.findOne({
      where: {
        [Op.and]: [{ job_id }, { guard_id }, { security_code }],
      },
    });

    if (foundSC) {
      const foundA = await this.AgendasModel.findOne({
        where: { id: foundSC.agenda_id },
      });

      if (foundA.agenda_done) {
        const foundJ = await this.JobModel.findOne({
          where: { id: job_id },
        });

        const foundItemFac = await this.FacilityModel.findOne({
          where: { id: foundJ.facility_id },
        });

        const foundItemFacLo = await this.FacilityLocationModel.findOne({
          where: { id: foundItemFac.facility_location_id },
        });
        const foundItemCoor = await this.CoordinatesModel.findOne({
          where: { id: foundItemFacLo.coordinates_id },
        });

        let objLatLog = {
          latitude: foundItemCoor.latitude,
          longitude: foundItemCoor.longitude,
          radius: foundItemFacLo.operations_area_constraint,
        };
        if (this.isInlocation(latitude, longitude, objLatLog)) {
          throw new SecurityCodeVerificationError("QR code has been scan");
        } else {
          throw new SecurityCodeVerificationError("you are not in location");
        }
      } else {
        const foundJ2 = await this.JobModel.findOne({
          where: { id: foundA.job_id },
        });

        let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);
        let currentTimeOfFacility = moment(
          new Date(
            new Date().toLocaleString("en", { timeZone: foundJ2.time_zone })
          )
        );
        let operation_date = moment(new Date(foundA.operation_date));
        if (currentTimeOfFacility.isSameOrAfter(operation_date)) {
          const createdC = await this.CoordinatesModel.create({
            longitude,
            latitude,
            created_at: dateStamp,
            updated_at: dateStamp,
          });

          let obj = {
            agenda_done: true,
            coordinates_id: createdC.id,
            updated_at: dateStamp,
          };

          await this.AgendasModel.update(obj, {
            where: { id: foundSC.agenda_id },
          });
        } else {
          throw new SecurityCodeVerificationError("not yet time");
        }
      }
    } else {
      throw new SecurityCodeVerificationError("no security code found");
    }
  }

  async settleShift(obj) {
    var { schedule_id } = await jobUtil.verifySettleShift.validateAsync(obj);

    for (let i = 0; i < schedule_id.length; i++) {
      let foundS = await this.ScheduleModel.findOne({
        where: { id: schedule_id[i] },
      });

      await this.ScheduleModel.update(
        { settlement_status: !foundS.settlement_status },
        {
          where: { id: schedule_id[i] },
        }
      );
    }
  }

  async updateJobStatus(obj) {
    var { job_id, status_value } =
      await jobUtil.verifyUpdateJobStatus.validateAsync(obj);

    await this.JobModel.update(
      { job_status: status_value },
      {
        where: { id: job_id },
      }
    );
  }

  async RemoveGuardSheduleLog(obj) {
    try {
      var { log_id } = await jobUtil.verifyRemoveGuardSheduleLog.validateAsync(
        obj
      );
      const record = await this.JobLogsModel.findOne({
        where: {
          id: log_id,
        },
      });
      if (record) {
        await this.JobLogsDeletedModel.create(record.dataValues);
      }

      const item1 = await this.JobLogsModel.destroy({
        where: { id: log_id },
      });
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async RemoveGuardSingleShedule(obj) {
    try {
      var { schedule_id, guard_id } =
        await jobUtil.verifyRemoveGuardSingleShedule.validateAsync(obj);

      let foundA = await this.AgendasModel.findOne({
        where: {
          [Op.and]: [{ guard_id }, { date_schedule_id: schedule_id }],
        },
      });

      if (foundA) {
        await this.AgendasModel.destroy({
          where: {
            [Op.and]: [{ guard_id }, { date_schedule_id: schedule_id }],
          },
        });
        await this.AgendasDeletedModel.create(foundA.dataValues);
      }

      const record = await this.ScheduleModel.findOne({
        where: {
          [Op.and]: [{ guard_id }, { id: schedule_id }],
        },
      });
      if (record) {
        const deleted_faclilty = await this.ScheduleDeletedModel.create(record.dataValues);
      }

      await this.ScheduleModel.destroy({
        where: {
          [Op.and]: [{ guard_id }, { id: schedule_id }],
        },
      });
    } catch (error) {
      {
        throw new SystemError(error.toString());
      }
    }
  }
  async RemoveGuardShedule(obj) {
    try {
      var { job_id, guard_id } =
        await jobUtil.verifyRemoveGuardShedule.validateAsync(obj);

      const foundA = await this.AgendasModel.findOne({
        where: {
          [Op.and]: [{ job_id }, { guard_id }],
        },
      });

      if (foundA) {
        await this.AgendasModel.destroy({
          where: {
            [Op.and]: [{ job_id }, { guard_id }],
          },
        });
        await this.AgendasDeletedModel.create(foundA.dataValues);
      }

      try {
        const record = await this.ScheduleModel.findOne({
          where: {
            [Op.and]: [{ job_id }, { guard_id }],
          },
        });
        if (record) {
          await this.ScheduleDeletedModel.create(record.dataValues);
        }
      } catch (error) {
        {
          throw new SystemError(error.toString());
        }
      }
      const item1 = await this.ScheduleModel.destroy({
        where: {
          [Op.and]: [{ job_id }, { guard_id }],
        },
      });
    } catch (err) {
      throw new NotFoundError(err);
    }
  }

  async checkInCheckOutAdmin(obj) {
    var {
      schedule_id,
      check_in,
      latitude,
      longitude,
      job_id,
      date,
      my_time_zone,
      guard_id,
    } = await jobUtil.verifyCheckInCheckOutAdmin.validateAsync(obj);

    latitude = latitude.toFixed(5);
    longitude = longitude.toFixed(5);
    let time = moment(date).format("hh:mm:ss a");
    let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);

    const foundItemS = await this.ScheduleModel.findOne({
      where: { id: schedule_id },
    });

    if (foundItemS) {
      const foundItemJL = await this.JobLogsModel.findOne({
        where: {
          [Op.and]: [
            { project_check_in_date: { [Op.eq]: foundItemS.check_in_date } },
            { job_id },
            { guard_id },
            { check_in_status: true },
          ],
        },
      });
      if (foundItemJL) {
        if (check_in) {
          const foundItemS2 = await this.ScheduleModel.findOne({
            where: {
              [Op.and]: [
                { check_in_date: { [Op.lte]: date } },
                { check_out_date: { [Op.gt]: date } },
                { id: schedule_id },
              ],
            },
          });

          if (foundItemS2) {
            if (await this.isBefore(date, foundItemJL.check_out_date)) {
              let obj = {
                check_in_time: time,
                check_in_date: date,
                check_in_status: true,
                updated_at: dateStamp,
                schedule_id,
              };

              this.JobLogsModel.update(obj, {
                where: { id: foundItemJL.id },
              });
            } else {
              throw new ConflictError(
                "Cant use date.  Check in date must come before check out date "
              );
            }
          } else {
            throw new ConflictError("Cant use date. Not in within guard shift");
          }
        } else {
          const foundItemS2 = await this.ScheduleModel.findOne({
            where: {
              [Op.and]: [
                { check_in_date: { [Op.lte]: date } },
                { check_out_date: { [Op.gte]: date } },
                { id: schedule_id },
              ],
            },
          });

          if (foundItemS2) {
            if (await this.isAfter(date, foundItemJL.check_in_date)) {
              let my_log_date_check_in = foundItemJL.check_in_date;
              let my_date_now_check_out = date;

              let my_job_H_worked = await this.calculateHoursSetToWork(
                my_date_now_check_out,
                my_log_date_check_in
              );

              let obj = {
                check_out_time: time,
                check_out_date: date,
                hours_worked: my_job_H_worked,
                check_out_status: true,
                updated_at: dateStamp,
              };

              this.JobLogsModel.update(obj, {
                where: { id: foundItemJL.id },
              });
            } else {
              throw new ConflictError(
                "Cant use date.  Check out date must come after check in date"
              );
            }
          } else {
            throw new ConflictError("Cant use date. Not in within guard shift");
          }
        }
      } else {
        if (check_in) {
          const foundItemS2 = await this.ScheduleModel.findOne({
            where: {
              [Op.and]: [
                { check_in_date: { [Op.lte]: date } },
                { check_out_date: { [Op.gt]: date } },
                { id: schedule_id },
              ],
            },
          });

          if (foundItemS2) {
            let coordinates_res = await this.CoordinatesModel.create({
              longitude,
              latitude,
              created_at: dateStamp,
              updated_at: dateStamp,
            });

            let obj = {
              message: "in location",
              check_in_time: time,
              check_in_status: true,
              job_id,
              guard_id,
              coordinates_id: coordinates_res.id,
              check_in_date: date,
              project_check_in_date: foundItemS2.check_in_date,
              created_at: dateStamp,
              updated_at: dateStamp,
              schedule_id,
            };

            await this.JobLogsModel.create(obj);
          } else {
            throw new ConflictError("Cant use date. Not in within guard shift");
          }
        } else {
          throw new ConflictError("You have not check in ");
        }
      }
    } else {
    }
  }

  async checkIn(obj) {
    var { job_id, guard_id, check_in, latitude, longitude } =
      await jobUtil.verifyCheckinData.validateAsync(obj);

    latitude = latitude.toFixed(5);
    longitude = longitude.toFixed(5);

    const foundItemJob = await this.JobModel.findOne({ where: { id: job_id } });

    const foundItemFac = await this.FacilityModel.findOne({
      where: { id: foundItemJob.facility_id },
    });

    const foundItemFacLo = await this.FacilityLocationModel.findOne({
      where: { id: foundItemFac.facility_location_id },
    });

    const foundItemCoor = await this.CoordinatesModel.findOne({
      where: { id: foundItemFacLo.coordinates_id },
    });

    let my_time_zone = foundItemFac.time_zone;
    let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);

    let con_fig_time_zone = momentTimeZone.tz(my_time_zone);
    let date = new Date(con_fig_time_zone.format("YYYY-MM-DD hh:mm:ss a"));
    let time = String(con_fig_time_zone.format("hh:mm:ss a"));
    let full_date = con_fig_time_zone.format("YYYY-MM-DD hh:mm:ss a");

    let objLatLog = {
      latitude: foundItemCoor.latitude,
      longitude: foundItemCoor.longitude,
      radius: foundItemFacLo.operations_area_constraint,
    };

    if (check_in) {
      const foundItemS = await this.ScheduleModel.findOne({
        where: {
          [Op.and]: [
            { check_in_date: { [Op.lte]: date } },
            { check_out_date: { [Op.gte]: date } },
            { job_id },
            { guard_id },
          ],
        },
      });

      if (foundItemS) {
        //CHECK IF IT IS TIME TO START

        let storedDate = foundItemS.check_in_date;
        let retrivedate = full_date;

        if (
          moment(new Date(retrivedate), "YYYY-MM-DD  hh:mm:ss a").isSameOrAfter(
            new Date(storedDate)
          )
        ) {
          if (this.isInlocation(latitude, longitude, objLatLog)) {
            let foundItemJL = await this.JobLogsModel.findOne({
              where: {
                [Op.and]: [
                  { job_id },
                  { guard_id },
                  { check_in_status: true },
                  { project_check_in_date: foundItemS.check_in_date },
                ],
              },
            });

            if (!foundItemJL) {
              if (
                this.checkIfGuardIsLate(
                  storedDate,
                  retrivedate,
                  foundItemS.max_check_in_time
                )
              ) {
                let coordinates_res = await this.CoordinatesModel.create({
                  longitude,
                  latitude,
                  created_at: dateStamp,
                  updated_at: dateStamp,
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
                  updated_at: dateStamp,
                };

                this.JobLogsModel.create(obj);
              } else {
                throw new LocationError("you are late cant check in");
              }
            } else {
              throw new LocationError("you have check in already");
            }
          } else {
            let coordinates_res = await this.CoordinatesModel.create({
              longitude,
              latitude,
              created_at: dateStamp,
              updated_at: dateStamp,
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
                updated_at: dateStamp,
              };
              await this.JobLogsModel.create(obj);
              throw new LocationError("You are not in location");
            } else {
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
                updated_at: dateStamp,
              };
              await this.JobLogsModel.create(obj);
              throw new LocationError("You are not in location");
            }
          }
        } else {
          throw new LocationError("not yet time to check");
        }
      } else {
        throw new LocationError("no shift available for check in");
      }
    } else {
      if (this.isInlocation(latitude, longitude, objLatLog)) {
        //FOR ALLOWING LATE CHECK OUT 30
        let con_fig_time_zone2 = momentTimeZone
          .tz(my_time_zone)
          .subtract(1, "minutes");
        let date2 = new Date(
          con_fig_time_zone2.format("YYYY-MM-DD hh:mm:ss a")
        );

        const foundItemS = await this.ScheduleModel.findOne({
          where: {
            [Op.and]: [
              { check_in_date: { [Op.lte]: date } },
              {
                check_out_date: {
                  [Op.or]: [{ [Op.gte]: date2 }, { [Op.gte]: date }],
                },
              },
              { job_id },
              { guard_id },
            ],
          },
        });

        if (foundItemS) {
          const foundItemJL = await this.JobLogsModel.findOne({
            where: {
              [Op.and]: [
                { job_id },
                { guard_id },
                { check_in_status: true },
                { project_check_in_date: foundItemS.check_in_date },
              ],
            },
          });
          if (!foundItemJL) {
            throw new LocationError("you have not check in yet");
          } else {
            if (!foundItemJL.check_out_status) {
              let my_log_date_check_in = foundItemJL.check_in_date;
              let my_date_now_check_out = full_date;
              let my_shedule_date_check_in = foundItemS.check_in_date;
              let my_shedule_date_check_out = foundItemS.check_out_date;

              let my_job_H_worked = await this.calculateHoursSetToWork(
                my_date_now_check_out,
                my_log_date_check_in
              );

              if (
                this.timePositionForCheckOut(
                  my_date_now_check_out,
                  my_shedule_date_check_out
                )
              ) {
                my_job_H_worked = await this.calculateHoursSetToWork(
                  my_date_now_check_out,
                  my_log_date_check_in
                );

                let obj = {
                  check_out_time: time,
                  hours_worked: my_job_H_worked,
                  check_out_status: true,
                  check_out_date: new Date(full_date),
                  updated_at: dateStamp,
                };

                let whereOptions = {
                  [Op.and]: [
                    { job_id },
                    { guard_id },
                    { check_in_status: true },
                    { project_check_in_date: foundItemS.check_in_date },
                  ],
                };

                this.JobLogsModel.update(obj, {
                  where: whereOptions,
                });
              } else {
                my_job_H_worked = await this.calculateHoursSetToWork(
                  my_shedule_date_check_out,
                  my_log_date_check_in
                );

                let obj = {
                  check_out_time: foundItemS.end_time,
                  hours_worked: my_job_H_worked,
                  check_out_status: true,
                  check_out_date: foundItemS.check_out_date,
                  updated_at: dateStamp,
                };

                let whereOptions = {
                  [Op.and]: [
                    { job_id },
                    { guard_id },
                    { check_in_status: true },
                    { project_check_in_date: foundItemS.check_in_date },
                  ],
                };

                this.JobLogsModel.update(obj, {
                  where: whereOptions,
                });
              }
            } else {
              throw new LocationError("you have check out already");
            }
          }
        } else {
          throw new LocationError("cant check out no shift available");
        }
      } else {
        let coordinates_res = await this.CoordinatesModel.create({
          longitude,
          latitude,
          created_at: dateStamp,
          updated_at: dateStamp,
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
            updated_at: dateStamp,
          };
          await this.JobLogsModel.create(obj);
          throw new LocationError("You are not in location");
        } else {
          let obj = {
            message: "not in location",
            check_out_time: time,
            check_in_time: time,
            check_out_status: false,
            check_in_status: false,
            check_in_date: date,
            job_id,
            guard_id,
            coordinates_id: coordinates_res.id,
            check_out_date: date,
            project_check_in_date: date,
            created_at: dateStamp,
            updated_at: dateStamp,
          };
          this.JobLogsModel.create(obj);
          throw new LocationError("You are not in location");
        }
      }
    }
  }

  checkIfGuardIsLate(val1, val2, added_time) {
    let stored_time = moment(new Date(val1), "YYYY-MM-DD hh:mm:ss a");
    let my_check_in_time = moment(
      new Date(val2),
      "YYYY-MM-DD hh:mm:ss a"
    ).subtract(added_time, "minutes");

    return my_check_in_time.isSameOrBefore(stored_time);
  }

  timePositionForCheckOut(val1, val2) {
    let startTime1 = moment(new Date(val1), "YYYY-MM-DD HH:mm:ss a");
    let startTime2 = moment(new Date(val2), "YYYY-MM-DD HH:mm:ss a");
    return startTime1.isSameOrBefore(startTime2);
  }

  async isAfter(val1, val2) {
    let startTime1 = moment(new Date(val1), "YYYY-MM-DD HH:mm:ss a");
    let startTime2 = moment(new Date(val2), "YYYY-MM-DD HH:mm:ss a");
    return startTime1.isAfter(startTime2);
  }

  async isBefore(val1, val2) {
    let startTime1 = moment(new Date(val1), "YYYY-MM-DD HH:mm:ss a");
    let startTime2 = moment(new Date(val2), "YYYY-MM-DD HH:mm:ss a");
    return startTime1.isBefore(startTime2);
  }

  isInlocation(latitude, longitude, objLatLog) {


    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkk")


    function getDistanceBetween(lat1, long1, lat2, long2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1); // deg2rad below
      var dLon = deg2rad(long2 - long1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      d = d * 1000; //Distance in meters
      return d;
    }

    function deg2rad(deg) {
          return deg * (Math.PI / 180);
    }

    if (
      getDistanceBetween(latitude,longitude,objLatLog.latitude,objLatLog.longitude) > objLatLog.radius
    ) {
      return false;
    } else {
      return true;
    }
  }

  async getSingleGuardDetail(val) {
    let obj = {};
    const foundU = await this.UserModel.findOne({
      where: { id: val },
    });
    if (foundU) {
      (obj["first_name"] = foundU.first_name),
        (obj["last_name"] = foundU.last_name);
      obj["phone_number"] = foundU.phone_number;
      obj["image"] = foundU.image;
    } else {
      (obj["first_name"] = "deleted"), (obj["last_name"] = "deleted");
      obj["phone_number"] = "deleted";
    }

    return obj;
  }

  async getMultipleGuardDetail(val, job_id) {
    let guard_detail = [];

    for (let i = 0; i < val.length; i++) {
      const foundU = await this.UserModel.findOne({
        where: { id: val[i] },
      });

      if (foundU) {
        const foundJL = await this.JobLogsModel.findAll({
          where: {
            [Op.and]: [
              { check_in_status: true },
              { check_out_status: true },
              { job_id },
              { guard_id: val[i] },
            ],
          },
        });

        let hours_worked = 0;
        if (foundJL.length == 0) {
          let foundJR = await this.JobReportsModel.findAll({
            where: {
              [Op.and]: [{ job_id }, { guard_id: val[i] }],
            },
          });

          let guard = {
            first_name: foundU.first_name,
            last_name: foundU.last_name,
            image: foundU.image,
            email: foundU.email,
            phone_number: foundU.phone_number,
            hours_worked,
            guard_id: foundU.id,
            no_of_report: foundJR.length,
          };
          guard_detail.push(guard);
        } else {
          for (let j = 0; j < foundJL.length; j++) {
            hours_worked += foundJL[j].hours_worked;
            if (j == foundJL.length - 1) {
              let foundJR = await this.JobReportsModel.findAll({
                where: {
                  [Op.and]: [{ job_id }, { guard_id: val[i] }],
                },
              });

              let guard = {
                first_name: foundU.first_name,
                last_name: foundU.last_name,
                image: foundU.image,
                email: foundU.email,
                phone_number: foundU.phone_number,
                hours_worked,
                guard_id: foundU.id,
                no_of_report: foundJR.length,
              };
              guard_detail.push(guard);
            }
          }
        }
      }

      if (i == val.length - 1) {
        return guard_detail;
      }
    }
  }

  async getDateOnly(val) {
    return moment(val).format("YYYY-MM-DD");
  }

  async compareDateOnlySame(val1, val2) {
    if (moment(val1, "YYYY-MM-DD").isSame(val2)) {
      return true;
    } else {
      return false;
    }
  }

  async getDateAndTime(val) {
    return moment(val).format("YYYY-MM-DD hh:mm:ss a");
  }

  async getTimeOnly(val) {
    return moment(val).format("hh:mm:ss a");
  }

  async getJobDetail(val) {
    const foundj = await this.JobModel.findOne({
      where: { id: val },
    });

    let foundJC = await this.JobSecurityCodeModel.findAll({
      where: {
        job_id: val,
      },
      attributes: ["job_id", "security_code"],
      group: ["job_id", "security_code"],
    });

    let job = {
      description: foundj.description,
      customer_id: foundj.customer_id,
      facility_id: foundj.facility_id,
      guard_charge: foundj.staff_charge,
      no_qr_code: foundJC.length,
    };

    return job;
  }

  async checkIfGuardIsInAnyActiveJob2(guard_id,job_id){

    let foundJ=await this.JobModel.findAll(
      {
        where:
        {job_status:'ACTIVE'
         }
      }
    )
  
  
      if(foundJ.length!=0){
        for(let i=0;i<foundJ.length;i++){
  
          let foundS=await this.ScheduleModel.findAll({
            where: {[Op.and]: [{job_id:foundJ[i].id },
            {guard_id}]}
          })
  
          if(foundS.length!=0){
            return true
          }
  
          if(i==foundJ.length-1){
              return false
          }
        }
      }
      else{
        return false
      }
    }
  async getSiteDetail(val) {
    const foundF = await this.FacilityModel.findOne({
      where: { id: val },
    });

    let site = {
      name: foundF.name,
      time_zone: foundF.time_zone,
    };

    return site;
  }

  async getCustomerDetail(val) {
    const foundC = await this.CustomerModel.findOne({
      where: { id: val },
    });

    let Customer = {
      company_name: foundC.company_name
    };

    return Customer;
  }

  async getDateAndTimeForStamp(my_time_zone) {
    let con_fig_time_zone = momentTimeZone.tz(my_time_zone);
    let date = new Date(con_fig_time_zone.format("YYYY-MM-DD hh:mm:ss a"));

    return date;
  }

  async combineUnsettleShift(val) {
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
        } else {
          if (val[i].id == val[j].id) {
            amount += val[j].amount;
            hours += val[j].hours_worked;
            id2.push(val[j].foundJL_id);
            id3.push(val[j].shedule_id);
          }
        }

        if (j == val.length - 1) {
          obj["id"] = val[i].id;
          obj["amount"] = amount.toFixed(2);
          obj["hours_worked"] = hours.toFixed(2);
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
  }


  async calender(customer_id, guard_id, site_id, from_date = null, to_date = null) {
    try {
      const all = [];
      if (!from_date && !to_date){

      from_date = new Date()
      to_date = new Date()

      const date = this.getOneWeek(from_date,to_date)
      if (date){
      var from = date[0]
      var to = date[1]
      }}
      else if (from_date && to_date) {
        var from = from_date
        var to = to_date
      }
      else{
        const date = this.getOneWeek(from_date,to_date)
      if (date){
      var from = date[0]
      var to = date[1]
      }}
      var data = await this.ScheduleModel.findAll(
        {
          include: [
            {
            model: this.JobModel,
            as: "job",
            include: [
              {
              model: this.JobLogsModel,
              // where: {
              //   [Op.and]:
              //   [
              //   {check_in_status: true},
              //     {check_out_status: true}
              //   ]
              // }
            }        
            ],

            
            where: {
              [Op.and]: [
                { "customer_id": { [Op.like]: customer_id ? customer_id : "%" } },
                { "facility_id": { [Op.like]: site_id ? site_id : "%" } }
              ],
              // attributes:['customer_id']
            }
          },
          {
            model: this.Shift_commentsModel,
            as: "Shift_comments"
          }  
        ],
          where:
           {
            [Op.and]:[
            {check_in_date:{[Op.gt]: from}},
          {check_out_date:{[Op.lt]: to}},
          { guard_id: { [Op.like]: guard_id ? guard_id : "%" }}
        ]
      },
        });

      const users = await this.UserModel.findAll({ where: { [Op.and]: [
        { "id": { [Op.like]: guard_id ? guard_id : "%" } },
        { "role": "GUARD" }
      ] }})
      for (let i = 0; i < users.length; i++) {
        let a = {
          user_id: users[i]?.id,
          name: users[i]?.first_name + " " + users[i]?.last_name,
          hours_worked: 0,
          data: []
        }
        for (let j = 0; j < data.length; j++) {
          if (data[j]?.guard_id == users[i].id) {
            var check_in_date: any = new Date(data[j].check_in_date);
            var check_out_date: any = new Date(data[j].check_out_date)
            a.hours_worked = ((check_out_date - check_in_date) / 3600000 + a.hours_worked)
            a.data.push(data[j])
          }

        }
        all.push(a)
      }
      // return data
      return all
    }
    catch (error) {
      console.log(error)
      throw new SystemError(error)
    }
  }

  async addShiftComment(data){
    try {
      let { comment, schedule_id, created_by_id, my_time_zone } =
        await jobUtil.verifyCreateShiftComment.validateAsync(data);

      let dateStamp = await this.getDateAndTimeForStamp(my_time_zone);

      let obj = {
        comment: comment,
        created_by_id,
        schedule_id,
        time_zone: my_time_zone,
        created_at: dateStamp,
        updated_at: dateStamp,
      };

      let createdC = await this.Shift_commentsModel.create(obj);

    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async deleteShiftComment(data){
    try {
      const { comment_id } = await jobUtil.verifyDeleteShiftComment.validateAsync(data);

      const record = await this.Shift_commentsModel.findOne({
        where: {
          id: comment_id,
        },
      });
      if (record) {
        await this.Shift_commentsDeletedModel.create(record.dataValues);
        await record.destroy()
      }

    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async getShiftComment(data){
    try {
      const { comment_id } = await jobUtil.verifyGetShiftComment.validateAsync(data);

      const record = await this.Shift_commentsModel.findOne({
        where: {
          id: comment_id,
        },
      });
      return record
    } catch (error) {
      throw new SystemError(error.toString());
    }
  }

  async getJobsAttachedToSite(data){
    try {
      const {site_id} = await jobUtil.verifyGetJobsAttachedToSite.validateAsync(data);
      const returned_data = await this.JobModel.findAll({
        where: {
          facility_id : site_id
        }
      })

      let jobs = {
        ACTIVE: [],
        PENDING: [],
        COMPLETED: []
      }

    //   returned_data.filter(job=>{
    //     if(){

    //     }
    //     else if{

    //     }
    //     else if{
          
    //     }
    //   })

    } catch (error) {
      
    }
  }

  async checkifAgendaDateIsInScheduleDate(agendaSchedule) {
    for (let i = 0; i < agendaSchedule.length; i++) {
      //THIS ONE IS USE BY INSTRUCTION TO MATCH DATE PROPERLY FOR SEARCH
      let operation_date = new Date(
        moment(new Date(agendaSchedule[i].operation_date)).format(
          "YYYY-MM-DD hh:mm:ss a"
        )
      );

      //THIS ONE IS USE BY TASK TO MATCH DATE PROPERLY FOR SEARCH
      let operation_date2 = moment(
        new Date(agendaSchedule[i].operation_date)
      ).format("YYYY-MM-DD");

      let foundItemS = [];

      if (agendaSchedule[i].agenda_type == "INSTRUCTION") {
        foundItemS = await this.ScheduleModel.findAll({
          where: {
            [Op.and]: [
              { check_in_date: { [Op.lte]: operation_date } },
              { check_out_date: { [Op.gte]: operation_date } },
              { job_id: agendaSchedule[i].job_id },
              { guard_id: agendaSchedule[i].guard_id },
            ],
          },
        });

        if (foundItemS.length == 0) {
          let guardDetail = await this.getSingleGuardDetail(
            agendaSchedule[i].guard_id
          );
          let obj = {
            status: false,
            info: {
              fullName:
                guardDetail["first_name"] + " " + guardDetail["last_name"],
              operation_date:
                agendaSchedule[i].agenda_type == "INSTRUCTION"
                  ? await this.getDateAndTime(operation_date)
                  : await this.getDateOnly(operation_date),
              issues:
                agendaSchedule[i].agenda_type == "INSTRUCTION"
                  ? "Instruction date not found in guard shift"
                  : "Task date not found in guard shift",
            },
          };

          return obj;
        } else {
          agendaSchedule[i] = {
            ...agendaSchedule[i],
            date_schedule_id: foundItemS[0].id,
          };
        }
      } else {
        const foundItemS2 = await this.ScheduleModel.findAll({
          where: {
            [Op.and]: [
              { job_id: agendaSchedule[i].job_id },
              { guard_id: agendaSchedule[i].guard_id },
            ],
          },
        });

        for (let k = 0; k < foundItemS2.length; k++) {
          if (
            (await this.compareDateOnlySame(
              moment(foundItemS2[k].check_in_date).format("YYYY-MM-DD"),
              operation_date2
            )) ||
            (await this.compareDateOnlySame(
              moment(foundItemS2[k].check_out_date).format("YYYY-MM-DD"),
              operation_date2
            ))
          ) {
            agendaSchedule[i] = {
              ...agendaSchedule[i],
              date_schedule_id: foundItemS2[k].id,
            };
            console.log(agendaSchedule);

            break;
          }

          if (k == foundItemS2.length - 1) {
            let guardDetail = await this.getSingleGuardDetail(
              agendaSchedule[i].guard_id
            );
            let obj = {
              status: false,
              info: {
                fullName:
                  guardDetail["first_name"] + " " + guardDetail["last_name"],
                operation_date:
                  agendaSchedule[i].agenda_type == "INSTRUCTION"
                    ? await this.getDateAndTime(operation_date)
                    : await this.getDateOnly(operation_date),
                issues:
                  agendaSchedule[i].agenda_type == "INSTRUCTION"
                    ? "Instruction date not found in guard shift"
                    : "Task date not found in guard shift",
              },
            };

            return obj;
          }
        }
      }

      if (i == agendaSchedule.length - 1) {
        let obj = {
          status: true,
        };
        return obj;
      }
    }
  }

  async checkIfDateAreApart(postedDate) {
    let myShedule = await this.ScheduleModel.findAll({
      where: { job_id: postedDate[0].job_id },
    });

    let combinedArray = [...postedDate, ...myShedule];

    for (let i = 0; i < combinedArray.length; i++) {
      for (let j = 0; j < combinedArray.length; j++) {
        if (i == j || combinedArray[i].guard_id != combinedArray[j].guard_id) {
          continue;
        }

        if (
          moment(combinedArray[i].check_in_date).isBefore(
            combinedArray[j].check_out_date
          )
        ) {
          if (
            moment(combinedArray[i].check_out_date)
              .add(60, "minutes")
              .isBefore(combinedArray[j].check_in_date)
          ) {
          } else {
            let name = await this.getSingleGuardDetail(
              combinedArray[i].guard_id
            );

            let data = {
              message: `This schedule (start date:${moment(
                combinedArray[i].check_in_date
              ).format("YYYY-MM-DD  hh:mm:ss a")},end date:${moment(
                combinedArray[i].check_out_date
              ).format(
                "YYYY-MM-DD  hh:mm:ss a"
              )} )  is clashing with (start date:${moment(
                combinedArray[j].check_in_date
              ).format("YYYY-MM-DD  hh:mm:ss a")},end date:${moment(
                combinedArray[j].check_out_date
              ).format("YYYY-MM-DD  hh:mm:ss a")} ) or they are not far apart `,
              solution: `SOLUTION :remove this guard (${name["first_name"]} ${name["last_name"]}) from the schedule or adjust the date`,
            };

            throw new TimeError(JSON.stringify(data));
          }
        } else if (
          moment(combinedArray[i].check_in_date)
            .subtract(60, "minutes")
            .isAfter(combinedArray[j].check_out_date)
        ) {
        } else {
          let name = await this.getSingleGuardDetail(combinedArray[i].guard_id);

          let data = {
            message: `This schedule (start date:${moment(
              combinedArray[i].check_in_date
            ).format("YYYY-MM-DD  hh:mm:ss a")},end date:${moment(
              combinedArray[i].check_out_date
            ).format(
              "YYYY-MM-DD  hh:mm:ss a"
            )} )  is clashing with (start date:${moment(
              combinedArray[j].check_in_date
            ).format("YYYY-MM-DD  hh:mm:ss a")},end date:${moment(
              combinedArray[j].check_out_date
            ).format("YYYY-MM-DD  hh:mm:ss a")} ) or they are not far apart `,
            solution: `SOLUTION :remove this guard (${name["first_name"]} ${name["last_name"]}) from the schedule or adjust the date`,
          };

          throw new TimeError(JSON.stringify(data));
        }
      }
      if (i == combinedArray.length - 1) {
        return true;
      }
    }
  }

  async checkIfGuardIsInAnyActiveJob(guard_id, job_id) {
    let foundJ = await this.JobModel.findAll({
      where: {
        [Op.and]: [{ job_status: "ACTIVE" }, { id: { [Op.ne]: job_id } }],
      },
    });

    if (foundJ.length != 0) {
      for (let i = 0; i < foundJ.length; i++) {
        let foundS = await this.ScheduleModel.findAll({
          where: {
            [Op.and]: [{ job_id: foundJ[i].id }, { guard_id }],
          },
        });

        if (foundS.length != 0) {
          return true;
        }

        if (i == foundJ.length - 1) {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  async calculateHoursSetToWork(to, from) {
    let init2 = moment(from).format("YYYY-MM-DD hh:mm:ss a");
    let now2 = moment(to).format("YYYY-MM-DD hh:mm:ss a");

    let init = moment(from, "YYYY-MM-DD hh:mm:ss a");
    let now = moment(to, "YYYY-MM-DD hh:mm:ss a");

    // calculate total duration
    let duration = moment.duration(now.diff(init));
    // duration in hours
    let hours: number = duration.asHours();

    return Number(hours.toFixed(2));
  }

  async getTimeZone(lat: number, log: number) {
    let timestamp = moment(new Date()).unix();
    try {
      let response = await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${log}&timestamp=${timestamp}&key=${serverConfig.GOOGLE_KEY}`
      );
      // console.log(response.data.url);
      // console.log(response.data.explanation);
      console.log(response.data);

      return response.data.timeZoneId;
    } catch (error) {
      console.log(error);
      throw new NotFoundError("Failed to resolve query");
    }
  }

  async addTimeStampToArr(schedule, dateAndTime) {
    let obj = {};
    obj["created_at"] = dateAndTime;
    obj["updated_at"] = dateAndTime;
    let mySchedule = [];
    for (let i = 0; i < schedule.length; i++) {
      mySchedule.push({ ...schedule[i], ...obj });

      if (i == schedule.length - 1) {
        return mySchedule;
      }
    }
  }

  async addCreatorsId(schedule, created_by_id) {
    for (let i = 0; i < schedule.length; i++) {
      schedule[i] = { ...schedule[i], created_by_id };
      if (i == schedule.length - 1) {
        return schedule;
      }
    }
  }

  async addMemoId(guards_details, memo_id) {
    for (let i = 0; i < guards_details.length; i++) {
      guards_details[i] = { ...guards_details[i], memo_id };
      if (i == guards_details.length - 1) {
        return guards_details;
      }
    }
  }

  async shiftJobToCompleted() {
    const foundJ = await this.JobModel.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ job_type: "INSTANT" }, { job_type: "TEMPORAL" }],
          },
          { job_status: "ACTIVE" },
        ],
      },
    });

    for (let i = 0; i < foundJ.length; i++) {
      const dateStamp = await this.getDateAndTimeForStamp(foundJ[i].time_zone);

      const foundS = await this.ScheduleModel.findAll({
        where: { job_id: foundJ[i].id },
      });

      for (let k = 0; k < foundS.length; k++) {
        let endDateSchedule = foundS[k].check_out_date;

        if (moment(endDateSchedule).isAfter(dateStamp)) {
          break;
        }

        if (k == foundS.length - 1) {
          this.JobModel.update(
            { job_status: "COMPLETED" },
            {
              where: { id: foundJ[i].id },
            }
          );
        }
      }

      if (i == foundJ.length - 1) {
      }
    }
  }
  async checkIfShiftHasStarted(job_id,startDate){
   
    const foundJ =await this.JobModel.findOne(
      {
        where: {id:job_id}
      })

      const dateStamp=await this.getDateAndTimeForStamp(foundJ.time_zone)
        if(moment(startDate).isAfter(dateStamp)){
            return false
        }
        else{
            return true
        }
  }


  async checkIfAllShiftHasStarted(obj){
   
    const checkKeyValue = obj.every(object => object["is_started"] === true);

    return checkKeyValue
  }

  async getCustomerName(customer_id){
   
    let foundC = await this.CustomerModel.findOne({
      where:{
          id:customer_id
      }
    });

    return foundC

  }



  async returnJobPercentage(job_id) {
    let total = 0;
    let completed = 0;

    const foundJ = await this.JobModel.findOne({
      where: { id: job_id },
    });

    const dateStamp = await this.getDateAndTimeForStamp(foundJ.time_zone);

    const foundS = await this.ScheduleModel.findAll({
      where: { job_id },
    });

    if (foundS.length != 0) {
      for (let k = 0; k < foundS.length; k++) {
        let endDateSchedule = foundS[k].check_out_date;
        if (moment(endDateSchedule).isAfter(dateStamp)) {
        } else {
          completed++;
        }
        total = foundS.length;

        if (k == foundS.length - 1) {
          return (completed / total) * 100;
        }
      }
    } else {
      return 0;
    }
  }

  async getGuardIdArray(job_id) {
    const foundS = await this.ScheduleModel.findAll({
      where: { job_id },
    });

    let all_guard_id = [];

    if (foundS.length != 0) {
      if (foundS.length != 0) {
        for (let i = 0; i < foundS.length; i++) {
          if (all_guard_id.includes(foundS[i].guard_id)) {
          } else {
            all_guard_id.push(foundS[i].guard_id);
          }
          if (i == foundS.length - 1) {
            return all_guard_id;
          }
        }
      }
    } else {
      return all_guard_id;
    }
  }

  async removeDuplicateID(array) {
    var uniqueArray = [];

    for (let i = 0; i < array.length; i++) {
      if (uniqueArray.indexOf(array[i]) === -1) {
        uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  }

  isSameDay(date1, date2) {
    if (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    ) {
      return true;
    } else {
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
  getOneWeek(dDate1: Date | null, dDate2: Date | null) {

    var dates = [];
    if (dDate1 && dDate2) {
      if (dDate1.getDay() === 0 && dDate2.getDay() === 6) {
        dates.push(dDate1)
        dates.push(dDate2)
  
      } else {
  
        const a = 0 - dDate1.getDay();
        const b = 6 - dDate2.getDay();
        dDate1.setDate(dDate1.getDate() + a)
        dDate2.setDate(dDate2.getDate() + b)
  
        dates.push(dDate1)
        dates.push(dDate2)
  
      }
    } else if (!dDate2) {
      dDate2 = dDate1
      dDate2.setDate(dDate2.getDate() + 6)
      dates.push(dDate1)
      dates.push(dDate2)

    }
    else{
      dDate1 = dDate2
      dDate1.setDate(dDate1.getDate() - 6)
      dates.push(dDate1)
      dates.push(dDate2)
    }

return dates
}
  async updateJob(data: any): Promise<any> { }
}

export default new UserService();

//https://stackoverflow.com/questions/30452977/sequelize-query-compare-dates-in-two-columns

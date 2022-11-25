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
} from "../db/models";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  SystemError,
} from "../errors";
import { fn, col, Op, QueryError } from "sequelize";
import Schedule from "../db/models/schedule.model";
import jobUtil from "../utils/job.util";
import { JobStatus } from "../interfaces/types.interface";
import { IJobSecurityCode } from "../interfaces/job_security_code.interface";
import authService from "./auth.service";

class UserService {
  private UserModel = Admin;
  private JobModel = Job;
  private ScheduleModel = Schedule;
  private JobOperationsModel = JobOperations;
  private AssignedStaffsModel = AssignedStaffs;
  private CustomerModel = Customer;
  private LocationModel = Location;
  private CoordinatesModel = Coordinates;
  private FacilityModel = Facility;
  private FacilityLocationModel = FacilityLocation;
  private AgendasModel = Agendas;
  private JobSecurityModel = JobSecurityCode;

  async getJobsForStaff(staffId: number): Promise<any[]> {
    try {
      const jobs = [];
      const relatedAssignments = await this.AssignedStaffsModel.findAll({
        where: {
          staff_id: staffId,
        },
      });
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

  async getAllJobsAdmin(data: any): Promise<any[]> {

     console.log(data.query)
    let mytype=data.query.type

   

    try {
      const jobs = [];
      let availableJobs;


      if(data.query.type=='ACTIVE'){
         availableJobs = await this.JobModel.findAll({
          where: {
            is_deleted: false,
            job_status:'ACTIVE',
          } as any,
        });
      }
      else if(data.query.type=='PENDING'){
         availableJobs = await this.JobModel.findAll({
          where: {
            is_deleted: false,
            job_status:'PENDING',
          } as any,
        });
      }
      else if(data.query.type=='COMPLETED'){
         availableJobs = await this.JobModel.findAll({
          where: {
            is_deleted: false,
            job_status:'COMPLETED',
          } as any,
        });
      }
      else{
        availableJobs = await this.JobModel.findAll({
          where: {
            is_deleted: false,
          } as any,
        });
      }





      for (const availableJob of availableJobs) {
        const facility = await this.FacilityModel.findByPk(
          availableJob.facility_id
        );
        if (facility == null) continue;
        const facilityLocation = await this.FacilityLocationModel.findByPk(
          facility.id
        );
        if (facilityLocation == null) continue;
        const coodinates = await this.CoordinatesModel.findByPk(
          facilityLocation.coordinates_id
        );
        const relatedSchedules = await this.ScheduleModel.findAll({
          where: {
            job_id: availableJob.id,
          },
        });
        const assignedStaffs = await this.AssignedStaffsModel.findAll({
          where: {
            job_id: availableJob.id,
          },
        });
        const customer = await this.CustomerModel.findByPk(
          availableJob.customer_id
        );
        const jobRes = {
          id: availableJob.id,
          description: availableJob.description,
          client_charge: availableJob.client_charge,
          staff_payment: availableJob.staff_charge,
          status: availableJob.job_status,
          customer: {
            id: availableJob.customer_id,
            full_name: `${customer?.first_name} ${customer?.last_name}`,
            first_name: customer?.first_name,
            last_name: customer?.last_name,
            email: customer?.email,
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
          assigned_staffs: [],
        };
        const scheduleRes = [];
        const staffsRes = [];
        for (const relatedSchedule of relatedSchedules) {
          scheduleRes.push({
            id: relatedSchedule.id,
            start_time: relatedSchedule.start_time,
            end_time: relatedSchedule.end_time,
            check_in_date: relatedSchedule.check_in_date,
            schedule_length: relatedSchedule.schedule_length,
          });
        }
        for (const assignment of assignedStaffs) {
          const staff = await this.UserModel.findByPk(assignment.staff_id);
          staffsRes.push({
            id: staff.id,
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            gender: staff.gender,
            assignment: {
              id: assignment.id,
              accept: assignment.accept_assignment,
            },
          });
        }
        jobRes.assigned_staffs = staffsRes;
        jobRes.schedule = scheduleRes;
        jobs.push(jobRes);
      }
      return jobs;
    } catch (error) {
      console.log(error);
      return null;
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
        job_type
      } = await jobUtil.verifyJobCreationData.validateAsync(data);

      await this.JobModel.create({
        description,
        customer_id,
        facility_id: site_id,
        client_charge,
        staff_charge,
        payment_status,
        job_status,
        job_type
      })

    } catch (error) {
      console.log(error);
      throw new SystemError(error.toString());
    }
  }


  /*  async createJob(data: any): Promise<any> {
    try {
      const {
        description,
        customer_id,
        site_id,
        status,
        amount,
        job_type,
        schedule,
        assigned_staffs,
        tasks,
        agendas,
        use_security_code,
      } = await jobUtil.verifyJobCreationData.validateAsync(data);

      var currentFacility = await this.FacilityModel.findOne({
        where: {
          id: site_id,
        },
      });
      console.log("t: " + currentFacility);

      var agendasToCreateUnscheduled = [];
      tasks.forEach((task) => {
        agendasToCreateUnscheduled.push({
          title: task.title,
          description: task.description,
          agenda_type: "TASK",
        });
      });
      agendas.forEach((agenda) => {
        agendasToCreateUnscheduled.push({
          title: agenda.title,
          description: agenda.description,
          agenda_type: "AGENDA",
        });
      });

      var createdJob = await this.JobModel.create({
        description,
        customer_id,
        facility_id: site_id,
        job_status: status,
        client_charge: currentFacility.client_charge,
        staff_charge: amount,
        job_type,
      });
      
      const schedules = [];
      for (let index = 0; index < schedule.length; index++) {
        const element = schedule[index];
        schedules.push({
          check_in_date: element.check_in_date,
          start_time: element.start_time,
          end_time: element.end_time,
          job_id: createdJob.id,
          schedule_length: job_type == "PERMANENT" ? "CONTINUOUS" : "LIMITED",
        });
      }

      try {
        let createdSchedule = await this.ScheduleModel.bulkCreate(schedules);
        let securityCodesToCreate = [];
        let agendasToCreateScheduled = [];
        createdSchedule.forEach((scheduleItem) => {
          if (use_security_code) {
            securityCodesToCreate.push({
              job_id: createdJob.id,
              security_code: authService.generatePassword(true, 19),
            });
          }
          agendasToCreateUnscheduled.forEach((agenda) => {
            agenda.schedule_id = scheduleItem.id;
          });
        });
        this.JobSecurityModel.bulkCreate(securityCodesToCreate);
        this.AgendasModel.bulkCreate(agendasToCreateScheduled);

        console.log("u: " + createdSchedule);
      } catch (error) {
        console.log(error);
      }
      var assignedStaffs = [];
      for (const staff of assigned_staffs) {
        assignedStaffs.push({
          job_id: createdJob.id,
          staff_id: staff.staff_id,
        });
      }

      var createdAssignedStaffs = await this.AssignedStaffsModel.bulkCreate(
        assignedStaffs
      );
      return createdAssignedStaffs;
    } catch (error) {
      console.log(error);
      throw new SystemError(error.toString());
    }
  } */

  async acceptDeclineJob(req) {
    var { job_id, accept } =
      await jobUtil.verifyAcceptDeclineData.validateAsync(req.body);
    var relatedAssignment = await this.AssignedStaffsModel.findOne({
      where: {
        staff_id: req.user.id,
        job_id,
      },
    });
    if (relatedAssignment == null)
      throw new NotFoundError(
        "No Assignment was found for you.\nIt may not exist anymore"
      );
    if (relatedAssignment.accept_assignment === false && accept)
      throw new ConflictError(
        "You can't accept a job that you previously declined"
      );
    if (relatedAssignment.accept_assignment === true && accept)
      throw new ConflictError("You have already accepted this job");
    if (relatedAssignment.accept_assignment === false && !accept)
      throw new ConflictError("You have already declined this job");
    if (relatedAssignment.accept_assignment === true && !accept)
      throw new ConflictError(
        "You can't decline a job that you previously accepted"
      );
    relatedAssignment.update({
      accept_assignment: accept,
    });
    return relatedAssignment;
  }

  async checkIn(obj) {
    var { operation_id, check_in, latitude, longitude } =
      await jobUtil.verifyCheckinData.validateAsync(obj);
    var job_operation = await this.JobOperationsModel.findByPk(operation_id);
    if (job_operation == null) throw new NotFoundError("Schedule not found");
    else {
      // if(this.isSameDay(new Date(relatedSchedule.check_in_date), new Date()) && relatedSchedule.start_time < ){
      //     if
      // }
      if (check_in && job_operation.checked_in != null) {
        throw new ConflictError("You have already checked in");
      } else if (check_in === false && job_operation.checked_out) {
        throw new ConflictError("You have already checked out");
      } else if (check_in === false && job_operation.checked_in == null) {
        throw new BadRequestError(
          "You must check in first before checking out"
        );
      } else if (check_in === true && job_operation.checked_in == null) {
        const createdCoordinates = await this.CoordinatesModel.create({
          longitude,
          latitude,
        });
        job_operation.update({
          checked_in: new Date(),
          check_in_coordinates_id: createdCoordinates.id,
        });
      } else if (check_in === false && job_operation.checked_out == null) {
        const createdCoordinates = await this.CoordinatesModel.create({
          longitude,
          latitude,
        });
        job_operation.update({
          checked_out: new Date(),
          check_out_coordinates_id: createdCoordinates.id,
        });
      } else {
        throw new BadRequestError("Unable to process request");
      }
    }
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

  async updateJob(data: any): Promise<any> {}
}

export default new UserService();

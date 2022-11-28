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
  MynewAgenda
} from "../db/models";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  SystemError,
} from "../errors";
import { fn, col, Op, QueryError } from "sequelize";
import moment from "moment";
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
  private MyNewAgendasModel = MynewAgenda;
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

      console.log(data.query.limit)
      if(data.query.type=='ACTIVE'){
         availableJobs = await this.JobModel.findAll({
          limit: parseInt(data.query.limit),
          offset: parseInt(data.query.offset),
          where: {
            is_deleted: false,
            job_status:'ACTIVE',
          } as any,
          order: [
            ['created_at', 'DESC'],
        ],
        });
      }
      else if(data.query.type=='PENDING'){
         availableJobs = await this.JobModel.findAll({
          limit: parseInt(data.query.limit),
          offset: parseInt(data.query.offset),
          where: {
            is_deleted: false,
            job_status:'PENDING',
          } as any,
          order: [
            ['created_at', 'DESC'],
        ],
        });
      }
      else if(data.query.type=='COMPLETED'){
         availableJobs = await this.JobModel.findAll({
          limit: parseInt(data.query.limit),
          offset: parseInt(data.query.offset),
          where: {
            is_deleted: false,
            job_status:'COMPLETED',
          } as any,
          order: [
            ['created_at', 'DESC'],
        ],
        });
      }
      else{
        availableJobs = await this.JobModel.findAll({
          where: {
            is_deleted: false,
          } as any,
          order: [
            ['created_at', 'DESC'],
        ],
        });
      }

      for (const availableJob of availableJobs) {
    
        const jobRes = {
          id: availableJob.id,
          description: availableJob.description,
          client_charge: availableJob.client_charge,
          staff_payment: availableJob.staff_charge,
          status: availableJob.job_status,
          create:availableJob.created_at
        };
  
        jobs.push(jobRes);
      }
      
      return jobs;
    } catch (error) {
      console.log(error);
      return null;
    }



  }
  /*
  async getAllJobsAdmin(data: any): Promise<any[]> {

     console.log(data.query)
    let mytype=data.query.type

   

    try {
      const jobs = [];
      let availableJobs;

      console.log(data.query.limit)
      if(data.query.type=='ACTIVE'){
         availableJobs = await this.JobModel.findAll({
          limit: parseInt(data.query.limit),
          offset: parseInt(data.query.offset),
          where: {
            is_deleted: false,
            job_status:'ACTIVE',
          } as any,
        });
      }
      else if(data.query.type=='PENDING'){
         availableJobs = await this.JobModel.findAll({
          limit: parseInt(data.query.limit),
          offset: parseInt(data.query.offset),
          where: {
            is_deleted: false,
            job_status:'PENDING',
          } as any,
        });
      }
      else if(data.query.type=='COMPLETED'){
         availableJobs = await this.JobModel.findAll({
          limit: parseInt(data.query.limit),
          offset: parseInt(data.query.offset),
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
  */
  
  async deleteJob(data: any): Promise<any> {
    try {
      const {
        job_id
      } = await jobUtil.verifyDeleteJob.validateAsync(data);

      this.JobModel.destroy({
        where: {
            id: job_id
        }
    })
    .then(function (deletedRecord) {
        if(deletedRecord === 1){
          return "Deleted successfully"
        }
        else
        {
         // throw new NotFoundError("record not found");
        }
    })
    
    .catch(function (error){
      //throw new NotFoundError(error);
    });
      
    } catch (error) {
      console.log(error);
      throw new SystemError(error.toString());
    }
  }

  
  async sheduleAgenda(data: any): Promise<any> {
    try {
      const {
        shedule_agenda
      } = await jobUtil.verifySheduleAgenda.validateAsync(data);


      //GETTING ALL THE THE JOBS SPECIFIC TO THE SHEDULE
      let myShedule=await this.AgendasModel.findAll(
        {
          where: {[Op.and]: [{job_id:shedule_agenda[0].job_id },
          {agenda_type:shedule_agenda[0].agenda_type }]}
        }
      );

     console.log(shedule_agenda)
      //CHECK FOR DUBPLICATE
      let cleanShedule=[]
      
        if(myShedule.length!=0){
          
          for(let i=0;  i<shedule_agenda.length; i++){
            let obj=shedule_agenda[i]
          for(let j=0;  j<myShedule.length; j++){
            let obj2=myShedule[j]
  
           // console.log("start check")
            let newDate= moment( new Date(obj.check_in_date));
            let dateNowFormatted1 = newDate.format('YYYY-MM-DD');

           // console.log(dateNowFormatted1)
            let oldDate= moment( new Date(obj2.check_in_date));
            let dateNowFormatted2 = oldDate.format('YYYY-MM-DD');
       
            if(obj.agenda_type=="INSTRUCTION"){
              if((dateNowFormatted1==dateNowFormatted2)&&(obj.guard_id==obj2.guard_id)&&(obj.time==obj2.time)){
                break;
              }
            }
          
            if(j==myShedule.length-1){
              shedule_agenda[i].status_per_staff=myShedule[0].status_per_staff
              cleanShedule.push(shedule_agenda[i])
            }
          }
          if(i==shedule_agenda.length-1){
              await this.AgendasModel.bulkCreate(cleanShedule);
          }
          }
        }
        else{
          await this.AgendasModel.bulkCreate(shedule_agenda);
        }
      
    } catch (error) {
      console.log(error);
      throw new SystemError(error.toString());
    }
  }


  async sheduleDate(data: any): Promise<any> {
    try {
      const {
        date_time_staff_shedule
      } = await jobUtil.verifysheduleDateCreation.validateAsync(data);


      //GETTING ALL THE THE JOBS SPECIFIC TO THE SHEDULE
      let myShedule=await this.ScheduleModel.findAll({
          where: { job_id:date_time_staff_shedule[0].job_id }
      });



     console.log(date_time_staff_shedule)


      //CHECK FOR DUBPLICATE
      let cleanShedule=[]

        if(myShedule.length!=0){
          
          for(let i=0;  i<date_time_staff_shedule.length; i++){
            let obj=date_time_staff_shedule[i]
          for(let j=0;  j<myShedule.length; j++){
            let obj2=myShedule[j]
  
           // console.log("start check")
            let newDate= moment( new Date(obj.check_in_date));
            let dateNowFormatted1 = newDate.format('YYYY-MM-DD');

           // console.log(dateNowFormatted1)
            let oldDate= moment( new Date(obj2.check_in_date));
            let dateNowFormatted2 = oldDate.format('YYYY-MM-DD');
            //console.log(dateNowFormatted2)
            console.log("end check")

          
            console.log(dateNowFormatted1==dateNowFormatted2)
            console.log(dateNowFormatted1 ,dateNowFormatted2)

           // console.log()


            if((dateNowFormatted1==dateNowFormatted2)&&(obj.guard_id==obj2.guard_id)){
              break;
            }
          
            if(j==myShedule.length-1){
              date_time_staff_shedule[i].status_per_staff=myShedule[0].status_per_staff
              cleanShedule.push(date_time_staff_shedule[i])
            }
          }
          if(i==date_time_staff_shedule.length-1){
              await this.ScheduleModel.bulkCreate(cleanShedule);
          }
          }
        }
        else{
          await this.ScheduleModel.bulkCreate(date_time_staff_shedule);
        }
       
      
    } catch (error) {
      console.log(error);
      throw new SystemError(error.toString());
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
  


  async acceptDeclineJobAdmin(req) {

    var { job_id, accept ,guard_id} =req.body;
    var relatedAssignment;
    if(accept){

      relatedAssignment = await this.ScheduleModel.destroy(
        {where: {[Op.and]: [{ guard_id}, {job_id}]} }
      )
                    
      await this.AgendasModel.destroy(
        {where: {[Op.and]: [{ guard_id }, {job_id}]}}
      )

    }
    else{
      relatedAssignment = await this.ScheduleModel.update(
        {
          status_per_staff:accept ? 'ACTIVE' : 'PENDING',
        },
        {
        where: {[Op.and]: [{ guard_id}, {job_id}]}
      });
                    
      await this.AgendasModel.update(
        {
          status_per_staff:accept ? 'ACTIVE' : 'PENDING',
        },
        {
        where: {[Op.and]: [{ guard_id }, {job_id}]}
        })
    }


      console.log(relatedAssignment)

    if (relatedAssignment == null)
      throw new NotFoundError(
        "No Assignment was found for you.\nIt may not exist anymore"
      );

    return relatedAssignment;
    
  }
  async acceptDeclineJob(req) {

    var { job_id, accept } =req.body;

    console.log(req.user)
    console.log(accept ? 'ACTIVE' : 'DECLINE')


    var relatedAssignment = await this.ScheduleModel.update(
      {
        status_per_staff:accept ? 'ACTIVE' : 'DECLINE',
      },
      {
      where: {[Op.and]: [{ guard_id:req.user }, {job_id}]}
      }
      );

     await this.AgendasModel.update(
        {
          status_per_staff:accept ? 'ACTIVE' : 'DECLINE',
        },
        {
        where: {[Op.and]: [{ guard_id:req.user }, {job_id}]}
        }
        );

      console.log(relatedAssignment)

    if (relatedAssignment == null)
      throw new NotFoundError(
        "No Assignment was found for you.\nIt may not exist anymore"
      );

    return relatedAssignment;
    
  }





  async checkIn(obj) {
    var { job_id,guard_id, check_in, latitude, longitude } =
      await jobUtil.verifyCheckinData.validateAsync(obj);

      console.log(latitude, longitude )
      

/*
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


*/


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

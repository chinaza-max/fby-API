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
  MynewAgenda
} from "../db/models";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  SystemError,
  TimeError,
  DateSheduleError,
  LocationError
} from "../errors";
import { fn, col, Op, QueryError, where } from "sequelize";
import moment from "moment";
import momentTimeZone from "moment-timezone";
import Schedule from "../db/models/schedule.model";
import jobUtil from "../utils/job.util";
import { JobStatus } from "../interfaces/types.interface";
import { IJobSecurityCode } from "../interfaces/job_security_code.interface";
import authService from "./auth.service";
import { func, number } from "joi";

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
  private MyNewAgendasModel = MynewAgenda;
  private JobSecurityModel = JobSecurityCode;

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


  
  async getAllJobsAdmin(data: any): Promise<any[]> {

     console.log(data.query)
    let mytype=data.query.type

   

    try {
      const jobs = [];
      let availableJobs;

      console.log(data.query.limit)
      if(mytype=='ACTIVE'){
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
      else if(mytype=='PENDING'){
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
      else if(mytype=='COMPLETED'){
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

      console.log(myShedule)

      //CHECK FOR DUBPLICATE
      let cleanShedule=[]

        if(myShedule.length!=0){
          
            for(let i=0;  i<date_time_staff_shedule.length; i++){
              let obj=date_time_staff_shedule[i]

              for(let j=0;  j<myShedule.length; j++){
                let obj2=myShedule[j]


              //  console.log(moment(new Date(obj.check_in_date)).format('YYYY-MM-DD hh:mm:ss a'))


                let newDate= moment(new Date(obj.check_in_date));
                let newDate2= moment(new Date(obj.check_out_date));
                let dateNowFormatted1 = newDate.format('YYYY-MM-DD');
                let dateNowFormatted2 = newDate2.format('YYYY-MM-DD');

                let oldDate= moment( new Date(obj2.check_in_date));
                let oldDate2= moment( new Date(obj2.check_out_date));
                let dateNowFormatted3 = oldDate.format('YYYY-MM-DD');
                let dateNowFormatted4 = oldDate2.format('YYYY-MM-DD');
                //console.log(dateNowFormatted2)

                console.log("in : ",dateNowFormatted1,"out : ",dateNowFormatted2,"in : ",dateNowFormatted3 ,"out : ",dateNowFormatted4)
                console.log((dateNowFormatted1==dateNowFormatted3)&&(dateNowFormatted2==dateNowFormatted4)&&(obj.guard_id==obj2.guard_id))


                if((dateNowFormatted1==dateNowFormatted3)&&(dateNowFormatted2==dateNowFormatted4)&&(obj.guard_id==obj2.guard_id)){
                  break;
                }
              
                if(j==myShedule.length-1){
                  date_time_staff_shedule[i].status_per_staff=myShedule[0].status_per_staff
                  cleanShedule.push(date_time_staff_shedule[i])
                }
              }
              if(i==date_time_staff_shedule.length-1){
                  if(cleanShedule.length!=0){
                    console.log("ooooooooooooooooooooooooooooo")
                    //console.log(cleanShedule)


                    await this.ScheduleModel.bulkCreate(cleanShedule);
                  }else{
                    throw new DateSheduleError("no new shedule was created dublicate found");

                  }
              }
            }
        }
        else{
          console.log(date_time_staff_shedule)

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


  
    
  async getGuardPerJob(obj) {
    var { job_id,
    }
  
    =  await jobUtil.verifygetGuardPerJob.validateAsync(obj);
      
    
      
     const  foundS =await  this.ScheduleModel.findAll({
      where: {job_id}
      })

    let all_guard_id=[]
      



     
   if(foundS){
        for(let i=0;i<foundS.length;i++ ){

          if(all_guard_id.includes(foundS[i].guard_id)){
              continue
          }
          else{
            all_guard_id.push(foundS[i].guard_id)
          }
        if(i==foundS.length-1){


          let foundG=  await this.getGuardDetail(all_guard_id,job_id)
          let job=    await this.getJobDetail(job_id)
          let site=    await this.getSiteDetail(job.facility_id)

          let detail={
              guard:foundG,
              job,
              site
          }

          return detail
        }
      }
   }



      
  }
  
  async RemoveGuardShedule(obj) {
    var { job_id,
      guard_id,
    }
  
    =  await jobUtil.verifyRemoveGuardShedule.validateAsync(obj);
      
    
      
     const item1 =await  this.ScheduleModel.destroy({
      where: {[Op.and]: 
        [{job_id},
        {guard_id }
        ]}
    })

    const item2 =await  this.AgendasModel.destroy({
      where: {[Op.and]: 
        [{job_id},
        {guard_id }
        ]}
    })




      
  }

  async checkIn(obj) {
    var { job_id,
      guard_id,
       check_in, 
       latitude, 
       longitude,
       
       }
  
    =  await jobUtil.verifyCheckinData.validateAsync(obj);
     // console.log(latitude, longitude )
      
    
      
     const foundItemJob =await  this.JobModel.findOne(
      { where: {id:job_id } })

      const foundItemFac =await  this.FacilityModel.findOne(
        { where: {id:foundItemJob.facility_id } })
      const foundItemFacLo =await  this.FacilityLocationModel.findOne(
        { where: {id:foundItemFac.facility_location_id } })
      const foundItemCoor =await  this.CoordinatesModel.findOne(
        { where: {id:foundItemFacLo.coordinates_id } })


        let my_time_zone=foundItemFac.time_zone||"Africa/Lagos"||"America/Tijuana"

          console.log(my_time_zone)

        let con_fig_time_zone = momentTimeZone.tz(my_time_zone)
        let date =new Date(con_fig_time_zone.format('YYYY-MM-DD hh:mm:ss a'))
        let time = String(con_fig_time_zone.format('hh:mm:ss a'))
        let full_date=con_fig_time_zone.format('YYYY-MM-DD hh:mm:ss a')


        console.log("start")
        console.log(date)
        console.log(time)
        console.log("end")

        
      let objLatLog={
        latitude:foundItemCoor.latitude,
        longitude:foundItemCoor.longitude,
        radius:foundItemFacLo.operations_area_constraint
      }

      if(this.isInlocation(latitude, longitude, objLatLog)){

        if(check_in){

          const foundItemS =await   this.ScheduleModel.findOne(
            {
              where: {[Op.and]: 
                [{check_in_date: {[Op.lte]: date} },
                {check_out_date: {[Op.gte]: date} },
                {job_id},
                {guard_id }
                ]}
            }
          )

           console.log(foundItemS)

            if(foundItemS){
                //CHECK IF IT IS TIME TO START 
                
              let storedDate=foundItemS.check_in_date
              let retrivedate=full_date

              //let storedDate='2022-01-07 08:30:00 am'    
              //let retrivedate='2022-01-07 08:50:00 am'
             // console.log(new Date(retrivedate))
             // console.log("na here")
             // console.log(moment(new Date(retrivedate)).format("YYYY-MM-DD hh:mm:ss A Z"));
              //console.log(retrivedate)
                
                if(moment(new Date(retrivedate),'YYYY-MM-DD  HH:mm:ss a').isSameOrAfter(new Date(storedDate)) ){
                

                  //THIS HELPS TO GET max_check_in_time
                  const foundItemS =await   this.ScheduleModel.findOne(
                    {
                      where: {[Op.and]: 
                        [{check_in_date: {[Op.lte]: date} },
                        {check_out_date: {[Op.gte]: date} },
                        {job_id},
                        {guard_id }
                        ]}
                    }
                  )

                    let foundItemJL =await this.JobLogsModel.findOne(
                      {
                        where: {[Op.and]: [{job_id },
                        {guard_id} , {check_in_status:true},{project_check_in_date:foundItemS.check_in_date}]}
                      }
                    )
                      console.log(date)
                      console.log("kkkkkkkkkkkkkkkkkkkkooooooooooooooooooo")
                      console.log(foundItemJL)
                      console.log(foundItemS.check_in_date)

                      

                  if(!foundItemJL){
                    if (this.checkIfGuardIsLate(storedDate,retrivedate,foundItemS.max_check_in_time)) {
                      
                      let coordinates_res=await this.CoordinatesModel.create({
                        longitude,
                        latitude
                      })
      
                      let obj={
                        message:"in location",
                        check_in_time:time,
                        check_in_status:true,
                        job_id,
                        guard_id,
                        coordinates_id:coordinates_res.id,
                        check_in_date:date,
                        project_check_in_date:foundItemS.check_in_date
                      }
      
                      this.JobLogsModel.create(obj).then((myRes)=>{
                        console.log(myRes)
                      })
                    }
                    else{
                      throw new LocationError("you are late cant check in");
                    }

                  }
                  else{
                   
                    throw new LocationError("you have check in already");

                  }
                }
                else{
                  throw new LocationError("not yet time to check");
                }

            }
            else{
              throw new LocationError("no shift available for check in");
            }

        }

        else{

          //FOR ALLOWING LATE CHECK OUT 30
          let con_fig_time_zone2 = momentTimeZone.tz(my_time_zone).subtract(60, 'minutes')
          let date2=new Date(con_fig_time_zone2.format('YYYY-MM-DD hh:mm:ss a'))

          const foundItemS =await   this.ScheduleModel.findOne(
            {
              where: {[Op.and]: 
                [{check_in_date: {[Op.lte]: date} },
                {check_out_date:{ [Op.or]: [{[Op.gte]: date2},{[Op.gte]: date}]  } },
                {job_id},
                {guard_id }
                ]}
            }
          )

          console.log(foundItemS)


          if(foundItemS){

            const foundItemJL =await   this.JobLogsModel.findOne(
              {
                where: {[Op.and]: [{job_id },
                {guard_id},{check_in_status:true},{project_check_in_date:foundItemS.check_in_date}]}
              }
            )
            if (!foundItemJL) {
              throw new LocationError("you have not check in yet");
  
            }
            else{


                  if (!foundItemJL.check_out_status) {
                  
                    let my_log_date_check_in=foundItemJL.check_in_date
                    let my_date_now_check_out=full_date
                    let my_shedule_date_check_in=foundItemS.check_in_date
                    let my_shedule_date_check_out=foundItemS.check_out_date


                    console.log(full_date)
                            /*           
                     retrivedate='2022-01-07 08:00:00 am'    
                      storedDate='2022-01-10 11:40:00 pm'*/

                                  
                      console.log("kkkkkkkkkkkkkkkkkkkkkkkkkk")

                    let my_job_H_worked=this.calculateHoursSetToWork(my_date_now_check_out,my_log_date_check_in )
                    console.log(my_job_H_worked)

                    
                    if(this.timePositionForCheckOut(my_date_now_check_out ,my_shedule_date_check_out)){
                      my_job_H_worked=this.calculateHoursSetToWork(my_date_now_check_out, my_log_date_check_in)
  
                        let obj={
                          check_out_time:time,
                          hours_worked:my_job_H_worked,
                          check_out_status:true,
                          check_out_date:new Date(full_date)
                        }
                          
                        let whereOptions ={[Op.and]: [{job_id },{guard_id} , {check_in_status:true},{project_check_in_date:foundItemS.check_in_date}]}
                        
                        this.JobLogsModel.update(obj,{
                        where:whereOptions})
  
                        
                      }
                      else{    
  
                        my_job_H_worked=this.calculateHoursSetToWork(my_shedule_date_check_out, my_log_date_check_in)
                        
                        let obj={
                          check_out_time:foundItemS.end_time,
                          hours_worked:my_job_H_worked,
                          check_out_status:true,
                          check_out_date:foundItemS.check_out_date
                        }
                          
                        let whereOptions ={[Op.and]: [{job_id },{guard_id} , {check_in_status:true},{project_check_in_date:foundItemS.check_in_date}]}
                        
                        this.JobLogsModel.update(obj,{
                        where:whereOptions})
  
                                            
                      }
  
                    
                    }
                    else{
                      throw new LocationError("you have check out already");
                    }   
            }
          }
          else{
            throw new LocationError("cant check out no shift available");
          }

      
        }

      }
      else{

        let coordinates_res=await this.CoordinatesModel.create({
          longitude,
          latitude
        })

        let obj={
          message:"not in location",
          check_in_time:time,
          check_in_status:false,
          job_id,
          guard_id,
          coordinates_id:coordinates_res.id,
          check_in_date: date,
          project_check_in_date:date
        }
        await this.JobLogsModel.create(obj)
        throw new LocationError( "You are not in location" );
      }


      
  }

 
 checkIfGuardIsLate(val1,val2,added_time){

    console.log(added_time)
    let stored_time = moment(new Date(val1) ,'YYYY-MM-DD HH:mm:ss a').add(added_time, 'minutes')
    let my_check_in_time = moment(new Date(val2)  ,'YYYY-MM-DD HH:mm:ss a');
    return my_check_in_time.isSameOrBefore(stored_time)
  
}

  timePositionForCheckOut(val1 ,val2){        
    
      let startTime1 =moment(new Date(val1)  ,'YYYY-MM-DD HH:mm:ss a');
      let startTime2 = moment(new Date(val2)  ,'YYYY-MM-DD HH:mm:ss a');

      return startTime1.isSameOrBefore(startTime2)

  }

/*
  timePositionForCheckIn(val ,val2){
    
    let startTime1 = moment(val, 'HH:mm:ss a');
    let startTime2 = moment(val2, 'HH:mm:ss a');

    return startTime1.isSameOrBefore(startTime2)

}

*/
  isInlocation(latitude,longitude,objLatLog){

    function getDistanceBetween(lat1, long1, lat2, long2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1); // deg2rad below
      var dLon = deg2rad(long2-long1);
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2) ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      d = d*1000 //Distance in meters
      return d;
    }
    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }


    console.log(getDistanceBetween(latitude,longitude,objLatLog.latitude,objLatLog.longitude))

    if(getDistanceBetween(latitude,longitude,objLatLog.latitude,objLatLog.longitude)>objLatLog.radius){
      return true
    }
    else{
      return true
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




 async getGuardDetail(val,job_id){


  let guard_detail=[]

  console.log("pppppssssssssss")

  console.log(val)


  for(let i=0;i<val.length;i++ ){

      const  foundU =await  this.UserModel.findOne({
        where: {id:val[i]}
      })

      const  foundJL =await  this.JobLogsModel.findAll({
        where: {[Op.and]: 
          [{check_in_status:true},
          {check_out_status: true},
          {job_id},
          {guard_id:val[i]}
          ]}
        })


       console.log(foundJL)
        let money_earned=0

        if(foundJL.length==0){
          let guard={
            first_name:foundU.first_name,
            last_name:foundU.last_name,
            image:foundU.image,
            email:foundU.email,
            money_earned,
            guard_id:foundU.id
          }
          guard_detail.push(guard)
        }else{
          for(let j=0;j<foundJL.length;j++ ){

            money_earned+=foundJL[j].hours_worked
            if(j==foundJL.length-1){
                
                let guard={
                  first_name:foundU.first_name,
                  last_name:foundU.last_name,
                  image:foundU.image,
                  email:foundU.email,
                  money_earned,
                  guard_id:foundU.id
                }
                guard_detail.push(guard)
            }
          }
        }


  if(i==val.length-1){

      return guard_detail

  }
}


  }


  async getJobDetail(val){

    const  foundj =await  this.JobModel.findOne({
      where: {id:val}
      })
      
     let job={
      description:foundj.description,
      customer_id:foundj.customer_id,
      facility_id:foundj.facility_id,
      guard_charge:foundj.staff_charge
     }
      
     return job
  }

  async getSiteDetail(val){

    const  foundF =await  this.FacilityModel.findOne({
      where: {id:val}
      })
      
     let site={
      name:foundF.name,
      time_zone:foundF.time_zone
     }
      
     return site
  }


  calculateHoursSetToWork(val ,val2){

    var startTime = moment(val, 'YYYY-MM-DD HH:mm:ss a');
      var endTime = moment(val2, 'YYYY-MM-DD HH:mm:ss a');

      // calculate total duration
      var duration = moment.duration(endTime.diff(startTime));

      // duration in hours
      var hours  : number = +duration.asHours();
    

      return hours
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


//https://stackoverflow.com/questions/30452977/sequelize-query-compare-dates-in-two-columns
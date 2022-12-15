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
  private JobReportsModel = JobReports;
  private JobSecurityModel = JobSecurityCode;


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










async getSinglejob(myObj: any): Promise<any[]> {
  try {

    let jobDetail=[]
    let myHours_worked=0

              let foundJL=    await this.JobLogsModel.findAll({
                where: {[Op.and]: 
                  [{check_in_status:true},
                    {guard_id:myObj.guard_id},
                  {check_out_status:true }
                  ]}
              })

              if(foundJL.length!=0){
                  for(let l=0;l<foundJL.length;l++){
                    myHours_worked+=foundJL[l].hours_worked
                  }
              }

              const foundS = await this.ScheduleModel.findAll({
                where: {[Op.and]: [{job_id:myObj.job_id },
                {guard_id:myObj.guard_id },
                {status_per_staff:'ACTIVE'}]},

                order: [
                  ["check_in_date", "ASC"],
            
                ],
              })

              if(foundS.length!=0){

                let schedule=[]
                for(let j=0;j<foundS.length;j++){
                  let obj={}
                  let sheduleObj=foundS[j]

                  

                  obj["check_in_date"]= await this.getDateOnly(sheduleObj.check_in_date)
                  obj["check_out_date"]= await this.getDateOnly(sheduleObj.check_out_date)
                  obj["start_time"]=await this.getTimeOnly(sheduleObj.check_in_date)
                  obj["end_time"]=await this.getTimeOnly(sheduleObj.check_out_date)

                  schedule.push(obj)
                  if(j==foundS.length-1){

                    const foundJ2 = await this.JobModel.findOne({
                      where: {id:sheduleObj.job_id}
                    })
                    const foundF = await this.FacilityModel.findOne({
                      where: {id:foundJ2.facility_id}
                    })

                    const foundFL= await this.FacilityLocationModel.findOne({
                      where: {id:foundF.facility_location_id}
                    })

                        jobDetail.push({schedule,
                          job_id:sheduleObj.job_id,
                          description:foundJ2.description,
                          job_type:foundJ2.job_type,
                          guard_charge:"$"+foundJ2.staff_charge,
                          time_zone:foundF.time_zone,
                          facility_name:foundF.name,
                          address:foundFL.address,
                          job_status:foundFL.address,
                          hours_worked:myHours_worked,
                          earn:"$"+myHours_worked*foundJ2.staff_charge,
                          guard_id:myObj.guard_id
                        })
                  } 


                  if(j==foundS.length-1){
                    return jobDetail
                  }
                }
               
              }
              else{
                return jobDetail
              }



  } catch (error) {
    console.log(error);
    return null;
  }
}











async getJobsForStaff(req: any): Promise<any[]> {


  const id = req.user.id;


  let myObj={
    id,
    jobType:req.query.jobType
}


  try {

    let jobDetail=[]



    
    if(myObj.jobType=="ACTIVE"){

      const foundJ = await this.JobModel.findAll({
        where: {job_status:'ACTIVE'}
      })

    
      if(foundJ.length!=0){
        for(let i=0;i<foundJ.length;i++){
              
              const foundS = await this.ScheduleModel.findAll({
                where: {[Op.and]: [{job_id:foundJ[i].id },
                {guard_id:myObj.id },
                {status_per_staff:'ACTIVE'}]}
              })


              if(foundS.length!=0){

                let schedule=[]
                for(let j=0;j<foundS.length;j++){
                  let obj={}
                  let sheduleObj=foundS[j]

                  obj["check_in_date"]= await this.getDateOnly(sheduleObj.check_in_date)
                  obj["check_out_date"]= await this.getDateOnly(sheduleObj.check_out_date)
                  obj["start_time"]=await this.getTimeOnly(sheduleObj.check_in_date)
                  obj["end_time"]=await this.getTimeOnly(sheduleObj.check_out_date)

                  schedule.push(obj)
                  if(j==foundS.length-1){

                    const foundJ2 = await this.JobModel.findOne({
                      where: {id:sheduleObj.job_id}
                    })
                    const foundF = await this.FacilityModel.findOne({
                      where: {id:foundJ2.facility_id}
                    })

                    const foundFL= await this.FacilityLocationModel.findOne({
                      where: {id:foundF.facility_location_id}
                    })

                    
                    jobDetail.push({schedule,
                      job_id:sheduleObj.job_id,
                      description:foundJ2.description,
                      job_type:foundJ2.job_type,
                      guard_charge:foundJ2.staff_charge,
                      time_zone:foundF.time_zone,
                      facility_name:foundF.name,
                      address:foundFL.address,
                      job_status:foundFL.address,

                  })
                  } 
                }
               
              }
  
          if(i==foundJ.length-1){
            console.log(jobDetail)

            return jobDetail
          }
        }
      }
      else{
        return jobDetail
      }


    }
    else if(myObj.jobType=="PENDING"){





      const foundJ = await this.JobModel.findAll({
        where: {job_status:'ACTIVE'}
      })

    
      if(foundJ.length!=0){
        for(let i=0;i<foundJ.length;i++){
              
              const foundS = await this.ScheduleModel.findAll({
                where: {[Op.and]: [{job_id:foundJ[i].id },
                {guard_id:myObj.id },
                {status_per_staff:'PENDING'}]}
              })
              if(foundS.length!=0){

                let schedule=[]
                for(let j=0;j<foundS.length;j++){
                  let obj={}
                  let sheduleObj=foundS[j]

                  obj["check_in_date"]= await this.getDateOnly(sheduleObj.check_in_date)
                  obj["check_out_date"]= await this.getDateOnly(sheduleObj.check_out_date)
                  obj["start_time"]=await this.getTimeOnly(sheduleObj.check_in_date)
                  obj["end_time"]=await this.getTimeOnly(sheduleObj.check_out_date)

                  schedule.push(obj)
                  if(j==foundS.length-1){

                    const foundJ2 = await this.JobModel.findOne({
                      where: {id:sheduleObj.job_id}
                    })
                    const foundF = await this.FacilityModel.findOne({
                      where: {id:foundJ2.facility_id}
                    })

                    const foundFL= await this.FacilityLocationModel.findOne({
                      where: {id:foundF.facility_location_id}
                    })

                    
                    jobDetail.push({schedule,
                      job_id:sheduleObj.job_id,
                      description:foundJ2.description,
                      job_type:foundJ2.job_type,
                      guard_charge:foundJ2.staff_charge,
                      time_zone:foundF.time_zone,
                      facility_name:foundF.name,
                      address:foundFL.address,
                      job_status:foundFL.address,

                  })
                  } 
                }
               
              }
  
          if(i==foundJ.length-1){
            console.log(jobDetail)

            return jobDetail
          }
        }
      }
      else{
        return jobDetail
      }




    }
    else if(myObj.jobType=="COMPLETED"){

      const myData={
        limit:Number(req.query.limit),
        offset:Number(req.query.offset)
      }


      const foundJ = await this.JobModel.findAll({
        where: {job_status:'COMPLETED'}
      })

    
      if(foundJ.length!=0){
        for(let i=0;i<foundJ.length;i++){
              
              const foundS = await this.ScheduleModel.findAll({
                limit: myData.limit,
                offset: myData.offset,
                where: {[Op.and]: [{job_id:foundJ[i].id },
                {guard_id:myObj.id },
                {status_per_staff:'ACTIVE'}]},
                order: [
                  ['created_at', 'ASC']
                ]
              })


              if(foundS.length!=0){

                let schedule=[]
                for(let j=0;j<foundS.length;j++){
                  let obj={}
                  let sheduleObj=foundS[j]

                  obj["check_in_date"]= await this.getDateOnly(sheduleObj.check_in_date)
                  obj["check_out_date"]= await this.getDateOnly(sheduleObj.check_out_date)
                  obj["start_time"]=await this.getTimeOnly(sheduleObj.check_in_date)
                  obj["end_time"]=await this.getTimeOnly(sheduleObj.check_out_date)

                  schedule.push(obj)
                  if(j==foundS.length-1){

                    const foundJ2 = await this.JobModel.findOne({
                      where: {id:sheduleObj.job_id}
                    })
                    const foundF = await this.FacilityModel.findOne({
                      where: {id:foundJ2.facility_id}
                    })

                    const foundFL= await this.FacilityLocationModel.findOne({
                      where: {id:foundF.facility_location_id}
                    })

                    
                    jobDetail.push({schedule,
                      job_id:sheduleObj.job_id,
                      description:foundJ2.description,
                      job_type:foundJ2.job_type,
                      guard_charge:foundJ2.staff_charge,
                      time_zone:foundF.time_zone,
                      facility_name:foundF.name,
                      address:foundFL.address,
                      job_status:foundFL.address,

                  })
                  } 
                }
               
              }
  
          if(i==foundJ.length-1){
            console.log(jobDetail)

            return jobDetail
          }
        }
      }
      else{
        return jobDetail
      }

    }
    else{
      return jobDetail
    }







   

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
    
        let foundC=await this.CustomerModel.findOne({
          where:{
            id:availableJob.customer_id
          }
        })
        let foundF=await this.FacilityModel.findOne({
          where:{
            id:availableJob.facility_id
          }
        })



        const jobRes = {
          id: availableJob.id,
          description: availableJob.description,
          client_charge: availableJob.client_charge,
          staff_payment: availableJob.staff_charge,
          status: availableJob.job_status,
          customer: foundC.first_name,
          site: foundF.name,
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

  
  
  async deleteJob(data: any): Promise<any> {
    try {
      const {
        job_id
      } = await jobUtil.verifyDeleteJob.validateAsync(data);


      console.log("lllllllllllllllllllllllllllllllllllllllllll")

      console.log(job_id)

      console.log("lllllllllllllllllllllllllllllllllllllllllll")


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

  



  async updateMaxCheckInTime(data: any): Promise<any> {
    try {
      const {
        guard_id,
        shedule_id,
        max_check_in_time
      } = await jobUtil.verifyUpdateMaxCheckInTime.validateAsync(data);



      let schedule=await this.ScheduleModel.update({max_check_in_time},{
        where: {[Op.and]: 
          [
            {guard_id},
            {id:shedule_id}
          ]}
      })
      console.log(schedule)
   
       
      
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
      })


        
     if(await this.checkIfDateAreApart(date_time_staff_shedule)){
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



              let myNewDateIn=new Date( moment(new Date(obj.check_in_date)).format('YYYY-MM-DD hh:mm:ss a'));
              let myNewDateOut= moment(new Date(obj.check_out_date));
             // let myNewDateFormatted1 = newDate.format('YYYY-MM-DD hh:mm:ss a');
              //let myNewDateOutFormatted1 = newDate2.format('YYYY-MM-DD hh:mm:ss a')

              let oldDate= moment( new Date(obj2.check_in_date));
              let oldDate2= moment( new Date(obj2.check_out_date));
              let dateNowFormatted3 = oldDate.format('YYYY-MM-DD');
              let dateNowFormatted4 = oldDate2.format('YYYY-MM-DD');
              //console.log(dateNowFormatted2)

              console.log("in : ",dateNowFormatted1,"out : ",dateNowFormatted2,"in : ",dateNowFormatted3 ,"out : ",dateNowFormatted4)
              console.log((dateNowFormatted1==dateNowFormatted3)&&(dateNowFormatted2==dateNowFormatted4)&&(obj.guard_id==obj2.guard_id))





//THIS CODE PREVENT DATE ENTANGLE MENT   ONE DATE FALLING INSIDE ANOTHE DATE


console.log(myNewDateIn)
              const foundItemS =await   this.ScheduleModel.findOne(
                {
                  where: {[Op.and]: 
                    [{check_in_date: {[Op.lte]: myNewDateIn} },
                    {check_out_date: {[Op.gte]: myNewDateIn} },
                    {job_id:obj.job_id},
                    {guard_id:obj.guard_id }
                    ]}
                }
              )

              console.log("========================")

              console.log(foundItemS)
              console.log("=============---------------===========")

              if(foundItemS){
                continue 
              }

              const foundItemS2 =await   this.ScheduleModel.findOne(
                {
                  where: {[Op.and]: 
                    [{check_in_date: {[Op.lte]: myNewDateOut} },
                    {check_out_date: {[Op.gte]: myNewDateOut} },
                    {job_id:obj.job_id},
                    {guard_id:obj.guard_id }
                    ]}
                }
              )
              if(foundItemS2){
                continue 
              }

              if((dateNowFormatted1==dateNowFormatted3)&&(dateNowFormatted2==dateNowFormatted4)&&(obj.guard_id==obj2.guard_id)){
                continue;
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


                return  await this.ScheduleModel.bulkCreate(cleanShedule);
                }else{
                  throw new DateSheduleError("no new shedule was created dublicate found");

                }
            }
          }
          if(cleanShedule.length!=0){
            await this.ScheduleModel.bulkCreate(cleanShedule);
          }
      }
      else{
        console.log(date_time_staff_shedule)

        await this.ScheduleModel.bulkCreate(date_time_staff_shedule);
      }
     
    
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

 
    if(accept=="true"){

     let relatedAssignment = await this.ScheduleModel.destroy(
        {where: {[Op.and]: [{ guard_id}, {job_id}]} }
      )
                    
      await this.AgendasModel.destroy(
        {where: {[Op.and]: [{ guard_id }, {job_id}]}}
      )



      if (relatedAssignment == null)
      throw new NotFoundError(
        "No Assignment was found for you.\nIt may not exist anymore"
      );

    }
    else{

  
      let relatedAssignment=await this.ScheduleModel.update(
        {
          status_per_staff:'PENDING',
        },
        {
        where: {[Op.and]: [{ guard_id}, {job_id}]}
      });
                    
      await this.AgendasModel.update(
        {
          status_per_staff:'PENDING',
        },
        {
        where: {[Op.and]: [{ guard_id }, {job_id}]}
        })



        console.log(relatedAssignment)

        if (relatedAssignment == null)
          throw new NotFoundError(
            "No Assignment was found for you.\nIt may not exist anymore"
          );

    }


   

    
  }


  async acceptDeclineJob(req) {

    var { job_id, accept } =req.body;
    let id=req.user.id


    var relatedAssignment = await this.ScheduleModel.update(
      {
        status_per_staff:accept=="true" ? 'ACTIVE' : 'DECLINE',
      },
      {
      where: {[Op.and]: [{ guard_id:id }, {job_id}]}
      }
      );

     await this.AgendasModel.update(
        {
          status_per_staff:accept="true" ? 'ACTIVE' : 'DECLINE',
        },
        {
        where: {[Op.and]: [{ guard_id:id }, {job_id}]}
        }
        );

      //console.log(relatedAssignment)

    if (relatedAssignment == null)
      throw new NotFoundError(
        "No Assignment was found for you.\nIt may not exist anymore"
      );

    return relatedAssignment;
    
  }

  
  async getLogPerGuard(obj) {
    var { job_id,
      guard_id
    }
  
    =  await jobUtil.verifyGetLogPerGuard.validateAsync(obj);
      
    
    const  foundJL =await  this.JobLogsModel.findAll(
      {
        where: {[Op.and]: 
           [
             {job_id},
             {guard_id}
           ]}
      }
    )

    let myLog=[]     
   if(foundJL.length!=0){
        for(let i=0;i<foundJL.length;i++ ){

            let obj={}

            let latLon =await  this.CoordinatesModel.findOne(
              {
                where: {id:foundJL[i].coordinates_id }
              }
            )


          obj["check_in_date"]= await this.getDateOnly(foundJL[i].check_in_date) 
          obj["check_out_date"]=foundJL[i].check_out_date ? await this.getDateOnly(foundJL[i].check_out_date) :'empty'
          obj["check_in_time"]=foundJL[i].check_in_time ?  foundJL[i].check_in_time:"empty"
          obj["check_out_time"]=foundJL[i].check_out_time  ?  foundJL[i].check_out_time:"empty"
          obj["log_id"]=foundJL[i].id
          obj["job_id"]=job_id
          obj["guard_id"]=guard_id


          if((foundJL[i].check_in_status==true)&&(true==foundJL[i].check_out_status)){
            obj["hours"]= await this.calculateHoursSetToWork( foundJL[i].check_out_date, foundJL[i].check_in_date)
          }
          else{
            obj["hours"]= 0
          }
          obj["location_message"]= foundJL[i].message
          obj["lat"]= latLon.latitude
          obj["log"]= latLon.longitude
         
          myLog.push(obj)

          if(i==foundJL.length-1){
            return myLog
          }
        }
   }
   else{
    return []
   }



      
  }
  



  

  async getAllUnsettleShiftOneGuard(obj,obj2) {
    var { guard_id,
      settlement
    }
  
    =  await jobUtil.verifyGetAllUnsettleShiftOneGuard.validateAsync(obj);
      
    

    if(settlement){



      let foundS=await this.ScheduleModel.findAll(
        {
          limit: obj2.limit,
          offset: obj2.offset,
          where:{settlement_status:settlement}
        }
      );

      console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
      console.log(foundS)
      console.log("==================================")


  
  
      let unSettledSucessfullShift=[]
      if(foundS.length!=0){
            for(let i=0; i<foundS.length; i++){
  
              let obj={}
                //JUST FOR GETTING THE CHARGE PER JOB
             // let foundJ=    await this.JobModel.findOne({where:{id: foundS[i].job_id}})
                
              let foundJL=    await this.JobLogsModel.findOne({
                where: {[Op.and]: 
                  [{check_in_status:true},
                    {project_check_in_date:foundS[i].check_in_date},
                  {check_out_status:true }
                  ]}
              })
  
              if(foundJL){
                let my_guard_info=  await this.getSingleGuardDetail(foundS[i].guard_id)
                let foundJ=await this.JobModel.findOne({
                  where:{
                    id:foundS[i].job_id
                  }
                })  
                
                let foundF=await this.FacilityModel.findOne({
                  where:{
                    id:foundJ.facility_id
                  }
                })   
  
  
                obj["hours_worked"]=foundJL.hours_worked
                obj["amount"]=foundJL.hours_worked*foundJ.staff_charge
                obj["charge"]=foundJ.staff_charge
                obj["first_name"]=my_guard_info["first_name"]
                obj["last_name"]=my_guard_info["last_name"]
                obj["start_date"]=await this.getDateOnly(foundS[i].check_in_date) 
                obj["start_time"]=foundS[i].start_time
                obj["end_date"]= await this.getDateOnly(foundS[i].check_out_date)
                obj["end_time"]=foundS[i].end_time
                obj["Job_hours"]=await this.calculateHoursSetToWork(foundS[i].check_out_date, foundS[i].check_in_date)
                obj["check_in_date"]=await this.getDateOnly(foundJL.check_in_date)    
                obj["check_in_time"]=foundJL.check_in_time
                obj["check_out_date"]= await this.getDateOnly(foundJL.check_out_date)  
                obj["check_out_time"]=foundJL.check_out_time
                obj["shedule_id"]=foundS[i].id
                obj["site_name"]=foundF.name
  
  
                unSettledSucessfullShift.push(obj)
                console.log("lllllllllllllll========================")

                console.log(obj)

  
              }
            
  
              if(i==foundS.length-1){
                return unSettledSucessfullShift
              }
            }
      }
      else{
        return unSettledSucessfullShift
      }
  
    }
    else{
      let foundS=await this.ScheduleModel.findAll(
        {
          where: {[Op.and]: [{guard_id },
          {settlement_status:settlement}]}
        }
      );
  
  
      let unSettledSucessfullShift=[]
      if(foundS.length!=0){
            for(let i=0; i<foundS.length; i++){
  
              let obj={}
                //JUST FOR GETTING THE CHARGE PER JOB
             // let foundJ=    await this.JobModel.findOne({where:{id: foundS[i].job_id}})
                
              let foundJL=    await this.JobLogsModel.findOne({
                where: {[Op.and]: 
                  [{check_in_status:true},
                    {project_check_in_date:foundS[i].check_in_date},
                  {check_out_status:true }
                  ]}
              })
  
              if(foundJL){
                let my_guard_info=  await this.getSingleGuardDetail(foundS[i].guard_id)
                let foundJ=await this.JobModel.findOne({
                  where:{
                    id:foundS[i].job_id
                  }
                })  
                
                let foundF=await this.FacilityModel.findOne({
                  where:{
                    id:foundJ.facility_id
                  }
                })   
  
  
                obj["hours_worked"]=foundJL.hours_worked
                obj["amount"]=foundJL.hours_worked*foundJ.staff_charge
                obj["charge"]=foundJ.staff_charge
                obj["first_name"]=my_guard_info["first_name"]
                obj["last_name"]=my_guard_info["last_name"]
                obj["start_date"]=await this.getDateOnly(foundS[i].check_in_date) 
                obj["start_time"]=foundS[i].start_time
                obj["end_date"]= await this.getDateOnly(foundS[i].check_out_date)
                obj["end_time"]=foundS[i].end_time
                obj["Job_hours"]=await this.calculateHoursSetToWork(foundS[i].check_out_date, foundS[i].check_in_date)
                obj["check_in_date"]=await this.getDateOnly(foundJL.check_in_date)    
                obj["check_in_time"]=foundJL.check_in_time
                obj["check_out_date"]= await this.getDateOnly(foundJL.check_out_date)  
                obj["check_out_time"]=foundJL.check_out_time
                obj["shedule_id"]=foundS[i].id
                obj["site_name"]=foundF.name
  
  
                unSettledSucessfullShift.push(obj)
  
              }
            
  
              if(i==foundS.length-1){
                return unSettledSucessfullShift
              }
            }
      }
      else{
        return unSettledSucessfullShift
      }
  
  
  
  
    }

 
      
  }


  

  async shiftPerGuardAllJob(obj) {
    var { 
      guard_id
    }
    =  await jobUtil.verifyShiftPerGuardAllJob.validateAsync(obj);
      
    
    const  foundS =await  this.ScheduleModel.findAll(
      {
        where: {[Op.and]: 
           [{guard_id}
           ]}
      }
    )



    let all_shift=[]     
   if(foundS.length!=0){
        for(let i=0;i<foundS.length;i++ ){

          let obj={}

          const foundJ = await this.JobModel.findOne({
             where: { id:foundS[i].job_id} });

          const foundF = await this.FacilityModel.findOne({
          where: { id:foundJ.facility_id} });

          const foundC = await this.CustomerModel.findOne({
            where: { id:foundJ.customer_id} });


          const  foundJL=await  this.JobLogsModel.findOne({
             where: {[Op.and]: 
                [{project_check_in_date:foundS[i].check_in_date},
                  {job_id:foundS[i].job_id},
                  {guard_id:foundS[i].guard_id},
                {check_in_status:true}
                ]}
          })

          console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
          console.log(foundJ)
          //obj["first_name"]= await this.getDateOnly(foundS[i].check_in_date) 
          //obj["last_name"]=await this.getDateOnly(foundS[i].check_out_date) 

          let name=await this.getSingleGuardDetail(foundS[i].guard_id)
          let hours=await this.calculateHoursSetToWork(foundS[i].check_in_date ,foundS[i].check_out_date)
          
     

          obj["start_date"]= await this.getDateOnly(foundS[i].check_in_date) 
          obj["end_date"]=await this.getDateOnly(foundS[i].check_out_date) 
          obj["start_time"]=foundS[i].start_time
          obj["end_time"]=foundS[i].end_time
          obj["hours"]= await this.calculateHoursSetToWork( foundS[i].check_out_date, foundS[i].check_in_date)
          obj["first_name"]= name["first_name"]
          obj["last_name"]= name["last_name"]
          obj["customer"]= foundC.first_name+" "+foundC.last_name;
          obj["site"]= foundF.name

          
          obj["guard_charge"]= "$"+foundJ.staff_charge
          obj["guard_id"]= foundS[i].guard_id
          obj["client_charge"]= foundJ.client_charge



          console.log("=================================")
          console.log(foundF)
          console.log("=================================")


          if(foundJL){
            if(foundJL.check_out_status==true){
              obj["check_in"]=await this.getDateAndTime(foundJL.check_in_date) 
              obj["check_out"]=await this.getDateAndTime(foundJL.check_out_date) 
              obj["hours_worked"]=foundJL.hours_worked
              obj["earned"]= "$"+(foundJL.hours_worked*foundJ.staff_charge).toFixed(2)
              obj["settlement_status"]=foundS[i].settlement_status

            }
            else{

              obj["check_in"]=await this.getDateAndTime(foundJL.check_in_date) 
              obj["check_out"]="empty" 
              obj["hours_worked"]=0
              obj["earned"]="$"+ 0
              obj["settlement_status"]="empty"
            }
          
          }
          else{
            obj["check_in"]="none"
            obj["check_out"]="none"
            obj["hours_worked"]=0
            obj["earned"]="$"+0
            obj["settlement_status"]="empty"

          }
                

          all_shift.push(obj)
        if(i==foundS.length-1){
          return all_shift
        }
      }
   }
   else{
    return []
   }



      
  }
  
  async getShiftPerGuard(obj) {
    var { job_id,
      guard_id
    }
  
    =  await jobUtil.verifyGetShiftPerGuard.validateAsync(obj);
      
    
    const  foundS =await  this.ScheduleModel.findAll(
      {
        where: {[Op.and]: 
           [
             {job_id},
             {guard_id}
           ]}
           ,
           order: [
            ['check_in_date', 'DESC'],
        ],
     }
    )

    let all_shift=[]     
   if(foundS.length!=0){
        for(let i=0;i<foundS.length;i++ ){

          let obj={}


          const foundJ = await this.JobModel.findOne({
             where: { id:foundS[i].job_id} });

          const foundF = await this.FacilityModel.findOne({
          where: { id:foundJ.facility_id} });

          const foundC = await this.CustomerModel.findOne({
            where: { id:foundJ.customer_id} });


          const  foundJL=await  this.JobLogsModel.findOne({
             where: {[Op.and]: 
                [{project_check_in_date:foundS[i].check_in_date},
                  {job_id:foundS[i].job_id},
                  {guard_id:foundS[i].guard_id},
                {check_in_status:true}
                ]}
          })

          //obj["first_name"]= await this.getDateOnly(foundS[i].check_in_date) 
          //obj["last_name"]=await this.getDateOnly(foundS[i].check_out_date) 

          let name=await this.getSingleGuardDetail(foundS[i].guard_id)
          let hours=await this.calculateHoursSetToWork(foundS[i].check_in_date ,foundS[i].check_out_date)
          
      console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkooooooooooo")

      console.log(hours)


          obj["start_date"]= await this.getDateOnly(foundS[i].check_in_date) 
          obj["end_date"]=await this.getDateOnly(foundS[i].check_out_date) 
          obj["start_time"]=foundS[i].start_time
          obj["end_time"]=foundS[i].end_time
          obj["hours"]= await this.calculateHoursSetToWork( foundS[i].check_out_date, foundS[i].check_in_date)
          obj["First_name"]= name["first_name"]
          obj["last_name"]= name["last_name"]
          obj["customer"]= foundC.first_name
          obj["site"]= foundF.name
          obj["guard_charge"]= foundF.guard_charge
          obj["guard_id"]= foundS[i].guard_id
          obj["client_charge"]= foundF.client_charge



          console.log("=================================")
          console.log(foundJL)
          console.log("=================================")


          if(foundJL){
            if(foundJL.check_out_status==true){
              obj["check_in"]=await this.getDateAndTime(foundJL.check_in_date) 
              obj["check_out"]=await this.getDateAndTime(foundJL.check_out_date) 
              obj["hours_worked"]=foundJL.hours_worked
              obj["earned"]= (foundJL.hours_worked*foundF.client_charge).toFixed(2)
            }
            else{

              obj["check_in"]=await this.getDateAndTime(foundJL.check_in_date) 
              obj["check_out"]="empty" 
              obj["hours_worked"]=0
              obj["earned"]= 0
            }
          
          }
          else{
            obj["check_in"]="none"
            obj["check_out"]="none"
            obj["hours_worked"]=0
            obj["earned"]= 0
          }
                

          all_shift.push(obj)
        if(i==foundS.length-1){
          return all_shift
        }
      }
   }
   else{
    return []
   }



      
  }

  async getGeneralShift(obj) {
    /*
    var { job_id,
      guard_id
    }
  
    =  await jobUtil.verifyGetgetGeneralShift.validateAsync(obj);
     */ 
    
    const  foundS =await  this.ScheduleModel.findAll({ order: [
      ['created_at', 'DESC']]
      })

    let all_shift=[]     
   if(foundS.length!=0){
        for(let i=0;i<foundS.length;i++ ){

          let obj={}


          const foundJ = await this.JobModel.findOne({
             where: { id:foundS[i].job_id} });

          const foundF = await this.FacilityModel.findOne({
          where: { id:foundJ.facility_id} });

          const foundC = await this.CustomerModel.findOne({
            where: { id:foundJ.customer_id} });


          const  foundJL=await  this.JobLogsModel.findOne({
             where: {[Op.and]: 
                [{project_check_in_date:foundS[i].check_in_date},
                  {job_id:foundS[i].job_id},
                  {job_id:foundS[i].job_id},
                {check_in_status:true}
                ]}
          })

          //obj["first_name"]= await this.getDateOnly(foundS[i].check_in_date) 
          //obj["last_name"]=await this.getDateOnly(foundS[i].check_out_date) 

          let name=await this.getSingleGuardDetail(foundS[i].guard_id)
          let hours=await this.calculateHoursSetToWork(foundS[i].check_in_date ,foundS[i].check_out_date)
          


          obj["start_date"]= await this.getDateOnly(foundS[i].check_in_date) 
          obj["end_date"]=await this.getDateOnly(foundS[i].check_out_date) 
          obj["start_time"]=foundS[i].start_time
          obj["end_time"]=foundS[i].end_time
          obj["hours"]= await this.calculateHoursSetToWork( foundS[i].check_out_date, foundS[i].check_in_date)
          obj["name"]= name["first_name"]+" "+name["last_name"]
          obj["customer"]= foundC.first_name +" "+foundC.last_name
          obj["site"]= foundF.name
          obj["guard_charge"]="$"+foundF.guard_charge
          obj["guard_id"]= foundS[i].guard_id
          obj["client_charge"]="$"+foundF.client_charge
          obj["job_status"]= foundJ.job_status
          obj["description"]= foundJ.description
          obj["settlement_status"]=foundS[i].settlement_status


          if(foundJL){
            if(foundJL.check_out_status==true){
              obj["check_in"]=await this.getDateAndTime(foundJL.check_in_date) 
              obj["check_out"]=await this.getDateAndTime(foundJL.check_out_date) 
              obj["hours_worked"]=foundJL.hours_worked
              obj["earned"]=  "$"+(foundJL.hours_worked*foundF.client_charge).toFixed(2)
            }
            else{

              obj["check_in"]=await this.getDateAndTime(foundJL.check_in_date) 
              obj["check_out"]="none" 
              obj["hours_worked"]=0
              obj["earned"]="$"+0
            }
          
          }
          else{
            obj["check_in"]="none"
            obj["check_out"]="none"
            obj["hours_worked"]=0
            obj["earned"]="$"+0
          }
                

          all_shift.push(obj)
        if(i==foundS.length-1){



          console.log(all_shift)
          return all_shift
        }
      }
   }
   else{
    return []
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



  
      try{
        if(data.reportType=="MESSAGE"){
        let createdRes= await this.JobReportsModel.create({
            job_id:data2.job_id,
            guard_id :data2.guard_id,
            report_type :data2.report_type,
            message :data2.message,
            is_emergency :data2.is_emergency,
            is_read:data2.is_read,
            who_has_it:data2.who_has_it

          })
          return createdRes

        }
        else{


          console.log(file)
          let createdRes=  await this.JobReportsModel.create({
              job_id:data2.job_id,
              guard_id :data2.guard_id,
              report_type:data2.report_type,
              file_url : file.path,
              is_emergency :data2.is_emergency,
              is_read:data2.is_read,
              who_has_it:data2.who_has_it

            })
          

            return createdRes

        }
          
      }
      catch (error) {
        console.log(error);
        throw new SystemError(error.toString());
      }

  
}
    


  async getOneShedulePerGuard(obj) {
    var { job_id,
      guard_id
    }
  
    =  await jobUtil.verifygetOneShedulePerGuard.validateAsync(obj);
      
    
    const  foundS =await  this.ScheduleModel.findAll({
      where: {[Op.and]: 
        [{job_id},
        {guard_id}
        ]}
        , 
        order: [
            ['check_in_date', 'ASC'],
            ['check_out_date', 'ASC'],
        ],
      })

    let all_shedule=[]     
   if(foundS.length!=0){

        for(let i=0;i<foundS.length;i++ ){

          let obj={
            check_in_date:await this.getDateOnly(foundS[i].check_in_date) ,
            start_time:foundS[i].start_time,
            check_out_date:await this.getDateOnly(foundS[i].check_out_date) ,
            end_time:foundS[i].end_time,
            hours:await this.calculateHoursSetToWork(foundS[i].check_out_date,foundS[i].check_in_date),
            shedule_id:foundS[i].id,
            guard_id:foundS[i].guard_id,
            job_id:foundS[i].job_id


          }
          all_shedule.push(obj)
          
        if(i==foundS.length-1){
          return all_shedule
        }
      }
   }
   else{
    console.log("jjjjjjjjjjjjjjjjj")
    return []
   }

  }
    
  async getGuardPerJob(obj) {
    var { job_id,
    }
  
    =  await jobUtil.verifygetGuardPerJob.validateAsync(obj);
      
    const  foundS =await  this.ScheduleModel.findAll({
    where: {job_id}
    })

    let all_guard_id=[]

   if(foundS.length!=0){
        let obj={}

        for(let i=0;i<foundS.length;i++ ){

          if(all_guard_id.includes(foundS[i].guard_id)){
            //continue
          }
          else{

            console.log(foundS[i].guard_id)
            all_guard_id.push(foundS[i].guard_id)

          }
        if(i==foundS.length-1){


          let foundG=  await this.getMultipleGuardDetail(all_guard_id,job_id)
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
   else{

    let job= await this.getJobDetail(job_id)
    let site= await this.getSiteDetail(job.facility_id)

    let detail={
        guard:[],
        job,
        site
    }


    return detail
   }
      
  }
  
  
  
  async getDeclinedJob(obj) {

    let foundS=await  this.ScheduleModel.findAll({
      where:{
        status_per_staff:'DECLINE'
      },
      group: ['job_id','guard_id']
    })

  


    
    let decline=[]

    if(foundS.length!=0){
      for(let i=0; i<foundS.length; i++){
        let obj={}
  
  
        let guardName= await this.getSingleGuardDetail(foundS[i].guard_id)
        

        let foundJ=await  this.JobModel.findOne({
          where:{
            id:foundS[i].job_id
          }
        })

       
        let customerF= await this.getCustomerDetail(foundJ.customer_id)
        let facilityF= await this.getSiteDetail(foundJ.facility_id)
  
        obj["date"]=await this.getDateOnly(foundJ.created_at)
        obj["Name"]=guardName["first_name"] +" "+ guardName["last_name"]
        obj["Phone_number"]=guardName["phone_number"]
        obj["customer_name"]=customerF["first_name"] +" "+ customerF["last_name"]
        obj["facility_name"]=facilityF["name"]
        obj["job_id"]=foundS[i].job_id
        obj["guard_id"]=foundS[i].guard_id

  
  
        decline.push(obj)
  
        if(i==foundS.length-1){
          return decline
        }
  
  
      }
    }
    return decline
   

  }



  

  async getDashBoardInfoGuard(req) {



    console.log("lllllllllllllllllllllllll")
    console.log(req.user.id)

  


    let foundS=await  this.ScheduleModel.findAll({
        where:{guard_id:req.user.id},
        group: ['job_id','guard_id']
    })
    let active=0
    let completed=0
    let pending=0
    let obj={}


  
    if(foundS.length!=0){

        for(let i=0;i<foundS.length;i++){
          let foundJ=await  this.JobModel.findOne({
            where:{id:foundS[i].job_id}
          })

   

          if(foundJ.job_status=='ACTIVE'&&foundS[i].status_per_staff=='ACTIVE'){
            active++
          }
          else if(foundJ.job_status=='COMPLETED'&&foundS[i].status_per_staff=='ACTIVE'){
            completed++
          }
          else if(foundJ.job_status=='ACTIVE'&&foundS[i].status_per_staff=='PENDING'){
            pending++
          }

          if(i==foundS.length-1){
            
              obj["active"]=active
              obj["completed"]=completed
              obj["pending"]=pending

              return obj

          }
        }
    }
    else{


      obj["active"]=active
      obj["completed"]=completed
      obj["pending"]=pending

      return obj
    }



   
  
   
  

  }





  async getDashBoardInfo(obj) {


    let foundC=await  this.CustomerModel.findAll()
    let foundG=await  this.UserModel.findAll({
      where:{
        role:'GUARD'
      }
    })

    let foundA=await  this.UserModel.findAll({
      where:{
        role:'ADMIN'
      }
    })
    let foundJ=await  this.JobModel.findAll({
      where:{
        job_status:'ACTIVE'
      }
    })
    obj={
      noCustomer:foundC.length,
      noStaff:foundA.length,
      noGuard: foundG.length,
      noActive:foundJ.length
    }

    return obj
   
  

  }
  
  async getAllSite(obj) {


    let foundF=await  this.FacilityModel.findAll()

   
    let availabLeGuard=[]
    if(foundF.length!=0){

          for(let i=0; i<foundF.length; i++){

            let obj={}
            obj["name"]=foundF[i].name
            obj["guard"]=foundF[i].id

            availabLeGuard.push(obj)


            if(i==foundF.length-1){
              return availabLeGuard
            }
             
          }
    }
    else{
      return []
    }

  }


  async getAllGuard(obj) {


    let foundG=await  this.UserModel.findAll({
      where:{
        role:'GUARD'
      }
    })

   
    let availabLeGuard=[]
    if(foundG.length!=0){

          for(let i=0; i<foundG.length; i++){

            let obj={}
            obj["name"]=foundG[i].first_name+" "+foundG[i].last_name
            obj["guard"]=foundG[i].id

            availabLeGuard.push(obj)


            if(i==foundG.length-1){
              return availabLeGuard
            }
             
          }
    }
    else{
      return []
    }

  }

  
  async getGuard(obj) {


/*
    let foundS= await  this.ScheduleModel.findAll({
      where:{
        job_id:obj.job_id
      }
    })
*/
    let arrayId=[]
    let detail=[]


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

     
          if(arrayId.includes(foundG[j].id)||await this.checkIfGuardIsInAnyActiveJob(foundG[j].id,obj.job_id)){

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


    let foundS=await  this.ScheduleModel.findAll({
      limit: obj.limit,
      offset: obj.offset,
      where: {settlement_status:obj.settlement}
    })


    let unSettledSucessfullShift=[]
    if(foundS.length!=0){

     
          for(let i=0; i<foundS.length; i++){

            let obj={}
              //JUST FOR GETTING THE CHARGE PER JOB
            let foundJ= await this.JobModel.findOne({where:{id: foundS[i].job_id}})
              
            let foundJL=    await this.JobLogsModel.findOne({
              where: {[Op.and]: 
                [{check_in_status:true},
                  {project_check_in_date:foundS[i].check_in_date},
                {check_out_status:true }
                ]}
            })
          


            if(foundJL){
              let my_guard_info=  await this.getSingleGuardDetail(foundS[i].guard_id)
              let myAmount=foundJL.hours_worked*foundJ.staff_charge
          

              obj["hours_worked"]=foundJL.hours_worked
              obj["amount"]=myAmount
              obj["first_name"]=my_guard_info["first_name"]
              obj["last_name"]=my_guard_info["last_name"]
              obj["id"]=foundS[i].guard_id
              obj["foundJL_id"]=foundJL.id
              obj["shedule_id"]=foundS[i].id


              unSettledSucessfullShift.push(obj)

            }
            else{
              //continue;
            }

            if(i==foundS.length-1){

                  if(unSettledSucessfullShift.length==0){
                    return unSettledSucessfullShift
                  }
                  else{
                    return  await this.combineUnsettleShift(unSettledSucessfullShift)

                  }


            }
          }
    }
    else{


      return unSettledSucessfullShift
    }

  }



  async settleShift(obj) {
    var { 
      schedule_id
    }
  
    =  await jobUtil.verifySettleShift.validateAsync(obj);
      


    for(let i=0;i <schedule_id.length; i++){
      let foundS=await  this.ScheduleModel.findOne({
        where: {id:schedule_id[i]}
      })
  
      await  this.ScheduleModel.update({settlement_status:!foundS.settlement_status},{
        where: {id:schedule_id[i]}
      })
    }

    


  }
  

  async updateJobStatus(obj) {
    var { job_id,
      status_value
    }
  
    =  await jobUtil.verifyUpdateJobStatus.validateAsync(obj);
      
      
    await  this.JobModel.update({job_status:status_value},{
      where: {id:job_id}
    })



  }

  async RemoveGuardSheduleLog(obj) {
    var { log_id
    }
  
    =  await jobUtil.verifyRemoveGuardSheduleLog.validateAsync(obj);
      
      
     const item1 =await  this.JobLogsModel.destroy({
      where: {id:log_id}
    })
  }



  
  async RemoveGuardSingleShedule(obj) {
    var { schedule_id,
      guard_id,
    }
  
    =  await jobUtil.verifyRemoveGuardSingleShedule.validateAsync(obj);
      
    
    await  this.ScheduleModel.destroy({
      where: {[Op.and]: 
        [{guard_id},
        {id:schedule_id }
        ]}
    })
      
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

  
  
  async checkInCheckOutAdmin(obj) {
    var { 
      shedule_id,
       check_in, 
       latitude, 
       longitude,
       job_id,
       date,
       guard_id
      }
  
    =  await jobUtil.verifyCheckInCheckOutAdmin.validateAsync(obj);
     // console.log(latitude, longitude )
      let time = moment(date).format('hh:mm:ss a')
    
        
     const foundItemS =await  this.ScheduleModel.findOne(
                  { where: {id:shedule_id } })

      if(foundItemS){
        const foundItemJL =await   this.JobLogsModel.findOne(
          {
            where: {[Op.and]: 
              [{project_check_in_date: {[Op.eq]: foundItemS.check_in_date} },
              {job_id},
              {guard_id }, 
              {check_in_status:true}
              ]}
          }
        )
        if(foundItemJL){



          if(check_in){
                        
            const foundItemS2 =await   this.ScheduleModel.findOne(
              {
                where: {[Op.and]: 
                  [{check_in_date: {[Op.lte]: date} },
                  {check_out_date: {[Op.gt]: date} },
                  {job_id},
                  {guard_id }
                  ]}
              }
            )

              if(foundItemS2){

                  if(await this.isBefore(date ,foundItemJL.check_out_date)){
                              
                    let obj={
                      check_in_time:time,
                      check_in_date:date,
                      check_in_status:true
                    }
                              
                  

                    this.JobLogsModel.update(obj,{
                    where:{id:foundItemJL.id}})
  

                }
                else{
                  throw new ConflictError("cant use date ")
                }

              }
              else{
                  throw new ConflictError("cant use date ")
              }
          }
          else{
                       
            const foundItemS2 =await   this.ScheduleModel.findOne(
              {
                where: {[Op.and]: 
                  [{check_in_date: {[Op.lte]: date} },
                  {check_out_date: {[Op.gte]: date} },
                  {job_id},
                  {guard_id }
                  ]}
              }
            )

            if(foundItemS2){

                if(await this.isAfter(date ,foundItemJL.check_in_date)){
                              
              
                    let obj={
                      check_out_time:time,
                      check_out_date:date,
                      check_out_status:true
                    }
                              
                    this.JobLogsModel.update(obj,{
                    where:{id:foundItemJL.id}})

                }
                else{
                  throw new ConflictError("cant use date ")
                }
            }
            else{
              throw new ConflictError("cant use date ")

            }






          }
     
        }
        else{

          
          if(check_in){
                        
            const foundItemS2 =await   this.ScheduleModel.findOne(
              {
                where: {[Op.and]: 
                  [{check_in_date: {[Op.lte]: date} },
                  {check_out_date: {[Op.gt]: date} },
                  {job_id},
                  {guard_id }
                  ]}
              }
            )

              if(foundItemS2){
                          

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
                  throw new ConflictError("cant use date ")
              }
          }
          else{
                       
            throw new ConflictError("you have not check in ")

          }

        }



      }
      else{

      }

        


      
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


      let objLatLog={
        latitude:foundItemCoor.latitude,
        longitude:foundItemCoor.longitude,
        radius:foundItemFacLo.operations_area_constraint
      }


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
 


            if(foundItemS){
                //CHECK IF IT IS TIME TO START 
                
              let storedDate=foundItemS.check_in_date
              let retrivedate=full_date

          
                if(moment(new Date(retrivedate),'YYYY-MM-DD  hh:mm:ss a').isSameOrAfter(new Date(storedDate)) ){
                
            


                  if(this.isInlocation(latitude, longitude, objLatLog)){


                          let foundItemJL =await this.JobLogsModel.findOne(
                            {
                              where: {[Op.and]: [{job_id },
                              {guard_id} , {check_in_status:true},{project_check_in_date:foundItemS.check_in_date}]}
                            }
                          )
                    
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
                                schedule_id:foundItemS.id,
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

                    let coordinates_res=await this.CoordinatesModel.create({
                      longitude,
                      latitude
                    })
            
            
                    if(check_in){
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
                    else{
                      let obj={
                        message:"not in location",
                        check_out_time:time,
                        check_out_status:false,
                        job_id,
                        guard_id,
                        coordinates_id:coordinates_res.id,
                        check_out_date: date,
                        project_check_in_date:date
                      }
                      await this.JobLogsModel.create(obj)
                      throw new LocationError( "You are not in location" );
                    }
                   
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

          if(this.isInlocation(latitude, longitude, objLatLog)){

            
            //FOR ALLOWING LATE CHECK OUT 30
            let con_fig_time_zone2 = momentTimeZone.tz(my_time_zone).subtract(1, 'minutes')
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

                                    
                      let my_job_H_worked=await this.calculateHoursSetToWork(my_date_now_check_out,my_log_date_check_in )

                      
                      if(this.timePositionForCheckOut(my_date_now_check_out ,my_shedule_date_check_out)){
                        my_job_H_worked=await this.calculateHoursSetToWork(my_date_now_check_out, my_log_date_check_in)
    
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
    
                          my_job_H_worked=await this.calculateHoursSetToWork(my_shedule_date_check_out, my_log_date_check_in)
                          
                          let obj={
                            check_out_time:foundItemS.end_time,
                            hours_worked:my_job_H_worked,
                            check_out_status:true,
                            check_out_date:foundItemS.check_out_date
                          }
                            
                          let whereOptions ={[Op.and]: [{job_id },{guard_id} , {check_in_status:true},{project_check_in_date:foundItemS.check_in_date}]}
                          /*
                          this.JobLogsModel.update(obj,{
                          where:whereOptions})
    */
                                              
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

          else{

            let coordinates_res=await this.CoordinatesModel.create({
              longitude,
              latitude
            })
    
    
            if(check_in){
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
            else{
              let obj={
                message:"not in location",
                check_out_time:time,
                check_out_status:false,
                job_id,
                guard_id,
                coordinates_id:coordinates_res.id,
                check_out_date: date,
                project_check_in_date:date
              }
              await this.JobLogsModel.create(obj)
              throw new LocationError( "You are not in location" );
            }
           
          }


        }

 


      
  }

 
 checkIfGuardIsLate(val1,val2,added_time){

    console.log(added_time)
    let stored_time = moment(new Date(val1) ,'YYYY-MM-DD hh:mm:ss a')
    let my_check_in_time = moment(new Date(val2)  ,'YYYY-MM-DD hh:mm:ss a').subtract(added_time, 'minutes');
    

    console.log("============here her here here =========")


    let stored_time2 = moment(new Date(val1) ).format('YYYY-MM-DD hh:mm:ss a')
    let my_check_in_time2 = moment(new Date(val2)).subtract(added_time, 'minutes').format('YYYY-MM-DD hh:mm:ss a')
    
    console.log(stored_time2)
    console.log(my_check_in_time2)

    
    
    return my_check_in_time.isSameOrBefore(stored_time)
  
}

  timePositionForCheckOut(val1 ,val2){        
    
      let startTime1 =moment(new Date(val1)  ,'YYYY-MM-DD HH:mm:ss a');
      let startTime2 = moment(new Date(val2)  ,'YYYY-MM-DD HH:mm:ss a');

      return startTime1.isSameOrBefore(startTime2)

  }


  
  async isAfter(val1 ,val2){

    let startTime1 =moment(new Date(val1)  ,'YYYY-MM-DD HH:mm:ss a');
    let startTime2 = moment(new Date(val2)  ,'YYYY-MM-DD HH:mm:ss a');

    return startTime1.isAfter(startTime2)

  
  }

  async isBefore(val1 ,val2){

    let startTime1 =moment(new Date(val1)  ,'YYYY-MM-DD HH:mm:ss a');
    let startTime2 = moment(new Date(val2)  ,'YYYY-MM-DD HH:mm:ss a');

    return startTime1.isBefore(startTime2)

  
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





  async getSingleGuardDetail(val){

    let obj={}
    const  foundU =await  this.UserModel.findOne({
      where: {id:val}
    })
    if(foundU){
      obj["first_name"]=foundU.first_name,
      obj["last_name"]=foundU.last_name
      obj["phone_number"]=foundU.phone_number

    }
    else{
      obj["first_name"]="deleted",
      obj["last_name"]="deleted"
    }

     return obj;
  }

 async getMultipleGuardDetail(val,job_id){

  let guard_detail=[]

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


 async getDateOnly(val){

   return moment(val).format('YYYY-MM-DD')
}

async getDateAndTime(val){

  return moment(val).format('YYYY-MM-DD hh:mm:ss a')
}



async getTimeOnly(val){

  return moment(val).format('hh:mm:ss a')
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


  async getCustomerDetail(val){

    const  foundC =await  this.CustomerModel.findOne({
      where: {id:val}
      })
      
     let Customer={
      first_name:foundC.first_name,
      last_name:foundC.last_name
     }
      
     return Customer
  }


  



async combineUnsettleShift(val){

    let hash={}
    let sum_of_guard_shift=[]

    for(let i=0;i<val.length;i++ ){
        let amount=0
        let hours=0
        let obj={}
        let id2=[]
        let id3=[]


        for(let j=0;j<val.length;j++ ){
           
            if(hash[val[i].id]){
                break
            }
            else{

                if(val[i].id==val[j].id){

                    amount+=val[j].amount
                    hours+=val[j].hours_worked

                    id2.push(val[j].foundJL_id)
                    id3.push(val[j].shedule_id)


                }
               
            }

            if(j==val.length-1){

                console.log(amount)
                obj["id"]=val[i].id
                obj["amount"]=amount
                obj["hours_worked"]=hours
                obj["first_name"]=val[i].first_name
                obj["last_name"]=val[i].last_name
                obj["foundJL_id"]=id2
                obj["shedule_id"]=id3


                sum_of_guard_shift.push(obj)
                hash[val[i].id]=true
            }



        }

        if(i==val.length-1){

            return sum_of_guard_shift

        }
    }      
      
  }


async checkIfDateAreApart(postedDate){

  let myShedule=await this.ScheduleModel.findAll({
        where: { job_id:postedDate[0].job_id }
      })

let combinedArray=[...postedDate,...myShedule]
      console.log(combinedArray)

for(let i=0;i<combinedArray.length ;i++){

  for(let j=0;j<combinedArray.length;j++){

    if(i==j || combinedArray[i].guard_id!=combinedArray[j].guard_id){

      continue
    }

    if(moment(combinedArray[i].check_in_date).isBefore(combinedArray[j].check_out_date)){
        if(moment(combinedArray[i].check_out_date).add(60, 'minutes').isBefore(combinedArray[j].check_in_date)){

          
        }
        else{
              let name= await this.getSingleGuardDetail(combinedArray[i].guard_id)


              let data={
                message:`This schedule (start date:${moment(combinedArray[i].check_in_date).format("YYYY-MM-DD  hh:mm:ss a")},end date:${moment(combinedArray[i].check_out_date).format("YYYY-MM-DD  hh:mm:ss a")  } )  is clashing with (start date:${moment(combinedArray[j].check_in_date).format("YYYY-MM-DD  hh:mm:ss a")    },end date:${moment(combinedArray[j].check_out_date).format("YYYY-MM-DD  hh:mm:ss a") } ) or they are not far apart `,
                solution:`SOLUTION :remove this guard (${name["first_name"]} ${name["last_name"] }) from the schedule or adjust the date`
              }
      
                throw new TimeError(JSON.stringify(data));
        }
    }
    else if(moment(combinedArray[i].check_in_date).subtract(60, 'minutes').isAfter(combinedArray[j].check_out_date)){

    }
    else{
        let name= await this.getSingleGuardDetail(combinedArray[i].guard_id)


        let data={
          message:`This schedule (start date:${moment(combinedArray[i].check_in_date).format("YYYY-MM-DD  hh:mm:ss a")},end date:${moment(combinedArray[i].check_out_date).format("YYYY-MM-DD  hh:mm:ss a")  } )  is clashing with (start date:${moment(combinedArray[j].check_in_date).format("YYYY-MM-DD  hh:mm:ss a")    },end date:${moment(combinedArray[j].check_out_date).format("YYYY-MM-DD  hh:mm:ss a") } ) or they are not far apart `,
          solution:`SOLUTION :remove this guard (${name["first_name"]} ${name["last_name"] }) from the schedule or adjust the date`
        }

          throw new TimeError(JSON.stringify(data));
        

    }
  }
  if(i==combinedArray.length-1){
      return true
  }
}
  
}

async checkIfGuardIsInAnyActiveJob(guard_id,job_id){

  let foundJ=await this.JobModel.findAll(
    {
      where:
      {[Op.and]: 
        [
          { job_status:'ACTIVE'},
          {id:{[Op.ne]:job_id}}
        ]}
    }
  )


  /**{
      where:{ job_status:'ACTIVE'}
    } */

  
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




  async calculateHoursSetToWork(to ,from){

 
    
    let init2 = moment(from).format('YYYY-MM-DD hh:mm:ss a');
    let now2 = moment(to).format('YYYY-MM-DD hh:mm:ss a')
  
    console.log(init2)
    console.log(now2)

    let init = moment(from, 'YYYY-MM-DD hh:mm:ss a');
    let now = moment(to, 'YYYY-MM-DD hh:mm:ss a');

   
      // calculate total duration
      let duration = moment.duration(now.diff(init));
      // duration in hours
      let hours  : number = duration.asHours();
      

      return Number(hours.toFixed(2)) 
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
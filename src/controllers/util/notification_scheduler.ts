import { fn, col, Op, QueryError, where, FLOAT, Sequelize } from "sequelize";
import moment from "moment";
import momentTimeZone from "moment-timezone";
import webpush from "web-push";

import {
    Admin,
    Schedule,
    Job,
    Agendas,
    JobSecurityCode,
    JobLogs,
    Subscriptions
  } from "../../db/models";
  
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
  } from "../../errors";
import { func } from "joi";

  
  class UtilService {
    private UserModel = Admin;
    private JobModel = Job;
    private ScheduleModel = Schedule;
    private JobLogsModel = JobLogs;
    private AgendasModel = Agendas;
    private JobSecurityCodeModel = JobSecurityCode;
    private SubscriptionsModel = Subscriptions
  
  

    async sendNotificationToGuardForShiftCheckAndOut() {



      let foundJ=await this.JobModel.findAll({
                          where:{
                          [Op.and]:[
                              {job_status:'ACTIVE'},
                              {is_deleted:false}
                          ]
                          }
                  })

      if(foundJ.length!=0){
          for (let index = 0; index < foundJ.length; index++) {
              let foundS=await this.ScheduleModel.findAll({
                  where:{
                      [Op.and]:[
                          {job_id:foundJ[index].id},
                          {status_per_staff:'ACTIVE'},
                          {is_deleted:false}
                      ]
                    }
              })
              for (let index2 = 0; index2 < foundS.length; index2++) {
                let foundG=await this.UserModel.findByPk(foundS[index2].guard_id) 
                if(foundG.notification){


                  let timeZone= foundJ[index].time_zone
                  let current_date= momentTimeZone.tz(timeZone);

                  let check_in_date=foundS[index2].check_in_date
                  
                  let job_id=foundJ[index].id
                  if(foundS[index2].is_check_in_notification_sent){
                    handle_check_out_notification(foundS[index2],current_date)
                  }
                  else{
                                            
                    if(current_date.isSameOrBefore(check_in_date)&&Math.abs(current_date.diff(check_in_date)) <= 3600000){
                        const remainingMinutes = moment(check_in_date).diff(current_date, 'minutes');
                        let foundSub= await this.SubscriptionsModel.findOne({
                            where:{
                              guard_id:foundG.id
                            }
                        })

                        let foundJL= await this.JobLogsModel.findOne({
                          where: {
                            [Op.and]: [
                              { guard_id:foundG.id},
                              { check_in_status:true},
                              { job_id},
                            ],
                          },
                        })
                    
                    
                        let sub =JSON.parse(JSON.stringify(foundSub.subscription))
                        let payload
                        
                        if(foundJL){

                          payload={
                              notification: {
                              title: "Upcoming job schedule",
                              body: `Your have a job schedule starting  in  ${remainingMinutes}m`,
                              vibration: [200, 100, 200, 100, 200],
                              
                            }
                          }
                        }
                        else{

                            payload={
                              notification: {
                                title: "Upcoming job schedule",
                                body: `Check in You have a job schedule starting in ${remainingMinutes}m`,
                                vibration: [200, 100, 200, 100, 200]
                              }
                            }
                        }

                        
                        sub=JSON.parse(sub)
                        payload=JSON.stringify(payload)
                        webpush.sendNotification(sub,payload).then(()=>{


                          let update={
                            is_check_in_notification_sent:true
                          }

                          this.ScheduleModel.update(update,{
                            where: {
                              id:foundS[index2].id
                            },
                          })
                        }).catch(err=>console.log(err))   
                    }
                    else{
                      handle_check_out_notification(foundS[index2],current_date)

                    }
                  }
                }
              }
          }
      }




     async function handle_check_out_notification(Schedule_details,current_date){
        
      //Schedule_details.is_check_out_notification_sent
        if(Schedule_details.is_check_out_notification_sent){
            
        }
        else{

         

          //1800000=30minute
          
          if(current_date.isSameOrAfter(Schedule_details.check_out_date)&&Math.abs(current_date.diff(Schedule_details.check_out_date)) <= 1800000){
            let remainingMinutes = current_date.diff(Schedule_details.check_out_date, 'minutes');
            remainingMinutes=30-remainingMinutes
            let foundSub= await Subscriptions.findOne({
                where:{
                  guard_id:Schedule_details.guard_id
                }
            })

            let foundJL= await JobLogs.findOne({
              where: {
                [Op.and]: [
                  { guard_id:Schedule_details.guard_id},
                  { check_out_status:true},
                  { job_id:Schedule_details.job_id},
                ],
              },
            })
        
        
            let sub =JSON.parse(JSON.stringify(foundSub.subscription))
            let payload
            
            if(foundJL){

              payload={
                  notification: {
                  title: "Job schedule ended",
                  body: `Your  job scheduled for  has ended`,
                  vibration: [200, 100, 200, 100, 200],
                }
              }
            }
            else{

                payload={
                notification: {
                  title: "Job schedule ended",
                  body: `Check out your job schedule has ended time remaining ${remainingMinutes}m`,
                  vibration: [200, 100, 200, 100, 200],
                  
                }
              }
            }

        

            sub=JSON.parse(sub)
            payload=JSON.stringify(payload)
            

            webpush.sendNotification(sub,payload).then(()=>{

              let update={
                is_check_out_notification_sent:true
              }

              Schedule.update(update,{
                where: {
                  id:Schedule_details.id
                }
              })

            }).catch(err=>console.log(err))

          }
        }
      }

    }
  

  }
  
  export default new UtilService();
  
  //https://stackoverflow.com/questions/30452977/sequelize-query-compare-dates-in-two-columns
  




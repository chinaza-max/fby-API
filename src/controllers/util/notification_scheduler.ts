import { fn, col, Op, QueryError, where, FLOAT, Sequelize } from "sequelize";
import moment from "moment";
import momentTimeZone from "moment-timezone";
import serverConfig from "../../../src/config/server.config";
import NotificationService from "../../service/push.notification.service";


import {
    Admin,
    Schedule,
    Job,
    Agendas,
    JobSecurityCode,
    JobLogs,
    Memo,
    MemoReceiver,
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
    private SubscriptionsModel = Subscriptions
    private MemoModel = Memo;
    private MemoReceiverModel = MemoReceiver;



  

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
                              staff_id:foundG.id
                            }
                        })


                        if(foundSub){
                              
                          let foundJL= await this.JobLogsModel.findOne({
                            where: {
                              [Op.and]: [
                                { guard_id:foundG.id},
                                { check_in_status:true},
                                { job_id},
                              ],
                            },
                          })
                      
                    
                          //let sub =JSON.parse(JSON.stringify(foundSub.subscription))
                          let sub =foundSub.subscription

                          let payload
                        
                          if(foundJL){

                            payload={
                                notification: {
                                title: "FBY TEAM Upcoming job schedule",
                                body: `Your have a job schedule starting  in  ${remainingMinutes}m`,
                                
                              }
                            }
                          }
                          else{

                              payload={
                                notification: {
                                  title: " FBY TEAM Upcoming job schedule",
                                  body: `Check in You have a job schedule starting in ${remainingMinutes}m`,
                                }
                              }
                          }

                          /*
                          //sub=JSON.parse(sub)
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
*/

/*
                          payload={...payload,token:sub}
        
  
                          firebase.messaging().send(payload)
                          .then((response) => {
                            console.log('Successfully sent message:', response);
                           
                            let update={
                              is_check_in_notification_sent:true
                            }

                            this.ScheduleModel.update(update,{
                              where: {
                                id:foundS[index2].id
                              },
                            })
                            
                          })
                          .catch((error) => {
                            console.log('Error sending message:', error);
                          })
*/

                          try {
                            await NotificationService.sendPushNotification(
                              {
                                type : "Check in",
                                token : sub,
                                title :payload.notification.title,
                                body:payload.notification.body,
                                icon: "ICON URL",
                              })
              
                              let update={
                                is_check_in_notification_sent:true
                              }
  
                              this.ScheduleModel.update(update,{
                                where: {
                                  id:foundS[index2].id
                                },
                              })

                          } catch (error) {
                              console.error("An error occurred:", error.message);
                          }  
                    
                        }
                    
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
          //current_date.isSameOrAfter(Schedule_details.check_out_date)&&Math.abs(current_date.diff(Schedule_details.check_out_date)) <= 1800000
          if(current_date.isSameOrAfter(Schedule_details.check_out_date)&&Math.abs(current_date.diff(Schedule_details.check_out_date)) <= 1800000){
            let remainingMinutes = current_date.diff(Schedule_details.check_out_date, 'minutes');
            remainingMinutes=30-remainingMinutes
            let foundSub= await Subscriptions.findOne({
                where:{
                  staff_id:Schedule_details.guard_id
                }
            })

            if(foundSub){
              
              let foundJL= await JobLogs.findOne({
                where: {
                  [Op.and]: [
                    { guard_id:Schedule_details.guard_id},
                    { check_out_status:true},
                    { job_id:Schedule_details.job_id},
                  ],
                },
              })
        
              let sub =foundSub.subscription
              // let sub =JSON.parse(JSON.stringify(foundSub.subscription))
              let payload
            
              if(foundJL){

                payload={
                    notification: {
                    title: "FBY TEAM Job schedule ended",
                    body: `Your  job scheduled  has ended`,
                  // vibration: [200, 100, 200, 100, 200],
                  }
                }
              }
              else{
                  payload={
                  notification: {
                    title: "FBY TEAM Job schedule ended",
                    body: `Check out your job schedule has ended time remaining ${remainingMinutes}m`,
                  // vibration: [200, 100, 200, 100, 200],
                  }
                }
              }


            try {
              await NotificationService.sendPushNotification(
                {
                  type : "Check out",
                  token : sub,
                  title :payload.notification.title,
                  body:payload.notification.body,
                  icon: "ICON URL",
                })

                let update={
                  is_check_out_notification_sent:true
                }
  
                Schedule.update(update,{
                  where: {
                    id:Schedule_details.id
                  }
                })
            } catch (error) {
                console.error("An error occurred:", error.message);
            }  


             // payload={...payload,token:sub}
        
/*
              firebase.messaging().send(payload)
              .then((response) => {
                console.log('Successfully sent message:', response);
                let update={
                  is_check_out_notification_sent:true
                }
  
                Schedule.update(update,{
                  where: {
                    id:Schedule_details.id
                  }
                })
              })
              .catch((error) => {
                console.log('Error sending message:', error);
              })
*/
            }


        
/*
            sub=JSON.parse(sub)
            payload=JSON.stringify(payload)
*/


            
/*
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
            */
/*
            firebase.initializeApp({
              credential: firebase.credential.cert(
                serviceAccount as firebase.ServiceAccount
              ),
            });
            */

           // sub="dO2HZ4S8YfABy5jkXwoSQ2:APA91bHbEPa5Gk8DHqP712ONEoB0RKaYcNyj14lJtVDp_dTPQuoIfX-AQKNgVYa4n2OmmYLvq8RFPtlsVGJly8vkF3w8ZXulJHQCzz5vx88srNPp986SiHH04pVKyoaVeCkYCsTmUOai"
           




          }
        }
    }

    }

    



    async sendNotificationForMessageSent() {



      let foundM = await this.MemoModel.findAll({
        where:{
        is_notification_sent:false
        }
      })


      for (let index = 0; index < foundM.length; index++) {


        const dateStamp = await this.getDateAndTimeForStamp(
          foundM[index].time_zone
        )
        if (!moment(foundM[index].send_date).isAfter(dateStamp)) {
            
          let foundMR = await this.MemoReceiverModel.findAll({
            where:{
              memo_id:foundM[index].id
            }
          })

          for (let index2 = 0; index2 < foundMR.length; index2++) {
            let foundG=await this.UserModel.findByPk(foundMR[index2].staff_id) 

            if(foundG){
    
              if(foundG.notification){
                  let foundSub= await this.SubscriptionsModel.findOne({
                    where:{
                      staff_id:foundG.id
                    }
                  })
    
                
    
                  if(foundSub){

                    let message="We would like to inform you about an important memo that has been issued by the management. login to the app view"

                    try {
                      let sub =foundSub.subscription
                      await NotificationService.sendPushNotification(
                        {
                          type:"memo",
                          token : sub,
                          title :"FBY TEAM ",
                          body:message,
                          icon: "ICON URL",
                        })



                        let update={
                          is_notification_sent:true
                        }
          
                        this.MemoModel.update(update,{
                          where: {
                            id:foundM[index].id
                          }
                        })
                        
          
                    } catch (error) {
                        console.error("An error occurred:", error.message);
                    } 

    
                  }
              }
            }
    
          }

        } 



       
        
      }

      
      

    }
  

    
    async getDateAndTimeForStamp(my_time_zone) {
      let con_fig_time_zone = momentTimeZone.tz(my_time_zone);
      let date = new Date(con_fig_time_zone.format("YYYY-MM-DD hh:mm:ss a"));

      return date;
    }



    async sendNotificationToGuardAndAdminForFailedCheckIn() {
      let foundJ=await this.JobModel.findAll({
                  where: {
                      [Op.and]: [
                        { is_deleted: false },
                        { job_status: "ACTIVE"  }
                      ],
                    },
                  })

          if(foundJ.length!=0){
              for (let index = 0; index < foundJ.length; index++) {

                const dateStamp = await this.getDateAndTimeForStamp(foundJ[index].time_zone);

                let foundS=await this.ScheduleModel.findAll({
                  where: {
                      [Op.and]: [
                        { is_deleted: false },
                        { job_id: foundJ[index].id },
                        { status_per_staff: "ACTIVE"  }
                      ],
                    },
                  })

                  for (let index2 = 0; index2 < foundS.length; index2++) {

                    if(foundS[index2].is_late_check_in_notification_sent){

                    }
                    else{

                        let foundJL= await this.JobLogsModel.findOne({
                          where: {
                            [Op.and]: [
                              { guard_id:foundS[index2].guard_id},
                              { check_in_status:true},
                              { job_id:foundJ[index].id}
                            ],
                          },
                        })
                        
                        if(foundJL){

                        }
                        else{

                            if(moment(dateStamp).isAfter( foundS[index2].check_in_date)){
                                
                              let foundG= await this.UserModel.findByPk(
                                foundS[index2].guard_id
                              )
                                
                              let fullName=foundG.first_name +" "+foundG.last_name
                              let type="No Check in"

                              const remainingMinutes = moment(dateStamp).diff( foundS[index2].check_in_date, 'minutes');

                              //This notification to the guard that fails to check in
                              let foundSub= await this.SubscriptionsModel.findOne({
                                                  where:{
                                                    staff_id:foundS[index2].guard_id
                                                  }
                                            })
                              
                                  
                                if(foundSub){

                                  let sub =foundSub.subscription
                                  try {
                                    await NotificationService.sendPushNotification(
                                      {
                                        type,
                                        token : sub,
                                        title :"FBY TEAM ",
                                        body:`You have not check in yet, job ID:${foundJ[index].id}`,
                                        icon: "ICON URL",
                                      })
                                      

                                      let update={
                                        is_late_check_in_notification_sent:true
                                      }
          
                                      this.ScheduleModel.update(update,{
                                        where: {
                                          id:foundS[index2].id
                                        },
                                      })
                                    
                                  } catch (error) {
                                      console.error("An error occurred:", error.message);
                                  } 



                                }

                                //This part send notification to all admin that a particular guard failed to check in

                                let foundA=await this.UserModel.findAll({
                                  where:{
                                    role: { [Op.ne]: "GUARD" }
                                  }
                                })
                          
                          
                                let message=`${fullName} with ID:${foundG.id}  has not check in  ${remainingMinutes}m late. Job ID${foundJ[index].id}`
                              
                                foundA.forEach(async element => {

                                  if(element.notification){
                                    let foundSub= await this.SubscriptionsModel.findOne({
                                      where:{
                                        staff_id:element.id
                                      }
                                    })
                                    if(foundSub){
                               
                                      try {
                                        let sub =foundSub.subscription
                                        await NotificationService.sendPushNotification(
                                          {
                                            type,
                                            token : sub,
                                            title :`FBY TEAM `,
                                            body:message,
                                            icon: "ICON URL",
                                          })
                                         
                                      } catch (error) {
                                          console.error("An error occurred:", error.message);
                                         
                                      } 
                                    }
                                  }
                                
                                  
                                });

                            }
                            else{

                            }

                        }
                  
                    }
                  }
                
              }
          }


    }

  }
  
  export default new UtilService();
  
  //https://stackoverflow.com/questions/30452977/sequelize-query-compare-dates-in-two-columns
  




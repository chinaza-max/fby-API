
import { NotificationOptionsI } from "../interfaces/Notification.interface";
import * as firebase from "firebase-admin";


class NotificationService {


  async sendPushNotification(options: NotificationOptionsI) {


    let payload={
      notification: {
        title:options.title,
        body:options.body,
      }, 
      token:options.token
    }

    await firebase.messaging().send(payload)

 /*
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
}

export default new NotificationService();

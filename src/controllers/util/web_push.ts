import webpush from 'web-push';
import serverConfig from "../../config/server.config";


const publicVapidKey = serverConfig.PUBLIC_KEY_PUSH_NOTIFICATION;
const privateVapidKey = serverConfig.PRIVATE_KEY_PUSH_NOTIFICATION;


export default (): void => {
  webpush.setVapidDetails(
    'mailto:test@test.com',
    publicVapidKey,
    privateVapidKey,
  );
};





/**REFERENCE FOR PUSH NOTIIFICATION 
 * 
 * https://felixgerschau.com/web-push-notifications-tutorial/
*/
import { v2 as Cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import serverConfig from "../config/server.config";



const storageB = multer.diskStorage({
  destination: function (req, file, cb) {


    if(serverConfig.NODE_ENV == "production"){
      cb(null, '/home/fbyteamschedule/public_html/fby-security-api/public/images/files');

    }
    else if(serverConfig.NODE_ENV == "development"){
      cb(null, 'public/images/files')
    }

  },
  filename: function (req, file, cb) {

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname +'-' + uniqueSuffix+'-'+file.originalname)
  }
})



const storageA = multer.diskStorage({
  destination: function (req, file, cb) {
    

    if(serverConfig.NODE_ENV == "production"){
      cb(null, '/home/fbyteamschedule/public_html/fby-security-api/public/images/avatars');

    }
    else if(serverConfig.NODE_ENV == "development"){
      cb(null, 'public/images/avatars')
    }

  },
  filename: function (req, file, cb) {

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+'-'+file.originalname)
  }
})


const uploads = multer({ storage: storageB });
const avatars = multer({ storage: storageA });




export default {uploads, avatars};

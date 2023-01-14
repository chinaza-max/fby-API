import { v2 as Cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";



const storageB = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")

    cb(null, 'public/images/files')

  },
  filename: function (req, file, cb) {

    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname +'-' + uniqueSuffix+'-'+file.originalname)
  }
})



const storageA = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, 'public/images/avatars')
  },
  filename: function (req, file, cb) {

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+'-'+file.originalname)
  }
})



const uploads = multer({ storage: storageB });
const avatars = multer({ storage: storageA });




export default {uploads, avatars};

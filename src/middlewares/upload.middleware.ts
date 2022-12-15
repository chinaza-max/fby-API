import { v2 as Cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import serverConfig from "../config/server.config";

Cloudinary.config({
  cloud_name: serverConfig.CLOUDINARY_CLOUD_NAME,
  api_key: serverConfig.CLOUDINARY_API_KEY,
  api_secret: serverConfig.CLOUDINARY_API_SECRET,
});

const uStorage = new CloudinaryStorage({
  cloudinary: Cloudinary,
  params: {
    folder: "files",
    resource_type: 'auto',
    allowedFormats: ['jpeg', 'png', 'jpg', 'mp3', 'mp4' , 'pdf'],
  } as any
});


const aStorage = new CloudinaryStorage({
  cloudinary: Cloudinary,
  params: {
    folder: "avatars",
  } as any
});

const uploads = multer({ storage: uStorage });
const avatars = multer({ storage: aStorage });

export default {uploads, avatars};

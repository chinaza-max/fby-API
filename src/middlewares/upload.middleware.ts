import { v2 as Cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import serverConfig from "../config/server.config";



const storageB = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/images/files')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const storageA = multer.diskStorage({
  destination: function (req, file, cb) {

    console.log("ppppppppppppppppppppppppppppppppppppppp")
    cb(null, 'images/avatars')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})



const uploads = multer({ storage: storageB });
const avatars = multer({ storage: storageA });




export default {uploads, avatars};

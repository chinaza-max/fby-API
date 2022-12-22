"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storageB = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/files');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
const storageA = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/avatars');
    },
    filename: function (req, file, cb) {
        console.log(req.hostname);
        console.log(req.protocol);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
const uploads = (0, multer_1.default)({ storage: storageB });
const avatars = (0, multer_1.default)({ storage: storageA });
exports.default = { uploads, avatars };
//# sourceMappingURL=upload.middleware.js.map
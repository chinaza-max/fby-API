"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const server_config_1 = __importDefault(require("../config/server.config"));
const fs_1 = __importDefault(require("fs"));
const debug_1 = __importDefault(require("debug"));
const handlebars_1 = __importDefault(require("handlebars"));
const DEBUG = (0, debug_1.default)('dev');
class MailService {
    constructor() {
        this.transporter = (0, nodemailer_1.createTransport)({
            host: server_config_1.default.EMAIL_HOST,
            port: Number(server_config_1.default.EMAIL_PORT),
            secure: true,
            auth: {
                user: server_config_1.default.EMAIL_USER,
                pass: server_config_1.default.EMAIL_PASS
            }
        });
    }
    sendMail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = `./src/resources/mailTemplates/${options.templateName}.html`;
            const source = fs_1.default.readFileSync(filePath, "utf-8").toString();
            const template = handlebars_1.default.compile(source);
            const html = template(options.variables);
            const mailData = {
                from: `${options.from ? options.from : server_config_1.default.EMAIL_SENDER} <${server_config_1.default.EMAIL_USER}>`,
                to: options.to,
                subject: options.subject,
                html: html
            };
            this.transporter.sendMail(mailData, (error) => {
                if (error) {
                    DEBUG(`Error sending email: ${error}`);
                    return false;
                }
                return true;
            });
        });
    }
}
exports.default = new MailService();
//# sourceMappingURL=mail.service.js.map
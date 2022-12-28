import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import serverConfig from "../config/server.config";
import { MailOptionsI } from "../interfaces/mail.interface";
import fs from 'fs';
import debug from "debug";
import Handlebars from "handlebars";
import Mail from "nodemailer/lib/mailer";

const DEBUG = debug('dev');

class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
    host: serverConfig.EMAIL_HOST,
    port: Number(serverConfig.EMAIL_PORT),
    secure: true,
    auth: {
      user: serverConfig.EMAIL_USER,
      pass: serverConfig.EMAIL_PASS
    }
  })

  async sendMail(options: MailOptionsI) {

    const filePath = `./src/resources/mailTemplates/${options.templateName}.html`;
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = Handlebars.compile(source);
    const html = template(options.variables);
    const mailData: Mail.Options = {
      from: `${options.from ? options.from : serverConfig.EMAIL_SENDER} <${serverConfig.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html:html
    }

    this.transporter.sendMail(mailData, (error) => {
      if (error) {

        console.log("error error error error")

        console.log(error)
        DEBUG(`Error sending email: ${error}`)
        return false;
      }
      console.log("sent sent sent sent sent sent")

      return true;
    })
  }
}

export default new MailService();

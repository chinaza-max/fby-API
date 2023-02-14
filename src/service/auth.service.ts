import jwt from "jsonwebtoken";
import { Admin, Location, PasswordReset } from "../db/models";
import serverConfig from "../config/server.config";
import authUtil from "../utils/auth.util";
import IAdmin from "../interfaces/admin.interface";
import bcrypt from "bcrypt";

import {
  ConflictError,
  NotFoundError,
  ServerError,
  SystemError,
} from "../errors";
import utilService from "./util.service";
import moment from "moment";
import axios from "axios";
import momentTimeZone from "moment-timezone";
import { DatabaseError, Op } from "sequelize";  
import mailService from "./mail.service";

interface DecodedToken {
  payload: IAdmin | null;
  expired: boolean | string | Error;
}

class AuthenticationService {
  private UserModel = Admin;
  private LocationModel = Location;
  private PasswordResetModel = PasswordReset;

  async handleUserAuthentication(data): Promise<any> {
    const { email, password } = data;
    const user = await Admin.findOne({
      where: {
        email: email,
        role: {
          [Op.eq]: "GUARD",
        },
      },
    });   
   
    if(user.suspended == true) return "Account has been suspended"

    if (!(await bcrypt.compare(password, user.password))) return null;

    var relatedLocation = await this.LocationModel.findByPk(user.location_id);
    user.last_logged_in = new Date();

    var transfromedUserObj = await this.transformUserForResponse(
      user,
      relatedLocation
    );
    await utilService.updateStat("GUARD_SIGNIN");
    return transfromedUserObj;
  }

  async handleAdminAuthentication(data): Promise<any> {
    const { email, password } = data;
    const user = await Admin.findOne({ where: { email: email } });

    if(user.suspended == true) return "Account has been suspended"

    console.log(bcrypt.compare(password, user.password));

    if (!(await bcrypt.compare(password, user.password))) return null;
    if (user.role == "GUARD" ) return -1;

    var relatedLocation = await this.LocationModel.findByPk(user.location_id);
    user.last_logged_in = new Date();

    var transfromedUserObj = await this.transformUserForResponse(
      user,
      relatedLocation
    );
    await utilService.updateStat("STAFF_SIGNIN");
    return transfromedUserObj;
  }

  async handleUserCreation(data: object): Promise<any> {
    let {
      first_name,
      last_name,
      email,
      image,
      date_of_birth,
      gender,
      password,
      address,
      phone_number,
      my_time_zone,
      created_by_id
    } = await authUtil.verifyUserCreationData2.validateAsync(data);

    let dateStamp=await this.getDateAndTimeForStamp(my_time_zone)
    let hashedPassword;
    if (password == null) password = this.generatePassword();
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) {
      throw new SystemError("An error occured while processing your request");
    }
    console.log(hashedPassword);

    var existingUser = await this.getUserByEmail(email);
    console.log(existingUser);
    if (existingUser != null)
      throw new ConflictError("A user with this email already exists");
    var createdLocation = await this.LocationModel.create({
      address,
      created_at:dateStamp, 
      updated_at:dateStamp
    });
    console.log(createdLocation.id);
    const user = await this.UserModel.create({
      first_name,
      last_name,
      email,
      image,
      date_of_birth,
      gender,
      password: hashedPassword,
      location_id: createdLocation.id,
      phone_number,
      role: "GUARD",
      availability:true,
      created_by_id,
      created_at:dateStamp, 
      updated_at:dateStamp
    });
    var transfromedUserObj = await this.transformUserForResponse(user, createdLocation);
    await utilService.updateStat("GUARD_SIGNUP");
    return transfromedUserObj;
  }

  async handleBulkUserCreaton(data): Promise<any> {
    let createdUsers = [];
    for(const user of data){
      let createdUser = await this.handleUserCreation(user);
      createdUsers.push(createdUser);
    }
    return createdUsers;
  }

  async handleAdminCreation(data: object): Promise<any> {
    let {
      first_name,
      last_name,
      email,
      image,
      date_of_birth,
      gender,
      password,
      address,
      my_time_zone,
      phone_number,
      staffRole,
      created_by_id
    } = await authUtil.verifyUserCreationData.validateAsync(data);


    let dateStamp=await this.getDateAndTimeForStamp(my_time_zone)

    let hashedPassword;
    if (password == null) password = this.generatePassword();
    try {
      hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
    } catch (error) {
      throw new SystemError("An error occured while processing your request");
    }
    console.log(hashedPassword);

    var existingUser = await this.getUserByEmail(email);

    console.log(existingUser);
    if (existingUser != null)
      throw new ConflictError("A user with this email already exists");
    var createdLocation = await this.LocationModel.create({
      address,
      created_at:dateStamp, 
      updated_at:dateStamp
    });


    const user = await this.UserModel.create({
      first_name,
      last_name,
      email,
      image,
      date_of_birth,
      gender,
      password: hashedPassword,
      location_id: createdLocation.id,
      phone_number,
      role:staffRole,
      created_by_id,
      created_at:dateStamp, 
      updated_at:dateStamp
    });
    var transfromedUserObj = await this.transformUserForResponse(user, createdLocation);
    await utilService.updateStat("STAFF_SIGNUP");
    return transfromedUserObj;
  }













  async handlePasswordResetEmail(data) {
    var { email } = await authUtil.validateUserEmail.validateAsync(data);
    var matchedUser = await this.UserModel.findOne({
      where: {
        email,
      },
    });
    if (matchedUser == null)
      throw new NotFoundError("This email does not correspond to any user");
    var keyExpirationMillisecondsFromEpoch =
      new Date().getTime() + 30 * 60 * 1000;
    var generatedKey = this.generatePassword(true);
    var relatedPasswordReset = await this.PasswordResetModel.findOrCreate({
      where: {
        user_id: matchedUser.id,
      },
      defaults: {
        user_id: matchedUser.id,
        reset_key: generatedKey,
        expires_in: new Date(keyExpirationMillisecondsFromEpoch),
      },
    });
    relatedPasswordReset[0]?.update({
      user_id: matchedUser.id,
      reset_key: generatedKey,
      expires_in: new Date(keyExpirationMillisecondsFromEpoch),
    });
    await mailService.sendMail({
      to: matchedUser.email,
      subject: "Reset Password",
      templateName: "reset_password",
      variables: {
        resetLink: `https://fbyteamschedule.com/adminpanel/PasswordReset.html?key=${generatedKey}_${keyExpirationMillisecondsFromEpoch}`
      },
    });
  }

  async handlePasswordReset(data) {
    var { email, password, reset_password_key } =
      await authUtil.validatePasswordReset.validateAsync(data);
    var relatedPasswordReset = await this.PasswordResetModel.findOne({
      where: {
        reset_key: reset_password_key,
      },
    });
    if (relatedPasswordReset == null)
      throw new NotFoundError("Invalid reset link");
    else if (relatedPasswordReset.expires_in.getTime() < new Date().getTime())
      throw new NotFoundError("Reset link expired");
    var relatedUser = await this.UserModel.findOne({
      where: { id: relatedPasswordReset.user_id },
    });
    if (relatedUser == null)
      throw new NotFoundError("Selected user cannot be found");
    try {
      var hashedPassword = await bcrypt.hash(
        password,
        Number(serverConfig.SALT_ROUNDS)
      );
      relatedUser.update({
        password: hashedPassword,
      });
      relatedPasswordReset.update({
        expires_in: new Date(),
      });
    } catch (error) {
      throw new ServerError("Failed to update password");
    }
  }

  async generateToken(user: Admin) {
    try {
      const rawUser = user.get();
      const token = jwt.sign(rawUser, serverConfig.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "2d",
        issuer: serverConfig.TOKEN_ISSUER,
      });
      return token;
    } catch (error) {
      return error;
    }
  }

  transformUserForResponse(
    data: Admin,
    locationObj: Location
  ): { transfromedUser; data: Admin } {
    try {
      var {
        id,
        image,
        first_name,
        last_name,
        email,
        date_of_birth,
        gender,
        phone_number,
        created_at,
        updated_at,
        is_archived,
        role,
        created_at, 
        updated_at,
        suspended,
        notification,
        availability
      } = data;



    

      var transfromedUser = {
        id,
        image,
        first_name,
        last_name,
        email,
        phone_number,
        role,
        suspended,
        notification,
        // Added Location
        availability,
        address: locationObj.address,
        date_of_birth,
        gender,
        created_at:this.getDateAndTime(created_at),
        updated_at:this.getDateAndTime(updated_at),
        is_archived,
      };
      return { transfromedUser, data };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getCurrentUser(id: number): Promise<Admin> {
    const user = await this.UserModel.findByPk(id);
    return user;
  }

  async getUserByEmail(email: string): Promise<Admin> {
    return await this.UserModel.findOne({ where: { email: email } });
  }

  async getUserCount(): Promise<number> {
    return await this.UserModel.count();
  }


  async getDateAndTimeForStamp(my_time_zone){

    let con_fig_time_zone = momentTimeZone.tz(my_time_zone)
    let date =new Date(con_fig_time_zone.format('YYYY-MM-DD hh:mm:ss a'))
      
     return date
  }

  async getTimeZone(lat: number,log:number) {
    
    let timestamp =moment(new Date()).unix();
    try {
      let response = await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${log}&timestamp=${timestamp}&key=${serverConfig.GOOGLE_KEY}`,
      );
      // console.log(response.data.url);
      // console.log(response.data.explanation);
        console.log(response.data);

      return response.data.timeZoneId;
    } catch (error) {
      console.log(error);
      throw new NotFoundError("Failed to resolve query");
    }
  }

  verifyToken(token: string): DecodedToken {
    try {
      const payload = jwt.verify(
        token,
        serverConfig.TOKEN_SECRET
      ) as unknown as IAdmin;
      return {
        payload,
        expired: false,
      };
    } catch (error) {
      return {
        payload: null,
        expired: error.message.includes("expired") ? error.message : error,
      };
    }
  }

  generatePassword(omitSpecial = false, passwordLength = 12): string {
    var chars = omitSpecial
      ? "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      : "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // var passwordLength = 12;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  }

   getDateAndTime(val) {
    return moment(val).format("YYYY-MM-DD hh:mm:ss a");
  }
}

export default new AuthenticationService();

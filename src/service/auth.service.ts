import jwt from "jsonwebtoken";
import { Admin, Location } from "../db/models";
import serverConfig from "../config/server.config";
import authUtil from "../utils/auth.util";
import IAdmin from "../interfaces/admin.interface";
import bcrypt from "bcrypt";
import { ConflictError, SystemError } from "../errors";

interface DecodedToken {
  payload: IAdmin | null;
  expired: boolean | string | Error;
}

class AuthenticationService {
  private UserModel = Admin;
  private LocationModel = Location;

  async handleUserAuthentication(data): Promise<Admin> {
    const { email, password } = data;
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, Number(serverConfig.SALT_ROUNDS));
    } catch (error) {
      return null;
    }
    const user = await Admin.findOne({ where: { email: email } });
    if (!bcrypt.compare(password, hashedPassword)) return null;
    return user;
  }

  async handleUserCreation(data: object): Promise<any> {
    const {
      first_name,
      last_name,
      email,
      image,
      date_of_birth,
      gender,
      password,
      address,
    } = await authUtil.verifyUserCreationData.validateAsync(data);
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, Number(serverConfig.SALT_ROUNDS));
    } catch (error) {
      throw new SystemError('An error occured while processing your request');
    }
    console.log(hashedPassword);

    var existingUser = await this.getUserByEmail(email);
    console.log(existingUser);
    if (existingUser != null)
      throw new ConflictError("A user with this email already exists");
    var createdLocation = await this.LocationModel.create({
      address: address,
      // created_at: new Date(),
      // updated_at: new Date(),
      // is_archived: false
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
    });

    return await this.transformUserForResponse(user, address);
  }

  async generateToken(user: Admin) {
    try {
      const rawUser = user.get();
      const token = jwt.sign(rawUser, serverConfig.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: serverConfig.TOKEN_EXPIRES_IN,
        issuer: serverConfig.TOKEN_ISSUER,
      });
      return token;
    } catch (error) {
      return error;
    }
  }

  transformUserForResponse(data: IAdmin, location: String) {
    try {
      var {
        id,
        image,
        first_name,
        last_name,
        email,
        password,
        date_of_birth,
        gender,
        created_at,
        updated_at,
        is_archived,
      } = data;

      var transfromedUser = {
        id,
        image,
        first_name,
        last_name,
        email,
        // Added Location
        location,
        password,
        date_of_birth,
        gender,
        created_at,
        updated_at,
        is_archived,
      };
      return transfromedUser;
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
}

export default new AuthenticationService();

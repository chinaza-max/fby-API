import jwt from "jsonwebtoken";
import { Admin, Location } from "../db/models";
import serverConfig from "../config/server.config";
import authUtil from "../utils/auth.util";
import IAdmin from "../interfaces/admin.interface";
import bcrypt from "bcrypt";
import { ConflictError } from "../errors";

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
      hashedPassword = await bcrypt.hash(password, serverConfig.SALT_ROUNDS);
    } catch (error) {
      return null;
    }
    const user = await Admin.findOne({ where: { email: email } });
    if(!bcrypt.compare(password, hashedPassword)) return null;
    return user;
  }

  async handleUserCreation(data: object): Promise<Admin> {
    const {
      first_name,
      last_name,
      email,
      image,
      date_of_birth,
      gender,
      password,
      address
    } = await authUtil.verifyUserCreationData.validateAsync(data);

    var existingUser = this.getUserByEmail(email);
    if(existingUser != null) throw new ConflictError("A user with this email already exists");
    var createdLocation = await this.LocationModel.create({
      address: address
    });

    const user = await this.UserModel.create({
      first_name,
      last_name,
      email,
      image,
      date_of_birth,
      gender,
      password,
      location_id: createdLocation.id
    });

    return user;
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

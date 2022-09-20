import IAdmin from "../../interfaces/admin.interface";


declare module 'express' {
  export interface Request {
    user: IAdmin;
  }
}
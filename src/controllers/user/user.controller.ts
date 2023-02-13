import { Request, Response, NextFunction } from "express";
import userService from "../../service/user.service";

export default class UserController {



  
  protected async updateProfileOtherAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { id } = req.body;
      const data = req.body;
      const { file } = req;
     
      const user = await userService.updateProfileOtherAdmin(id, data, file);

      return res.status(200).json({
        status: 200,
        message: "User update successful.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }


  protected async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { id } = req.user;
      const data = req.body;
      const { file } = req;
     

      const user = await userService.updateUser(id, data, file);

      return res.status(200).json({
        status: 200,
        message: "User update successful.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }


  protected async LicenseRUD(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;
         
      const data2={
          id:data.id,
          type:req.query.type,
          my_time_zone:req["user_time_zone"]
      }

      const user = await userService.LicenseRUD(data2);

      return res.status(200).json({
        status: 200,
        message: req.query.type=="delete"?"delete successful":"update successful",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
  protected async getAllStaffLicense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;
         
      const data2={
          guard_id:data.id,
          my_time_zone:req["user_time_zone"]
      }

      const user = await userService.getAllStaffLicense(data2);

      return res.status(200).json({
        status: 200,
        // message: req.query.type=="delete"?"delete successful":"update successful",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
  protected async deleteStaffLicense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;
         
      const data2={
          id:data.id,
      }

      const user = await userService.deleteStaffLicense(data2);

      return res.status(200).json({
        status: 200,
        message: "delete successful"
      });
    } catch (error) {
      next(error);
    }
  }
  
  protected async uploadLicense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { id } = req.user;

      const data = req.body;
      const data2={
        ...data,
        my_time_zone:req["user_time_zone"]
      }

    
      const { file } = req;
      const user = await userService.uploadLicense(id, data2, file);

      return res.status(200).json({
        status: 200,
        message: "upload successful.",
      });
    } catch (error) {
      next(error);
    }
  }

  protected async updateGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { id } = req.body;
      const data = req.body;
      const { file } = req;
     
      const user = await userService.updateUser(id, data, file);

      return res.status(200).json({
        status: 200,
        message: "Guard update successful.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  
  protected async deleteStaff(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {

      const id=req.body.id
      const users = await userService.deleteStaff(id);

      return res.status(200).json({
        status: 200,
        message: "successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  }
  protected async toggleVisibilty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { id } = req.user;  

      const users = await userService.toggleVisibilty(id,req);

      return res.status(200).json({
        status: 200,
        data: "status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }





  protected async getAllStaff(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
    
      const myData={
        limit:Number(req.query.limit),
        offset:Number(req.query.offset),
        role:req.query.role
      }

      const users = await userService.getAllStaff(myData);

      return res.status(200).json({
        status: 200,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  protected async suspendAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = {
        body: req.body,
        admin_id: req?.user?.id,
      };
      const obj = await userService.handleSuspension(data);
      return res.status(200).json({
        status: 200,
        message: "Account has been suspended",
      });
    } catch (error) {
      next(error);
    }
  }

  protected async UnsuspendAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = {
        body: req.body,
        admin_id: req?.user?.id,
      };
      const obj = await userService.handleUnSuspension(data);
      return res.status(200).json({
        status: 200,
        message: "Account has been unsuspended",
      });
    } catch (error) {
      next(error);
    }
  }


  protected async suspendAccountAuthorization(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = {
        body: req.body,
        admin_id: req?.user?.id,
      };
      const obj = await userService.handleSuspensionAuth(data);
      return res.status(200).json({
        status: 200,
        message: "Admin can now suspend users",
      });
    } catch (error) {
      next(error);
    }
  }

  protected async suspendAccountUnAuthorization(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = {
        body: req.body,
        admin_id: req?.user?.id,
      };
      const obj = await userService.handleSuspensionUnAuth(data);
      return res.status(200).json({
        status: 200,
        message: "Admin can no longer suspend users",
      });
    } catch (error) {
      next(error);
    }
  }

  protected async getSuspendedStaffs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      let myData;

      if(Object.keys(req.query).length === 0){
        myData="all" 
      }else{
        myData={
          limit:Number(req.query.limit),
          offset:Number(req.query.offset),
          role: req.query.role 
        }
      }
      const obj = await userService.handleGetSuspendedStaffs(myData);
      return res.status(200).json({
        status: 200,
        data: obj,
      });
    } catch (error) {
      next(error);
    }
  }


}

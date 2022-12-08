import { Request, Response, NextFunction } from "express";
import userService from "../../service/user.service";

export default class UserController {
  protected async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {

      //console.log(req)
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

      const users = await userService.toggleVisibilty(id);

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
      console.log(req.query)
      const data = req.body;

      const myData={
        limit:Number(req.query.limit),
        offset:Number(req.query.offset),
        role:req.query.role
      }

      const users = await userService.getAllStaff(myData);

      return res.status(200).json({
        status: 200,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}

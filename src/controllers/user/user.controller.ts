import { Request, Response, NextFunction } from "express";
import userService from "../../service/user.service";

export default class UserController {
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

  protected async getAllStaff(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const users = await userService.getAllStaff();

      return res.status(200).json({
        status: 200,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}

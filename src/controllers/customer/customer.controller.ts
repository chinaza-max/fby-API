import { Request, Response, NextFunction } from "express";
import { Location } from "../../db/models";
import { ConflictError } from "../../errors";
import authService from "../../service/auth.service";
import mailService from "../../service/mail.service";

export default class CustomerController {

  protected async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { authType } = req.query;
      const data = req.body;

      const obj = await authService.handleUserCreation(data);

      try {
        if (obj != null) {
          await mailService.sendMail({
            to: "turboburstenvironment@gmail.com",
            subject: "Welcome to FBY Security",
            templateName: "welcome",
            variables: { userRole: "Customer", website: "https://fby-security.com", email: obj.transfromedUser.email, password: data.password },
          });
        }
      } catch (error) {
        console.log(error);
      }

      return res.status(200).json({
        status: 200,
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  protected async whoAmI(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { id } = req.user;

      const user = await authService.getCurrentUser(id);
      var LocationModel = Location;
      var relatedLocation = await LocationModel.findByPk(user.location_id);
      var { transfromedUser } = await authService.transformUserForResponse(user, relatedLocation?.address);
      return res.status(200).json({
        status: 200,
        data: transfromedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

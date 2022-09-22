import { Request, Response, NextFunction } from "express";
import { Location } from "../../db/models";
import { ConflictError } from "../../errors";
import authService from "../../service/auth.service";
import mailService from "../../service/mail.service";

export default class AuthenticationController {
  protected async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { authType } = req.query;
      const data = req.body;

      var obj;
      try {
        obj = await authService.handleUserAuthentication(data);
      } catch (error) {
        console.log(error);
      }

      if (obj == null)
        return res.status(400).json({
          status: 400,
          message: "Invalid login credentials",
        });

      const token = await authService.generateToken(obj.data);
      console.log(token);

      return res.status(200).json({
        status: 200,
        message: "Login successful.",
        data: { user: obj.transfromedUser, token },
      });
    } catch (error) {
      next(error);
    }
  }

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
            variables: {
              userRole: "Admin",
              website: "https://fby-security.com",
              email: obj.transfromedUser.email,
              password: data.password,
            },
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
      var { transfromedUser } = await authService.transformUserForResponse(
        user,
        relatedLocation?.address
      );
      return res.status(200).json({
        status: 200,
        data: {
          user: transfromedUser,
          token: req.headers.authorization.split(" ")[1],
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

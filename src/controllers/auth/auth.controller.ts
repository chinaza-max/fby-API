import { Request, Response, NextFunction } from "express";
import { Location } from "../../db/models";
import { ConflictError } from "../../errors";
import authService from "../../service/auth.service";
import mailService from "../../service/mail.service";
import authUtil from "../../utils/auth.util";

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

  protected async loginAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { authType } = req.query;
      const data = req.body;

      var obj;
      try {
        obj = await authService.handleAdminAuthentication(data);
      } catch (error) {
        console.log(error);
      }
      if (obj == -1)
        return res.status(401).json({
          status: 401,
          message: "Unauthorized access!",
        });

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

  protected async signupGuard(
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
            to: obj.transfromedUser.email,
            subject: "Welcome to FBY Security",
            templateName: "welcome",
            variables: {
              userRole: "Guard",
              website: "https://fbysecuritysvs.com",
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
        message: "Guard registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  protected async signupAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {   
    try {
      const data = req.body;
      console.log(data)
      const obj = await authService.handleAdminCreation(data);

      try {
        if (obj != null) {
          await mailService.sendMail({
            to: obj.transfromedUser.email,
            subject: "Welcome to FBY Security",
            templateName: "welcome",
            variables: {
              userRole: "Admin",
              website: "https://fbysecuritysvs.com",
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
        message: "Admin registered successfully",
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
        relatedLocation
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

  protected async resetPasswordEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const createdResetObj = await authService.handlePasswordResetEmail(req.body);
      return res.status(200).json({
        status: 200,
        message: "A reset link was sent to your email"
      });
    } catch (error) {
      next(error);
    }
  }

  protected async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const createdResetObj = await authService.handlePasswordReset(req.body);
      return res.status(200).json({
        status: 200,
        message: "Password updated successufully"
      });
    } catch (error) {
      next(error);
    }
  }

  protected async signupGuardBulk(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { authType } = req.query;
      const data = req.body;

      const obj = await authService.handleBulkUserCreaton(data);

      return res.status(200).json({
        status: 200,
        message: "Guard registered successfully",
        data: obj,
      });
    } catch (error) {
      next(error);
    }
  }
}

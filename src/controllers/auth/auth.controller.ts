import { Request, Response, NextFunction } from "express";
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

      const user = await authService.handleUserAuthentication(data);

      if(user == null) return res.status(400).json({
        status: 400,
        message: "Invalid login credentials",
      });

      const token = await authService.generateToken(user);
      console.log(token);

      return res.status(200).json({
        status: 200,
        message: "Login successful.",
        data: { user, token },
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

      const user = await authService.handleUserCreation(data);

      if (user != null) {
        const userCount = await authService.getUserCount();
        const ordinal = 10;
        await mailService.sendMail({
          to: "turboburstenvironment@gmail.com",
          subject: "Welcome to FBY Security",
          templateName: "welcome",
          variables: { userCount: userCount.toLocaleString(), ordinal },
        });
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

      return res.status(200).json({
        status: 200,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

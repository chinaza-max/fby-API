import { Request, Response, NextFunction } from "express";
import DB from "../db";
import { BadRequestError, UnAuthorizedError } from "../errors/index";
import authService from "../service/auth.service";
import debug from "debug";

const DEBUG = debug("dev");

class AuthenticationMiddlewares {
  public async validateUserToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { authorization } = req.headers;

      if (!authorization) throw new BadRequestError("No token provided.");
      
      // console.log(authorization);
      const token = authorization.split(" ")[1];
      // console.log(token);

      if (!token) throw new BadRequestError("No token provided.");

      const { payload, expired } = authService.verifyToken(token);

      if (expired) throw new UnAuthorizedError("Invalid token.");

      req.user = payload;
      return next();
    } catch (error) {
      DEBUG(`Error in validating user token: ${error}`);
      next(error);
    }
  }

  public async getUserOrSkip(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { authorization } = req.headers;
      const token = authorization ? authorization.split(" ")[1] : undefined;


      if (token) {
        const { payload, expired } = authService.verifyToken(token);
        
        req.user = !expired ? payload : undefined;
      }
      return next();
    } catch (error) {
      DEBUG(`Error in get user or skip auth middleware: ${error}`);
      next(error);
    }
  }
}

export default new AuthenticationMiddlewares();

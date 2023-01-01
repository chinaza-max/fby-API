import { Request, Response, NextFunction } from "express";
import sequelize from "sequelize";
import Joi from "joi";
import { ValidationError, SystemError } from "../errors";

class SystemMiddlewares {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    if (error instanceof Joi.ValidationError) {
      return res.status(400).json({
        status: "validation-error",
        errors: error.details,
      });
    }
    if (error instanceof sequelize.UniqueConstraintError) {
      return res.status(400).json({
        status: "validation-error",
        message: "Duplicate entry",
      });
    }
    if (error instanceof ValidationError) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { _required_variables } = error;
      const message = error.message
        ? error.message
        : `${_required_variables.join("or ")} is required`;
      return res.status(400).json({
        status: "validation-error",
        message,
        required_variables: _required_variables,
      });
    }

    if (error instanceof SystemError) {




      console.log("==============================================")
      console.log("==                                          ==")
      console.log("==                                          ==")
      console.log("==                                          ==")
      console.log("==               errorr                     ==")
      console.log("==                                          ==")
      console.log("==                                          ==")
      console.log("==                                          ==")
      console.log("==============================================")



      console.log(error)
      console.log(error.name)




      switch (error.name) {
        case "NotFoundError":
          return res.status(404).json({
            status: error.code,
            message: error.message,
          });
        case "UnAuthorizedError":
          return res.status(401).json({
            status: error.code,
            message: error.message,
          });
        case "EmailClientError":
          return res.status(500).json({
            status: error.code,
            message: error.message,
          });
        case "ConflictError":
          return res.status(409).json({
            status: error.code,
            message: error.message,
          });
        case "TooManyRequestsError":
          return res.status(429).json({
            status: error.code,
            message: error.message,
          });
        case "AgendaSheduleError":
          return res.status(409).json({
            status: error.code,
            message: error.message,
          });
          case "SecurityCodeVerificationError":
            return res.status(403).json({
              status: error.code,
              message: error.message,
            });
        case "ServerError":
        case "SystemError":
        default:
          return res.status(500).json({
            status: error.code,
            message: error.message,
          });
      }
    }
    return res.status(500).json({
      status: "server-error",
      message: "An unexpected error occured.",
    });
  }
}

export default new SystemMiddlewares();

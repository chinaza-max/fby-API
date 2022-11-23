import { Request, Response, NextFunction } from "express";
import { Location } from "../../db/models";
import authService from "../../service/auth.service";
import customerService from "../../service/customer.service";
import mailService from "../../service/mail.service";

export default class CustomerController {


  protected async createCustomerBulk(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await customerService.handleCustomerCreationBulk(data);

      return res.status(200).json({
        status: 200,
        message: "Customers registered successfully",
        data: obj
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  protected async createCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await customerService.handleCustomerCreation(data);

      try {
        if (obj != null) {
          await mailService.sendMail({
            to: "mosesogbonna68@gmail.com",
            subject: "Welcome to FBY Security",
            templateName: "welcome",
            variables: { userRole: "Customer", website: "https://fbysecuritysvs.com", email: obj.transfromedUser.email, password: obj.transfromedUser.password },
          });
        }
      } catch (error) {
        console.log(error);
      }

      return res.status(200).json({
        status: 200,
        message: "Customer registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  protected async resetCustomerPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await customerService.handleCustomerGetAll("all");
      if(obj?.length === null){
        return res.status(400).json({
          status: 400,
          data: obj ?? "Failed to process request",
        });
      }

      return res.status(200).json({
        status: 200,
        data: obj,
      });
    } catch (error) {
      next(error);
    }
  }

  protected async testEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      await mailService.sendMail({
        to: "turboburstenvironment@gmail.com",
        subject: "Reset Password",
        templateName: "reset_password",
        variables: { resetLink: "https://fbysecurity.web.app/auth/login"},
      });
      return res.status(200).json({
        status: 200,
        message: "Email Sent Successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  
  protected async getAllCustomers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;
      const myData={
        limit:Number(req.query.limit),
        offset:Number(req.query.offset) 
      }

      const obj = await customerService.handleCustomerGetAll(myData);
      if(obj?.length === null){
        return res.status(400).json({
          status: 400,
          data: obj ?? "Failed to process request",
        });
      }

      return res.status(200).json({
        status: 200,
        data: obj,
      });
    } catch (error) {
      next(error);
    }
  }


  protected async getSingleCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {

      const data = req.body;
      const userId=req.query.id


      const obj = await customerService.handleGetSingleCustomer(userId)
      if(obj?.length === null){
        return res.status(400).json({
          status: 400,
          data: obj ?? "Failed to process request",
        });
      }

      return res.status(200).json({
        status: 200,
        data: obj,
      });
    } catch (error) {
      next(error);
    }
  }
}

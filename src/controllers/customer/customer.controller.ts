import { Request, Response, NextFunction } from "express";
import { link } from "joi";
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
  


  protected async createFacility(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      let my_bj={
        ...data,
        my_time_zone:req["user_time_zone"],
        created_by_id:req.user.id
      }

      console.log(my_bj)
    
      console.log("''''''''''''''''''''''''''''fffffffffffffffffff''''''''''''''''''''''''''''")
      const obj = await customerService.handleCreateFacility(my_bj);

      return res.status(200).json({
        status: 200,
        message: "Site registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }


  protected async deleteFacility(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await customerService.handleDeleteFacility(data);
      
      return res.status(200).json({
        status: 200,
        message: "Site deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  
  protected async updateFacility(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      const obj = await customerService.handleUpdateFacility(data);

    
      return res.status(200).json({
        status: 200,
        message: "Site updatered successfully",
      });
    } catch (error) {
      next(error);
    }
  }


  protected async deleteCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const data = req.body;

      console.log(data)
      
      const obj = await customerService.deleteCustomer(data);

      return res.status(200).json({
        status: 200,
        message: "Customer deleted successfully",
      });
    } catch (error) {
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
      let my_bj={
        ...data,
        my_time_zone:req["user_time_zone"],
        created_by_id:req.user.id
      }

      const obj = await customerService.handleCustomerCreation(my_bj);

      try {

        if (obj != null) {
          await mailService.sendMail({
            to: obj.email,
            subject: "Welcome to FBY Security",
            templateName: "welcome2",
            variables: {
              userRole: "Customer",
              website: "https://fbysecuritysvs.com", 
              email: obj.email, 
              password: obj.password 
            },
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
      let myData;

      if(Object.keys(req.query).length === 0){
        myData="all" 
      }else{
        myData={
          limit:Number(req.query.limit),
          offset:Number(req.query.offset) 
        }
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


  
  protected async getAllSiteOrSingleSite(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {

      const obj = await customerService.getAllSiteOrSingleSite(req)
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

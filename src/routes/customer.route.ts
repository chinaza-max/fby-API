import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import CustomerController from "../controllers/customer/customer.controller";
import uploadHandler from "../middlewares/upload.middleware";

class CustomerRoutes extends CustomerController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get(
        "/",
       authMiddleware.validateUserToken,
        this.getAllCustomers 
      );
      this.router.get(
        "/one",
      authMiddleware.validateUserToken,
        this.getSingleCustomer
      );
    this.router.get(
      "/get_all_site_or_single_site",
      authMiddleware.validateUserToken,
     this.getAllSiteOrSingleSite);
     
    this.router.post(
      "/",
      authMiddleware.validateUserToken,
      this.createCustomer 
    );
    this.router.post(
      "/deleteCustomer",
      authMiddleware.validateUserToken,
      this.deleteCustomer 
    );
    this.router.post(
      "/createFacility",
      authMiddleware.validateUserToken,
      this.createFacility 
    );
    this.router.post(
      "/updateFacility",
      authMiddleware.validateUserToken,
      this.updateFacility 
    );
    this.router.post(
      "/deleteFacility",
      authMiddleware.validateUserToken,
      this.deleteFacility 
    );
    this.router.post(
      "/bulk",
      authMiddleware.validateUserToken,
      this.createCustomerBulk
    );
    this.router.get(
      "/test",
      authMiddleware.validateUserToken,
      this.testEmail
    );
    this.router.post(
      "/updateProfile",
      authMiddleware.validateUserToken,
      uploadHandler.avatars.single("image"),
      this.updateProfile
    );
    this.router.post(
      "/suspend_customer_account", 
      authMiddleware.validateUserToken,
      this.suspendCustomerAccount
    );
    this.router.post(
      "/unsuspend_customer_account",
      authMiddleware.validateUserToken,
      this.UnsuspendCustomerAccount
    );
    this.router.get(
      "/suspended_customers", 
      authMiddleware.validateUserToken,
      this.getSuspendedCustomers);

    this.router.get(
      "/deleted_customers", 
      authMiddleware.validateUserToken,
      this.getDeletedCustomers);

    this.router.get(
      "/get_deleted_facility", 
      authMiddleware.validateUserToken,
      this.getDeletedFacility);
  

    

    // this.router.get("/", authMiddleware.validateUserToken, this.getAllCustomers);
    // this.router.post("/register", this.signup);
  }
}

export default new CustomerRoutes().router;

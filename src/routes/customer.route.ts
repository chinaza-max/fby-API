import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import CustomerController from "../controllers/customer/customer.controller";

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
    this.router.post(
      "/",
      authMiddleware.validateUserToken,
      this.createCustomer 
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

    // this.router.get("/", authMiddleware.validateUserToken, this.getAllCustomers);
    // this.router.post("/register", this.signup);
  }
}

export default new CustomerRoutes().router;

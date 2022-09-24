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
    this.router.post(
      "/",
      authMiddleware.validateUserToken,
      this.createCustomer 
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

import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import AuthController from "../controllers/auth/auth.controller";

class AuthRoutes extends AuthController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      "/login",
      this.login
    );
    this.router.post(
      "/admin/login",
      this.loginAdmin
    );

    this.router.get("/", authMiddleware.validateUserToken, this.whoAmI);
    this.router.post("/register", this.signup);
  }
}

export default new AuthRoutes().router;

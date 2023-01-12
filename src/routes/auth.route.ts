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
    this.router.post(
      "/send-password-reset-link",
      this.resetPasswordEmail
    );
    this.router.post(
      "/reset-password",  
      this.resetPassword
    );

    
    this.router.post("/profile_info",this.profile_info);
    this.router.get("/", authMiddleware.validateUserToken, this.whoAmI);
    this.router.post("/register",authMiddleware.validateUserToken,  this.signupGuard);
    this.router.post("/registerBulk", this.signupGuardBulk);
    this.router.post("/admin/register",authMiddleware.validateUserToken,  this.signupAdmin);
  }
}

export default new AuthRoutes().router;

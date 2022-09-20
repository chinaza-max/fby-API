import { Router } from "express";
import {
  UserController,
} from "../controllers/user/index";
import uploads from "../middlewares/upload.middleware";

class UserRoutes extends UserController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.put("/", uploads.single("image"), this.update);
  }
}

export default new UserRoutes().router;

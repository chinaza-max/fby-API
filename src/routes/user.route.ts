import { Router } from "express";
import { func } from "joi";
import {
  UserController,
} from "../controllers/user/index";
import uploadHandler from "../middlewares/upload.middleware";

class UserRoutes extends UserController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.put("/updateProfile" ,uploadHandler.avatars.single("image"), this.update);
    this.router.get("/getAllStaff", this.getAllStaff);
  }
}

export default new UserRoutes().router;

import { Router } from "express";
import UtilController from "../controllers/util/util.controller";
import authMiddleware from "../middlewares/auth.middleware";

class UtilRoutes extends UtilController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/googleMapsAutoComplete", this.googleMapsAutoComplete);
    this.router.post("/googleMapsLocationSearch", this.googleMapsLocationSearch);
    this.router.post("/store_or_update_subscription",authMiddleware.validateUserToken, this.subscription);

  }
}

export default new UtilRoutes().router;

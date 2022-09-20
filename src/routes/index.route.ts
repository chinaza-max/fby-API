import { Router, Request, Response } from "express";
import { NotFoundError } from "../errors";
import authMiddleware from "../middlewares/auth.middleware";
import authRoute from "./auth.route";
import userRoute from "./user.route";

class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    let rootAPI = "/api/v1";
    this.router.get("/").get(`${rootAPI}/`, (req: Request, res: Response) => {
      return res.status(200).json({
        status: 200,
        message: "Welcome to FBY Security API",
        data: {
          service: "fby-security",
          version: "1.0.0",
        },
      });
    });

    this.router.use(`${rootAPI}/auth`, authRoute);

    this.router.use(authMiddleware.validateUserToken);

    this.router.use(`${rootAPI}/user`, userRoute);

    this.router.all("*", (req: Request, res: Response) => {
      // return res.status(400).json({
      //   status: 400,
      //   message: "Resource not found."
      // });
      throw new NotFoundError("Resource not found.");
    });
  }
}

export default new Routes().router;

import { Router, Request, Response,  NextFunction } from "express";
import { NotFoundError } from "../errors";
import authMiddleware from "../middlewares/auth.middleware";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import customerRoute from "./customer.route";
import jobRoute from "./job.route";
import utilRoute from "./util.route";
import  geoip from 'geoip-lite';

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

    this.router.use((req: Request, res: Response,  next: NextFunction  )=>{

      let ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
      ip="::ffff:190.2.138.12"
  
      console.log("::ffff:"+ip.substr(0, 7))
      console.log("always always always always always always")

            if (ip.substr(0, 7) == "::ffff:") {
              ip = ip.substr(7)
              var geo = geoip.lookup(ip);
              console.log(geo)
              req["user_time_zone"]=geo.timezone    
              req["objLatLon"]=geo.ll
            }
/*
            console.log(`------------------BEGIN REQUEST FROM ALL ROUTE CURRENT PATH ${req.path}-------------------------`)
           console.log(req)
           console.log(`------------------ENDS REQUEST FROM ALL ROUTE  CURRENT PATH ${req.path}-------------------------`)
*/
      next()
    });



    this.router.use(`${rootAPI}/auth`, authRoute);

    this.router.use(`${rootAPI}/util`, utilRoute);

  
    this.router.use(authMiddleware.validateUserToken);

    this.router.use(`${rootAPI}/customer`, customerRoute);

    this.router.use(`${rootAPI}/job`, jobRoute)

    this.router.use(`${rootAPI}/user`, userRoute)

    this.router.all("*", (req: Request, res: Response) => {
      // return res.status(400).json({
      //   status: 400,
      //   message: "Resource not found."
      // })



      throw new NotFoundError(JSON.stringify(req));
    });
  }
}

export default new Routes().router;

import express, { Application, Request, Response, NextFunction } from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import path from 'path';
//var ComfyWeb = require( "webwebwebs" );
import https from 'https';
import fs from 'fs';
import morgan from "morgan";
import debug from "debug";
import cron from "node-cron"
import DB from "./src/db";
import webpush from './src/controllers/util/web_push';
import serverConfig from "./src/config/server.config";
import routes from "./src/routes/index.route";
import systemMiddleware from "./src/middlewares/system.middleware";
import notification_scheduler from "./src/controllers/util/notification_scheduler";


const DEBUG = debug("dev");

class Server {
  public app: Application;

  protected port: number;

  private corsOptions: cors.CorsOptions;

  socketBytes = new Map();

  constructor() {
    this.app = express();


/*
    require("greenlock-express")
    .init({
        packageRoot: __dirname,
        configDir: "./greenlock.d",
 
        // contact for security and critical bug notices
        maintainerEmail: "jon@example.com",
 
        // whether or not to run at cloudscale
        cluster: false
    })
    // Serves on 80 and 443
    // Get's SSL certificates magically!
    .serve(this.app);
*/

    this.port =
      serverConfig.NODE_ENV === "test"
        ? 3234
        : Number(serverConfig.PORT) || 3080;
    this.corsOptions = {
      origin: serverConfig.ALLOWED_ORIGINS
        ? serverConfig.ALLOWED_ORIGINS.split(",")
        : [],
    };
    this.initializeDbAndFirebase();
    this.initializeMiddlewaresAndRoutes();
  }

  // Class Method to initialize db and firebase
  private async initializeDbAndFirebase(): Promise<void> {



    
    await DB.connectDB();
    await DB.connectFirebase();
    
    webpush()
    const job = cron.schedule('*/30 * * * *', () => {
      //notification_scheduler.sendNotificationToGuardForShiftCheckAndOut()

      notification_scheduler.sendNotificationToGuardForShiftCheckAndOut()
      notification_scheduler.sendNotificationForMessageSent()
      notification_scheduler.sendNotificationToGuardAndAdminForFailedCheckIn()
    });  
    
    job.start();

    
  }
  

  // Class methods to build middleware and routes
  private initializeMiddlewaresAndRoutes(): void {
    this.app.use(compression());
    if (serverConfig.NODE_ENV === "development") {
      this.app.use(cors());
    }
    else if(serverConfig.NODE_ENV === "production"){
      this.app.use(cors());

    }
     else {
      this.app.use(cors(this.corsOptions));
    }
    this.app.use((req: Request, res: Response, next: NextFunction) => {

      
      (req as any).socketProgress = this.getSocketProgress(req.socket);
      console.log((req as any).socketProgress);
      express.json()(req, res, next);
    });
    
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(express.static(path.join(__dirname, 'public')));
    global.__basedir =__dirname;
    this.app.use(helmet());
    if (["development", "production"].includes(serverConfig.NODE_ENV)) {
      this.app.use(morgan("dev"));
    }
    this.app.use(routes);
    this.app.use(systemMiddleware.errorHandler);
  }

  // Class Method to initiate app listening
  public start(): void {
    

    const sslFolder = '/home/fbyteamschedule/ssl/cert'
    const sslFolder2 = '/home/fbyteamschedule/ssl/private'; 

    /*
    const serverOptions = {
      cert: fs.readFileSync(path.join(sslFolder, 'middleware.fbyteamschedule.com.crt')),
      ca: fs.readFileSync(path.join(sslFolder, 'middleware.fbyteamschedule.com-ca.crt')),
      key: fs.readFileSync(path.join(sslFolder2, 'middleware.fbyteamschedule.com.key')),
    };
       
    const server = https.createServer(serverOptions,  this.app);
    */
    this.app.listen(this.port, () => {

     // console.log(process.env.DB_USERNAME)
      DEBUG(
        `server running on http://localhost:${this.port} in ${serverConfig.NODE_ENV} mode.\npress CTRL-C to stop`
      );
    }).on('error', (e) => {
      console.log('Error happened: ', e.message)
   });

/*
    ComfyWeb.Run( 443, {
        domain: "fbyteamschedule.com",
        email: "mosesogbonna68@gmail.com"
    } );

    */
   
  }

  private getSocketProgress(socket) {
    const currBytesRead = socket.bytesRead;
    let prevBytesRead;
    if (!this.socketBytes.has(socket)) {
      prevBytesRead = 0;
    } else {
      prevBytesRead = this.socketBytes.get(socket).prevBytesRead;
    }
    this.socketBytes.set(socket, { prevBytesRead: currBytesRead });
    return (currBytesRead - prevBytesRead) / 1024;
  }
}

const server = new Server();
server.start();

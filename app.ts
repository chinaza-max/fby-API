import express, { Application, Request, Response, NextFunction } from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import debug from "debug";
import DB from "./src/db";
import serverConfig from "./src/config/server.config";
import routes from "./src/routes/index.route";
import systemMiddleware from "./src/middlewares/system.middleware";

const DEBUG = debug("dev");

class Server {
  public app: Application;

  protected port: number;

  private corsOptions: cors.CorsOptions;

  socketBytes = new Map();

  constructor() {
    this.app = express();
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
  }

  // Class methods to build middleware and routes
  private initializeMiddlewaresAndRoutes(): void {
    this.app.use(compression());
    if (serverConfig.NODE_ENV === "development") {
      this.app.use(cors());
    } else {
      this.app.use(cors(this.corsOptions));
    }
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      (req as any).socketProgress = this.getSocketProgress(req.socket);
      console.log((req as any).socketProgress);
      express.json()(req, res, next);
    });
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(helmet());
    if (["development", "production"].includes(serverConfig.NODE_ENV)) {
      this.app.use(morgan("dev"));
    }
    this.app.use(routes);
    this.app.use(systemMiddleware.errorHandler);
  }

  // Class Method to initiate app listening
  public start(): void {
    this.app.listen(this.port, () => {

     // console.log(process.env.DB_USERNAME)
      DEBUG(
        `server running on http://localhost:${this.port} in ${serverConfig.NODE_ENV} mode.\npress CTRL-C to stop`
      );
    });
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

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const debug_1 = __importDefault(require("debug"));
const db_1 = __importDefault(require("./src/db"));
const server_config_1 = __importDefault(require("./src/config/server.config"));
const index_route_1 = __importDefault(require("./src/routes/index.route"));
const system_middleware_1 = __importDefault(require("./src/middlewares/system.middleware"));
const DEBUG = (0, debug_1.default)("dev");
class Server {
    constructor() {
        this.socketBytes = new Map();
        this.app = (0, express_1.default)();
        this.port =
            server_config_1.default.NODE_ENV === "test"
                ? 3234
                : Number(server_config_1.default.PORT) || 3080;
        this.corsOptions = {
            origin: server_config_1.default.ALLOWED_ORIGINS
                ? server_config_1.default.ALLOWED_ORIGINS.split(",")
                : [],
        };
        this.initializeDbAndFirebase();
        this.initializeMiddlewaresAndRoutes();
    }
    // Class Method to initialize db and firebase
    initializeDbAndFirebase() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.default.connectDB();
            yield db_1.default.connectFirebase();
        });
    }
    // Class methods to build middleware and routes
    initializeMiddlewaresAndRoutes() {
        this.app.use((0, compression_1.default)());
        if (server_config_1.default.NODE_ENV === "development") {
            this.app.use((0, cors_1.default)());
        }
        else {
            this.app.use((0, cors_1.default)(this.corsOptions));
        }
        this.app.use((req, res, next) => {
            req.socketProgress = this.getSocketProgress(req.socket);
            console.log(req.socketProgress);
            express_1.default.json()(req, res, next);
        });
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        global.__basedir = __dirname;
        this.app.use((0, helmet_1.default)());
        if (["development", "production"].includes(server_config_1.default.NODE_ENV)) {
            this.app.use((0, morgan_1.default)("dev"));
        }
        this.app.use(index_route_1.default);
        this.app.use(system_middleware_1.default.errorHandler);
    }
    // Class Method to initiate app listening
    start() {
        this.app.listen(this.port, () => {
            // console.log(process.env.DB_USERNAME)
            DEBUG(`server running on http://localhost:${this.port} in ${server_config_1.default.NODE_ENV} mode.\npress CTRL-C to stop`);
        });
    }
    getSocketProgress(socket) {
        const currBytesRead = socket.bytesRead;
        let prevBytesRead;
        if (!this.socketBytes.has(socket)) {
            prevBytesRead = 0;
        }
        else {
            prevBytesRead = this.socketBytes.get(socket).prevBytesRead;
        }
        this.socketBytes.set(socket, { prevBytesRead: currBytesRead });
        return (currBytesRead - prevBytesRead) / 1024;
    }
}
const server = new Server();
server.start();
//# sourceMappingURL=app.js.map
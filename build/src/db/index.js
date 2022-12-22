"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const sequelize_1 = require("sequelize");
const models_1 = require("./models");
const server_config_1 = __importDefault(require("../config/server.config"));
const firebase = __importStar(require("firebase-admin"));
const debug_1 = __importDefault(require("debug"));
const DEBUG = (0, debug_1.default)("dev");
class DB {
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const options = {
                    logging: console.log,
                    dialect: "mysql",
                    host: server_config_1.default.DB_HOST,
                    username: server_config_1.default.DB_USERNAME,
                    password: server_config_1.default.DB_PASSWORD,
                    port: Number(server_config_1.default.DB_PORT),
                    database: server_config_1.default.DB_NAME,
                    logQueryParameters: true
                };
                this.sequelize = new sequelize_1.Sequelize(server_config_1.default.DB_NAME, server_config_1.default.DB_USERNAME, server_config_1.default.DB_PASSWORD, options);
                (0, models_1.init)(this.sequelize);
                // if (serverConfig.NODE_ENV === "development") {
                //  await this.sequelize.sync({ alter: true });
                // }
                DEBUG("connected to database.");
                return this.sequelize;
            }
            catch (error) {
                DEBUG(`failed to connect to database: ${error}`);
                throw error;
            }
        });
    }
    connectFirebase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceAccount = {
                    type: server_config_1.default.FIREBASE_TYPE,
                    project_id: server_config_1.default.FIREBASE_PROJECT_ID,
                    private_key_id: server_config_1.default.FIREBASE_PRIVATE_KEY_ID,
                    private_key: server_config_1.default.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
                    client_email: server_config_1.default.FIREBASE_CLIENT_EMAIL,
                    client_id: server_config_1.default.FIREBASE_CLIENT_ID,
                    auth_uri: server_config_1.default.FIREBASE_AUTH_URI,
                    token_uri: server_config_1.default.FIREBASE_TOKEN_URI,
                    auth_provider_x509_cert_url: server_config_1.default.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                    client_x509_cert_url: server_config_1.default.FIREBASE_CLIENT_X509_CERT_URL,
                };
                this.fireBaseConnection = firebase.initializeApp({
                    credential: firebase.credential.cert(serviceAccount),
                });
                DEBUG("connection established to firebase.");
            }
            catch (error) {
                DEBUG(`failed to connect to firebase: ${error}`);
            }
        });
    }
}
exports.default = new DB();
//# sourceMappingURL=index.js.map
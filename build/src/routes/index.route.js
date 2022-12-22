"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errors_1 = require("../errors");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const customer_route_1 = __importDefault(require("./customer.route"));
const job_route_1 = __importDefault(require("./job.route"));
const util_route_1 = __importDefault(require("./util.route"));
class Routes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        let rootAPI = "/api/v1";
        this.router.get("/").get(`${rootAPI}/`, (req, res) => {
            return res.status(200).json({
                status: 200,
                message: "Welcome to FBY Security API",
                data: {
                    service: "fby-security",
                    version: "1.0.0",
                },
            });
        });
        this.router.use(`${rootAPI}/auth`, auth_route_1.default);
        this.router.use(`${rootAPI}/util`, util_route_1.default);
        this.router.use(auth_middleware_1.default.validateUserToken);
        this.router.use(`${rootAPI}/customer`, customer_route_1.default);
        this.router.use(`${rootAPI}/job`, job_route_1.default);
        this.router.use(`${rootAPI}/user`, user_route_1.default);
        this.router.all("*", (req, res) => {
            // return res.status(400).json({
            //   status: 400,
            //   message: "Resource not found."
            // });
            throw new errors_1.NotFoundError("Resource not found.");
        });
    }
}
exports.default = new Routes().router;
//# sourceMappingURL=index.route.js.map
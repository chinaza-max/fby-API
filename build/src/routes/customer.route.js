"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const customer_controller_1 = __importDefault(require("../controllers/customer/customer.controller"));
class CustomerRoutes extends customer_controller_1.default {
    constructor() {
        super();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.get("/", auth_middleware_1.default.validateUserToken, this.getAllCustomers);
        this.router.get("/one", auth_middleware_1.default.validateUserToken, this.getSingleCustomer);
        this.router.post("/", auth_middleware_1.default.validateUserToken, this.createCustomer);
        this.router.post("/deleteCustomer", 
        // authMiddleware.validateUserToken,
        this.deleteCustomer);
        this.router.post("/createFacility", 
        //   authMiddleware.validateUserToken,
        this.createFacility);
        this.router.post("/updateFacility", auth_middleware_1.default.validateUserToken, this.updateFacility);
        this.router.post("/deleteFacility", auth_middleware_1.default.validateUserToken, this.deleteFacility);
        this.router.post("/bulk", auth_middleware_1.default.validateUserToken, this.createCustomerBulk);
        this.router.get("/test", auth_middleware_1.default.validateUserToken, this.testEmail);
        // this.router.get("/", authMiddleware.validateUserToken, this.getAllCustomers);
        // this.router.post("/register", this.signup);
    }
}
exports.default = new CustomerRoutes().router;
//# sourceMappingURL=customer.route.js.map
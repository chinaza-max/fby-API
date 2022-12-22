"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const auth_controller_1 = __importDefault(require("../controllers/auth/auth.controller"));
class AuthRoutes extends auth_controller_1.default {
    constructor() {
        super();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.post("/login", this.login);
        this.router.post("/admin/login", this.loginAdmin);
        this.router.post("/send-password-reset-link", this.resetPasswordEmail);
        this.router.post("/reset-password", this.resetPassword);
        this.router.get("/", auth_middleware_1.default.validateUserToken, this.whoAmI);
        this.router.post("/register", this.signupGuard);
        this.router.post("/registerBulk", this.signupGuardBulk);
        this.router.post("/admin/register", this.signupAdmin);
    }
}
exports.default = new AuthRoutes().router;
//# sourceMappingURL=auth.route.js.map
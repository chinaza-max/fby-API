"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../controllers/user/index");
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
class UserRoutes extends index_1.UserController {
    constructor() {
        super();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.put("/updateProfile", upload_middleware_1.default.avatars.single("image"), this.update);
        this.router.get("/getAllStaff", this.getAllStaff);
        this.router.post("/deleteStaff", this.deleteStaff);
        this.router.post("/toggleVisibilty", this.toggleVisibilty);
    }
}
exports.default = new UserRoutes().router;
//# sourceMappingURL=user.route.js.map
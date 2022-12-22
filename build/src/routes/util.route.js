"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const util_controller_1 = __importDefault(require("../controllers/util/util.controller"));
class UtilRoutes extends util_controller_1.default {
    constructor() {
        super();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.post("/googleMapsAutoComplete", this.googleMapsAutoComplete);
        this.router.post("/googleMapsLocationSearch", this.googleMapsLocationSearch);
    }
}
exports.default = new UtilRoutes().router;
//# sourceMappingURL=util.route.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errors_1 = require("../errors");
class RateLimitMiddlewares {
    constructor() {
        this.profileViewLimiter = (0, express_rate_limit_1.default)({
            keyGenerator: (req, res) => `${req.socket.remoteAddress}-${req.body.businessId}`,
            windowMs: 60 * 60 * 1000,
            max: 10,
            message: "Too many request created from this IP to this business, please try again later!",
            handler: (req, res, next, options) => next(new errors_1.TooManyRequestsError(options.message)),
            standardHeaders: true,
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        });
    }
}
exports.default = new RateLimitMiddlewares();
//# sourceMappingURL=rateLimit.middleware.js.map
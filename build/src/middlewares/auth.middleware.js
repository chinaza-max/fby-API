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
const index_1 = require("../errors/index");
const auth_service_1 = __importDefault(require("../service/auth.service"));
const debug_1 = __importDefault(require("debug"));
const DEBUG = (0, debug_1.default)("dev");
class AuthenticationMiddlewares {
    validateUserToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authorization } = req.headers;
                if (!authorization)
                    throw new index_1.BadRequestError("No token provided.");
                // console.log(authorization);
                const token = authorization.split(" ")[1];
                // console.log(token);
                if (!token)
                    throw new index_1.BadRequestError("No token provided.");
                const { payload, expired } = auth_service_1.default.verifyToken(token);
                if (expired)
                    throw new index_1.UnAuthorizedError("Invalid token.");
                req.user = payload;
                return next();
            }
            catch (error) {
                DEBUG(`Error in validating user token: ${error}`);
                next(error);
            }
        });
    }
    getUserOrSkip(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authorization } = req.headers;
                const token = authorization ? authorization.split(" ")[1] : undefined;
                if (token) {
                    const { payload, expired } = auth_service_1.default.verifyToken(token);
                    req.user = !expired ? payload : undefined;
                }
                return next();
            }
            catch (error) {
                DEBUG(`Error in get user or skip auth middleware: ${error}`);
                next(error);
            }
        });
    }
}
exports.default = new AuthenticationMiddlewares();
//# sourceMappingURL=auth.middleware.js.map
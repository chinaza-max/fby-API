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
const sequelize_1 = __importDefault(require("sequelize"));
const joi_1 = __importDefault(require("joi"));
const errors_1 = require("../errors");
class SystemMiddlewares {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    errorHandler(error, req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error instanceof joi_1.default.ValidationError) {
                return res.status(400).json({
                    status: "validation-error",
                    errors: error.details,
                });
            }
            if (error instanceof sequelize_1.default.UniqueConstraintError) {
                return res.status(400).json({
                    status: "validation-error",
                    message: "Duplicate entry",
                });
            }
            if (error instanceof errors_1.ValidationError) {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                const { _required_variables } = error;
                const message = error.message
                    ? error.message
                    : `${_required_variables.join("or ")} is required`;
                return res.status(400).json({
                    status: "validation-error",
                    message,
                    required_variables: _required_variables,
                });
            }
            if (error instanceof errors_1.SystemError) {
                switch (error.name) {
                    case "NotFoundError":
                        return res.status(404).json({
                            status: error.code,
                            message: error.message,
                        });
                    case "UnAuthorizedError":
                        return res.status(401).json({
                            status: error.code,
                            message: error.message,
                        });
                    case "EmailClientError":
                        return res.status(500).json({
                            status: error.code,
                            message: error.message,
                        });
                    case "ConflictError":
                        return res.status(409).json({
                            status: error.code,
                            message: error.message,
                        });
                    case "TooManyRequestsError":
                        return res.status(429).json({
                            status: error.code,
                            message: error.message,
                        });
                    case "ServerError":
                    case "SystemError":
                    default:
                        return res.status(500).json({
                            status: error.code,
                            message: error.message,
                        });
                }
            }
            return res.status(500).json({
                status: "server-error",
                message: "An unexpected error occured.",
            });
        });
    }
}
exports.default = new SystemMiddlewares();
//# sourceMappingURL=system.middleware.js.map
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
const models_1 = require("../../db/models");
const auth_service_1 = __importDefault(require("../../service/auth.service"));
const mail_service_1 = __importDefault(require("../../service/mail.service"));
class AuthenticationController {
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authType } = req.query;
                const data = req.body;
                var obj;
                try {
                    obj = yield auth_service_1.default.handleUserAuthentication(data);
                }
                catch (error) {
                    console.log(error);
                }
                if (obj == null)
                    return res.status(400).json({
                        status: 400,
                        message: "Invalid login credentials",
                    });
                const token = yield auth_service_1.default.generateToken(obj.data);
                console.log(token);
                return res.status(200).json({
                    status: 200,
                    message: "Login successful.",
                    data: { user: obj.transfromedUser, token },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    loginAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authType } = req.query;
                const data = req.body;
                var obj;
                try {
                    obj = yield auth_service_1.default.handleAdminAuthentication(data);
                }
                catch (error) {
                    console.log(error);
                }
                if (obj == -1)
                    return res.status(401).json({
                        status: 401,
                        message: "Unauthorized access!",
                    });
                if (obj == null)
                    return res.status(400).json({
                        status: 400,
                        message: "Invalid login credentials",
                    });
                const token = yield auth_service_1.default.generateToken(obj.data);
                console.log(token);
                return res.status(200).json({
                    status: 200,
                    message: "Login successful.",
                    data: { user: obj.transfromedUser, token },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    signupGuard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authType } = req.query;
                const data = req.body;
                const obj = yield auth_service_1.default.handleUserCreation(data);
                try {
                    if (obj != null) {
                        yield mail_service_1.default.sendMail({
                            to: obj.transfromedUser.email,
                            subject: "Welcome to FBY Security",
                            templateName: "welcome",
                            variables: {
                                userRole: "Guard",
                                website: "https://fbysecuritysvs.com",
                                email: obj.transfromedUser.email,
                                password: data.password,
                            },
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                }
                return res.status(200).json({
                    status: 200,
                    message: "Guard registered successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    signupAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                console.log(data);
                const obj = yield auth_service_1.default.handleAdminCreation(data);
                try {
                    if (obj != null) {
                        yield mail_service_1.default.sendMail({
                            to: obj.transfromedUser.email,
                            subject: "Welcome to FBY Security",
                            templateName: "welcome",
                            variables: {
                                userRole: "Admin",
                                website: "https://fbysecuritysvs.com",
                                email: obj.transfromedUser.email,
                                password: data.password,
                            },
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                }
                return res.status(200).json({
                    status: 200,
                    message: "Admin registered successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    whoAmI(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.user;
                const user = yield auth_service_1.default.getCurrentUser(id);
                var LocationModel = models_1.Location;
                var relatedLocation = yield LocationModel.findByPk(user.location_id);
                var { transfromedUser } = yield auth_service_1.default.transformUserForResponse(user, relatedLocation);
                return res.status(200).json({
                    status: 200,
                    data: {
                        user: transfromedUser,
                        token: req.headers.authorization.split(" ")[1],
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPasswordEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdResetObj = yield auth_service_1.default.handlePasswordResetEmail(req.body);
                return res.status(200).json({
                    status: 200,
                    message: "A reset link was sent to your email"
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdResetObj = yield auth_service_1.default.handlePasswordReset(req.body);
                return res.status(200).json({
                    status: 200,
                    message: "Password updated successufully"
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    signupGuardBulk(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authType } = req.query;
                const data = req.body;
                const obj = yield auth_service_1.default.handleBulkUserCreaton(data);
                return res.status(200).json({
                    status: 200,
                    message: "Guard registered successfully",
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AuthenticationController;
//# sourceMappingURL=auth.controller.js.map
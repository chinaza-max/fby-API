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
const customer_service_1 = __importDefault(require("../../service/customer.service"));
const mail_service_1 = __importDefault(require("../../service/mail.service"));
class CustomerController {
    createCustomerBulk(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield customer_service_1.default.handleCustomerCreationBulk(data);
                return res.status(200).json({
                    status: 200,
                    message: "Customers registered successfully",
                    data: obj
                });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    createFacility(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield customer_service_1.default.handleCreateFacility(data);
                return res.status(200).json({
                    status: 200,
                    message: "Site registered successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteFacility(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield customer_service_1.default.handleDeleteFacility(data);
                return res.status(200).json({
                    status: 200,
                    message: "Site deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateFacility(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield customer_service_1.default.handleUpdateFacility(data);
                return res.status(200).json({
                    status: 200,
                    message: "Site updatered successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                console.log(data);
                const obj = yield customer_service_1.default.deleteCustomer(data);
                return res.status(200).json({
                    status: 200,
                    message: "Customer deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                console.log(data);
                const obj = yield customer_service_1.default.handleCustomerCreation(data);
                try {
                    if (obj != null) {
                        yield mail_service_1.default.sendMail({
                            to: obj.email,
                            subject: "Welcome to FBY Security",
                            templateName: "welcome2",
                            variables: {
                                userRole: "Customer",
                                website: "https://fbysecuritysvs.com",
                                email: obj.email,
                                password: obj.password
                            },
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                }
                return res.status(200).json({
                    status: 200,
                    message: "Customer registered successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetCustomerPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const obj = yield customer_service_1.default.handleCustomerGetAll("all");
                if ((obj === null || obj === void 0 ? void 0 : obj.length) === null) {
                    return res.status(400).json({
                        status: 400,
                        data: obj !== null && obj !== void 0 ? obj : "Failed to process request",
                    });
                }
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    testEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mail_service_1.default.sendMail({
                    to: "turboburstenvironment@gmail.com",
                    subject: "Reset Password",
                    templateName: "reset_password",
                    variables: { resetLink: "https://fbysecurity.web.app/auth/login" },
                });
                return res.status(200).json({
                    status: 200,
                    message: "Email Sent Successfully",
                });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    getAllCustomers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                let myData;
                if (Object.keys(req.query).length === 0) {
                    myData = "all";
                }
                else {
                    myData = {
                        limit: Number(req.query.limit),
                        offset: Number(req.query.offset)
                    };
                }
                const obj = yield customer_service_1.default.handleCustomerGetAll(myData);
                if ((obj === null || obj === void 0 ? void 0 : obj.length) === null) {
                    return res.status(400).json({
                        status: 400,
                        data: obj !== null && obj !== void 0 ? obj : "Failed to process request",
                    });
                }
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSingleCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const userId = req.query.id;
                const obj = yield customer_service_1.default.handleGetSingleCustomer(userId);
                if ((obj === null || obj === void 0 ? void 0 : obj.length) === null) {
                    return res.status(400).json({
                        status: 400,
                        data: obj !== null && obj !== void 0 ? obj : "Failed to process request",
                    });
                }
                return res.status(200).json({
                    status: 200,
                    data: obj,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = CustomerController;
//# sourceMappingURL=customer.controller.js.map
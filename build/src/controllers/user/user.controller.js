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
const user_service_1 = __importDefault(require("../../service/user.service"));
class UserController {
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log(req)
                const { id } = req.user;
                const data = req.body;
                const { file } = req;
                const user = yield user_service_1.default.updateUser(id, data, file);
                return res.status(200).json({
                    status: 200,
                    message: "User update successful.",
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteStaff(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.body.id;
                const users = yield user_service_1.default.deleteStaff(id);
                return res.status(200).json({
                    status: 200,
                    message: "successfully deleted",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    toggleVisibilty(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.user;
                const users = yield user_service_1.default.toggleVisibilty(id);
                return res.status(200).json({
                    status: 200,
                    data: "status updated successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllStaff(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.query);
                const data = req.body;
                const myData = {
                    limit: Number(req.query.limit),
                    offset: Number(req.query.offset),
                    role: req.query.role
                };
                const users = yield user_service_1.default.getAllStaff(myData);
                return res.status(200).json({
                    status: 200,
                    data: users,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map
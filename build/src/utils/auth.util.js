"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AdminUtil {
    constructor() {
        this.verifyUserCreationData = joi_1.default.object().keys({
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
            first_name: joi_1.default.string().required(),
            last_name: joi_1.default.string().required(),
            phone_number: joi_1.default.number().required(),
            address: joi_1.default.string().required(),
            email: joi_1.default.string().trim().required(),
            password: joi_1.default.string(),
            date_of_birth: joi_1.default.date().min(new Date("1900-01-01").toLocaleDateString("af-AZ")).required(),
            gender: joi_1.default.string().required().valid('MALE', 'FEMALE', 'NOT_SPECIFIED'),
        });
        this.validateUserEmail = joi_1.default.object().keys({
            email: joi_1.default.string().email().required(),
        });
        this.validatePasswordReset = joi_1.default.object().keys({
            password: joi_1.default.string().min(6).required(),
            reset_password_key: joi_1.default.string().min(1).required(),
        });
    }
}
exports.default = new AdminUtil();
//# sourceMappingURL=auth.util.js.map
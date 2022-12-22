"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class UserUtil {
    constructor() {
        this.verifyUserUpdateData = joi_1.default.object().keys({
            first_name: joi_1.default.string().required(),
            last_name: joi_1.default.string().required(),
            address: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            phone_number: joi_1.default.number().required(),
            date_of_birth: joi_1.default.date()
                .min(new Date("1900-01-01").toLocaleDateString("af-AZ"))
                .required(),
            gender: joi_1.default.string().required().valid("MALE", "FEMALE", "NOT_SPECIFIED"),
            image: joi_1.default.object().unknown(true).error((errors) => {
                errors.forEach(error => {
                    error.message = "Image must be a valid file not greater than 1mb";
                });
                return errors;
            }),
        });
    }
}
exports.default = new UserUtil();
//# sourceMappingURL=user.util.js.map
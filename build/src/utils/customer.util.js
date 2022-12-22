"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class CustomerUtil {
    constructor() {
        this.verifyDeleteFacility = joi_1.default.object().keys({
            site_id: joi_1.default.number().required(),
        });
        this.verifyUpdateFacility = joi_1.default.object().keys({
            guard_charge: joi_1.default.number().required(),
            site_name: joi_1.default.string().required(),
            client_charge: joi_1.default.number().required(),
            site_id: joi_1.default.number().required(),
            operations_area_constraint: joi_1.default.number().required(),
            facility_location_id: joi_1.default.number().required(),
        });
        this.verifyFacilityCreation = joi_1.default.object().keys({
            site_name: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            guard_charge: joi_1.default.number().required(),
            client_charge: joi_1.default.number().required(),
            address: joi_1.default.string().required(),
            google_address: joi_1.default.string().required(),
            latitude: joi_1.default.number().required(),
            latitude_admin: joi_1.default.number().required(),
            longitude_admin: joi_1.default.number().required(),
            customer_id: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
            operations_area_constraint: joi_1.default.number().required(),
        });
        this.verifyDeleteCustomer = joi_1.default.object().keys({
            address_id: joi_1.default.number().required(),
        });
        this.verifyUserCreationData = joi_1.default.object().keys({
            first_name: joi_1.default.string().required(),
            last_name: joi_1.default.string().required(),
            address: joi_1.default.string().required(),
            email: joi_1.default.string().trim().required(),
            phone_number: joi_1.default.number().required(),
            latitude: joi_1.default.number().required(),
            longitude: joi_1.default.number().required(),
            // password: Joi.string().required(),
            date_of_birth: joi_1.default.date().min(new Date("1900-01-01").toLocaleDateString("af-AZ")).required(),
            gender: joi_1.default.string().required().valid('MALE', 'FEMALE', 'NOT_SPECIFIED'),
            // image: Joi.string().min(5),
        });
        this.verifyUserUpdateData = joi_1.default.object().keys({
            first_name: joi_1.default.string().required(),
            last_name: joi_1.default.string().required(),
            address: joi_1.default.string().required(),
            email: joi_1.default.string().trim().required(),
            // password: Joi.string().required(),
            date_of_birth: joi_1.default.date().min(new Date("1900-01-01").toLocaleDateString("af-AZ")).required(),
            gender: joi_1.default.string().required().valid('MALE', 'FEMALE', 'NOT_SPECIFIED'),
            // image: Joi.string().min(5),
            sites: joi_1.default.array().min(1).max(20).items({
                site_name: joi_1.default.string().required(),
                amount: joi_1.default.number().required(),
                address: joi_1.default.string().required(),
                latitude: joi_1.default.number().required(),
                longitude: joi_1.default.number().required(),
                operations_area_constraint_active: joi_1.default.boolean().required(),
                operations_area_constraint: joi_1.default.number().required(),
            }),
        });
    }
}
exports.default = new CustomerUtil();
//# sourceMappingURL=customer.util.js.map
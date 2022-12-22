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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../db/models");
const server_config_1 = __importDefault(require("../config/server.config"));
const auth_util_1 = __importDefault(require("../utils/auth.util"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../errors");
const util_service_1 = __importDefault(require("./util.service"));
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const sequelize_1 = require("sequelize");
const mail_service_1 = __importDefault(require("./mail.service"));
class AuthenticationService {
    constructor() {
        this.UserModel = models_1.Admin;
        this.LocationModel = models_1.Location;
        this.PasswordResetModel = models_1.PasswordReset;
    }
    handleUserAuthentication(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            const user = yield models_1.Admin.findOne({
                where: {
                    email: email,
                    role: {
                        [sequelize_1.Op.eq]: "GUARD",
                    },
                },
            });
            if (!(yield bcrypt_1.default.compare(password, user.password)))
                return null;
            var relatedLocation = yield this.LocationModel.findByPk(user.location_id);
            user.last_logged_in = new Date();
            var transfromedUserObj = yield this.transformUserForResponse(user, relatedLocation);
            yield util_service_1.default.updateStat("GUARD_SIGNIN");
            return transfromedUserObj;
        });
    }
    handleAdminAuthentication(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            const user = yield models_1.Admin.findOne({ where: { email: email } });
            console.log(bcrypt_1.default.compare(password, user.password));
            if (!(yield bcrypt_1.default.compare(password, user.password)))
                return null;
            if (user.role != "ADMIN")
                return -1;
            var relatedLocation = yield this.LocationModel.findByPk(user.location_id);
            user.last_logged_in = new Date();
            var transfromedUserObj = yield this.transformUserForResponse(user, relatedLocation);
            yield util_service_1.default.updateStat("STAFF_SIGNIN");
            return transfromedUserObj;
        });
    }
    handleUserCreation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let { first_name, last_name, email, image, date_of_birth, gender, password, address, phone_number, latitude, longitude } = yield auth_util_1.default.verifyUserCreationData.validateAsync(data);
            let my_time_zone = yield this.getTimeZone(latitude, longitude);
            let dateStamp = yield this.getDateAndTimeForStamp(my_time_zone);
            let hashedPassword;
            if (password == null)
                password = this.generatePassword();
            try {
                hashedPassword = yield bcrypt_1.default.hash(password, Number(server_config_1.default.SALT_ROUNDS));
            }
            catch (error) {
                throw new errors_1.SystemError("An error occured while processing your request");
            }
            console.log(hashedPassword);
            var existingUser = yield this.getUserByEmail(email);
            console.log(existingUser);
            if (existingUser != null)
                throw new errors_1.ConflictError("A user with this email already exists");
            var createdLocation = yield this.LocationModel.create({
                address,
                created_at: dateStamp,
                updated_at: dateStamp
            });
            console.log(createdLocation.id);
            const user = yield this.UserModel.create({
                first_name,
                last_name,
                email,
                image,
                date_of_birth,
                gender,
                password: hashedPassword,
                location_id: createdLocation.id,
                phone_number,
                role: "GUARD",
                availability: true,
                created_at: dateStamp,
                updated_at: dateStamp
            });
            var transfromedUserObj = yield this.transformUserForResponse(user, createdLocation);
            yield util_service_1.default.updateStat("GUARD_SIGNUP");
            return transfromedUserObj;
        });
    }
    handleBulkUserCreaton(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let createdUsers = [];
            for (const user of data) {
                let createdUser = yield this.handleUserCreation(user);
                createdUsers.push(createdUser);
            }
            return createdUsers;
        });
    }
    handleAdminCreation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let { first_name, last_name, email, image, date_of_birth, gender, password, address, latitude, longitude, phone_number } = yield auth_util_1.default.verifyUserCreationData.validateAsync(data);
            let my_time_zone = yield this.getTimeZone(latitude, longitude);
            let dateStamp = yield this.getDateAndTimeForStamp(my_time_zone);
            let hashedPassword;
            if (password == null)
                password = this.generatePassword();
            try {
                hashedPassword = yield bcrypt_1.default.hash(password, Number(server_config_1.default.SALT_ROUNDS));
            }
            catch (error) {
                throw new errors_1.SystemError("An error occured while processing your request");
            }
            console.log(hashedPassword);
            var existingUser = yield this.getUserByEmail(email);
            console.log(existingUser);
            if (existingUser != null)
                throw new errors_1.ConflictError("A user with this email already exists");
            var createdLocation = yield this.LocationModel.create({
                address,
                created_at: dateStamp,
                updated_at: dateStamp
            });
            const user = yield this.UserModel.create({
                first_name,
                last_name,
                email,
                image,
                date_of_birth,
                gender,
                password: hashedPassword,
                location_id: createdLocation.id,
                phone_number,
                role: "ADMIN",
                created_at: dateStamp,
                updated_at: dateStamp
            });
            var transfromedUserObj = yield this.transformUserForResponse(user, createdLocation);
            yield util_service_1.default.updateStat("STAFF_SIGNUP");
            return transfromedUserObj;
        });
    }
    handlePasswordResetEmail(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            var { email } = yield auth_util_1.default.validateUserEmail.validateAsync(data);
            var matchedUser = yield this.UserModel.findOne({
                where: {
                    email,
                },
            });
            if (matchedUser == null)
                throw new errors_1.NotFoundError("This email does not correspond to any user");
            var keyExpirationMillisecondsFromEpoch = new Date().getTime() + 30 * 60 * 1000;
            var generatedKey = this.generatePassword(true);
            var relatedPasswordReset = yield this.PasswordResetModel.findOrCreate({
                where: {
                    user_id: matchedUser.id,
                },
                defaults: {
                    user_id: matchedUser.id,
                    reset_key: generatedKey,
                    expires_in: new Date(keyExpirationMillisecondsFromEpoch),
                },
            });
            (_a = relatedPasswordReset[0]) === null || _a === void 0 ? void 0 : _a.update({
                user_id: matchedUser.id,
                reset_key: generatedKey,
                expires_in: new Date(keyExpirationMillisecondsFromEpoch),
            });
            yield mail_service_1.default.sendMail({
                to: matchedUser.email,
                subject: "Reset Password",
                templateName: "reset_password",
                variables: {
                    resetLink: `http://127.0.0.1:5502/dist/PasswordReset.html?key=${generatedKey}_${keyExpirationMillisecondsFromEpoch}`
                },
            });
        });
    }
    handlePasswordReset(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var { email, password, reset_password_key } = yield auth_util_1.default.validatePasswordReset.validateAsync(data);
            var relatedPasswordReset = yield this.PasswordResetModel.findOne({
                where: {
                    reset_key: reset_password_key,
                },
            });
            if (relatedPasswordReset == null)
                throw new errors_1.NotFoundError("Invalid reset link");
            else if (relatedPasswordReset.expires_in.getTime() < new Date().getTime())
                throw new errors_1.NotFoundError("Reset link expired");
            var relatedUser = yield this.UserModel.findOne({
                where: { id: relatedPasswordReset.user_id },
            });
            if (relatedUser == null)
                throw new errors_1.NotFoundError("Selected user cannot be found");
            try {
                var hashedPassword = yield bcrypt_1.default.hash(password, Number(server_config_1.default.SALT_ROUNDS));
                relatedUser.update({
                    password: hashedPassword,
                });
                relatedPasswordReset.update({
                    expires_in: new Date(),
                });
            }
            catch (error) {
                throw new errors_1.ServerError("Failed to update password");
            }
        });
    }
    generateToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rawUser = user.get();
                const token = jsonwebtoken_1.default.sign(rawUser, server_config_1.default.TOKEN_SECRET, {
                    algorithm: "HS256",
                    expiresIn: "2d",
                    issuer: server_config_1.default.TOKEN_ISSUER,
                });
                return token;
            }
            catch (error) {
                return error;
            }
        });
    }
    transformUserForResponse(data, locationObj) {
        try {
            var { id, image, first_name, last_name, email, date_of_birth, gender, phone_number, created_at, updated_at, is_archived, } = data;
            var transfromedUser = {
                id,
                image,
                first_name,
                last_name,
                email,
                phone_number,
                // Added Location
                address: locationObj.address,
                date_of_birth,
                gender,
                created_at,
                updated_at,
                is_archived,
            };
            return { transfromedUser, data };
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    getCurrentUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserModel.findByPk(id);
            return user;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({ where: { email: email } });
        });
    }
    getUserCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.count();
        });
    }
    getDateAndTimeForStamp(my_time_zone) {
        return __awaiter(this, void 0, void 0, function* () {
            let con_fig_time_zone = moment_timezone_1.default.tz(my_time_zone);
            let date = new Date(con_fig_time_zone.format('YYYY-MM-DD hh:mm:ss a'));
            return date;
        });
    }
    getTimeZone(lat, log) {
        return __awaiter(this, void 0, void 0, function* () {
            let timestamp = (0, moment_1.default)(new Date()).unix();
            try {
                let response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${log}&timestamp=${timestamp}&key=${server_config_1.default.GOOGLE_KEY}`);
                // console.log(response.data.url);
                // console.log(response.data.explanation);
                console.log(response.data);
                return response.data.timeZoneId;
            }
            catch (error) {
                console.log(error);
                throw new errors_1.NotFoundError("Failed to resolve query");
            }
        });
    }
    verifyToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, server_config_1.default.TOKEN_SECRET);
            return {
                payload,
                expired: false,
            };
        }
        catch (error) {
            return {
                payload: null,
                expired: error.message.includes("expired") ? error.message : error,
            };
        }
    }
    generatePassword(omitSpecial = false, passwordLength = 12) {
        var chars = omitSpecial
            ? "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            : "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        // var passwordLength = 12;
        var password = "";
        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber + 1);
        }
        return password;
    }
}
exports.default = new AuthenticationService();
//# sourceMappingURL=auth.service.js.map
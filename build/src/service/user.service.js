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
const models_1 = require("../db/models");
const errors_1 = require("../errors");
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const user_util_1 = __importDefault(require("../utils/user.util"));
const server_config_1 = __importDefault(require("../config/server.config"));
class UserService {
    constructor() {
        this.UserModel = models_1.Admin;
        this.LocationModel = models_1.Location;
    }
    updateUser(id, data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const userUpdateData = yield user_util_1.default.verifyUserUpdateData.validateAsync(data);
            const user = yield this.UserModel.findByPk(id);
            if (!user)
                throw new errors_1.NotFoundError("User not found.");
            try {
                var filePath = global.__basedir + "\\" + "public" + user.image.slice(server_config_1.default.DOMAIN.length, user.image.length);
                if (filePath.includes("fbyDefaultIMG.png")) {
                }
                else {
                    fs_1.default.unlinkSync(filePath);
                }
            }
            finally {
                if (file)
                    yield user.update({ image: server_config_1.default.DOMAIN + file.path.slice(6, file.path.length) });
                var relatedLocation = yield this.LocationModel.findOrCreate({
                    where: {
                        id: user.location_id,
                    },
                    defaults: {
                        address: userUpdateData.address,
                    },
                });
                relatedLocation[0].update({
                    address: userUpdateData.address,
                });
                user.update({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    location_id: relatedLocation[0].id,
                    email: data.email,
                    date_of_birth: data.date_of_birth,
                    gender: data.gender,
                    phone_number: data.phone_number
                });
                // await user.update();
                return user;
            }
        });
    }
    deleteStaff(address_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.LocationModel.destroy({
                where: {
                    id: address_id
                }
            });
        });
    }
    toggleVisibilty(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = data;
            const user = yield this.UserModel.findByPk(id);
            console.log(user.availability);
            yield this.UserModel.update({ availability: !user.availability }, {
                where: {
                    id
                }
            });
        });
    }
    getAllStaff(data) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data.role);
            if (data.role == "ADMIN") {
                var staffs = yield this.UserModel.findAll({
                    limit: data.limit,
                    offset: data.offset,
                    where: {
                        role: {
                            [sequelize_1.Op.eq]: "ADMIN",
                        },
                    },
                    include: {
                        model: models_1.Location,
                        as: "location",
                    },
                    order: [
                        ['created_at', 'DESC'],
                    ]
                });
                if (staffs == null)
                    return [];
                var staffRes = [];
                for (let index = 0; index < staffs.length; index++) {
                    const staff = staffs[index];
                    const staffData = {
                        id: staff.id,
                        image: staff.image,
                        full_name: `${staff.first_name} ${staff.last_name}`,
                        first_name: staff.first_name,
                        last_name: staff.last_name,
                        email: staff.email,
                        date_of_birth: staff.date_of_birth,
                        gender: staff.gender,
                        phone_number: staff.phone_number,
                        address: (_a = staff.location) === null || _a === void 0 ? void 0 : _a.address,
                        address_id: staff.location["id"],
                    };
                    staffRes.push(staffData);
                }
                return staffRes;
            }
            else if (data.role == "GUARD") {
                var staffs = yield this.UserModel.findAll({
                    limit: data.limit,
                    offset: data.offset,
                    where: {
                        role: {
                            [sequelize_1.Op.eq]: "GUARD",
                        },
                    },
                    include: {
                        model: models_1.Location,
                        as: "location",
                    },
                    order: [
                        ['created_at', 'DESC'],
                    ]
                });
                if (staffs == null)
                    return [];
                var staffRes = [];
                for (let index = 0; index < staffs.length; index++) {
                    const staff = staffs[index];
                    const staffData = {
                        id: staff.id,
                        image: staff.image,
                        full_name: `${staff.first_name} ${staff.last_name}`,
                        first_name: staff.first_name,
                        last_name: staff.last_name,
                        email: staff.email,
                        date_of_birth: staff.date_of_birth,
                        gender: staff.gender,
                        phone_number: staff.phone_number,
                        address: (_b = staff.location) === null || _b === void 0 ? void 0 : _b.address,
                        address_id: (_c = staff.location) === null || _c === void 0 ? void 0 : _c.id,
                    };
                    staffRes.push(staffData);
                }
                return staffRes;
            }
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map
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
const axios_1 = __importDefault(require("axios"));
const server_config_1 = __importDefault(require("../config/server.config"));
const customer_util_1 = __importDefault(require("../utils/customer.util"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../errors");
const auth_service_1 = __importDefault(require("./auth.service"));
const util_service_1 = __importDefault(require("./util.service"));
const sequelize_1 = require("sequelize");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const moment_1 = __importDefault(require("moment"));
class CustomerService {
    constructor() {
        this.UserModel = models_1.Customer;
        this.LocationModel = models_1.Location;
        this.CoordinatesModel = models_1.Coordinates;
        this.FacilityModel = models_1.Facility;
        this.FacilityLocationModel = models_1.FacilityLocation;
    }
    handleCreateFacility(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { longitude, latitude, longitude_admin, latitude_admin, operations_area_constraint, client_charge, guard_charge, address, google_address, site_name, email, customer_id } = yield customer_util_1.default.verifyFacilityCreation.validateAsync(data);
            var existingUser = yield this.getUserByEmail(email);
            if (existingUser != null) {
                var existingSite = yield this.getsitebyName(site_name, customer_id);
                if (existingSite != null) {
                    throw new errors_1.ConflictError("Site name exists");
                }
                else {
                    let get_time_zone_admin = yield this.getTimeZone(latitude_admin, longitude_admin);
                    let get_time_zone = yield this.getTimeZone(latitude, longitude);
                    let dateStamp = yield this.getDateAndTimeForStamp(get_time_zone_admin);
                    var createdLocation = yield this.LocationModel.create({
                        address,
                        created_at: dateStamp,
                        updated_at: dateStamp
                    });
                    console.log(createdLocation.id);
                    const createdCoordinates = yield this.CoordinatesModel.create({
                        longitude,
                        latitude,
                        created_at: dateStamp,
                        updated_at: dateStamp
                    });
                    const createdFacilityLocation = yield this.FacilityLocationModel.create({
                        address,
                        google_address,
                        coordinates_id: createdCoordinates.id,
                        operations_area_constraint: operations_area_constraint,
                        operations_area_constraint_active: true,
                        created_at: dateStamp,
                        updated_at: dateStamp
                    });
                    const createdFacility = yield this.FacilityModel.create({
                        customer_id,
                        facility_location_id: createdFacilityLocation.id,
                        name: site_name,
                        client_charge,
                        guard_charge,
                        time_zone: get_time_zone,
                        created_at: dateStamp,
                        updated_at: dateStamp
                    });
                    return createdFacility;
                }
            }
            else {
                throw new errors_1.ConflictError("A user with this email does not exists");
            }
        });
    }
    handleUpdateFacility(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { operations_area_constraint, client_charge, guard_charge, site_name, facility_location_id, site_id } = yield customer_util_1.default.verifyUpdateFacility.validateAsync(data);
            yield this.FacilityModel.update({
                client_charge,
                guard_charge,
                name: site_name,
            }, {
                where: {
                    id: site_id
                },
            });
            yield this.FacilityLocationModel.update({
                operations_area_constraint,
            }, {
                where: {
                    id: facility_location_id
                },
            });
        });
    }
    handleDeleteFacility(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { site_id } = yield customer_util_1.default.verifyDeleteFacility.validateAsync(data);
            //let lo=await this.FacilityLocationModel.findOne({ where: { id:156} });
            //console.log(lo)
            this.FacilityModel.destroy({
                where: {
                    id: site_id
                }
            })
                .then(function (deletedRecord) {
                if (deletedRecord === 1) {
                    return "Deleted successfully";
                }
                else {
                    // throw new NotFoundError("record not found");
                }
            })
                .catch(function (error) {
                //throw new NotFoundError(error);
            });
        });
    }
    deleteCustomer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { address_id } = yield customer_util_1.default.verifyDeleteCustomer.validateAsync(data);
            console.log(address_id);
            yield this.LocationModel.destroy({
                where: {
                    id: address_id
                }
            });
        });
    }
    handleCustomerCreation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { first_name, last_name, email, image, date_of_birth, gender, address, sites, phone_number, latitude, longitude } = yield customer_util_1.default.verifyUserCreationData.validateAsync(data);
            let my_time_zone = yield this.getTimeZone(latitude, longitude);
            let dateStamp = yield this.getDateAndTimeForStamp(my_time_zone);
            var password = auth_service_1.default.generatePassword();
            let hashedPassword;
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
                created_at: dateStamp,
                updated_at: dateStamp
            });
            console.log(sites);
            if (sites === null || sites === void 0 ? void 0 : sites.length) {
                const coordinates = [];
                for (const site of sites) {
                    // coordinates.push({
                    //   longitude: site.longitude,
                    //   latitude: site.latitude,
                    // });
                    const createdCoordinates = yield this.CoordinatesModel.create({
                        longitude: site.longitude,
                        latitude: site.latitude,
                    });
                    const createdFacilityLocation = yield this.FacilityLocationModel.create({
                        address: site.address,
                        coordinates_id: createdCoordinates.id,
                        operations_area_constraint: site.operations_area_constraint,
                        operations_area_constraint_active: site.operations_area_constraint_active,
                    });
                    const createdFacility = yield this.FacilityModel.create({
                        customer_id: user.id,
                        facility_location_id: createdFacilityLocation.id,
                        name: site.site_name,
                        client_charge: site.amount,
                    });
                }
                // const createdCoordinates = await this.CoordinatesModel.bulkCreate(
                //   coordinates
                // );
                // const facilityLocations = [];
                // for (var i = 0; i < createdCoordinates.length; i++) {
                //   const coordinate = createdCoordinates[i];
                //   facilityLocations.push({
                //     address: sites[i].site_name,
                //     coordinates_id: createdCoordinates[i].id,
                //   });
                // }
                // const createdFacilityLocations =
                //   await this.FacilityLocationModel.bulkCreate(facilityLocations);
                // const facilities = [];
                // for (var i = 0; i < createdFacilityLocations.length; i++) {
                //   const coordinate = createdFacilityLocations[i];
                //   facilities.push({
                //     customer_id: user.id,
                //     facility_location_id: createdFacilityLocations[i].id,
                //     name: sites[i].address,
                //     client_charge: sites[i].amount,
                //   });
                // }
                // const createdFacilities = await this.FacilityModel.bulkCreate(facilities);
            }
            var transfromedUserObj = yield this.transformCustomerForResponse(user, address, sites);
            transfromedUserObj.transfromedUser.password = password;
            util_service_1.default.updateStat("CUSTOMER_SIGNUP");
            return transfromedUserObj.transfromedUser;
        });
    }
    handleCustomerCreationBulk(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [];
            for (const customer of data) {
                let val = yield this.handleCustomerCreation(customer);
                res.push(val);
            }
            return res;
        });
    }
    handleGetSingleCustomer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var allCustomers = yield models_1.Customer.findAll({
                    where: { id: data },
                    include: [
                        {
                            model: models_1.Location,
                            as: "location",
                        },
                        {
                            model: models_1.Facility,
                            as: "facilities",
                            include: [
                                {
                                    model: models_1.FacilityLocation,
                                    as: "facility_location",
                                    include: [
                                        {
                                            model: models_1.Coordinates,
                                            as: "coordinates",
                                        },
                                    ],
                                },
                            ]
                        },
                    ]
                });
                let tempCustomers = [];
                console.log(allCustomers);
                allCustomers === null || allCustomers === void 0 ? void 0 : allCustomers.forEach((customer) => {
                    var _a;
                    let tempCustomer = {
                        id: customer.id,
                        image: customer.image,
                        full_name: `${customer.first_name} ${customer.last_name}`,
                        first_name: customer.first_name,
                        last_name: customer.last_name,
                        address: customer.location.address,
                        email: customer.email,
                        gender: customer.gender,
                        date_of_birth: customer.date_of_birth,
                    };
                    let sites = [];
                    (_a = customer.facilities) === null || _a === void 0 ? void 0 : _a.forEach((facility) => {
                        console.log(facility);
                        sites.push({
                            id: facility.id,
                            site_name: facility.name,
                            facility_location_id: facility.facility_location_id,
                            client_charge: facility.client_charge,
                            guard_charge: facility.guard_charge,
                            address: facility.facility_location.address,
                            latitude: facility.facility_location.coordinates.latitude,
                            longitude: facility.facility_location.coordinates.longitude,
                            operations_area_constraint: facility.facility_location.operations_area_constraint,
                            operations_area_constraint_active: facility.facility_location.operations_area_constraint_active,
                        });
                    });
                    tempCustomer["sites"] = sites.reverse();
                    tempCustomers.push(tempCustomer);
                });
                return tempCustomers;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    handleCustomerGetAll(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data == "all") {
                try {
                    var allCustomers = yield models_1.Customer.findAll({
                        include: [
                            {
                                model: models_1.Location,
                                as: "location",
                            },
                            {
                                model: models_1.Facility,
                                as: "facilities",
                                include: [
                                    {
                                        model: models_1.FacilityLocation,
                                        as: "facility_location",
                                        include: [
                                            {
                                                model: models_1.Coordinates,
                                                as: "coordinates",
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                        order: [
                            ['created_at', 'DESC'],
                        ]
                    });
                    let tempCustomers = [];
                    allCustomers === null || allCustomers === void 0 ? void 0 : allCustomers.forEach((customer) => {
                        var _a;
                        let tempCustomer = {
                            id: customer.id,
                            image: customer.image,
                            full_name: `${customer.first_name} ${customer.last_name}`,
                            first_name: customer.first_name,
                            last_name: customer.last_name,
                            address: customer.location.address,
                            address_id: customer.location.id,
                            email: customer.email,
                            gender: customer.gender,
                            date_of_birth: customer.date_of_birth,
                        };
                        let sites = [];
                        (_a = customer.facilities) === null || _a === void 0 ? void 0 : _a.forEach((facility) => {
                            sites.push({
                                id: facility.id,
                                site_name: facility.name,
                                amount: facility.client_charge,
                                address: facility.facility_location.address,
                                latitude: facility.facility_location.coordinates.latitude,
                                longitude: facility.facility_location.coordinates.longitude,
                                operations_area_constraint: facility.facility_location.operations_area_constraint,
                                operations_area_constraint_active: facility.facility_location.operations_area_constraint_active,
                            });
                        });
                        tempCustomer["sites"] = sites;
                        tempCustomers.push(tempCustomer);
                    });
                    return tempCustomers;
                }
                catch (error) {
                    console.log(error);
                    return error;
                }
            }
            else {
                try {
                    var allCustomers = yield models_1.Customer.findAll({
                        limit: data.limit,
                        offset: data.offset,
                        include: [
                            {
                                model: models_1.Location,
                                as: "location",
                            },
                            {
                                model: models_1.Facility,
                                as: "facilities",
                                include: [
                                    {
                                        model: models_1.FacilityLocation,
                                        as: "facility_location",
                                        include: [
                                            {
                                                model: models_1.Coordinates,
                                                as: "coordinates",
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                        order: [
                            ['created_at', 'DESC'],
                        ]
                    });
                    let tempCustomers = [];
                    allCustomers === null || allCustomers === void 0 ? void 0 : allCustomers.forEach((customer) => {
                        var _a;
                        let tempCustomer = {
                            id: customer.id,
                            image: customer.image,
                            full_name: `${customer.first_name} ${customer.last_name}`,
                            first_name: customer.first_name,
                            last_name: customer.last_name,
                            address: customer.location.address,
                            address_id: customer.location.id,
                            email: customer.email,
                            gender: customer.gender,
                            date_of_birth: customer.date_of_birth,
                            phone_number: customer.phone_number,
                        };
                        let sites = [];
                        (_a = customer.facilities) === null || _a === void 0 ? void 0 : _a.forEach((facility) => {
                            sites.push({
                                id: facility.id,
                                site_name: facility.name,
                                amount: facility.client_charge,
                                address: facility.facility_location.address,
                                latitude: facility.facility_location.coordinates.latitude,
                                longitude: facility.facility_location.coordinates.longitude,
                                operations_area_constraint: facility.facility_location.operations_area_constraint,
                                operations_area_constraint_active: facility.facility_location.operations_area_constraint_active,
                            });
                        });
                        tempCustomer["sites"] = sites;
                        tempCustomers.push(tempCustomer);
                    });
                    return tempCustomers;
                }
                catch (error) {
                    console.log(error);
                    return error;
                }
            }
        });
    }
    transformCustomerForResponse(data, address, sites) {
        try {
            var { id, image, first_name, last_name, email, date_of_birth, gender, created_at, updated_at, is_archived, } = data;
            var transfromedUser = {
                id,
                image,
                first_name,
                last_name,
                email,
                // Added Location
                address,
                sites,
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
    getCurrentUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserModel.findAll({
                where: { is_deleted: false },
            });
            return user;
        });
    }
    getCurrentUserFacilities(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const facilities = yield this.FacilityModel.findAll({
                where: { customer_id: id, is_deleted: false },
            });
            return facilities;
        });
    }
    getCurrentFacilityLocation(facility_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const facilityLocation = yield this.FacilityLocationModel.findOne({
                where: { id: facility_id, is_deleted: false },
            });
            return facilityLocation;
        });
    }
    getCurrentFacilityLocationCoordinates(coordinates_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const coordinates = yield this.CoordinatesModel.findOne({
                where: { id: coordinates_id, is_deleted: false },
            });
            return coordinates;
        });
    }
    parseUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var users = [];
                var currentUsers = yield this.getCurrentUsers();
                for (const user of currentUsers) {
                    const facilities = yield this.getCurrentUserFacilities(user.id);
                    const sites = [];
                    for (const facility of facilities) {
                        var facilityLocation = yield this.getCurrentFacilityLocation(facility.id);
                        if (facilityLocation == null) {
                            console.log("Null Facility Detected");
                            // await facility.destroy();
                            continue;
                        }
                        var coordinates = yield this.getCurrentFacilityLocationCoordinates(facilityLocation.id);
                        if (coordinates == null) {
                            console.log("Null Coordinates Detected");
                            // facility.destroy();
                            // facilityLocation.destroy();
                            continue;
                        }
                        sites.push({
                            id: facility.id,
                            site_name: facility.name,
                            amount: facility.client_charge,
                            address: facilityLocation.address,
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude,
                        });
                    }
                    var userAddress = yield this.getLocationById(user.location_id);
                    users.push({
                        id: user.id,
                        image: user.image,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        address: userAddress.address,
                        email: user.email,
                        gender: user.gender,
                        date_of_birth: user.date_of_birth,
                        sites,
                    });
                }
                console.log("k: " + users.length);
                return users;
            }
            catch (error) {
                console.log(error);
                return [];
            }
        });
    }
    getLocationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.LocationModel.findByPk(id);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({ where: { email: email } });
        });
    }
    getsitebyName(name, customer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.FacilityModel.findOne({
                where: { [sequelize_1.Op.and]: [{ name },
                        { customer_id }] }
            });
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
}
exports.default = new CustomerService();
//# sourceMappingURL=customer.service.js.map
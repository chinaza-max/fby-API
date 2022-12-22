"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
const server_config_1 = __importDefault(require("../../config/server.config"));
class Customer extends sequelize_1.Model {
}
function init(connection) {
    Customer.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        image: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: `${server_config_1.default.DOMAIN}/images/avatars/fbyDefaultIMG.png`,
        },
        first_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        phone_number: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: true,
        },
        date_of_birth: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: new Date(),
            allowNull: false,
        },
        gender: {
            type: sequelize_1.DataTypes.ENUM('MALE', 'FEMALE', 'NOT_SPECIFIED'),
            allowNull: false,
        },
        location_id: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        is_archived: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        last_logged_in: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: "customers",
        underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = Customer;
//# sourceMappingURL=customer.model.js.map
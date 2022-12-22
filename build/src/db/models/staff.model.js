"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class Staff extends sequelize_1.Model {
}
function init(connection) {
    Staff.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        image: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: "https://res.cloudinary.com/fby-security-bucket-1/image/upload/v1663555863/uploads/avatar_ixcg8u.png",
        },
        first_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: sequelize_1.DataTypes.NUMBER,
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
        availability: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: new Date(),
            allowNull: false,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: new Date(),
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
        tableName: "staff",
        timestamps: true, underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = Staff;
//# sourceMappingURL=staff.model.js.map
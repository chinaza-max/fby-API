"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class Facility extends sequelize_1.Model {
}
function init(connection) {
    Facility.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        facility_location_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        client_charge: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        guard_charge: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        customer_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        time_zone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
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
    }, {
        tableName: "facility",
        underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = Facility;
//# sourceMappingURL=facility.model.js.map
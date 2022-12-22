"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class FacilityLocation extends sequelize_1.Model {
}
function init(connection) {
    FacilityLocation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        address: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        google_address: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        operations_area_constraint: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        operations_area_constraint_active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
        coordinates_id: {
            type: sequelize_1.DataTypes.NUMBER,
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
        tableName: "facility_locations",
        underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = FacilityLocation;
//# sourceMappingURL=facility_location.model.js.map
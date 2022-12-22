"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class LocationCheckOperations extends sequelize_1.Model {
}
function init(connection) {
    LocationCheckOperations.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: new Date(),
            allowNull: false,
        },
        job_operations_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        coordinates_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
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
    }, {
        tableName: "location_check_operations",
        timestamps: false,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = LocationCheckOperations;
//# sourceMappingURL=location_check_operations.model.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class ScanOperations extends sequelize_1.Model {
}
function init(connection) {
    ScanOperations.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        job_operations_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        coordinates_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        scanned_code: {
            type: sequelize_1.DataTypes.STRING,
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
        tableName: "scan_operations",
        timestamps: false,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = ScanOperations;
//# sourceMappingURL=scan_operations.model.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class JobOperations extends sequelize_1.Model {
}
function init(connection) {
    JobOperations.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        checked_in: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        checked_out: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        staff_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        check_in_coordinates_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: true,
        },
        check_out_coordinates_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: true,
        },
        schedule_id: {
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
        is_archived: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        tableName: "job_operations",
        timestamps: true, underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = JobOperations;
//# sourceMappingURL=job_operations.model.js.map
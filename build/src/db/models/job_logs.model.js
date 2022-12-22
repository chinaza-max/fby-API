"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class JobLogs extends sequelize_1.Model {
}
function init(connection) {
    JobLogs.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        message: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        check_in_time: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        check_out_time: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        check_in_status: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        check_out_status: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        job_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        guard_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        schedule_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        coordinates_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        hours_worked: {
            type: sequelize_1.DataTypes.DECIMAL(11, 4),
            defaultValue: 0
        },
        check_in_date: {
            type: sequelize_1.DataTypes.DATE(),
            allowNull: true,
        },
        check_out_date: {
            type: sequelize_1.DataTypes.DATE(),
            allowNull: true,
        },
        project_check_in_date: {
            type: sequelize_1.DataTypes.DATE(),
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
    }, {
        tableName: "job_logs",
        underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = JobLogs;
//# sourceMappingURL=job_logs.model.js.map
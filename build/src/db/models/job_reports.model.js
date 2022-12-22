"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class JobReports extends sequelize_1.Model {
}
function init(connection) {
    JobReports.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        job_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        guard_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        report_type: {
            type: sequelize_1.DataTypes.ENUM('ATTACHMENT', 'MESSAGE'),
            allowNull: false,
        },
        message: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        is_emergency: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        file_url: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        is_read: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
        who_has_it: {
            type: sequelize_1.DataTypes.ENUM('GUARD', 'ADMIN'),
            allowNull: false,
        },
        mime_type: {
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
    }, {
        tableName: "job_reports",
        underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = JobReports;
//# sourceMappingURL=job_reports.model.js.map
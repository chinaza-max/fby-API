"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class Job extends sequelize_1.Model {
}
function init(connection) {
    Job.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        customer_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        facility_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        job_status: {
            type: sequelize_1.DataTypes.ENUM('ACTIVE', 'PENDING', 'COMPLETED'),
            allowNull: false,
        },
        time_zone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        client_charge: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        staff_charge: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        job_type: {
            type: sequelize_1.DataTypes.ENUM('INSTANT', 'ONGOING', 'TEMPORAL', 'PERMANENT'),
            allowNull: false,
        },
        payment_status: {
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
        tableName: "jobs",
        underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = Job;
//# sourceMappingURL=job.model.js.map
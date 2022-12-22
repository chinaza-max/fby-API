"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class Schedule extends sequelize_1.Model {
}
function init(connection) {
    Schedule.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        start_time: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        end_time: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        settlement_status: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        status_per_staff: {
            type: sequelize_1.DataTypes.ENUM('ACTIVE', 'DECLINE', 'PENDING'),
            allowNull: false,
        },
        check_in_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        check_out_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        job_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        max_check_in_time: {
            type: sequelize_1.DataTypes.NUMBER,
            defaultValue: 20,
            allowNull: false,
        },
        guard_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        schedule_length: {
            type: sequelize_1.DataTypes.ENUM("LIMITED", "CONTINUOUS"),
            defaultValue: "LIMITED",
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
        tableName: "schedule",
        underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = Schedule;
//# sourceMappingURL=schedule.model.js.map
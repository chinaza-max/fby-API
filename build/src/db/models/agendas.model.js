"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class Agendas extends sequelize_1.Model {
}
function init(connection) {
    Agendas.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        job_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        guard_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        agenda_type: {
            type: sequelize_1.DataTypes.ENUM("TASK", "INSTRUCTION"),
            allowNull: false,
        },
        status_per_staff: {
            type: sequelize_1.DataTypes.ENUM("PENDING", "ACTIVE", "DECLINE"),
            allowNull: false,
        },
        time: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        check_in_date: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: new Date(),
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
        tableName: "agendas",
        timestamps: false,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = Agendas;
//# sourceMappingURL=agendas.model.js.map
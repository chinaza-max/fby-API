"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class Statistics extends sequelize_1.Model {
}
function init(connection) {
    Statistics.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        month: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        year: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        value: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        stat_type: {
            type: sequelize_1.DataTypes.ENUM("CUSTOMER_SIGNIN", "CUSTOMER_SIGNUP", "GUARD_SIGNIN", "GUARD_SIGNUP", "STAFF_SIGNIN", "STAFF_SIGNUP", "JOB", "JOB_REQUEST", "TRANSACTION"),
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
        tableName: "statistics",
        timestamps: true,
        underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = Statistics;
//# sourceMappingURL=statistics.model.js.map
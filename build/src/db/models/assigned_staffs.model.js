"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class AssignedStaffs extends sequelize_1.Model {
}
function init(connection) {
    AssignedStaffs.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        job_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        staff_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        accept_assignment: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: true,
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
        tableName: "assigned_staffs",
        timestamps: true, underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = AssignedStaffs;
//# sourceMappingURL=assigned_staffs.model.js.map
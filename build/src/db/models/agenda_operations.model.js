"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class AgendaOperations extends sequelize_1.Model {
}
function init(connection) {
    AgendaOperations.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        agenda_id: {
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
        agenda_done: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
    }, {
        tableName: "agenda_operations",
        timestamps: false,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = AgendaOperations;
//# sourceMappingURL=agenda_operations.model.js.map
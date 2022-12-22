"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class Coordinates extends sequelize_1.Model {
}
function init(connection) {
    Coordinates.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        longitude: {
            type: sequelize_1.DataTypes.DECIMAL(10, 10),
            allowNull: false,
        },
        latitude: {
            type: sequelize_1.DataTypes.DECIMAL(10, 10),
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
        tableName: "coordinates",
        underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = Coordinates;
//# sourceMappingURL=coordinates.model.js.map
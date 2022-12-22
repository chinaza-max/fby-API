"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class PasswordReset extends sequelize_1.Model {
}
function init(connection) {
    PasswordReset.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        reset_key: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        expires_in: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: new Date(),
            allowNull: false,
        },
    }, {
        tableName: "password_reset",
        timestamps: false,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = PasswordReset;
//# sourceMappingURL=password_reset.model.js.map
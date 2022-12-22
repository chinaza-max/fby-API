"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class JobSecurityCode extends sequelize_1.Model {
}
function init(connection) {
    JobSecurityCode.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        job_id: {
            type: sequelize_1.DataTypes.NUMBER,
            allowNull: false,
        },
        security_code: {
            type: sequelize_1.DataTypes.STRING,
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
        tableName: "job_security_code",
        timestamps: true,
        underscored: true,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = JobSecurityCode;
//# sourceMappingURL=job_security_code.model.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const sequelize_1 = require("sequelize");
class DeletedUploads extends sequelize_1.Model {
}
function init(connection) {
    DeletedUploads.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        file_upload_url: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        is_deleted: {
            type: sequelize_1.DataTypes.BOOLEAN,
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
        tableName: "deleted_uploads",
        timestamps: false,
        sequelize: connection,
    });
}
exports.init = init;
exports.default = DeletedUploads;
//# sourceMappingURL=deleted_uploads.model.js.map
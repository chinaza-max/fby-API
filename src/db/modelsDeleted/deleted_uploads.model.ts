import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
  DataTypes,
} from "sequelize";
import { IDeletedUploads } from "../../interfaces/deleted_uploads.interface";

class DeletedUploads
  extends Model<
    InferAttributes<DeletedUploads>,
    InferCreationAttributes<DeletedUploads>
  >
  implements IDeletedUploads
{
  declare id: CreationOptional<number>;
  declare file_upload_url: string;
  declare is_deleted: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export function init(connection: Sequelize) {
  DeletedUploads.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      file_upload_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
    },
    {
      tableName: "deleted_uploads",
      timestamps: false,
      sequelize: connection,
    }
  );
}

export default DeletedUploads;

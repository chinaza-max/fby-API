import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import ILocation from "../../interfaces/location.interface";
import { GenderTypes } from "../../interfaces/types.interface";

class Location
  extends Model<InferAttributes<Location>, InferCreationAttributes<Location>>
  implements ILocation
{
  declare id: CreationOptional<number>;
  declare address: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare is_archived: CreationOptional<boolean>;
}

export function init(connection: Sequelize) {
  Location.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      address: {
        type: DataTypes.STRING,
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
      is_archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "location",
      timestamps: true,
      sequelize: connection,
    }
  );
}

export default Location;

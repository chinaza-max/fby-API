import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import ICoordinates from "../../interfaces/coordinates.interface";

class Coordinates
  extends Model<
    InferAttributes<Coordinates>,
    InferCreationAttributes<Coordinates>
  >
  implements ICoordinates
{
  declare id: CreationOptional<number>;
  declare longitude: number;
  declare latitude: number;
  declare created_at?: CreationOptional<Date>;
  declare updated_at?: CreationOptional<Date>;
  declare is_archived: CreationOptional<boolean>;
}

export function init(connection: Sequelize) {
  Coordinates.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(4, 4),
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DECIMAL(4, 4),
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
      tableName: "coordinates",
      timestamps: true, underscored: true,
      sequelize: connection,
    }
  );
}

export default Coordinates;

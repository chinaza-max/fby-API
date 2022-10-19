import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import IFacility from "../../interfaces/facility.interface";
import IFacilityLocation from "../../interfaces/facility_location.interface";

class FacilityLocation
  extends Model<InferAttributes<FacilityLocation>, InferCreationAttributes<FacilityLocation>>
  implements IFacilityLocation
{
  declare id: CreationOptional<number>;
  declare address: string;
  declare coordinates_id: number;
  declare operations_area_constraint: number;
  declare operations_area_constraint_active: boolean;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare is_archived: CreationOptional<boolean>;
}

export function init(connection: Sequelize) {
  FacilityLocation.init(
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
      operations_area_constraint: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      operations_area_constraint_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      coordinates_id: {
        type: DataTypes.NUMBER,
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
      tableName: "facility_locations",
      timestamps: true, underscored: true,
      sequelize: connection,
    }
  );
}

export default FacilityLocation;

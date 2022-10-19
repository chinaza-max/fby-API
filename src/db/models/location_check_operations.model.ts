import { Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize, DataTypes } from "sequelize";
import { ILocationCheckOperations } from "../../interfaces/location_check_operations.interface";
  
  class LocationCheckOperations
    extends Model<InferAttributes<LocationCheckOperations>, InferCreationAttributes<LocationCheckOperations>>
    implements ILocationCheckOperations
  {
    declare id: CreationOptional<number>;
    declare timestamp: CreationOptional<Date>;
    declare job_operations_id: number;
    declare coordinates_id: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
  }
  
  export function init(connection: Sequelize) {
    LocationCheckOperations.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        timestamp: {
          type: DataTypes.DATE,
          defaultValue: new Date(),
          allowNull: false,
        },
        job_operations_id: {
          type: DataTypes.NUMBER,
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
      },
      {
        tableName: "location_check_operations",
        timestamps: false,
        sequelize: connection,
      }
    );
  }
  
  export default LocationCheckOperations;
  
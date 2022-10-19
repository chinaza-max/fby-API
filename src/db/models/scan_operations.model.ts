import { Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize, DataTypes } from "sequelize";
import { IScanOperations } from "../../interfaces/scan_operations.interface";
import FacilityLocation from "./facility_location.model";

  
  class ScanOperations
    extends Model<InferAttributes<ScanOperations>, InferCreationAttributes<ScanOperations>>
    implements IScanOperations
  {
    declare id: CreationOptional<number>;
    declare job_operations_id: number;
    declare coordinates_id: number;
    declare scanned_code: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
  }
  
  export function init(connection: Sequelize) {
    ScanOperations.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        job_operations_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        coordinates_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        scanned_code: {
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
      },
      {
        tableName: "scan_operations",
        timestamps: false,
        sequelize: connection,
      }
    );
  }
  
  export default ScanOperations;
  
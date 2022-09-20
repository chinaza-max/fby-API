import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import IJobOperations from "../../interfaces/job_operation.interface";

class JobOperations
  extends Model<
    InferAttributes<JobOperations>,
    InferCreationAttributes<JobOperations>
  >
  implements IJobOperations
{
  declare id: CreationOptional<number>;
  declare checked_in?: CreationOptional<Date>;
  declare checked_out?: CreationOptional<Date>;
  declare staff_id: number;
  declare check_in_coordinates_id: CreationOptional<number>;
  declare check_out_coordinates_id: CreationOptional<number>;
  declare schedule_id: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare is_archived: CreationOptional<boolean>;
}

export function init(connection: Sequelize) {
  JobOperations.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      checked_in: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      checked_out: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      staff_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      check_in_coordinates_id: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      check_out_coordinates_id: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      schedule_id: {
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
      tableName: "job_operations",
      timestamps: true, underscored: true,
      sequelize: connection,
    }
  );
}

export default JobOperations;

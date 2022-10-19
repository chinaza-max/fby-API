import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
  DataTypes,
} from "sequelize";
import { IJobLogs } from "../../interfaces/job_logs.interface";

class JobLogs
  extends Model<InferAttributes<JobLogs>, InferCreationAttributes<JobLogs>>
  implements IJobLogs
{
  declare id: CreationOptional<number>;
  declare timestamp: CreationOptional<Date>;
  declare activity: string;
  declare staff_id: number;
  declare coordinates_id: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export function init(connection: Sequelize) {
  JobLogs.init(
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
      activity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      staff_id: {
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
      tableName: "job_logs",
      timestamps: false,
      sequelize: connection,
    }
  );
}

export default JobLogs;

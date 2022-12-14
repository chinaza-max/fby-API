import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { IJobReports } from "../../interfaces/job_reports.interface";
import { JobReportPriorityTypes } from "../../interfaces/types.interface";

class JobReports
  extends Model<
    InferAttributes<JobReports>,
    InferCreationAttributes<JobReports>
  >
  implements IJobReports
{
  declare id: CreationOptional<number>;
  declare job_id: number;
  declare guard_id: number;
  declare message?: string;
  declare is_emergency: boolean;
  declare file_url: string;
  declare is_read: boolean;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export function init(connection: Sequelize) {
  JobReports.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      job_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      guard_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_emergency: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_read: {
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
      tableName: "job_reports",
      timestamps: true,
      underscored: true,
      sequelize: connection,
    }
  );
}

export default JobReports;

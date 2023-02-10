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
  extends Model<InferAttributes<JobReports>,
    InferCreationAttributes<JobReports>
  >
  implements IJobReports
{
  declare id: CreationOptional<number>;
  declare job_id: number;
  declare guard_id: number;
  declare message: string;
  declare report_type: string;
  declare who_has_it: string;
  declare is_emergency: boolean;
  declare file_url: string;
  declare mime_type:string;
  declare is_read: boolean;
  declare reference_date:boolean;
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
      report_type: {
        type: DataTypes.ENUM(
          'ATTACHMENT',
          'MESSAGE'
        ),
        allowNull:false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_emergency: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "no file",
      },
      reference_date:{
        type: DataTypes.DATE(),
        allowNull: true,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      who_has_it:{
        type: DataTypes.ENUM(
          'GUARD',
          'ADMIN'
        ),
        allowNull: false,
      },
      mime_type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "no file"
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "job_reports",
      timestamps: false,
      sequelize: connection,
      underscored: true,
    }
  );
}

export default JobReports;

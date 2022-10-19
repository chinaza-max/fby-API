import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { IJobReportAttachments } from "../../interfaces/job_report_attachments.interface";

class JobReportAttachments
  extends Model<
    InferAttributes<JobReportAttachments>,
    InferCreationAttributes<JobReportAttachments>
  >
  implements IJobReportAttachments
{
  declare id: CreationOptional<number>;
  declare job_report_id: number;
  declare file_url: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export function init(connection: Sequelize) {
  JobReportAttachments.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      job_report_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      file_url: {
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
      tableName: "job_report_attachments",
      timestamps: true,
      underscored: true,
      sequelize: connection,
    }
  );
}

export default JobReportAttachments;

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
  declare coordinates_id: number;
  declare message: string;
  declare check_in_time: string;
  declare check_out_time: string;
  declare check_out_status:boolean;
  declare job_id: number;
  declare guard_id: number;
  declare check_in_status:boolean;
  declare hours_worked:number;
  declare date:Date;
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
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      check_in_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      check_out_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },  
      check_in_status: {
        type: DataTypes.BOOLEAN,
        defaultValue:false,
      },
      check_out_status: {
        type: DataTypes.BOOLEAN,
        defaultValue:false,
      },
      job_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      guard_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      coordinates_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      hours_worked: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue:0
      },
      date: {
        type: DataTypes.DATE,
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
      timestamps: true,
      underscored: true,
      sequelize: connection,
    }
  );
}

export default JobLogs;

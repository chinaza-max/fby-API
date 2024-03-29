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
  declare action_name: string;
  declare check_in_time: string;   
  declare is_deleted:boolean;
  declare check_out_time: string;
  declare check_out_status:boolean;
  declare job_id: number;
  declare guard_id: number;
  declare schedule_id:number;
  declare check_in_status:boolean;
  declare hours_worked:number;
  declare check_in_date:Date;
  declare check_out_date:Date;
  declare project_check_in_date:Date;
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
      action_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      check_in_time: {
        type: DataTypes.STRING,
        defaultValue:'0',
        allowNull: false,
      },
      check_out_time: {
        type: DataTypes.STRING,
        defaultValue:'0',
        allowNull: false,
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
      schedule_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      coordinates_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      hours_worked: {
        type: DataTypes.DECIMAL(11,4),
        defaultValue:0
      },
      check_in_date: {
        type: DataTypes.DATE(),
        defaultValue:  Sequelize.fn('now'),
        allowNull: false,
      },
      check_out_date: {
        type: DataTypes.DATE(),
        defaultValue:  Sequelize.fn('now'),
        allowNull: false,
      },
      project_check_in_date: {
        type: DataTypes.DATE(),
        defaultValue:  Sequelize.fn('now'),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      tableName: "job_logs",
      timestamps: false,
      sequelize: connection,
      underscored: true,
    }
  );
}

export default JobLogs;

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import ISchedule from "../../interfaces/schedule.interface";
import { ScheduleLengthTypes } from "../../interfaces/types.interface";

class Schedule
  extends Model<InferAttributes<Schedule>, InferCreationAttributes<Schedule>>
  implements ISchedule
{
  declare id: CreationOptional<number>;
  declare start_time: string;
  declare end_time: string;
  declare status_per_staff: string;
  declare check_in_date: Date;
  declare check_out_date:Date;
  declare job_id: number;
  declare is_check_in_notification_sent:boolean;
  declare is_check_out_notification_sent:boolean;
  declare guard_id: number;
  declare max_check_in_time:number;
  declare settlement_status:boolean;
  declare is_deleted:boolean;
  declare schedule_accepted_by_admin:boolean;
  declare schedule_length: ScheduleLengthTypes;
  declare created_at: Date;
  declare updated_at: Date;
  declare created_by_id:number;
  declare is_archived: CreationOptional<boolean>;
}

export function init(connection: Sequelize) {
  Schedule.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      start_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      end_time: {      
        type: DataTypes.STRING,
        allowNull: false,
      },
      settlement_status: {
        type: DataTypes.BOOLEAN,
        defaultValue:false,
      },
      status_per_staff: {
        type: DataTypes.ENUM(
          'ACTIVE',
          'DECLINE',
          'PENDING'
        ),
        allowNull: false,
      },
      check_in_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      check_out_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_check_in_notification_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_check_out_notification_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      job_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      created_by_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      max_check_in_time: {
        type: DataTypes.NUMBER,
        defaultValue:20,
        allowNull: false,
      },
      guard_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      schedule_accepted_by_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue:true,
      },
      schedule_length: {
        type: DataTypes.ENUM("LIMITED", "CONTINUOUS"),
        defaultValue:"LIMITED",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      tableName: "schedule",
      timestamps: false,
      sequelize: connection,
      underscored: true,
    }
  );
}

export default Schedule;

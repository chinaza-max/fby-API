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
  declare check_in_date: Date;
  declare job_id: number;
  declare schedule_length: ScheduleLengthTypes;
  declare max_check_in_time: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
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
      check_in_date: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
      job_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      schedule_length: {
        type: DataTypes.ENUM("LIMITED", "CONTINUOUS"),
        allowNull: false,
      },
      max_check_in_time: {
        type: DataTypes.NUMBER,
        defaultValue: 15,
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
      tableName: "schedule",
      timestamps: true,
      underscored: true,
      sequelize: connection,
    }
  );
}

export default Schedule;

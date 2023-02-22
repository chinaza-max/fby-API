import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { IStatistics } from "../../interfaces/statistics.interface";
import { StatTypes } from "../../interfaces/types.interface";

class Statistics
  extends Model<
    InferAttributes<Statistics>,
    InferCreationAttributes<Statistics>
  >
  implements IStatistics
{
  declare id: CreationOptional<number>;
  declare month: number;
  declare year: number;
  declare value: number;
  declare stat_type: StatTypes;
  declare is_deleted:boolean;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare is_archived: CreationOptional<boolean>;
}

export function init(connection: Sequelize) {
  Statistics.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      value: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      stat_type: {
        type: DataTypes.ENUM(
          "CUSTOMER_SIGNIN",
          "CUSTOMER_SIGNUP",
          "GUARD_SIGNIN",
          "GUARD_SIGNUP",
          "STAFF_SIGNIN",
          "STAFF_SIGNUP",
          "JOB",
          "JOB_REQUEST",
          "TRANSACTION"
        ),
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
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      tableName: "statistics",
      timestamps: true,
      underscored: true,
      sequelize: connection,
    }
  );
}

export default Statistics;

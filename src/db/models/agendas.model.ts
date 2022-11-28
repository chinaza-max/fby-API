import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
  DataTypes,
} from "sequelize";
import { IAgendas } from "../../interfaces/agendas.interface";
import { AgendaTypes } from "../../interfaces/types.interface";

class Agendas
  extends Model<InferAttributes<Agendas>, InferCreationAttributes<Agendas>>
  implements IAgendas
{
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare status_per_staff: string;
  declare job_id: number;
  declare guard_id: number;
  declare agenda_type: AgendaTypes;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare start_time?: Date;
  declare end_time?: Date;
  declare check_in_date?: Date;
  declare time?: Date;

}

export function init(connection: Sequelize) {
  Agendas.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      job_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      guard_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      agenda_type: {
        type: DataTypes.ENUM("TASK", "INSTRUCTION"),
        allowNull: false,
      },
      status_per_staff: {
        type: DataTypes.ENUM("PENDING", "ACTIVE" , "DECLINE"),
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      check_in_date: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
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
      tableName: "agendas",
      timestamps: false,
      sequelize: connection,
    }
  );
}

export default Agendas;

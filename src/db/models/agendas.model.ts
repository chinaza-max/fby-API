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
  declare schedule_id: number;
  declare agenda_type: AgendaTypes;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare start_time?: Date;
  declare end_time?: Date;
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
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,
      },
      schedule_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      agenda_type: {
        type: DataTypes.ENUM("TASK", "AGENDA"),
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
      start_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
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

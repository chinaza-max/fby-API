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
  declare created_at: Date;
  declare updated_at: Date;
  declare operation_date?: Date;
  declare agenda_done:boolean;
  declare coordinates_id:number;
  declare schedule_id:number;
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
        defaultValue:'',
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
      schedule_id: {
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
      operation_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      agenda_done: {
        type: DataTypes.BOOLEAN,
        defaultValue:false,
      },
      coordinates_id: {
        type: DataTypes.NUMBER,
        defaultValue:0,
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
    },
    {
      tableName: "agendas",
      sequelize: connection,
      timestamps: false,
      underscored: true,
    }
  );
}

export default Agendas;

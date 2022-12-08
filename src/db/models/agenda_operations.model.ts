import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
  DataTypes,
} from "sequelize";
import { IAgendaOperations } from "../../interfaces/agenda_operations.interface";

class AgendaOperations
  extends Model<InferAttributes<AgendaOperations>,InferCreationAttributes<AgendaOperations>>
  implements IAgendaOperations
{
  declare id: CreationOptional<number>;
  declare agenda_id: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare agenda_done: boolean;
}

export function init(connection: Sequelize) {
  AgendaOperations.init(
    {
      id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      agenda_id: {
        type: DataTypes.NUMBER,
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
      agenda_done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: "agenda_operations",
      timestamps: false,
      sequelize: connection,
    }
  );
}

export default AgendaOperations;

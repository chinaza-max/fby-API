import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { ISubscription } from "../../interfaces/subscription.interface";

class Subscriptions
  extends Model<InferAttributes<Subscriptions>, InferCreationAttributes<Subscriptions>>
  implements ISubscription
{
  declare id: CreationOptional<number>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare guard_id: number;
  declare subscription: JSON;
}

export function init(connection: Sequelize) {
  Subscriptions.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      guard_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      subscription:{
        type: DataTypes.JSON,
        allowNull: false,
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
      tableName: "subscriptions",
      timestamps: false,
      underscored: true,
      sequelize: connection,
    }
  );
}

export default Subscriptions;

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
  declare staff_id: number;
  declare is_deleted:boolean;
  declare subscription: string;
}

export function init(connection: Sequelize) {
  Subscriptions.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      staff_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      subscription:{
        type: DataTypes.STRING,
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
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
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

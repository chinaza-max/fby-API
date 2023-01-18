import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import IMemoReceiver from "../../interfaces/memo_receiver.interface";
     
  class MemoReceiver
    extends Model<InferAttributes<MemoReceiver>, InferCreationAttributes<MemoReceiver>>
    implements IMemoReceiver
  {
    declare id: CreationOptional<number>;
    declare staff_id: number;
    declare memo_id: number;
    declare reply_message:string;
    declare created_at: Date;
    declare updated_at: Date;
    declare is_archived: CreationOptional<boolean>;
  }
  
  export function init(connection: Sequelize) {
    MemoReceiver.init(
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
        memo_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        reply_message: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "",
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
      },
      {
        tableName: "memo_receivers",
        timestamps: false,
        sequelize: connection,
        underscored: true,
      }
    );
  }
  
  export default MemoReceiver;
  
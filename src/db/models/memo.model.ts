import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import IMemo from "../../interfaces/memo.interface";
     
  class Memo
    extends Model<InferAttributes<Memo>, InferCreationAttributes<Memo>>
    implements IMemo
  {
    declare id: CreationOptional<number>;
    declare created_by_id:number;
    declare memo_message: string;
    declare time_zone:string;
    declare send_date: Date;
    declare is_delivered:boolean;
    declare created_at: Date;
    declare updated_at: Date;
    declare is_archived: CreationOptional<boolean>;
  }
  
  export function init(connection: Sequelize) {
    Memo.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        memo_message: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_by_id: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        time_zone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        send_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        is_delivered: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
        tableName: "Memo",
        timestamps: false,
        sequelize: connection,
        underscored: true,
      }
    );
  }
  
  export default Memo;
  
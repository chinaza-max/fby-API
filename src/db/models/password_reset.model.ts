import { Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize, DataTypes } from "sequelize";
import { IPasswordReset } from "../../interfaces/password_reset.interface";
import FacilityLocation from "./facility_location.model";

  
  class PasswordReset
    extends Model<InferAttributes<PasswordReset>, InferCreationAttributes<PasswordReset>>
    implements IPasswordReset
  {
    declare id: CreationOptional<number>;
    declare user_id: number;
    declare reset_key: string;
    declare expires_in: Date;
    declare created_at: CreationOptional<Date>;
  }
  
  export function init(connection: Sequelize) {
    PasswordReset.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        reset_key: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        expires_in: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: new Date(),
          allowNull: false,
        },
      },
      {
        tableName: "password_reset",
        timestamps: false,
        sequelize: connection,
      }
    );
  }
  
  export default PasswordReset;
  
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import { ISuspension_comments } from "../../interfaces/uspension_comments.interface";
  
  class Suspension_comments
    extends Model<
      InferAttributes<Suspension_comments>,
      InferCreationAttributes<Suspension_comments>
    >
    implements ISuspension_comments
  {
    declare id: CreationOptional<number>;
    declare comment: string;
    declare admin_id: number;
    declare user_id: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare is_archived: CreationOptional<boolean>;
  }
  
  export function init(connection: Sequelize) {
    Suspension_comments.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        admin_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        user_id: {
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
        is_archived: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        tableName: "suspension_comments",
        timestamps: true,
        underscored: true,
        sequelize: connection,
      }
    );
  }
  
  export default Suspension_comments;
  
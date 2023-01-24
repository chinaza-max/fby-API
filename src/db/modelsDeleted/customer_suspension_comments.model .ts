import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import { ICustomer_suspension_comments } from "../../interfaces/customer_suspension_comments.interface";  
  class Customer_suspension_comments
    extends Model<
      InferAttributes<Customer_suspension_comments>,
      InferCreationAttributes<Customer_suspension_comments>
    >
    implements ICustomer_suspension_comments
  {
    declare id: CreationOptional<number>;
    declare comment: string;
    declare admin_id: number;
    declare customer_id: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare is_archived: CreationOptional<boolean>;
  }
  
  export function init(connection: Sequelize) {
    Customer_suspension_comments.init(
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
        customer_id: {
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
        tableName: "customer_suspension_comments",
        timestamps: true,
        underscored: true,
        sequelize: connection,
      }
    );
  }
  
  export default Customer_suspension_comments;
  
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import ICustomer from "../../interfaces/customer.interface";
  import { IStaff } from "../../interfaces/staff.interface";
  import { GenderTypes } from "../../interfaces/types.interface";
  
  class Customer
    extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>>
    implements ICustomer
  {
    declare id: CreationOptional<number>;
    declare image?: CreationOptional<string>;
    declare first_name: string;
    declare last_name: string;
    declare email: string;
    declare password: CreationOptional<string>;
    declare date_of_birth: Date;
    declare gender: GenderTypes;
    declare phone_number:number;
    declare location_id?: CreationOptional<number>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare is_archived: CreationOptional<boolean>;
    declare last_logged_in?: CreationOptional<Date>;
  }
  
  export function init(connection: Sequelize) {
    Customer.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue:
            "https://res.cloudinary.com/fby-security-bucket-1/image/upload/v1663555863/uploads/avatar_ixcg8u.png",
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        phone_number: {
          type: DataTypes.NUMBER,
          allowNull: true,
        },
        date_of_birth: {
          type: DataTypes.DATE,
          defaultValue: new Date(),
          allowNull: false,
        },
        gender: {
          type: DataTypes.ENUM(
              'MALE',
              'FEMALE',
              'NOT_SPECIFIED'
          ),
          allowNull: false,
        },
        location_id: {
          type: DataTypes.STRING,
          allowNull: true,
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
        last_logged_in: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        tableName: "customers",
        timestamps: true, underscored: true,
        sequelize: connection,
      }
    );
  }
  
  export default Customer;
  
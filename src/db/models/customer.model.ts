import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import serverConfig from "../../config/server.config";
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
    declare created_at: Date;
    declare updated_at: Date;
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
          `${serverConfig.DOMAIN}/images/avatars/fbyDefaultIMG.png`,
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
        last_logged_in: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        tableName: "customers",
        timestamps: false,
        sequelize: connection,
        underscored: true,
      }
    );
  }
  
  export default Customer;
  
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
    declare company_name: string;
    declare is_deleted:boolean;
    declare email: string;
    declare password: CreationOptional<string>;
    declare gender: GenderTypes;
    declare phone_number:number;
    declare created_by_id:number;
    declare location_id?: CreationOptional<number>;
    declare suspended:boolean;
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
          defaultValue:serverConfig.NODE_ENV =="production"? `${serverConfig.DOMAIN}/fby-security-api/public/images/avatars/fbyDefaultIMG.png`:`${serverConfig.DOMAIN}/images/avatars/fbyDefaultIMG.png`
        },
        company_name: {
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
        suspended: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        created_by_id: {
          type: DataTypes.NUMBER,
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
        is_deleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        }
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
  
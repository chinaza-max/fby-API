import {
  BelongsToGetAssociationMixin,
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import IAdmin from "../../interfaces/admin.interface";
  import { GenderTypes, RoleTypes } from "../../interfaces/types.interface";
  
  class Admin
    extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>>
    implements IAdmin
  {
    declare id: CreationOptional<number>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare image?: CreationOptional<string>;
    declare first_name: string;
    declare last_name: string;
    declare availability:boolean;
    declare suspended:boolean;
    declare phone_number: number;
    declare email: string;
    declare password: CreationOptional<string>;
    declare date_of_birth: Date;
    declare gender: GenderTypes;
    declare role: RoleTypes;
    declare location_id?: CreationOptional<number>;
    declare is_archived: CreationOptional<boolean>;
    declare last_logged_in?: CreationOptional<Date>;

    public getLocation!: BelongsToGetAssociationMixin<Location>;

    public location?: Location;
  }
  
  export function init(connection: Sequelize) {
    Admin.init(
      {
        id:{
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
        phone_number: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        suspended: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        date_of_birth: {
          type: DataTypes.DATE,
          defaultValue: new Date(),
          allowNull: false,
        },
        availability:{
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        gender: {
          type: DataTypes.ENUM(
              'MALE',
              'FEMALE',
              'NOT_SPECIFIED'
          ),
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM(
              'ADMIN',
              'GUARD',
          ),
          allowNull: true,
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
        tableName: "users",
        timestamps: true, underscored: true,
        sequelize: connection,
      }
    );
  }
  
  export default Admin;
  
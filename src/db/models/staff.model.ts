import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { IStaff } from "../../interfaces/staff.interface";
import { GenderTypes } from "../../interfaces/types.interface";

class Staff
  extends Model<InferAttributes<Staff>, InferCreationAttributes<Staff>>
  implements IStaff
{
  declare id: CreationOptional<number>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare image?: CreationOptional<string>;
  declare first_name: string;
  declare last_name: string;
  declare availability:string;
  declare is_deleted:boolean;
  declare email: string;
  declare phone_number: number;
  declare password: CreationOptional<string>;
  declare date_of_birth: Date;
  declare gender: GenderTypes;
  declare location_id?: CreationOptional<number>;
  declare is_archived: CreationOptional<boolean>;
  declare last_logged_in?: CreationOptional<Date>;
}

export function init(connection: Sequelize) {
  Staff.init(
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
      phone_number: {
        type: DataTypes.NUMBER,
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
      availability:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      tableName: "staff",
      timestamps: true, underscored: true,
      sequelize: connection,
    }
  );
}

export default Staff;

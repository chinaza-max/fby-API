import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import ILicense from "../../interfaces/license.interface";
     
  class License
    extends Model<InferAttributes<License>, InferCreationAttributes<License>>
    implements ILicense
  {
    declare id: CreationOptional<number>;
    declare staff_id: number;
    declare license: string;
    declare time_zone:string;
    declare expires_in: Date;
    declare approved:boolean;
    declare is_deleted:boolean;
    declare created_at: Date;
    declare updated_at: Date;
    declare is_archived: CreationOptional<boolean>;
  }
  
  export function init(connection: Sequelize) {
    License.init(
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
        license: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        expires_in: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        time_zone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        approved: {
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
        is_deleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        }
      },
      {
        tableName: "licenses",
        timestamps: false,
        sequelize: connection,
        underscored: true,
      }
    );
  }
  
  export default License;
  
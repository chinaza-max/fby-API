import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import IFacility from "../../interfaces/facility.interface";
import IJob from "../../interfaces/job.interface";
  import { IStaff } from "../../interfaces/staff.interface";
  import { GenderTypes, JobStatus, JobTypes } from "../../interfaces/types.interface";
  
  class Facility
    extends Model<InferAttributes<Facility>, InferCreationAttributes<Facility>>
    implements IFacility
  {
    declare id: CreationOptional<number>;
    declare facility_location_id: number;
    declare name: string;
    declare time_zone:string
    declare client_charge: number;
    declare guard_charge: number;
    declare customer_id: number;
    declare is_deleted:boolean;
    declare created_by_id:number;
    declare created_at: Date;
    declare updated_at: Date;
    declare is_archived: CreationOptional<boolean>;
  }
  
  export function init(connection: Sequelize) {
    Facility.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        facility_location_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        client_charge: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,  
        },
        guard_charge: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        customer_id: {
          type: DataTypes.NUMBER,
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
        tableName: "facility",
        timestamps: false,
        sequelize: connection,
        underscored: true,
      }
    );
  }
  
  export default Facility;
  
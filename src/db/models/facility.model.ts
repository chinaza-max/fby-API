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
    declare customer_id: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
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
        tableName: "facility",
        timestamps: true, underscored: true,
        sequelize: connection,
      }
    );
  }
  
  export default Facility;
  
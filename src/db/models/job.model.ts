import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import IJob from "../../interfaces/job.interface";
  import { IStaff } from "../../interfaces/staff.interface";
  import { GenderTypes, JobStatus, JobTypes } from "../../interfaces/types.interface";
  
  class Job
    extends Model<InferAttributes<Job>, InferCreationAttributes<Job>>
    implements IJob
  {
    declare id: CreationOptional<number>;
    declare description: string;
    declare customer_id: number;
    declare facility_id: number;
    declare job_status: JobStatus;
    declare client_charge: number;
    declare staff_charge: number;
    declare job_type: JobTypes;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare is_archived: CreationOptional<boolean>;
  }
  
  export function init(connection: Sequelize) {
    Job.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        customer_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        facility_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        job_status: {
          type: DataTypes.ENUM(
            'PENDING',
            'ONGOING',
            'COMPLETED',
            'CANCELED'
          ),
          allowNull: false,
        },
        client_charge: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        staff_charge: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        job_type: {
          type: DataTypes.ENUM(
            'INSTANT',
            'ONGOING',
            'TEMPORAL',
            'PERMANENT'
          ),
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
        tableName: "jobs",
        timestamps: true,
        sequelize: connection,
      }
    );
  }
  
  export default Job;
  
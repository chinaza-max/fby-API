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
    declare created_by_id: number;
    declare is_deleted:boolean;
    declare job_status: JobStatus;
    declare client_charge: number;
    declare staff_charge: number;
    declare payment_status: string;
    declare time_zone:string;
    declare job_type: JobTypes;
    declare created_at: Date;
    declare updated_at: Date;
    declare max_check_in_time: string;
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
        created_by_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        job_status: {
          type: DataTypes.ENUM(
            'ACTIVE',
            'PENDING',
            'COMPLETED'
          ),
          allowNull: false,
        },
        time_zone: {
          type: DataTypes.STRING,
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
        max_check_in_time:{
          type: DataTypes.STRING,
          defaultValue: "60",
        },
        payment_status:{
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
        tableName: "jobs",
        timestamps: false,
        sequelize: connection,
        underscored: true,
      }
    );
  }
  
  export default Job;
  
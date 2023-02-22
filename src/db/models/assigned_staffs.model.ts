import {
  BelongsToGetAssociationMixin,
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import IAssignedStaffs from "../../interfaces/assigned_staffs.interface";
  import IFacility from "../../interfaces/facility.interface";
  import IFacilityLocation from "../../interfaces/facility_location.interface";
import Job from "./job.model";
import Staff from "./staff.model";
  
  class AssignedStaffs
    extends Model<InferAttributes<AssignedStaffs>, InferCreationAttributes<AssignedStaffs>>
    implements IAssignedStaffs
  {
    declare id: CreationOptional<number>;
    declare job_id: number;
    declare is_deleted:boolean;
    declare staff_id: number;
    declare accept_assignment: boolean;
    declare created_at?: CreationOptional<Date>;
    declare updated_at?: CreationOptional<Date>;
    declare is_archived: CreationOptional<boolean>;

    public getJob!: BelongsToGetAssociationMixin<Job>;
    public getStaff!: BelongsToGetAssociationMixin<Staff>;

    public job?: Job;
    public staff?: Staff;
  }
  
  export function init(connection: Sequelize) {
    AssignedStaffs.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        job_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        staff_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        accept_assignment: {
          type: DataTypes.BOOLEAN,
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
        is_deleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        }
      },
      {
        tableName: "assigned_staffs",
        timestamps: true, underscored: true,
        sequelize: connection,
      }
    );
  }
  
  export default AssignedStaffs;
  
import {
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
  
  class AssignedStaffs
    extends Model<InferAttributes<AssignedStaffs>, InferCreationAttributes<AssignedStaffs>>
    implements IAssignedStaffs
  {
    declare id: CreationOptional<number>;
    declare job_id: number;
    declare staff_id: number;
    declare created_at?: CreationOptional<Date>;
    declare updated_at?: CreationOptional<Date>;
    declare is_archived: CreationOptional<boolean>;
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
        tableName: "assigned_staffs",
        timestamps: true,
        sequelize: connection,
      }
    );
  }
  
  export default AssignedStaffs;
  
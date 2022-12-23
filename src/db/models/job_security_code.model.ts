import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { IJobSecurityCode } from "../../interfaces/job_security_code.interface";

class JobSecurityCode
  extends Model<
    InferAttributes<JobSecurityCode>,
    InferCreationAttributes<JobSecurityCode>
  >
  implements IJobSecurityCode
{
  declare id: CreationOptional<number>;
  declare agenda_id: number;
  declare guard_id: number;
  declare job_id:number;
  declare security_code: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export function init(connection: Sequelize) {
  JobSecurityCode.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      agenda_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      guard_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      job_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      security_code: {
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
    },
    {
      tableName: "job_security_code",
      timestamps: false,
      sequelize: connection,
      underscored: true,
    }
  );
}

export default JobSecurityCode;

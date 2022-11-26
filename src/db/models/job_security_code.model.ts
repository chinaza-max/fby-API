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
  declare job_id: number;
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
        defaultValue: new Date(),
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
    },
    {
      tableName: "job_security_code",
      timestamps: true,
      underscored: true,
      sequelize: connection,
    }
  );
}

export default JobSecurityCode;
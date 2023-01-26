import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    DataTypes,
  } from "sequelize";
  import { IsecurityCheckLog } from "../../interfaces/security_check_log.interface";
  
  class SecurityCheckLog
    extends Model<InferAttributes<SecurityCheckLog>, InferCreationAttributes<SecurityCheckLog>>
    implements IsecurityCheckLog
  {
    declare id: CreationOptional<number>;
    declare coordinates_id: number;
    declare job_id: number;
    declare guard_id: number;
    declare status:boolean;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
  }
  
  export function init(connection: Sequelize) {
    SecurityCheckLog.init(
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
        guard_id: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        coordinates_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue:false,
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
        tableName: "security_check_log",
        timestamps: false,
        sequelize: connection,
        underscored: true,
      }
    );
  }
  
  export default SecurityCheckLog;
  
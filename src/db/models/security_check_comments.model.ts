import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
  } from "sequelize";
import ISecurityCheckComments from "../../interfaces/security_check_comments.interface";
     
  class SecurityCheckComments
    extends Model<InferAttributes<SecurityCheckComments>, InferCreationAttributes<SecurityCheckComments>>
    implements ISecurityCheckComments
  {
    declare id: CreationOptional<number>;
    declare guard_id:number;
    declare security_check_log_id:number;
    declare comment: string;
    declare created_at: Date;
    declare updated_at: Date;
    declare is_archived: CreationOptional<boolean>;
  }
  
  export function init(connection: Sequelize) {
    SecurityCheckComments.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        guard_id: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        security_check_log_id: {
          type: DataTypes.NUMBER,
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
      },
      {
        tableName: "security_check_comments",
        timestamps: false,
        sequelize: connection,
        underscored: true,
      }
    );
  }
  
  export default SecurityCheckComments;
  
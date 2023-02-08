import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import IShift_comments from "../../interfaces/shift_comments.interface";
   
class Shift_comments
  extends Model<InferAttributes<Shift_comments>, InferCreationAttributes<Shift_comments>>
  implements IShift_comments
{
  declare id: CreationOptional<number>;
  declare created_by_id:number;
  declare schedule_id:number;
  declare comment: string;
  declare time_zone:string;
  declare reference_date:Date;
  declare created_at: Date;
  declare updated_at: Date;
  declare is_archived: CreationOptional<boolean>;
}

export function init(connection: Sequelize) {
  Shift_comments.init(
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
      created_by_id: {
          type: DataTypes.NUMBER,
          allowNull: false,
      },
      schedule_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
      time_zone: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      reference_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date()
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
      tableName: "shift_comments",
      timestamps: false,
      sequelize: connection,
      underscored: true,
    }
  );
}

export default Shift_comments;

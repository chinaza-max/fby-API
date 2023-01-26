import { Sequelize, Options } from "sequelize";
import { init as initModels } from "./modelsDeleted";
import serverConfig from "../config/server.config";
import debug from "debug";

const DEBUG = debug("dev");

class DB_DELETED {
  public sequelize: Sequelize;

  async connectDB() {
    try {
      const options: Options = {
        logging: console.log,
        dialect: "mysql",
        host: serverConfig.DB_HOST,
        username: serverConfig.DB_USERNAME,
        password: serverConfig.DB_PASSWORD,
        port: Number(serverConfig.DB_PORT),
        database: serverConfig.DB_NAME2,
        logQueryParameters: true
      };
      this.sequelize = new Sequelize(
        serverConfig.DB_NAME2,
        serverConfig.DB_USERNAME,
        serverConfig.DB_PASSWORD,
        options
      );
      initModels(this.sequelize);
      // if (serverConfig.NODE_ENV === "development") {
      //  await this.sequelize.sync({ alter: true });
      // }
      DEBUG("connected to second database.");
      return this.sequelize;
    } catch (error) {
      DEBUG(`failed to connect to second database: ${error}`);
      throw error;
    }
  }
}

export default new DB_DELETED();

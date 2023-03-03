import { Sequelize, Options } from "sequelize";
import { init as initModels } from "./models";
import serverConfig from "../config/server.config";
import * as firebase from "firebase-admin";
import debug from "debug";

const DEBUG = debug("dev");

class DB {
  public fireBaseConnection: firebase.app.App;
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
        database: serverConfig.DB_NAME,
        logQueryParameters: true
      };
      this.sequelize = new Sequelize(
        serverConfig.DB_NAME,
        serverConfig.DB_USERNAME,
        serverConfig.DB_PASSWORD,
        options
      );

      
      initModels(this.sequelize);
      // if (serverConfig.NODE_ENV === "development") {
      //  await this.sequelize.sync({ alter: true });
      // }
      DEBUG("connected to database.");
      return this.sequelize;
    } catch (error) {
      DEBUG(`failed to connect to database: ${error}`);
      throw error;
    }
  }

  async connectFirebase() {
    try {
      const serviceAccount = {
        type: serverConfig.FIREBASE_TYPE2,
        project_id: serverConfig.FIREBASE_PROJECT_ID2,
        private_key_id: serverConfig.FIREBASE_PRIVATE_KEY_ID2,
        private_key: serverConfig.FIREBASE_PRIVATE_KEY2.replace(/\\n/g, "\n"),
        client_email: serverConfig.FIREBASE_CLIENT_EMAIL2,
        client_id: serverConfig.FIREBASE_CLIENT_ID2,
        auth_uri: serverConfig.FIREBASE_AUTH_URI2,
        token_uri: serverConfig.FIREBASE_TOKEN_URI2,
        auth_provider_x509_cert_url:
        serverConfig.FIREBASE_AUTH_PROVIDER_X509_CERT_URL2,
        client_x509_cert_url: serverConfig.FIREBASE_CLIENT_X509_CERT_URL2,
      };
      this.fireBaseConnection = firebase.initializeApp({
        credential: firebase.credential.cert(
          serviceAccount as firebase.ServiceAccount
        ),
      });
      DEBUG("connection established to firebase.");
    } catch (error) {
      DEBUG(`failed to connect to firebase: ${error}`);
    }
  }
  
}

export default new DB();

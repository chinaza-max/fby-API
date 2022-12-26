import { config } from "dotenv";

config();

class ServerConfig {
  public NODE_ENV = process.env.NODE_ENV;
  public PORT = process.env.PORT;

  public ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

  public SALT_ROUNDS = process.env.SALT_ROUNDS;
  public TOKEN_SECRET = process.env.TOKEN_SECRET;
  public TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;
  public TOKEN_ISSUER = process.env.TOKEN_ISSUER;

  public DB_USERNAME = process.env.DB_USERNAME;
  public DB_PASSWORD = process.env.DB_PASSWORD;
  public DB_HOST = process.env.DB_HOST;
  public DB_PORT = process.env.DB_PORT;
  public DB_NAME = process.env.DB_NAME;
  public DB_URI = process.env.DB_URI;

  public FIREBASE_TYPE = process.env.FIREBASE_TYPE;
  public FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
  public FIREBASE_PRIVATE_KEY_ID = process.env.FIREBASE_PRIVATE_KEY_ID;
  public FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;
  public FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
  public FIREBASE_CLIENT_ID = process.env.FIREBASE_CLIENT_ID;
  public FIREBASE_AUTH_URI = process.env.FIREBASE_AUTH_URI;
  public FIREBASE_TOKEN_URI = process.env.FIREBASE_TOKEN_URI;
  public FIREBASE_AUTH_PROVIDER_X509_CERT_URL =
    process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL;
  public FIREBASE_CLIENT_X509_CERT_URL =
    process.env.FIREBASE_CLIENT_X509_CERT_URL;

  public CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  public CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
  public CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
  public CLOUDINARY_FOLDER_NAME = process.env.CLOUDINARY_FOLDER_NAME;

  public EMAIL_HOST = process.env.EMAIL_HOST;
  public EMAIL_PORT = process.env.EMAIL_PORT;
  public EMAIL_USER = process.env.EMAIL_USER;
  public EMAIL_PASS = process.env.EMAIL_PASS;
  public EMAIL_SENDER = process.env.EMAIL_SENDER;

  public STRIPE_PUBLIC_KEY = String(process.env.STRIPE_PUBLIC_KEY);
  public STRIPE_SECRET_KEY = String(process.env.STRIPE_SECRET_KEY);
  public STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  public GOOGLE_KEY = process.env.GOOGLE_KEY;
  public DOMAIN = process.env.DOMAIN;

}

export default new ServerConfig();

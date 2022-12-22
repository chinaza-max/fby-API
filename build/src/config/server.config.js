"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class ServerConfig {
    constructor() {
        this.NODE_ENV = process.env.NODE_ENV;
        this.PORT = process.env.PORT;
        this.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
        this.SALT_ROUNDS = process.env.SALT_ROUNDS;
        this.TOKEN_SECRET = process.env.TOKEN_SECRET;
        this.TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;
        this.TOKEN_ISSUER = process.env.TOKEN_ISSUER;
        this.DB_USERNAME = process.env.DB_USERNAME;
        this.DB_PASSWORD = process.env.DB_PASSWORD;
        this.DB_HOST = process.env.DB_HOST;
        this.DB_PORT = process.env.DB_PORT;
        this.DB_NAME = process.env.DB_NAME;
        this.DB_URI = process.env.DB_URI;
        this.FIREBASE_TYPE = process.env.FIREBASE_TYPE;
        this.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
        this.FIREBASE_PRIVATE_KEY_ID = process.env.FIREBASE_PRIVATE_KEY_ID;
        this.FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;
        this.FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
        this.FIREBASE_CLIENT_ID = process.env.FIREBASE_CLIENT_ID;
        this.FIREBASE_AUTH_URI = process.env.FIREBASE_AUTH_URI;
        this.FIREBASE_TOKEN_URI = process.env.FIREBASE_TOKEN_URI;
        this.FIREBASE_AUTH_PROVIDER_X509_CERT_URL = process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL;
        this.FIREBASE_CLIENT_X509_CERT_URL = process.env.FIREBASE_CLIENT_X509_CERT_URL;
        this.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
        this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
        this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
        this.CLOUDINARY_FOLDER_NAME = process.env.CLOUDINARY_FOLDER_NAME;
        this.EMAIL_HOST = process.env.EMAIL_HOST;
        this.EMAIL_PORT = process.env.EMAIL_PORT;
        this.EMAIL_USER = process.env.EMAIL_USER;
        this.EMAIL_PASS = process.env.EMAIL_PASS;
        this.EMAIL_SENDER = process.env.EMAIL_SENDER;
        this.STRIPE_PUBLIC_KEY = String(process.env.STRIPE_PUBLIC_KEY);
        this.STRIPE_SECRET_KEY = String(process.env.STRIPE_SECRET_KEY);
        this.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
        this.GOOGLE_KEY = process.env.GOOGLE_KEY;
        this.DOMAIN = process.env.DOMAIN;
    }
}
exports.default = new ServerConfig();
//# sourceMappingURL=server.config.js.map
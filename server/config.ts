import path from "path";
import dotenv from "dotenv";

const root = path.join(__dirname, ".env");
dotenv.config({ path: root });

export default {
    IS_PRODUCTION: process.env.NODE_ENV! === "production",
    PORT: process.env.PORT!,
    MONGODB_URL: process.env.MONGODB_URL!,
    SERVER_URL: process.env.SERVER_URL!,
    RECAPTCHA_KEY: process.env.RECAPTCHA_KEY!,
    ADMIN_ID: process.env.ADMIN_ID!
}

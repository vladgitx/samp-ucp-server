import "dotenv/config"

export const appConfig = {
    port: 3001,
    cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    environment: "development" as "production" | "development",
    sessionSecretKey: process.env.SESSION_SECRET_KEY as string,
    database: {
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_DB,
        password: process.env.DATABASE_PASSWORD,
    },
    clientUrl: "http://localhost:3000",
}
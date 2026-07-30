// src/config/index.js — the complete config layer 
import dotenv from "dotenv";
dotenv.config(); // load .env file into process.env

// 1. Define the apps needed for the app to work
const requiredEnvVars = [
    "MONGODB_URI",
    "JWT_SECRET",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    // Add any other required environment here as the app grows
];

// 2. Check if all the required variables are present
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable/s: ${envVar}`); // For debugging purposes

        // Stop the app immediately if any of the required variables are missing, for security reasons
        process.exit(1);
    }
});

// 3. Export the required configs to be use throughout the app as single source of truth
export const config = {
    port: parseInt(process.env.PORT, 10) || 5001, // PORT 5001 fallback if not defined in .env
    nodeEnv: process.env.NODE_ENV || "development",
    mongoUri: process.env.MONGODB_URI, // MongoDB API credentials for database connection
    jwtSecret: process.env.JWT_SECRET, // JWT value in .env file
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173", // Frontend link
    isProduction: process.env.NODE_ENV === "production", // To check if the app is running in production mode
    redis: { 
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }, // Redis API credentials for rate limiting
    cookie: {
        httpOnly: true, // Hides the cookie from JS when executed, good against XSS attacks
        secure: process.env.NODE_ENV === "production", // Only send the cookie in production (HTTPS)
        sameSite: process.env.NODE_ENV === "production" ? 'strict' : 'lax', // lax on dev, strict in prod for anti-CSRF attack
        maxAge: 1000 * 60 * 60, // Logs out automatically after 1 hour
    } // Cookie configuration for session management
};

// USAGE
// New version
// import { config } from '../config/index.js'; 
// // authController.js 
// const token = jwt.sign(
//     { userId: user._id }, 
//     config.jwtSecret, 
//     { expiresIn: '1h' }
// ); 

// // protect.js / authMiddleware.js
// const decoded = jwt.verify(token, config.jwtSecret);
// // Single source of truth, consistent calling
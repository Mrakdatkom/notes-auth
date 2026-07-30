import mongoose from "mongoose";
import { config } from "./index.js"

export const connectDb = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      sanitizeFilter: true, // This is the equivalent or alternative to the mongoSanitize() package. Since it is already a built-in function, we will just declare it here
    });
    console.log("Database connected to MongoDB");
  } catch (e) {
    console.error("Error connecting to db", e);
    process.exit(1); // Exit with failure
  }
}

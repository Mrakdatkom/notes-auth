import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected to MongoDB");
  } catch (e) {
    console.error("Error connecting to db", e);
    process.exit(1); // Exit with failure
  }
}

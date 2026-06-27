import express from 'express';
import notesRoutes from "./routes/notesRoutes.js";
import { connectDb } from './config/db.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDb();

// parse data into json
app.use(express.json());

// Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use("/api/notes", notesRoutes);

app.listen(PORT, () => {
  console.log("DB Connected:", PORT);
});
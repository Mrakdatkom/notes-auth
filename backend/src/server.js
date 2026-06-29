import express from 'express';
import notesRoutes from "./routes/notesRoutes.js";
import { connectDb } from './config/db.js';
import dotenv from "dotenv";
import rateLimiter from './middleware/rateLimiter.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: "http://localhost:5175"
}));

// parse data into json
app.use(express.json());

// Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(rateLimiter);

app.use("/api/notes", notesRoutes);

// Connect to database first before rendering the page
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("DB Connected:", PORT);
  });
});
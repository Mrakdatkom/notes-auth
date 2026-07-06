import express from 'express';
import notesRoutes from "./routes/notesRoutes.js";
import { connectDb } from './config/db.js';
import dotenv from "dotenv";
import rateLimiter from './middleware/rateLimiter.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import helmet from 'helmet';
import errorMiddleware from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 1st. helmet()
app.use(helmet());

// 2nd. cors()
app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}));

// 3rd. parse data into json
app.use(express.json());

// 4th. parse cookies
app.use(cookieParser());

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Route limit
app.use(rateLimiter);

// 6th. routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// 7th. protect()

// 8th. errorMiddleware
app.use(errorMiddleware);

// Connect to database first before rendering the page
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("DB Connected:", PORT);
  });
});
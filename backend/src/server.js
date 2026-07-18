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

// 1. First of all, the helmet. Serves as a building and first line of defense to protect the app from 7 possible attacks such as XSS
app.use(helmet());

// 2. CORS. Cors is the one resposible for checking the header's origin and credentials. If the origin is in the allowed list, allow the request. Otherwise, block.
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true,
}));

// 3. express.json(). Convert raw data into something Javascript can understand. In this case, JSON format.
app.use(express.json());

// 4. cookieParser(). Reads the raw cookie header and convert it to Javascript cookie object
app.use(cookieParser());

// 5. Rate Limiter
app.use(rateLimiter);

// 6. Routes. Will trust the app that the incoming requests are safe and already configured so it is declared at the bottom part.
app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);

// 7. errorMiddleware. The last thing to setup. Catches all the possible errors that might occur somewhere in the app.
app.use(errorMiddleware);

// Connect to database first before rendering the page
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("DB Connected:", PORT);
  });
});
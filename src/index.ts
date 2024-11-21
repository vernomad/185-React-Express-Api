import dotenv from 'dotenv';
dotenv.config();
console.log("From the Server",process.env.VITE_BASE_URL); // Should print the URL correctly

import express from 'express';
const app = express();
import { connectDB } from "./config/db";
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import path from 'path';
import cors from 'cors';
import corsOptions from './config/corsOptions';
import logger from './middleware/logEvents';
import errorHandler from './middleware/errorHandler';
//import verifyJWT from './middleware/verifyJWT';
import requireAuth from './middleware/authMiddleware';
import credentials from './middleware/credentials';
import cookieParser from 'cookie-parser';


const port = process.env.PORT || 3500;

// custom middleware logger
app.use(logger.logger);
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// Handle options credentials check - before CORS! and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions)); // Use your CORS configuration here

// built-in middleware to handle urlencoded form data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

// middleware for cookies
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, '../clients/dist')));

// Routes
app.use('/api/user/', requireAuth, userRouter);
app.use('/api/auth', authRouter);

// Handle preflight (OPTIONS) requests
app.options('*', (req, res) => {
  res.sendStatus(200); // Preflight response status
});

// Serve fallback page for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../clients/dist', 'index.html'));
});

// Global error handler
//app.use(errorHandler);

connectDB();
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

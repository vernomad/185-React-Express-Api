import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from "./config/db";
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import projectRouter from './routes/projectRoutes';
import eventRouter from './routes/eventRoutes';
import trackRoutes from './routes/trackRoutes';

import corsOptions from './config/corsOptions';
import logger from './middleware/logEvents';
import errorHandler from './middleware/errorHandler';
import requireAuth from './middleware/authMiddleware';
import credentials from './middleware/credentials';
import sessionMiddleware from './middleware/sessionMiddleware';


const app = express();
const port = process.env.PORT || 3500;


// Handle options credentials check - before CORS! and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions)); // Use your CORS configuration here

// built-in middleware to handle urlencoded form data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

// middleware for cookies
app.use(cookieParser());
app.use(sessionMiddleware);

// 2️⃣ Logging — now that cookies/session are available
app.use(logger.logger);
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});


// Serve static assets
app.use(express.static(path.join(__dirname, '../../clients/dist')));
app.use("/assets", express.static(path.join(__dirname, "../../clients/public/assets")));
app.use("/data", express.static(path.join(__dirname, "../../data")));


// API routes
app.use('/api/user/', requireAuth, userRouter);
app.use('/api/project', projectRouter);
app.use('/api/auth', authRouter);
app.use('/api/event', eventRouter);
app.use('/api', trackRoutes)
app.get('/api/session', sessionMiddleware, (req, res) => {
  res.json({ sessionId: req.sessionId });
});

// Handle preflight (OPTIONS) requests
app.options('*', (req, res) => {
  res.sendStatus(200); // Preflight response status
});

// Serve fallback page for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../clients/dist', 'index.html'));
});

connectDB();

app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

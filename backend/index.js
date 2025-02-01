import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import authRouter from './routes/authroute.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import messageRouter from './routes/message.route.js';
import { app, server, io } from './lib/socket.js';

connectDB();

app.use(cookieParser());

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true
}));

// Increase payload size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/api/auth", authRouter); // Ensure the base path is '/api/auth'
app.use("/api/messages", messageRouter);

server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`); // Corrected port logging
});

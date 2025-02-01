import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authroute.js';
// ...existing code...

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Use the authRouter for authentication routes
app.use('/auth', authRouter); // Ensure the base path is '/auth'

// ...existing code...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import { login, signup, logout, updateProfile, getprofile } from '../controllers/auth.controllers.js';
import isAuthenticated from '../middleware/Auth.js';
const authRouter = express.Router();

authRouter.post("/signup",signup);

authRouter.post("/login", login); // POST method for login
authRouter.post("/signup", signup); // POST method for signup
authRouter.post("/logout", isAuthenticated, logout);
authRouter.get("/profile", isAuthenticated, getprofile);
authRouter.put("/update-profile", isAuthenticated, updateProfile);

export default authRouter;




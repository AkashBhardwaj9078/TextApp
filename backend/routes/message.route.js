import express from 'express'
import { getMessages, getUsersForSidebar, sendMessages } from '../controllers/message.controller.js';
import isAuthenticated from '../middleware/Auth.js';

const messageRouter=express.Router();

messageRouter.get("/users",isAuthenticated,getUsersForSidebar)
messageRouter.get("/:id",isAuthenticated,getMessages)

messageRouter.post("/send/:id",isAuthenticated,sendMessages);
// messageRouter.get('/users', isAuthenticated, getUsers);

export default messageRouter 
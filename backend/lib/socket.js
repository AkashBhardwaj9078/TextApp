import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow requests from this origin
        credentials: true
    }
});

export const getReceiverId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {};
const socketUserMap = {};

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const user_id = socket.handshake.query.userId;
    if (user_id) {
        userSocketMap[user_id] = userSocketMap[user_id] || [];
        userSocketMap[user_id].push(socket.id);
        socketUserMap[socket.id] = user_id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("setOnlineUsers", () => {
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("disconnect", () => {
        console.log('user disconnected', socket.id);
        const user_id = socketUserMap[socket.id];
        if (user_id) {
            userSocketMap[user_id] = userSocketMap[user_id].filter(id => id !== socket.id);
            if (userSocketMap[user_id].length === 0) {
                delete userSocketMap[user_id];
            }
            delete socketUserMap[socket.id];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });
});

export { io, server, app };


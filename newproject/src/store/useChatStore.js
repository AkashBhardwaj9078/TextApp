import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import useAuthStore from "./useAuthStore";
import { io } from "socket.io-client";
import { useState, useEffect } from 'react';

const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    isUserLoading: false,
    isMessagesLoading: false,
    selectedUser: null,
    socket: null,

    getUsers: async () => {
        set({ isUserLoading: true });
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You are not authenticated');
            set({ isUserLoading: false });
            return;
        }
        try {
            const res = await axiosInstance.get("/messages/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                set({ users: res.data });
                console.log(get().users); // Log users after setting them
            } else {
                console.log("There is error in getting 200 with all the users", res.data.message);
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log("There is error in getting all the users", error);
            const errorMessage = error.response?.data?.message || 'An error occurred';
            toast.error(errorMessage);
        } finally {
            set({ isUserLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });

        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            if (res.status === 201) {
                set({ messages: res.data });
                console.log(get().messages); // Log messages after setting them
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log("There is error in getting all the messages", error);
            toast.error(error);
        }
        finally{
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (userId, { text, image }) => {
        try {
            const res = await axiosInstance.post(`/messages/send/${userId}`, { text, image });
            if (res.status === 201) {
                set({ messages: [...get().messages, res.data] });
                console.log(get().messages);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log("There is error in sending message", error);
            toast.error(error.message);
        }
    },
    subscribeToMessage:async()=>{
        const {selectedUser}=get();
        if(!selectedUser) return ;
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.on("newMessage",(message)=>{
                set({messages:[...get().messages,message]});
            });
        }
    }
    ,
    unSubscribeToMessage:async()=>{
        const socket = get().socket;
        if (socket) {
            socket.off("newMessage");
        }
    }
    ,
    setSelectedUser: async (user) => {
        set({ selectedUser: user });
    },
    // initializeSocket: async () => {
    //     const { authUser } = useAuthStore.getState();
    //     if (authUser && !get().socket) {
    //         const newSocket = io("http://localhost:5000", {
    //             withCredentials: true,
    //             query: { userId: authUser._id }
    //         });
    //         set({ socket: newSocket });

    //         return () => {
    //             newSocket.disconnect();
    //         };
    //     }
    // }
}));

export default useChatStore;
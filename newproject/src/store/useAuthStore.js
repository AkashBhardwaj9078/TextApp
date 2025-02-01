import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
// import { disconnect } from 'mongoose';
const SOCKET_BASE_URL = 'http://localhost:5000';
const useAuthStore = create((set,get) => ({
    authUser:null,
    isAuthenticated: false,
    isLoggingIn: false,
    isSigningUp: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers:[],
    socket:null,

    checkAuthProfile: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ authUser: null, isCheckingAuth: false });
            return;
        }

        try {
            const res = await axiosInstance.get('/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({ authUser: res.data });


            get().connectSocket();
        } catch (error) {
            console.log('The error in checkingAuthProfile', error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data, navigate) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            if (res.status === 201) {
                toast.success("Account created successfully");
                set({ authUser: res.data.user });
                localStorage.setItem('token', res.data.token);
                get().connectSocket()
                await useAuthStore.getState().checkAuthProfile();
                navigate("/");
            } else {
                toast.error(res.data.message);
            }

            await useAuthStore.getState().checkAuthProfile();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            toast.error(errorMessage);
            console.log('The error in while creating account', error);
            set({ authUser: null });
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data, navigate) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            if (res.status === 200) {
                toast.success("You successfully logged in");
                set({ authUser: res.data.user, isAuthenticated: true });
                localStorage.setItem('token', res.data.token);
                get().connectSocket();
                await useAuthStore.getState().checkAuthProfile();
                navigate("/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            toast.error(errorMessage);
            console.log('The error in logging in', error);
            set({ authUser: null, isAuthenticated: false });
        } finally {
            set({ isLoggingIn: false });
            
        }
    },

    logout: async (navigate) => {
        try {
            await axiosInstance.post("/auth/logout");
            localStorage.removeItem('token');
            toast.success("Successfully logged out");
            get().disconnectSocket();
            set({ authUser: null, isAuthenticated: false });
            await useAuthStore.getState().checkAuthProfile();
            // navigate("/login");
        } catch (error) {
            console.log('The error in logging out', error);
            const errorMessage = error.response?.data?.message || 'An error occurred';
            toast.error(errorMessage);
        }
    }
    ,
    updateprofile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            if (res.status === 200) {
                set({ authUser: res.data.user });
                toast.success("Successfully uploaded the profile");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            toast.error(errorMessage);
            console.log('The error in updating profile', error);
        } finally {
            set({ isUpdatingProfile: false });
        }
    }

    ,
    connectSocket: async () => {
        if (!get().authUser || get().socket?.connected) {
            return;
        }
        const socket=io(SOCKET_BASE_URL,{
            
                    query:{
                        userId:get().authUser._id
                    }
                
        });

        socket.connect()
        // const socket = io(SOCKET_BASE_URL,{
        //     query:{
        //         userId:get().authUser._id
        //     }
        // });

        // // socket.on('connect', () => {
        // //     console.log('Socket connected:', socket.id);
        // //     set({ socket });
        // // });

        // // socket.on('connect_error', (error) => {
        // //     console.error('Connection error:', error);
        // // });

        // // socket.on('disconnect', () => {
        // //     console.log('Socket disconnected:', socket.id);
        // //     set({ socket: null });
        // // });

        // // socket.on("getOnlineUsers", (userIds) => {
        
        // //     set({ onlineUsers: userIds });
        // // });
 
        // // socket.on("userDisconnected", (userId) => {
        // //     set((state) => ({
        // //         onlineUsers: state.onlineUsers.filter(id => id !== userId)
        // //     }));
        // // });

        // socket.connect();

        set({socket:socket})

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        })
    }
    ,
    disconnectSocket:async()=>{
        // const userId=get().authUser._id;
        // const socket = get().socket;
        if(get().socket?.connected){

            get().socket?.disconnect();
        }
        // if (socket?.connected) {
        //     socket.disconnect();
            
        //     // socket.on("getOnlineUsers", (userIds) => {
        

        //     //     set({ onlineUsers: userIds });
                
        //     // });
            
        // }
    }


}));

export default useAuthStore;
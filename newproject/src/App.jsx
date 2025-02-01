import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Pages/Signup';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Settings from './Pages/Settings';
import Profile from './Pages/Profile';
import useAuthStore from './store/useAuthStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import useThemeStore from './store/useThemeStore';

const App = () => {
  const { checkAuthProfile, authUser, isCheckingAuth ,onlineUsers} = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuthProfile();
  }, [checkAuthProfile]);


  console.log(authUser)
  console.log({"onlineUsers":onlineUsers});
  // useEffect(() => {
  //   if (!authUser && !isCheckingAuth) {
  //     // Redirect to login if not authenticated
  //     window.location.href = '/login';
  //   }
  // }, [authUser, isCheckingAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;

import User from "../models/users.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
        res.cookie('token', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== 'development'
        });

        return res.status(201).json({
            token,
            user: newUser
        });
    } catch (error) {
        console.error("There is an error while signing up", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
        res.cookie('token', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== 'development'
        });

        return res.status(200).json({
            token, user
        });
    } catch (error) {
        console.error("There is an error while logging in", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const logout = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        res.cookie('token', "", { maxAge: 0 }); // Clear the 'token' cookie
        return res.status(200).json({
            message: "Successfully Logged Out"
        });
    } catch (error) {
        console.error("There is an error while logging out", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) {
            return res.status(400).json({
                message: "Profile pic is required"
            });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error("There is an error while uploading profile pic", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
    
}

export const getprofile=(req,res)=>{
   try {
    
    return res.status(200).json(req.user);
   } catch (error) {
    console.error("There is an error while getting Profile ", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
   }
}
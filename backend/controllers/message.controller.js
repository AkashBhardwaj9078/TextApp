import User from "../models/users.model.js";
import Message from "../models/messages.model.js";
import cloudinary from "../lib/cloudinary.js";


import { getReceiverId, io } from "../lib/socket.js";

export const getUsersForSidebar=async(req,res)=>{
    try {
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password");
       
        return res.status(200).json(
            filteredUsers
        )
        
    } catch (error) {
        console.error("There is an error while getting  all the users,server error", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
        
    }
}

export const getMessages=async(req,res)=>{

    try {
        const {id}=req.params;
        const myId=req.user._id;
        const messages=await Message.find({
            $or:[
                {senderId:id,receiverId:myId},
                {senderId:myId,receiverId:id},

            ]
        });
        res.status(201).json(messages);
    } catch (error) {

        console.error("There is an error while getting messages", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
        
    }
}
// export const getUsers=async(req,res)=>{

//     try {

//         const userId=req.user._id;
//         const users=await User.find({})
        
//     } catch (error) {
        
//     }
// }
export const sendMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const { text, image } = req.body;
        let imgUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imgUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imgUrl
        });

        await newMessage.save();

        const receiverSocketId=getReceiverId[receiverId]
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("There is an error while sending messages", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
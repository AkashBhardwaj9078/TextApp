import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';

const isAuthenticated = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id).select('-password'); // Use 'id' instead of '_id'
        if (!user) {
            return res.status(404).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error("There is an error in authentication", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export default isAuthenticated;
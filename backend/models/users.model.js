import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true
  },
  fullname: {
    required: true,
    type: String
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "It must be 6 characters long"]
  },
  profilePic: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;

# Backend API Documentation

## Overview

This project is a backend server built using Node.js, Express, and MongoDB. It provides a set of RESTful API endpoints for user authentication, messaging, and real-time communication using Socket.io. The server also integrates with Cloudinary for image uploads.

## Features

- **User Authentication**: Sign up, login, and logout functionalities.
- **Profile Management**: Update user profile picture.
- **Messaging**: Send and receive messages between users.
- **Real-time Communication**: Real-time updates for online users and new messages using Socket.io.
- **Image Uploads**: Upload and store images using Cloudinary.

## Environment Variables

The following environment variables need to be set in a `.env` file:

```
PORT=5000
SECRET_KEY="your_secret_key"
DB_CONNECT="your_mongodb_connection_string"
NODE_ENV="development"
CLOUDINARY_API="your_cloudinary_api_key"
CLOUDINARY_NAME="your_cloudinary_name"
CLOUDINARY_SECRET="your_cloudinary_secret"
```

## Endpoints

### Authentication

#### Sign Up

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Description**: Create a new user account.
- **Request Body**:
  ```json
  {
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "fullname": "John Doe",
      "email": "john@example.com",
      "profilePic": "profile_pic_url"
    }
  }
  ```

#### Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user and return a JWT token.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "fullname": "John Doe",
      "email": "john@example.com",
      "profilePic": "profile_pic_url"
    }
  }
  ```

#### Logout

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Description**: Logout the user by clearing the JWT token.
- **Response**:
  ```json
  {
    "message": "Successfully Logged Out"
  }
  ```

### Profile

#### Update Profile Picture

- **URL**: `/api/auth/update-profile`
- **Method**: `PUT`
- **Description**: Update the user's profile picture.
- **Request Body**:
  ```json
  {
    "profilePic": "base64_encoded_image"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "_id": "user_id",
      "fullname": "John Doe",
      "email": "john@example.com",
      "profilePic": "new_profile_pic_url"
    }
  }
  ```

#### Get Profile

- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Description**: Get the authenticated user's profile.
- **Response**:
  ```json
  {
    "_id": "user_id",
    "fullname": "John Doe",
    "email": "john@example.com",
    "profilePic": "profile_pic_url"
  }
  ```

### Messaging

#### Get Users for Sidebar

- **URL**: `/api/messages/users`
- **Method**: `GET`
- **Description**: Get a list of users excluding the authenticated user.
- **Response**:
  ```json
  [
    {
      "_id": "user_id",
      "fullname": "Jane Doe",
      "email": "jane@example.com",
      "profilePic": "profile_pic_url"
    },
    // ...other users
  ]
  ```

#### Get Messages

- **URL**: `/api/messages/:id`
- **Method**: `GET`
- **Description**: Get messages between the authenticated user and another user.
- **Response**:
  ```json
  [
    {
      "_id": "message_id",
      "senderId": "user_id",
      "receiverId": "receiver_id",
      "text": "Hello!",
      "image": "image_url",
      "createdAt": "timestamp"
    },
    // ...other messages
  ]
  ```

#### Send Message

- **URL**: `/api/messages/:id`
- **Method**: `POST`
- **Description**: Send a message to another user.
- **Request Body**:
  ```json
  {
    "text": "Hello!",
    "image": "base64_encoded_image"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "message_id",
    "senderId": "user_id",
    "receiverId": "receiver_id",
    "text": "Hello!",
    "image": "image_url",
    "createdAt": "timestamp"
  }
  ```

### Real-time Communication(Socket requires some improvisation here)

#### Socket.io Events

- **Connection**: When a user connects, their socket ID is stored.
- **Disconnect**: When a user disconnects, their socket ID is removed.
- **setOnlineUsers**: Emit the list of online users.
- **newMessage**: Emit a new message to the receiver.

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env` file and set the environment variables.
4. Start the server: `npm start`.

## Dependencies

- **express**: Web framework for Node.js.
- **mongoose**: MongoDB object modeling tool.
- **jsonwebtoken**: For generating and verifying JWT tokens.
- **bcryptjs**: For hashing passwords.
- **cloudinary**: For image uploads.
- **socket.io**: For real-time communication.
- **dotenv**: For loading environment variables.
- **cors**: For enabling Cross-Origin Resource Sharing.
- **cookie-parser**: For parsing cookies.

## License

This project is licensed under the MIT License.

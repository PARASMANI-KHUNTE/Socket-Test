const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require('./models/User')
// Load environment variables
dotenv.config();

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chatapplication-client-2zc4.onrender.com", // Replace with your client URL for production
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
const db = require('./config/dbConfig');
db();


passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  const user = User.find(u => u.id === id);
  done(null, user || null);
});

// Routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

// Models
const Chat = require('./models/Chat');
const Message = require('./models/Message');

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a specific room for private chats
  socket.on("joinRoom", ({ chatId }) => {
    if (!chatId) {
      console.error("Chat ID is required to join a room.");
      return;
    }
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  // Handle new message
  socket.on("sendMessage", async ({ chatId, senderId, receiverId, content }) => {
    if (!chatId || !senderId || !receiverId || !content) {
      console.error("All fields are required to send a message.");
      return;
    }
    try {
      // Save message to MongoDB
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
        type: "text", // Change dynamically if needed
      });
      const savedMessage = await message.save();

      // Update Chat with new message
      await Chat.findByIdAndUpdate(chatId, {
        $push: { messages: savedMessage._id },
      });

      // Emit message to other participants in the chat room
      io.to(chatId).emit("receiveMessage", {
        chatId,
        senderId,
        receiverId,
        content,
        timestamp: savedMessage.createdAt, // Adjust to match your schema
      });

    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Server Listener
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is undefined
server.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`);
});

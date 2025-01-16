const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require("passport");
const session = require("express-session");
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
const jwt = require("jsonwebtoken");

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
const db = require('./config/dbConfig');
db();


// Session setup
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const token = jwt.sign({ id: profile.id }, "JWT_SECRET", { expiresIn: "1h" })
      const user = await User.findOneAndUpdate(
        { googleId: profile.id },
        { email: profile.emails[0].value, name: profile.displayName },
        { upsert: true, new: true }
      );
      return done(null,user, { profile, token });
    }
  )
);


// Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback",passport.authenticate("google", { failureRedirect: "/" }),(req, res) => res.redirect("/")
);
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

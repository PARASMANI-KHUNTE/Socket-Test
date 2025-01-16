const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/", // Replace with your client URL for production
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

// Session setup

// Initialize Passport


const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const socialRoute = require('./routes/socialRoute')
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/social", socialRoute);




// Server Listener
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`);
});

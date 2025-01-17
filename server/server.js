const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Create an Express app and an HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-client-rm95.onrender.com" , 
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Database and routes
const db = require('./config/dbConfig');
db();
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const socialRoute = require('./routes/socialRoute');

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/social", socialRoute);

// Set up WebSocket server
const wss = new WebSocket.Server({ server });
const clients = new Map();
const Chat = require('./models/Chat')

wss.on("connection", (ws, req) => {
  const urlParams = new URLSearchParams(req.url.split("?")[1]);
  const chatId = urlParams.get("chatid");
  const senderId = urlParams.get("sender");
  const receiverId = urlParams.get("receiver");

  if (!chatId || !senderId || !receiverId) {
    console.log(`Invalid connection parameters. chatId: ${chatId}, senderId: ${senderId}, receiverId: ${receiverId}`);
    ws.send("Invalid connection parameters.");
    ws.close();
    return;
  }

  // Store WebSocket connection with sender and chatId info
  clients.set(ws, { chatId, senderId, receiverId });
  console.log(`Client connected: Sender = ${senderId}, Receiver = ${receiverId}, Chat = ${chatId}`);

  // Handling incoming messages
  ws.on("message", async (messageData) => {
    console.log(`Incoming raw message from ${senderId}: ${messageData}`);

    let messageContent;

    try {
      // Try parsing the message as JSON first
      const parsedData = JSON.parse(messageData);
      messageContent = parsedData.text || parsedData.message;
    } catch (err) {
      // If not JSON, treat it as plain text
      messageContent = messageData.toString();
    }

    // Check if message content is empty or undefined
    if (!messageContent || messageContent.trim() === "") {
      ws.send("Message content cannot be empty.");
      return;
    }

    console.log(`Processed message from ${senderId}: ${messageContent}`);

    // Save the message to the database
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        ws.send("Invalid chat ID.");
        return;
      }

      const newMessage = {
        sender: senderId,
        content: messageContent,
        timestamp: new Date(),
      };

      chat.messages.push(newMessage); // Add the new message to the chat
      await chat.save();

      console.log(`Message saved to chat ${chatId}`);

      // Broadcast the message to the corresponding receiver
      clients.forEach((clientDetails, clientWs) => {
        if (
          clientWs.readyState === WebSocket.OPEN &&
          clientDetails.chatId === chatId &&
          clientDetails.senderId === receiverId &&
          clientDetails.receiverId === senderId
        ) {
          const formattedMessage = {
            text: messageContent,
            from: senderId,
            to: receiverId,
            timestamp: new Date(),
          };
          clientWs.send(JSON.stringify(formattedMessage));
        }
      });
    } catch (error) {
      console.error("Error saving message to chat:", error.message);
      ws.send("Error saving message to chat.");
    }
  });

  // Handle WebSocket closure
  ws.on("close", () => {
    clients.delete(ws);
    console.log(`Client disconnected: Sender = ${senderId}, Receiver = ${receiverId}, Chat = ${chatId}`);
  });
});

// Define an HTTP endpoint for WebSocket info
app.get('/chat/connect', (req, res) => {
  res.send('This endpoint establishes a WebSocket connection.');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`);
});

const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Message = require("../models/Message");




// Endpoint to create a chat room
router.post("/create", async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Check if a chat room already exists between these users
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      // If no chat room exists, create a new one
      chat = new Chat({
        participants: [senderId, receiverId],
      });
      await chat.save();
    }

    res.status(200).json({ chatid: chat._id });
  } catch (error) {
    res.status(500).json({ message: "Error creating chat room", error });
  }
});

// Endpoint to save message to the backend
router.post("/saveMessage", async (req, res) => {
  const { chatId, senderId, content } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    const newMessage = {
      sender: senderId,
      content,
      timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(200).json({ message: "Message saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving message", error });
  }
});

// Get all messages by Chat ID
router.get("/:chatId/messages", async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId).populate("messages.sender", "name email");
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

// Send a new message
router.post("/:chatId/messages", async (req, res) => {
  const { chatId } = req.params;
  const { senderId, content } = req.body;

  if (!senderId || !content) {
    return res.status(400).json({ message: "Sender ID and content are required" });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const newMessage = {
      sender: senderId,
      content,
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

// Get all chats for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ participants: userId }).populate("participants", "name email");
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user chats", error });
  }
});



module.exports = router;

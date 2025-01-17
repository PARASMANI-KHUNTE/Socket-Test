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







// Example route: Fetch all chats for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const chats = await Chat.find({ participants: userId }).populate("messages");
    res.status(200).json(chats);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// Example route: Create a new chat
router.post("/", async (req, res) => {
  const { participants } = req.body;
  try {
    const newChat = new Chat({ participants });
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

module.exports = router;

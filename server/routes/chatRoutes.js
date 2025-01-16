const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Message = require("../models/Message");

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

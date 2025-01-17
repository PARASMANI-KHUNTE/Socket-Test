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

module.exports = router;

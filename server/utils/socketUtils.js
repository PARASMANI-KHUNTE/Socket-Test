const Chat = require("../models/Chat");

const createChatRoom = async (user1Id, user2Id) => {
  try {
    let chat = await Chat.findOne({
      participants: { $all: [user1Id, user2Id] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [user1Id, user2Id],
      });
      await chat.save();
    }

    console.log("Chat room created:", chat);
    return chat;
  } catch (error) {
    console.error("Error creating chat room:", error);
  }
};


const addMessageToChat = async (chatId, senderId, content) => {
    try {
      const chat = await Chat.findById(chatId);
  
      if (chat) {
        chat.messages.push({ sender: senderId, content });
        await chat.save();
  
        console.log("Message added:", content);
        return chat;
      } else {
        console.error("Chat room not found");
      }
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };
  


module.exports = {createChatRoom,addMessageToChat}
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = "http://localhost:5000";
// Connect to WebSocket server
const socket = io("http://localhost:5000");

const ChatRoom = () => {
  const { chatid, senderId, receiverId } = useSelector((state) => state.chat);
  const [ProfileUrl, setProfileUrl] = useState("");
  const [receiverName, setReceiverName] = useState("");

  // Fetch receiver data only once after mount
  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/id`, {
          params: { id: receiverId },
        });
        if (response.status === 200) {
          setProfileUrl(response.data.ProfileUrl);
          setReceiverName(response.data.name);
        }
      } catch (error) {
        console.error("Error fetching receiver data:", error.message);
      }
    };

    if (receiverId) {
      fetchReceiverData();
    }
  }, []); // Empty dependency array to run only once

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off("receiveMessage");
    };
  }, []); 

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        chatid,
        senderId,
        receiverId,
        message,
      };

      // Send the message to the server
      socket.emit("sendMessage", messageData);

      // Add the message to the local state for immediate feedback
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId, message, timestamp: new Date() },
      ]);

      // Clear the input field
      setMessage("");
    } else {
      toast.error("Message cannot be empty");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Chat Room Navigation Bar */}
      <div className="flex items-center p-4 bg-white border-b border-gray-300">
        <img
          src={ProfileUrl || "https://your-default-placeholder.com/40"}
          alt={receiverName}
          className="w-10 h-10 rounded-full mr-3"
        />
        <h2 className="font-bold text-lg">{receiverName || "Chat Partner"}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.senderId === senderId
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 self-start"
            } p-3 rounded-lg max-w-xs`}
          >
            <p>{msg.message}</p>
            <span className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center p-4 bg-white border-t border-gray-300">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ChatRoom;
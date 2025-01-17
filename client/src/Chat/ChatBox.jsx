import { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatBox = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null); // Store chatId
  const ws = useRef(null);

  // Create chat room and get chatId
  const createChatRoom = async () => {
    try {
      const response = await axios.post("https://chat-app-server-zwfu.onrender.com/api/chat/create", {
        senderId,
        receiverId,
      });

      if (response.data && response.data.chatid) {
        setChatId(response.data.chatid); // Set the chatId
        console.log("Chat room created. Chat ID:", response.data.chatid);
      } else {
        console.error("Failed to create chat room. No chatId returned.");
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };

  // Fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`https://chat-app-server-zwfu.onrender.com/api/chat/${chatId}/messages`);
      setMessages(response.data); // Load messages from the backend
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    // Only create WebSocket connection if chatId is available
    if (chatId && senderId && receiverId) {
      ws.current = new WebSocket(
        `ws://localhost:5000/chat/connect?chatid=${chatId}&sender=${senderId}&receiver=${receiverId}`
      );

      ws.current.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.current.onmessage = (event) => {
        let receivedMessage;
      
        try {
          // Try parsing the message as JSON
          receivedMessage = JSON.parse(event.data);
          if (!receivedMessage || !receivedMessage.content) {
            throw new Error("Message content is empty or invalid");
          }
        } catch (error) {
          // If parsing fails or the message is empty, log an appropriate message
          console.log("Received non-JSON or empty message:", event.data);
          return; // Do not add empty or invalid messages to the state
        }
      
        // Add the received message to the message state
        setMessages((prev) => [...prev, receivedMessage]);
      };
      
      ws.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        ws.current.close();
      };
    }
  }, [chatId, senderId, receiverId]); // Re-run only when chatId, senderId, or receiverId change

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim()) {
      console.log("Cannot send empty message");
      return; // Prevent sending empty messages
    }
  
    const messagePayload = {
      senderId,
      content: newMessage,
    };
  
    // Send message to WebSocket
    ws.current.send(JSON.stringify(messagePayload));
  
    // Add the message locally for immediate display
    setMessages((prev) => [
      ...prev,
      { sender: senderId, content: newMessage, timestamp: new Date() },
    ]);
    setNewMessage(""); // Clear the input field
  
    // Save the message in the backend
    axios
      .post("http://localhost:5000/api/chat/saveMessage", {
        chatId,
        senderId,
        content: newMessage,
      })
      .catch((error) => console.error("Error saving message to backend:", error));
  };
  
  // Trigger chat room creation and initial fetch of messages
  useEffect(() => {
    createChatRoom(); // Create chat room when the component mounts
  }, [senderId, receiverId]);

  useEffect(() => {
    if (chatId) {
      fetchMessages(); // Fetch messages after chatId is available
    }
  }, [chatId]);

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Chat with User {receiverId}</h2>

      {/* Message Display */}
      <div className="h-64 overflow-y-auto border border-gray-300 rounded p-2 mb-4">
        {/* Upper Row - Messages fetched from the backend */}
        <div className="mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet.</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 mb-2 rounded ${msg.sender === senderId ? "bg-blue-100 text-right" : "bg-gray-100 text-left"}`}
              >
                <p>{msg.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Lower Row - Messages from WebSocket response */}
        <div>
          {/* WebSocket messages will appear here */}
          {messages.length > 0 &&
            messages
              .filter((msg) => msg.sender !== senderId)
              .map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 mb-2 rounded ${msg.sender === receiverId ? "bg-gray-100 text-left" : "bg-blue-100 text-right"}`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow border border-gray-300 rounded p-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

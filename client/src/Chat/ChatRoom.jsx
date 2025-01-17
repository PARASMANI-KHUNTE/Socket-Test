import { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatRoom = ({ senderId, receiverId }) => {
  const [chatId, setChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Stores fetched messages
  const [LiveMessages, setLiveMessages] = useState([]); // Stores live WebSocket messages
  const [receiverDetails, setReceiverDetails] = useState(null); // Receiver info
  const [usersMap, setUsersMap] = useState({}); // Maps userId to name for display
  const ws = useRef(null);

  // Fetch receiver details
  useEffect(() => {
    const fetchReceiverDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${receiverId}`);
        setReceiverDetails(response.data);
        setUsersMap((prev) => ({ ...prev, [receiverId]: response.data.name }));
      } catch (error) {
        console.error("Error fetching receiver details:", error);
      }
    };
    fetchReceiverDetails();
  }, [receiverId]);

  // Create chat room when the component mounts
  useEffect(() => {
    const createChatRoom = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/chat/create", {
          senderId,
          receiverId,
        });
        setChatId(response.data.chatid);
      } catch (error) {
        console.error("Error creating chat room:", error);
      }
    };
    createChatRoom();
  }, [senderId, receiverId]);

  // Fetch messages when the chat room is available
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/chat/${chatId}/messages`);
        setMessages(response.data);

        // Map user IDs to names for all message senders
        const userIds = response.data.map((msg) => msg.sender);
        const uniqueUserIds = [...new Set(userIds)];
        const userDetails = await Promise.all(
          uniqueUserIds.map((id) => axios.get(`http://localhost:5000/api/user/${id}`))
        );
        const userMap = userDetails.reduce(
          (map, res) => ({ ...map, [res.data.id]: res.data.name }),
          {}
        );
        setUsersMap((prev) => ({ ...prev, ...userMap }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [chatId]);

  // Establish WebSocket connection
  useEffect(() => {
    if (!chatId) return;

    const wsUrl = `ws://localhost:5000/?chatid=${chatId}&sender=${senderId}&receiver=${receiverId}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error("Error received from server:", data.error);
        } else {
          setLiveMessages((prev) => [...prev, data]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [chatId, senderId, receiverId]);

  // Handle sending a message
  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      text: message,
      sender: senderId,
      receiver: receiverId,
      timestamp: new Date().toISOString(),
    };

    // Send message via WebSocket
    ws.current.send(JSON.stringify(messageData));

    // Add message to local state for display
    setLiveMessages((prev) => [...prev, messageData]);

    setMessage("");
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto border rounded-lg shadow-md bg-white">
      {/* Navbar */}
      <div className="flex items-center p-4 bg-gray-100 border-b">
        {receiverDetails && (
          <>
            <img
              src={receiverDetails.ProfileUrl || "https://via.placeholder.com/40"}
              alt="Receiver"
              className="w-10 h-10 rounded-full mr-4"
            />
            <h1 className="text-lg font-semibold">{receiverDetails.name || "Receiver"}</h1>
          </>
        )}
      </div>

      {/* Message box */}
      <div className="flex-1 p-4 overflow-y-auto" style={{ height: "300px" }}>
        {[...messages, ...LiveMessages].map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg max-w-xs ${
              msg.sender === senderId
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            <p className="text-sm">{msg.text || msg.content}</p>
            <span className="text-xs text-gray-500 block mt-1">
              {usersMap[msg.sender] || "Unknown"}
            </span>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="flex p-4 border-t">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-lg p-2 mr-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;

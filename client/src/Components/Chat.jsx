import  { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AuthContext from "../context/AuthContext";
import api from "../api/axiosConfig";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const { authToken, username } = useContext(AuthContext);
  const socket = io("http://localhost:6345");

  useEffect(() => {
    if (authToken) {
      socket.emit("authenticate", authToken);

      socket.on("user_list", (userList) => setUsers(userList));
      socket.on("private_message", (msg) => setMessages((prev) => [...prev, msg]));
    }

    return () => {
      socket.disconnect();
    };
  }, [authToken]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("private_message", { token: authToken, recipient: "RecipientUsername", message });
      setMessages((prev) => [...prev, { from: username, message }]);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <div>
        <h2>Online Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.username}>{user.username} ({user.status})</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Messages</h2>
        <div>
          {messages.map((msg, index) => (
            <p key={index}>
              <b>{msg.from}:</b> {msg.message}
            </p>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

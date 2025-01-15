import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ChatApp = () => {
  const [users, setUsers] = useState([]); // List of users
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // Messages exchanged
  const [socket, setSocket] = useState(null);

  // Fetch the list of users for search
  useEffect(() => {
    axios.get('http://localhost:6345/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => console.error('Error fetching users:', err));

    // Initialize socket connection
    const socketIo = io('http://localhost:6345');
    setSocket(socketIo);

    return () => socketIo.disconnect(); // Clean up the socket connection on component unmount
  }, []);

  // Handle message submission
  const handleSendMessage = () => {
    if (selectedUser && message.trim()) {
      // Send the message to the selected user via socket
      socket.emit('private_message', {
        message,
        to: selectedUser.socketId, // Send the message to the selected user's socket ID
      });
      setMessages([...messages, { from: 'Me', message }]);
      setMessage(''); // Clear the message input
    }
  };

  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages([]); // Clear previous messages when a new user is selected
  };
  useEffect(() => {
    if (socket) {
      // Listen for incoming private messages
      socket.on('receive_message', ({ from, message }) => {
        setMessages((prevMessages) => [...prevMessages, { from, message }]);
      });
    }
  }, [socket]);
  

  return (
    <div className="chat-app">
      <h2>Chat Application</h2>
      
      <div className="user-search">
        <h3>Search for Users</h3>
        <ul>
          {users.map(user => (
            <li key={user._id} onClick={() => handleSelectUser(user)}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && (
        <div className="chat-box">
          <h3>Chat with {selectedUser.username}</h3>
          
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <strong>{msg.from}:</strong> {msg.message}
              </div>
            ))}
          </div>

          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type your message"
          />
          
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatApp;

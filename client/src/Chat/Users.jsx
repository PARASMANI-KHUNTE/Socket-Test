import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateChat } from "../redux/chatSlice";

const BASE_URL = "http://localhost:5000";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUserId, setActiveUserId] = useState(null);

  const dispatch = useDispatch();

  // Get the logged-in user's data from Redux
  const {id,email } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/users`);
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          toast.error("Failed to fetch users.");
        }
      } catch (error) {
        toast.error(`Error fetching users: ${error.message}`);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (receiverId) => {
    try {
        console.log("email - ",email)
        console.log("id - ",id)
      // Fetch senderId using email
      const senderResponse = await axios.post(`${BASE_URL}/api/user/user`,{email} )

      if (senderResponse.status === 200) {
        const senderId = senderResponse.data._id;

        // Send request to create a chat room
        const response = await axios.post(`${BASE_URL}/api/chat/create`, {
          senderId,
          receiverId,
        });

        if (response.status === 200) {
          const { chatid } = response.data;

          // Dispatch the chat data to Redux store
          dispatch(
            CreateChat({
              chatid,
              senderId,
              receiverId,
              message: "",
            })
          );

          // Set active user
          setActiveUserId(receiverId);

          toast.success("Chat room created successfully!");
        } else {
          toast.error("Failed to create chat room.");
        }
      } else {
        toast.error("Failed to fetch sender details.");
      }
    } catch (error) {
      toast.error(`Error creating chat room: ${error.message}`);
    }
  };

  // Filter users, excluding the logged-in user
  const filteredUsers = Array.isArray(users)
    ? users
        .filter((user) => user.email !== email)
        .filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      {/* Users List */}
      <div className="flex flex-col gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`p-4 border rounded-lg cursor-pointer ${
                activeUserId === user._id ? "bg-blue-100" : "bg-white"
              }`}
              onClick={() => handleUserClick(user._id)}
            >
              <img
                src={user.ProfileUrl || "https://via.placeholder.com/150"}
                alt={user.name}
                className="w-16 h-16 rounded-full mb-2"
              />
              <h2 className="font-bold">{user.name}</h2>
              <p>{user.email}</p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Users;
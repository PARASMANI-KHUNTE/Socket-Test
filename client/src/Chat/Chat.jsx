import Navbar from "../Components/Navbar";
import Users from "./Users";
import ChatRoom from "./ChatRoom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const BASE_URL = "https://chat-app-server-zwfu.onrender.com";

const Chat = () => {
  const navigate = useNavigate();
  const {chatid,senderId ,receiverId } = useSelector((state) => state.chat);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Use `null` as initial state
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
   
    if (token) {
      const verifyUser = async () => {
        try {
          const response = await axios.post(`${BASE_URL}/api/auth/verify-token`, { token });

          if (response.status === 200) {
            setIsAuthenticated(true);
            const storedChatId = localStorage.getItem("chatid");
            setChatId(storedChatId);
          } else {
            throw new Error("Unauthorized");
          }
        } catch (error) {
          console.error("Token verification failed:", error.message);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          console.log("Session expired. Please log in again.");
          navigate("/login");
        }
      };

      verifyUser();
    } else {
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [navigate]);

  // If authentication is still being determined, show a loading message
  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
        {/* Users Section */}
        <div className="col-span-1 border-r overflow-y-auto">
          <Users />
        </div>

        {/* ChatRoom Section */}
        <div className="col-span-2 flex justify-center items-center">
          {chatid ? <ChatRoom senderId={senderId} receiverId={receiverId} />: <p className="text-center">No Chat Selected</p>}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Chat;

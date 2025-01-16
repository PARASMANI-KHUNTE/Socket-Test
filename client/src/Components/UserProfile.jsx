import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Logout from "../components/AuthComponents/Logout";
import { useNavigate } from "react-router-dom";
const BASE_URL = "http://localhost:5000";

const UserProfile = () => {
  const navigate = useNavigate()
  const { name, email, isAuthenticated } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    if(!isAuthenticated){
      navigate('/login')
    }
    const getUserData = async () => {
      try {
        if (email) {
          const response = await axios.post(`${BASE_URL}/api/user/user`, { email });
          setUserData({
            name: name,
            email: response.data.email,
            ProfileUrl: response.data.ProfileUrl,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, [email]);

  
  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <div className="flex justify-between w-full p-4 border gap-3">
          <div>
            <img
              src={userData.ProfileUrl || "https://via.placeholder.com/80"}
              width={80}
              className="rounded-3xl"
              alt="User Profile"
            />
            <h1 className="font-bold">
              Welcome, <span className="text-blue-500">{userData.name}</span>
            </h1>
            <p className="font-bold">
              Email: <span className="text-blue-500">{userData.email}</span>
            </p>
          </div>
          <Logout />
        </div>
      </div>
    </>
  );
};

export default UserProfile;

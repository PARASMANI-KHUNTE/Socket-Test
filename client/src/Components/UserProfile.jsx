import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Logout from "../components/AuthComponents/Logout";
import { loginUser } from "../redux/actions/userActions"; // Your Redux action to set user data

const BASE_URL = "http://localhost:5000";

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { name, email, isAuthenticated } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get the token from the URL if it exists
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Save the token to localStorage
      localStorage.setItem("token", token);

      // Decode the token to get user details (optional, depends on your backend)
      const decodedUser = parseJwt(token);

      // Dispatch login action to set user in Redux store
      dispatch(loginUser(decodedUser));
    } else if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
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

  // Function to decode JWT (if needed)
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch (e) {
      console.error("Error decoding token", e);
      return null;
    }
  };

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

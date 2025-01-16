import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Logout from "../components/AuthComponents/Logout";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/userSlice"; // Add your action import

const BASE_URL = "http://localhost:5000";

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { name, email, isAuthenticated, token } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Get the token from the URL if it exists
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");

      if (tokenFromUrl) {
        // Save the token to Redux using loginUser
        dispatch(
          login({
            token: tokenFromUrl,
            name: "", // If name is not available, set empty or fetch after successful login
            email: "", // Same as above
          })
        );
        localStorage.setItem("token", tokenFromUrl); // Optionally save token in localStorage
      } else {
        navigate("/login");
      }
    } else {
      // Check if user data is already available
      if (email) {
        // Fetch user data from the server
        const getUserData = async () => {
          try {
            const response = await axios.post(`${BASE_URL}/api/user/user`, { email });

            if (response.data) {
              setUserData({
                name: response.data.name, // Store the name returned from API
                email: response.data.email,
                ProfileUrl: response.data.ProfileUrl,
              });
            } else {
              console.error("No user data returned from API");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
        getUserData();
      } else {
        console.error("Email is missing in the Redux state");
      }
    }
  }, [isAuthenticated, email, dispatch, navigate]);

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

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Logout from "../components/AuthComponents/Logout";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/userSlice"; // Add your action import
import jwtDecode from 'jwt-decode';

const BASE_URL = "http://localhost:5000";

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {name,email, isAuthenticated } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Get the token from the URL if it exists
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      if (tokenFromUrl) {
        const decoded = jwtDecode(tokenFromUrl);
        // Dispatch login with just the token
        dispatch(
          login({
            name : decoded.name,
            email : decoded.email,
            token: tokenFromUrl,
          })
        );
       // Optionally save token in localStorage
      } else {
        navigate("/login");
      }
    }
  }, [isAuthenticated, dispatch, navigate]);

  // Fetch user data only after the email is available in Redux
  useEffect(() => {
    if (email) {
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
    }
  }, [email]); // Only run when email is updated

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
      <div className="flex flex-col justify-center p-4">
        {/* {data.imgurl && <img src={data.imgurl} alt="Profile" />} */}
        <h1>Name - {name}</h1>
        <h1>Email - {email}</h1>
        <p>isAuthenticated - {isAuthenticated ? "yes" : "no"}</p>

      </div>
    </>
  );
};

export default UserProfile;

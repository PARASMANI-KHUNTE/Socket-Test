import { createSlice } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';

// Retrieve token from localStorage
const token = localStorage.getItem('token');
let decoded = null;

// Decode token if it exists
if (token) {
  try {
    decoded = jwtDecode(token);
  } catch (error) {
    console.error("Invalid token provided:", error.message);
    localStorage.removeItem('token'); // Clear invalid token from localStorage
  }
}

// Initial state
const initialState = {
  token: token || '',
  userId: decoded?.userId || '', // Extract userId from the token payload
};

const otpSlice = createSlice({
  name: 'otp', // Slice name
  initialState,
  reducers: {
    setUserId: (state, action) => {
      const { token } = action.payload;
      try {
        const decoded = jwtDecode(token); // Decode the token
        console.log("Decoded Token:", decoded); // Debugging
        state.userId = decoded.userId || ''; // Extract userId from token
        console.log("user id - ",state.userId)
        state.token = token; // Save token
        localStorage.setItem('token', token); // Persist token in localStorage
      } catch (error) {
        console.error("Failed to decode token:", error.message);
      }
    },
    clearUserId: (state) => {
      state.userId = ''; // Clear userId
      state.token = ''; // Clear token
      localStorage.removeItem('token'); // Remove token from localStorage
    },
  },
});

export const { setUserId, clearUserId } = otpSlice.actions;
export default otpSlice.reducer;
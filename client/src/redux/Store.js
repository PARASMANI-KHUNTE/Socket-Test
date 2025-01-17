import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // If you have a separate user slice
import otpReducer from './otpSlice';
import chatReducer from './chatSlice'

const store = configureStore({
  reducer: {
    user: userReducer, // Manages user-related state
    otp: otpReducer,   // Manages OTP-related state
    chat : chatReducer

  },
});

export default store;
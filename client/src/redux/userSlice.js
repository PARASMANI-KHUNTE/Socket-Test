import { createSlice } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

const token = localStorage.getItem('token'); // Retrieve token from localStorage
let decoded = null;

if (token) {
  try {
    decoded = jwtDecode(token); // Decode only if the token is valid
  } catch (error) {
    console.error("Invalid token provided:", error.message);
    // Handle invalid token (e.g., clear it from storage)
    localStorage.removeItem('token');
  }
}

const initialState = {
  name: decoded?.payload?.name || '',
  email: decoded?.payload?.email || '',
  token: token || '',
  isAuthenticated: !!token && !!decoded,
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token } = action.payload;
      // Decode token to extract payload
      const decoded = jwtDecode(token);

      state.name = decoded.payload.name;
      state.email = decoded.payload.email;
      state.token = token;
      state.isAuthenticated = true;

      // Store token in localStorage
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.name = '';
      state.email = '';
      state.token = '';
      state.isAuthenticated = false;

      // Remove token from localStorage
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

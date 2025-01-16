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
  name: decoded?.name || '', // Adjusted to use `decoded` directly
  email: decoded?.email || '', // Adjusted to use `decoded` directly
  token: token || '',
  isAuthenticated: !!token && !!decoded,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token } = action.payload;
      try {
        // Decode token to extract payload
        const decoded = jwtDecode(token);

        state.name = decoded.name; // Adjusted based on token structure
        state.email = decoded.email; // Adjusted based on token structure
        state.token = token;
        state.isAuthenticated = true;

        // Store token in localStorage
        localStorage.setItem('token', token);
      } catch (error) {
        console.error("Invalid token provided during login:", error.message);
        state.isAuthenticated = false;
      }
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

import { createSlice } from '@reduxjs/toolkit';



const initialState = {
  name: '', // Adjusted to use `decoded` directly
  email:  '', // Adjusted to use `decoded` directly
  token: '',
  isAuthenticated: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const {name,email, token } = action.payload;
      try {
        // Check if the decoded token contains email and name
        state.name = name || ''; // Make sure `decoded.name` exists
        state.email = email || ''; // Make sure `decoded.email` exists
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

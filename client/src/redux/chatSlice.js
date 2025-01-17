import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatid: localStorage.getItem('chatid') || '',  // Load from localStorage
  senderId: '',
  receiverId: '',  // Fixed spelling
  message: ''
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    CreateChat: (state, action) => {
      const { chatid, senderId, receiverId, message } = action.payload;
      try {
        state.chatid = chatid || ''; 
        state.senderId = senderId || ''; 
        state.receiverId = receiverId || ''; // Fixed spelling
        state.message = message || '';

        // Update localStorage whenever chat is created
        localStorage.setItem('chatid', chatid || '');
      } catch (error) {
        console.error("Unable to create chat room", error.message);
      }
    },
    CloseChat: (state) => {
      state.chatid = ''; 
      state.senderId = ''; 
      state.receiverId = ''; // Fixed spelling
      state.message = '';

      // Remove chatid from localStorage
      localStorage.removeItem('chatid');
    },
    UpdateMessage: (state, action) => {
      const { message } = action.payload;
      state.message = message || '';
    },
  },
});

export const { CreateChat, CloseChat, UpdateMessage } = chatSlice.actions;
export default chatSlice.reducer;

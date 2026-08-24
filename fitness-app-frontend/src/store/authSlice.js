import { createSlice } from '@reduxjs/toolkit';

const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
const savedUserId = localStorage.getItem('userId');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    token: localStorage.getItem('token') || null,
    userId: savedUserId || (savedUser ? (savedUser.id || savedUser.userId) : null)
  },
  reducers: {
    setCredentials: (state, action) => {
      const user = action.payload.user;
      const token = action.payload.token || null;
      const userId = user?.id || user?.userId || action.payload.userId || null;

      state.user = user;
      state.token = token;
      state.userId = userId;

      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      if (userId) {
        localStorage.setItem('userId', userId);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
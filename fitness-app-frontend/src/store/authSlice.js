import { createSlice } from '@reduxjs/toolkit'

const defaultUser = {
  name: 'Fitness User',
  email: 'user@fitness.com',
  sub: 'user-default-1'
};

const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
const savedUserId = localStorage.getItem('userId');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser || defaultUser,
    token: localStorage.getItem('token') || null,
    userId: savedUserId || (savedUser ? savedUser.sub : defaultUser.sub)
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.userId = action.payload.user?.sub || action.payload.userId || defaultUser.sub;

      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('userId', state.userId);
    },
    logout: (state) => {
      state.user = defaultUser;
      state.token = null;
      state.userId = defaultUser.sub;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  userName: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  userName: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ userName: string }>) => {
      state.isAuthenticated = true;
      state.userName = action.payload.userName;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userName = null;
    },
    setUserData: (state, action: PayloadAction<{ userName: string }>) => {
      state.userName = action.payload.userName;
    },
  },
});

export const { login, logout, setUserData } = userSlice.actions;
export default userSlice.reducer;

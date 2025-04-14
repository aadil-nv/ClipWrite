import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  name: string | null;
  email: string | null;
  mobile: string | null;
  dob: string | null;
  preferences: string[] | null;
  image: string | null; // added image field
}

interface UserState {
  isAuthenticated: boolean;
  userId: string | null;
  userData: UserData;
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: null,
  userData: {
    name: null,
    email: null,
    mobile: null,
    dob: null,
    preferences: null,
    image: null, // added initial value
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ userId: string; userData: UserData }>) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.userData = {
        name: null,
        email: null,
        mobile: null,
        dob: null,
        preferences: null,
        image: null,
      };
    },
    updateUserData: (state, action: PayloadAction<{ userData: Partial<UserData> }>) => {
      state.userData = {
        ...state.userData,
        ...action.payload.userData,
      };
    },
  },
});

export const { login, logout, updateUserData } = userSlice.actions;
export default userSlice.reducer;

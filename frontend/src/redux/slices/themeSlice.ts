import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  activeMenu: boolean;
  themeMode: 'light' | 'dark';
}

const initialState: ThemeState = {
  activeMenu: true,
  themeMode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    activeMenu: (state) => {
      state.activeMenu = !state.activeMenu;
    },
    setActiveMenu: (state, action: PayloadAction<boolean>) => {
      state.activeMenu = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themeMode = action.payload;
    },
  },
});

export const { activeMenu, setActiveMenu, setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;

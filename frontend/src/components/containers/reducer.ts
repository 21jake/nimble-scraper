import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IContainerState {
  sidebarShow: boolean;
  asideShow: boolean;
  darkMode: boolean;
}

const initialState: IContainerState = {
  sidebarShow: true,
  asideShow: false,
  darkMode: false,
};

const containerSlice = createSlice({
  name: 'containerSlice',
  initialState,
  reducers: {
    toggleSidebar: (state, { payload }: PayloadAction<boolean>) => {
      state.sidebarShow = payload;
    },
    toggleAside: (state, { payload }: PayloadAction<boolean>) => {
      state.asideShow = payload;
    },
    toggleDarkMode: (state, { payload }: PayloadAction<boolean>) => {
      state.darkMode = payload;
    },
  },
});

export default containerSlice.reducer;
export const { toggleSidebar, toggleAside, toggleDarkMode } = containerSlice.actions;

import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const folderProfilesSlice = createSlice({
  name: "folderprofiles",
  initialState,
  reducers: {
    storeFolderProfiles(state, action) {
      state = action.payload;
      return state;
    },
  },
});

const portalMenuStatus = false;
const portalMenuStatusSlice = createSlice({
  name: "portalmenu",
  initialState: portalMenuStatus,
  reducers: {
    storePortalMenuStatus(state, action) {
      state = action.payload;
      return state;
    },
  },
});

const logoutMenuStatus = false;
const logoutMenuStatusSlice = createSlice({
  name: "logoutmenu",
  initialState: logoutMenuStatus,
  reducers: {
    storeLogoutMenuStatus(state, action) {
      state = action.payload;
      return state;
    },
  },
});

export const { storeFolderProfiles } = folderProfilesSlice.actions;
export const { storePortalMenuStatus } = portalMenuStatusSlice.actions;
export const { storeLogoutMenuStatus } = logoutMenuStatusSlice.actions;

export const folderProfilesReducer = folderProfilesSlice.reducer;
export const portalMenuStatusReducer = portalMenuStatusSlice.reducer;
export const logoutMenuStatusReducer = logoutMenuStatusSlice.reducer;

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

const courseVideosSlice = createSlice({
  name: "coursevideos",
  initialState,
  reducers: {
    storeCourseVideos(state, action) {
      state = action.payload;
      return state;
    },
  },
});

const courseDocumentsSlice = createSlice({
  name: "coursedocuments",
  initialState,
  reducers: {
    storeCourseDocuments(state, action) {
      state = action.payload;
      return state;
    },
  },
});

const trainerId = null;
const trainerIdSlice = createSlice({
  name: "trainerid",
  initialState: trainerId,
  reducers: {
    storeTrainerId(state, action) {
      state = action.payload;
      return state;
    },
  },
});

export const { storeFolderProfiles } = folderProfilesSlice.actions;
export const { storePortalMenuStatus } = portalMenuStatusSlice.actions;
export const { storeLogoutMenuStatus } = logoutMenuStatusSlice.actions;
export const { storeCourseVideos } = courseVideosSlice.actions;
export const { storeTrainerId } = trainerIdSlice.actions;
export const { storeCourseDocuments } = courseDocumentsSlice.actions;

export const folderProfilesReducer = folderProfilesSlice.reducer;
export const portalMenuStatusReducer = portalMenuStatusSlice.reducer;
export const logoutMenuStatusReducer = logoutMenuStatusSlice.reducer;
export const courseVideosReducer = courseVideosSlice.reducer;
export const trainerIdReducer = trainerIdSlice.reducer;
export const courseDocumentsReducer = courseDocumentsSlice.reducer;

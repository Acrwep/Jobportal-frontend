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

const folderFiltersSlice = createSlice({
  name: "folderfilters",
  initialState,
  reducers: {
    storeFolderFilters(state, action) {
      state = action.payload;
      return state;
    },
  },
});

export const { storeFolderProfiles } = folderProfilesSlice.actions;
export const { storeFolderFilters } = folderFiltersSlice.actions;

export const folderProfilesReducer = folderProfilesSlice.reducer;
export const folderFiltersReducer = folderFiltersSlice.reducer;

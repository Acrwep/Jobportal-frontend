import { configureStore } from "@reduxjs/toolkit";
import { folderProfilesReducer, folderFiltersReducer } from "./slice";

export const store = configureStore({
  devTools: true,
  reducer: {
    folderprofiles: folderProfilesReducer,
    folderfilters: folderFiltersReducer,
  },
});

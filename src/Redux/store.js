import { configureStore } from "@reduxjs/toolkit";
import { folderProfilesReducer } from "./slice";

export const store = configureStore({
  devTools: true,
  reducer: {
    folderprofiles: folderProfilesReducer,
  },
});

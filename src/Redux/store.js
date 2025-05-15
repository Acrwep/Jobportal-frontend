import { configureStore } from "@reduxjs/toolkit";
import {
  folderProfilesReducer,
  portalMenuStatusReducer,
  logoutMenuStatusReducer,
  courseVideosReducer,
} from "./slice";

export const store = configureStore({
  devTools: true,
  reducer: {
    folderprofiles: folderProfilesReducer,
    portalmenu: portalMenuStatusReducer,
    logoutmenu: logoutMenuStatusReducer,
    coursevideos: courseVideosReducer,
  },
});

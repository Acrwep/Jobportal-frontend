import { configureStore } from "@reduxjs/toolkit";
import {
  currentPortalNameReducer,
  folderProfilesReducer,
  portalMenuStatusReducer,
  logoutMenuStatusReducer,
  courseVideosReducer,
  courseDocumentsReducer,
  trainerIdReducer,
  companyIdReducer,
  trainersListReducer,
  companyListReducer,
  companyVideosReducer,
  companyDocumentsReducer,
  notificationCountReducer,
} from "./slice";

export const store = configureStore({
  devTools: true,
  reducer: {
    currentportalname: currentPortalNameReducer,
    folderprofiles: folderProfilesReducer,
    portalmenu: portalMenuStatusReducer,
    logoutmenu: logoutMenuStatusReducer,
    coursevideos: courseVideosReducer,
    coursedocuments: courseDocumentsReducer,
    trainerid: trainerIdReducer,
    companyid: companyIdReducer,
    trainerslist: trainersListReducer,
    companylist: companyListReducer,
    companyvideos: companyVideosReducer,
    companydocuments: companyDocumentsReducer,
    notificationcount: notificationCountReducer,
  },
});

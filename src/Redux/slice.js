import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const currentPortalName = "";
const currentPortalNameSlice = createSlice({
  name: "currentportalname",
  initialState: currentPortalName,
  reducers: {
    storeCurrentPortalName(state, action) {
      state = action.payload;
      return state;
    },
  },
});

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

const placementRegisterStatus = false;
const placementRegisterStatusSlice = createSlice({
  name: "placementregisterstatus",
  initialState: placementRegisterStatus,
  reducers: {
    storePlacementRegisterStatus(state, action) {
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

const companyVideosSlice = createSlice({
  name: "companyvideos",
  initialState,
  reducers: {
    storeCompanyVideos(state, action) {
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

const companyDocumentsSlice = createSlice({
  name: "companydocuments",
  initialState,
  reducers: {
    storeCompanyDocuments(state, action) {
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

const companyId = null;
const companyIdSlice = createSlice({
  name: "companyid",
  initialState: companyId,
  reducers: {
    storeCompanyId(state, action) {
      state = action.payload;
      return state;
    },
  },
});

const trainersListSlice = createSlice({
  name: "trainerslist",
  initialState,
  reducers: {
    storeTrainersList(state, action) {
      state = action.payload;
      return state;
    },
  },
});

const companyListSlice = createSlice({
  name: "companylist",
  initialState,
  reducers: {
    storeCompanyList(state, action) {
      state = action.payload;
      return state;
    },
  },
});

const notificationCount = null;
const notificationCountSlice = createSlice({
  name: "notificationcount",
  initialState: notificationCount,
  reducers: {
    storeNotificationCount(state, action) {
      state = action.payload;
      return state;
    },
  },
});

export const { storeCurrentPortalName } = currentPortalNameSlice.actions;
export const { storeFolderProfiles } = folderProfilesSlice.actions;
export const { storePortalMenuStatus } = portalMenuStatusSlice.actions;
export const { storeLogoutMenuStatus } = logoutMenuStatusSlice.actions;
export const { storePlacementRegisterStatus } =
  placementRegisterStatusSlice.actions;
export const { storeCourseVideos } = courseVideosSlice.actions;
export const { storeTrainerId } = trainerIdSlice.actions;
export const { storeCourseDocuments } = courseDocumentsSlice.actions;
export const { storeCompanyId } = companyIdSlice.actions;
export const { storeTrainersList } = trainersListSlice.actions;
export const { storeCompanyList } = companyListSlice.actions;
export const { storeCompanyVideos } = companyVideosSlice.actions;
export const { storeCompanyDocuments } = companyDocumentsSlice.actions;
export const { storeNotificationCount } = notificationCountSlice.actions;

export const currentPortalNameReducer = currentPortalNameSlice.reducer;
export const folderProfilesReducer = folderProfilesSlice.reducer;
export const portalMenuStatusReducer = portalMenuStatusSlice.reducer;
export const logoutMenuStatusReducer = logoutMenuStatusSlice.reducer;
export const placementRegisterStatusReducer =
  placementRegisterStatusSlice.reducer;
export const courseVideosReducer = courseVideosSlice.reducer;
export const trainerIdReducer = trainerIdSlice.reducer;
export const courseDocumentsReducer = courseDocumentsSlice.reducer;
export const companyIdReducer = companyIdSlice.reducer;
export const trainersListReducer = trainersListSlice.reducer;
export const companyListReducer = companyListSlice.reducer;
export const companyVideosReducer = companyVideosSlice.reducer;
export const companyDocumentsReducer = companyDocumentsSlice.reducer;
export const notificationCountReducer = notificationCountSlice.reducer;

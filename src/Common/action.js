import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const AccessToken = localStorage.getItem("Accesstoken");
    console.log("Accesstoken", AccessToken);
    if (AccessToken) {
      config.headers.Authorization = `Bearer ${AccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const adminLogin = async (loginPayload) => {
  try {
    const response = await api.post("/api/adminLogin", loginPayload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createStudent = async (studentPayload) => {
  try {
    const response = await api.post("/api/createStudent", studentPayload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getStudents = async () => {
  try {
    const response = await api.get("/api/getStudents");
    return response;
  } catch (error) {
    throw error;
  }
};

export const candidateRegistration = async (payload) => {
  try {
    const response = await api.post("/api/registration", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCandidates = async (payload) => {
  try {
    const response = await api.get("/api/getCandidates", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCandidateById = async (candidateId) => {
  try {
    const response = await api.get(`/api/getCandidateById?id=${candidateId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMultipleCandidatesById = async (payload) => {
  try {
    const response = await api.get("/api/getMultipleCandidatesById", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSkills = async (payload) => {
  try {
    const response = await api.get("/api/getSkills", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addToFavorite = async (payload) => {
  try {
    const response = await api.post("/api/createFavorites", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteFavorite = async (payload) => {
  try {
    const response = await api.delete("/api/removeFavorites", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getFavorites = async () => {
  try {
    const response = await api.get("/api/getFavorites");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getFavoriteCandidates = async (payload) => {
  try {
    const response = await api.get("/api/getFavoriteCandidates", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const createFolder = async (payload) => {
  try {
    const response = await api.post("/api/createfolder", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateFolder = async (payload) => {
  try {
    const response = await api.put("/api/updatefolder", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getFolders = async (userId) => {
  try {
    const response = await api.get(`/api/getfolders?userId=${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

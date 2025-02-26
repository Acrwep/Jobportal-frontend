import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
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

import axios from "axios";
import { Modal } from "antd";
import "./commonstyles.css";

let isModalVisible = false;
let modalInstance = null;

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
      const expired = isTokenExpired(AccessToken);
      if (expired === true) {
        ShowModal();
        return Promise.reject(new Error("Token is expired"));
      }
      config.headers.Authorization = `Bearer ${AccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleSessionModal = () => {
  const event = new Event("tokenExpireUpdated");
  window.dispatchEvent(event);
  if (modalInstance) {
    modalInstance.destroy(); // Manually close the modal
    modalInstance = null;
  }
  isModalVisible = false;
};

const ShowModal = () => {
  if (isModalVisible) {
    return; // Don't open a new modal if one is already visible
  }

  isModalVisible = true;

  modalInstance = Modal.warning({
    title: "Session Expired",
    centered: true,
    content: "Your session has expired. Please log in again.",
    onOk() {
      handleSessionModal();
    },
    onCancel() {
      handleSessionModal();
    },
    onClose() {
      handleSessionModal();
    },
    footer: [
      <div className="sessionmodal_okbuttonContainer">
        <button className="sessionmodal_okbutton" onClick={handleSessionModal}>
          OK
        </button>
      </div>,
    ],
  });

  return;
};

const isTokenExpired = (token) => {
  if (!token) return true; // No token means it's "expired"

  try {
    // split the token into parts
    const payloadBase64 = token.split(".")[1];

    // decode the base64 payload
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // get the current time in seconds
    const currentTime = Date.now() / 1000;

    // check if the token has expired
    return decodedPayload.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

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

export const searchByKeyword = async (payload) => {
  try {
    const response = await api.get("/api/searchByKeyword", {
      params: payload,
    });
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

export const deleteFolder = async (folderId) => {
  try {
    const response = await api.delete(`/api/deletefolder?folderId=${folderId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateEligibleCandidate = async (payload) => {
  try {
    const response = await api.put("/api/updateEligibleCandidate", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

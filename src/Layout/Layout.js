import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Login from "../Login/Login";
import Admin from "../Admin/Admin";
import FolderManagement from "../FolderManagement/FolderManagement";
import CandidateRegister from "../CandidateRegister/CandidateRegister";
import Register from "../Register/Register";
import FolderProfiles from "../FolderManagement/Folderprofiles";
import Favorites from "../Admin/Favorites";
import Profile from "../Profile/Profile";
import AdminSearch from "../Admin/AdminSearch";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPages, setShowPages] = useState(false);

  useEffect(() => {
    const handleStorageUpdate = () => {
      console.log("path", location.pathname);
      const accessToken = localStorage.getItem("Accesstoken");
      if (accessToken) {
        setShowPages(true);
        if (location.pathname === "/") {
          navigate("/search");
        }
      } else {
        if (location.pathname === "/register") {
          navigate("/register");
          setShowPages(false);
        } else {
          navigate("/login");
          setShowPages(false);
        }
      }
    };

    window.addEventListener("localStorageUpdated", handleStorageUpdate);

    // Initial load
    handleStorageUpdate();

    return () => {
      window.removeEventListener("localStorageUpdated", handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    //handle navigate to login page when token expire
    const handleTokenExpire = () => {
      navigate("/login");
    };

    window.addEventListener("tokenExpireUpdated", handleTokenExpire);

    // Initial load
    // handleTokenExpire();

    return () => {
      window.removeEventListener("tokenExpireUpdated", handleTokenExpire);
    };
  }, []);

  return (
    <div>
      {location.pathname === "/login" ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : location.pathname === "/register" ? (
        <Routes>
          <Route path="/register" element={<CandidateRegister />} />
        </Routes>
      ) : showPages === true ? (
        <Routes>
          <Route path="/profiles" element={<Admin />} />
          <Route path="/search" element={<AdminSearch />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/foldermanagement" element={<FolderManagement />} />
          <Route path="/folderprofiles" element={<FolderProfiles />} />
          <Route path="/profiledetails" element={<Profile />} />

          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<Navigate to="/search" />} />
        </Routes>
      ) : (
        ""
      )}
    </div>
  );
};
export default Layout;

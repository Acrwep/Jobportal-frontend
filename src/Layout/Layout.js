import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
        navigate(location.pathname);
      } else {
        if (location.pathname === "/") {
          navigate("/");
          setShowPages(false);
        } else if (location.pathname === "/register") {
          navigate("/register");
          setShowPages(false);
        } else if (location.pathname === "/search") {
          navigate("/search");
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
  return (
    <div>
      {location.pathname === "/" ? (
        <Routes>
          <Route path="/" element={<CandidateRegister />} />
        </Routes>
      ) : location.pathname === "/login" ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : location.pathname === "/register" ? (
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : location.pathname === "/search" ? (
        <Routes>
          <Route path="/search" element={<AdminSearch />} />
        </Routes>
      ) : showPages === true ? (
        <Routes>
          <Route path="/admin" element={<Admin />} />
          {/* <Route path="/search" element={<AdminSearch />} /> */}
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/foldermanagement" element={<FolderManagement />} />
          <Route path="/folderprofiles" element={<FolderProfiles />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      ) : (
        ""
      )}
    </div>
  );
};
export default Layout;

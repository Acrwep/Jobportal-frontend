import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "../Login/Login";
import StudentRegister from "../StudentsRegister/StudentsRegister";
import Admin from "../Admin/Admin";
import CandidateRegister from "../CandidateRegister/CandidateRegister";
import Register from "../Register/Register";

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
        } else if (location.pathname === "/register") {
          navigate("/register");
        } else {
          navigate("/login");
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
          <Route path="/" element={<StudentRegister />} />
        </Routes>
      ) : location.pathname === "/login" ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : location.pathname === "/register" ? (
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : showPages === true ? (
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      ) : (
        ""
      )}
    </div>
  );
};
export default Layout;

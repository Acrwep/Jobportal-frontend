import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Avatar, Button } from "antd";
import { AiOutlineLogout } from "react-icons/ai";
import Actelogo from "../images/acte-logo.png";
import "./styles.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");

  useEffect(() => {
    const loginDetails = localStorage.getItem("loginDetails");
    const convertAsJson = JSON.parse(loginDetails);
    console.log("header login details", JSON.parse(loginDetails));
    setName(convertAsJson.name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin_headerContainer">
      <Row>
        <Col span={12} style={{ display: "flex", alignItems: "center" }}>
          <div className="admin_headerlogoContainer">
            <div style={{ marginRight: "70px" }}>
              <img
                src={Actelogo}
                className="registration_actelogo"
                onClick={() => navigate("/admin")}
              />
            </div>
            <div style={{ gap: 40, display: "flex" }}>
              <p
                className={
                  location.pathname === "/favorites"
                    ? "admin_activeheaderheadings"
                    : "admin_headerheadings"
                }
                onClick={() => navigate("/favorites")}
              >
                Favorites
              </p>
              <p
                onClick={() => navigate("/foldermanagement")}
                className={
                  location.pathname === "/foldermanagement"
                    ? "admin_activeheaderheadings"
                    : "admin_headerheadings"
                }
              >
                Folders
              </p>
            </div>
          </div>
        </Col>
        <Col span={12} className="registration_headertextContainer">
          <Avatar size={40} className="admin_headeravatar">
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <Button className="admin_headerlogoutbutton" onClick={handleLogout}>
            <AiOutlineLogout size={16} /> Logout
          </Button>
        </Col>
      </Row>
    </div>
  );
}

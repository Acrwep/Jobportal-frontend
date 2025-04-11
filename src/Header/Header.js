import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Avatar, Button, Modal } from "antd";
import { AiOutlineLogout } from "react-icons/ai";
import Actelogo from "../images/acte-logo.png";
import "./styles.css";
import { CommonToaster } from "../Common/CommonToaster";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loginDetails = localStorage.getItem("loginDetails");
    const convertAsJson = JSON.parse(loginDetails);
    console.log("header login details", JSON.parse(loginDetails));
    setName(convertAsJson.name);
  }, []);

  const handleProfiles = () => {
    const keyword = localStorage.getItem("searchKeyword");
    const convertJson = JSON.parse(keyword);
    console.log("search keyword", convertJson);
    if (convertJson === null) {
      navigate("/search");
      CommonToaster("Enter keyword and search profiles");
    } else {
      navigate("/profiles");
    }
  };

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
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/search")}
              />
            </div>
            <div style={{ gap: 40, display: "flex" }}>
              <p
                className={
                  location.pathname === "/profiles"
                    ? "admin_activeheaderheadings"
                    : "admin_headerheadings"
                }
                onClick={handleProfiles}
              >
                Profiles
              </p>
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
          <Button
            className="admin_headerlogoutbutton"
            onClick={() => setIsModalOpen(true)}
          >
            <AiOutlineLogout size={16} /> Logout
          </Button>
        </Col>
      </Row>

      <Modal
        open={isModalOpen}
        onOk={handleLogout}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={[
          <Button
            className="admin_headermodalcancelbutton"
            onClick={() => setIsModalOpen(false)}
            style={{ marginRight: "16px" }}
          >
            Cancel
          </Button>,
          <button
            className="admin_headermodalsubmitbutton"
            onClick={handleLogout}
          >
            Ok
          </button>,
        ]}
        width="34%"
        closeIcon={false}
      >
        <div style={{ marginTop: "6px" }}>
          <p style={{ fontWeight: 500, fontSize: "16px" }}>
            Are you sure you want to logout?
          </p>
        </div>
      </Modal>
    </div>
  );
}

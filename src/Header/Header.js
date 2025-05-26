import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Avatar, Button, Modal, Divider } from "antd";
import { AiOutlineLogout } from "react-icons/ai";
import Actelogo from "../images/acte-logo.png";
import { TbGridDots } from "react-icons/tb";
import Placement from "../images/hiring-black.png";
import Interview from "../images/interview-black.png";
import "./styles.css";
import { CommonToaster } from "../Common/CommonToaster";
import { MdOutlineLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { storeLogoutMenuStatus, storePortalMenuStatus } from "../Redux/slice";
import PortalMenu from "../Common/PortalMenu";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const portalMenu = useSelector((state) => state.portalmenu);
  const logoutMenu = useSelector((state) => state.logoutmenu);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loginDetails = localStorage.getItem("loginDetails");
    const convertAsJson = JSON.parse(loginDetails);
    console.log("header login details", JSON.parse(loginDetails));
    if (convertAsJson) {
      setUserName(convertAsJson.name);
      setUserEmail(convertAsJson.email);
    } else {
      setUserName("");
      setUserEmail("");
    }
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

  const handlePortalMenu = () => {
    console.log(portalMenu);
    dispatch(storePortalMenuStatus(!portalMenu));
    dispatch(storeLogoutMenuStatus(false));
  };

  const handleLogoutMenu = () => {
    dispatch(storePortalMenuStatus(false));
    dispatch(storeLogoutMenuStatus(!logoutMenu));
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    dispatch(storePortalMenuStatus(false));
    dispatch(storeLogoutMenuStatus(false));
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
          <PortalMenu />
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
            No
          </Button>,
          <button
            className="admin_headermodalsubmitbutton"
            onClick={handleLogout}
          >
            Yes
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

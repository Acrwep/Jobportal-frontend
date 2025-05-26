import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Placement from "../images/hiring-black.png";
import LMS from "../images/study.png";
import Interview from "../images/meeting.png";
import { useDispatch, useSelector } from "react-redux";
import { storeLogoutMenuStatus, storePortalMenuStatus } from "../Redux/slice";
import { Avatar, Divider } from "antd";
import { TbGridDots } from "react-icons/tb";
import { FaRegCheckCircle } from "react-icons/fa";
import { PiWarningCircleBold } from "react-icons/pi";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOutlineLogout } from "react-icons/md";
import "./commonstyles.css";

export default function PortalMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const portalMenu = useSelector((state) => state.portalmenu);
  const logoutMenu = useSelector((state) => state.logoutmenu);
  const notificationCount = useSelector((state) => state.notificationcount);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [roleId, setRoleId] = useState(null);
  const [placementStatus, setPlacementStatus] = useState(false);

  useEffect(() => {
    const loginDetails = localStorage.getItem("loginDetails");
    const loginDetailsJson = JSON.parse(loginDetails);
    const selectedCourseName = localStorage.getItem("selectedCourseName");
    console.log("selected course name", selectedCourseName);

    if (loginDetailsJson) {
      setUserName(loginDetailsJson.name);
      setUserEmail(loginDetailsJson.email);
      setRoleId(loginDetailsJson.role_id);
    }
  }, []);

  //header functions
  const handlePortalMenu = () => {
    console.log(portalMenu);
    dispatch(storePortalMenuStatus(!portalMenu));
    dispatch(storeLogoutMenuStatus(false));
  };

  const handlePlacementButton = () => {
    dispatch(storePortalMenuStatus(false));
    dispatch(storeLogoutMenuStatus(false));
    if (roleId === 3) {
      navigate("/placementregister");
    } else {
      navigate("/search");
    }
  };

  const handleLmsClick = () => {
    dispatch(storePortalMenuStatus(false));
    dispatch(storeLogoutMenuStatus(false));
    if (roleId === 3) {
      const defaultCourseName = localStorage.getItem("defaultCourseName");
      localStorage.setItem("selectedCourseName", defaultCourseName);

      const defaultCourseId = localStorage.getItem("defaultCourseId");
      localStorage.setItem("selectedCourseId", defaultCourseId);
      navigate(`/courses`);
    } else {
      navigate("/question-upload");
    }
  };

  const handleInterviewClick = () => {
    dispatch(storePortalMenuStatus(false));
    dispatch(storeLogoutMenuStatus(false));
    if (roleId === 3) {
      navigate(`/assessments`);
    } else {
      navigate("/question-upload");
    }
  };

  const handleLogoutMenu = () => {
    dispatch(storePortalMenuStatus(false));
    dispatch(storeLogoutMenuStatus(!logoutMenu));
  };

  const handleLogout = () => {
    dispatch(storePortalMenuStatus(false));
    dispatch(storeLogoutMenuStatus(false));
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          position: "relative",
        }}
      >
        <button
          onClick={handlePortalMenu}
          className="common_portalmenu_headermenubutton"
        >
          <TbGridDots size={20} />
          {notificationCount >= 1 && roleId === 3 ? (
            <div className="common_portalmenu_notificationCount_container">
              <p>{notificationCount}</p>
            </div>
          ) : (
            ""
          )}
        </button>

        <button
          className="common_portal_headeravatarbutton"
          onClick={handleLogoutMenu}
        >
          <Avatar size={34} className="common_portalmenu_avatar">
            {userName ? userName.charAt(0).toUpperCase() : ""}
          </Avatar>
        </button>
      </div>

      <div
        className={
          location.pathname === "/placementregister"
            ? "common_portalmenu_placementreg_menuContainer"
            : "common_portalmenu_menuContainer"
        }
        style={{ display: portalMenu ? "block" : "none" }}
      >
        <div className="common_portalmenu_menuInnerContainer">
          <div
            className="common_portalmenu_menuItemContainer"
            onClick={handlePlacementButton}
          >
            <img src={Placement} style={{ width: "34px" }} />
            <p className="common_portalmenu_menuname">
              Placement
              <br />
              Portal
            </p>

            {roleId === 3 && (
              <>
                {placementStatus === true ? (
                  <FaRegCheckCircle
                    color="#52c41a"
                    className="common_portalmenu_placementStatusIcon"
                  />
                ) : (
                  <PiWarningCircleBold
                    color="#faad14"
                    className="common_portalmenu_placementStatusIcon"
                  />
                )}
              </>
            )}
          </div>

          <div
            className="portallayout_menuItemContainer"
            style={{ width: "84px" }}
            onClick={handleLmsClick}
          >
            <img src={LMS} style={{ width: "34px" }} />
            <p className="portallayout_menuname">
              LMS <br />
              Portal
            </p>
          </div>

          <div
            className="common_portalmenu_menuItemContainer"
            onClick={handleInterviewClick}
          >
            <img src={Interview} className="common_portalmenu_menuImage" />
            <p className="common_portalmenu_menunametwo">
              Interview
              <br />
              Portal
            </p>
            {notificationCount >= 1 && roleId === 3 ? (
              <div className="commonportalmenu_interviewportal_notificationCount_container">
                <p>{notificationCount}</p>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div
        className={
          location.pathname === "/placementregister"
            ? "common_portalmenu_placementreg_logoutmenuContainer"
            : "common_portalmenu_logoutmenuContainer"
        }
        style={{ display: logoutMenu ? "block" : "none" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "22px 22px 0px",
          }}
        >
          <Avatar size={42} className="common_portalmenu_avatar">
            {userName ? userName.charAt(0).toUpperCase() : ""}
          </Avatar>
        </div>
        <div
          style={{
            padding: "0px 22px 0px",
          }}
        >
          <p className="common_portalmenu_logoutmenuemail">
            {userEmail ? userEmail : ""}
          </p>
          <p className="common_portalmenu_logoutmenu_username">
            {userName ? userName : ""}
          </p>
        </div>
        <Divider className="common_portalmenu_logoutmenu_divider" />

        <div
          className="common_portalmenu_logoutmenu_buttonContainer"
          onClick={handleLogout}
        >
          <button className="common_portalmenu_logoutmenu_button">
            <MdOutlineLogout size={17} style={{ marginRight: "12px" }} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

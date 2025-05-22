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
import LmsLogin from "../Login/LmsLogin";
import Portal from "../Portal/Portal";
import { RiMenuUnfold2Fill, RiMenuUnfoldFill } from "react-icons/ri";
import SideMenu from "./SideMenu";
import QuestionUpload from "../QuestionUpload/QuestionUpload";
import "./styles.css";
import { Button, Layout, Avatar, theme, Divider } from "antd";
import OnlineTest from "../Interview/OnlineTest";
import { TbGridDots } from "react-icons/tb";
import Placement from "../images/hiring-black.png";
import Interview from "../images/interview-black.png";
import { MdOutlineLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { storeLogoutMenuStatus, storePortalMenuStatus } from "../Redux/slice";
import TestInvite from "../Interview/TestInvite";
import TestExpired from "../Interview/TestExpired";
import Result from "../Interview/Result";
import Users from "../Users/Users";
import Candidates from "../Users/Candidates";
import Courses from "../Courses/Courses";
import SidebarLogo from "../images/old-acte-logo.png";
import { getCourses } from "../Common/action";
import StudentResult from "../StudentResult/StudentResult";
const { Header, Sider, Content } = Layout;

const MainSideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const portalMenu = useSelector((state) => state.portalmenu);
  const logoutMenu = useSelector((state) => state.logoutmenu);

  const [showPages, setShowPages] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // const handleStorageUpdate = () => {
    console.log("path", location.pathname);
    const accessToken = localStorage.getItem("Accesstoken");
    const loginDetails = localStorage.getItem("loginDetails");
    const loginDetailsJson = JSON.parse(loginDetails);
    const selectedCourseName = localStorage.getItem("selectedCourseName");

    if (loginDetailsJson) {
      setUserName(loginDetailsJson.name);
      setUserEmail(loginDetailsJson.email);
    }

    if (accessToken) {
      setShowSideBar(true);
      if (location.pathname === "/") {
        navigate("/question-upload");
        setShowPages(false);
        setShowSideBar(true);
      }

      if (location.pathname === "/search") {
        navigate("/search");
        setShowPages(true);
        setShowSideBar(false);
      }

      if (location.pathname === "/profiles") {
        navigate("/profiles");
        setShowPages(true);
        setShowSideBar(false);
      }

      if (location.pathname === "/profiledetails") {
        navigate("/profiledetails");
        setShowPages(true);
        setShowSideBar(false);
      }

      if (location.pathname === "/favorites") {
        navigate("/favorites");
        setShowPages(true);
        setShowSideBar(false);
      }

      if (location.pathname === "/foldermanagement") {
        navigate("/foldermanagement");
        setShowPages(true);
        setShowSideBar(false);
      }

      if (location.pathname === "/folderprofiles") {
        navigate("/folderprofiles");
        setShowPages(true);
        setShowSideBar(false);
      }

      if (location.pathname === "/question-upload") {
        navigate("/question-upload");
        setShowPages(false);
        setShowSideBar(true);
      }

      if (location.pathname === "/users") {
        navigate("/users");
        setShowPages(false);
        setShowSideBar(true);
      }
      if (location.pathname === "/candidates") {
        navigate("/candidates");
        setShowPages(false);
        setShowSideBar(true);
      }
      if (location.pathname.includes("/courses")) {
        navigate(`/courses/${selectedCourseName.replace(/\s+/g, "")}`);
        setShowPages(false);
        setShowSideBar(true);
      }
      if (location.pathname.includes("/test-invite")) {
        // navigate("/test-invite");
        setShowPages(false);
        setShowSideBar(false);
      }
      if (location.pathname.includes("/assessment-results")) {
        setShowPages(false);
        setShowSideBar(true);
      }
    } else {
      if (location.pathname === "/register") {
        navigate("/register");
        setShowPages(false);
      } else if (location.pathname === "/lmsregister") {
        navigate("/lmsregister");
        setShowPages(false);
      } else if (location.pathname === "/portal") {
        navigate("/portal");
        setShowPages(false);
      } else if (location.pathname === "/online-test") {
        navigate("/online-test");
        setShowPages(false);
        setShowSideBar(false);
      } else if (location.pathname.includes("/test-invite")) {
        // navigate("/test-invite");
        setShowPages(false);
        setShowSideBar(false);
      } else if (location.pathname === "/token-unavailable") {
        navigate("/token-unavailable");
        setShowPages(false);
        setShowSideBar(false);
      } else if (location.pathname === "/result") {
        navigate("/result");
        setShowPages(false);
        setShowSideBar(false);
      } else {
        navigate("/login");
        setShowPages(false);
      }
    }
    // };

    // window.addEventListener("localStorageUpdated", handleStorageUpdate);

    // // Initial load
    // handleStorageUpdate();

    // return () => {
    //   window.removeEventListener("localStorageUpdated", handleStorageUpdate);
    // };
  }, [location.pathname]);

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

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
    dispatch(storePortalMenuStatus(false));
    dispatch(storeLogoutMenuStatus(false));
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      {location.pathname === "/login" ? (
        <Routes>
          <Route path="/login" element={<LmsLogin />} />
        </Routes>
      ) : location.pathname === "/register" ? (
        <Routes>
          <Route path="/register" element={<CandidateRegister />} />
        </Routes>
      ) : location.pathname === "/lmsregister" ? (
        <Routes>
          <Route path="/lmsregister" element={<Register />} />
        </Routes>
      ) : location.pathname === "/portal" ? (
        <Routes>
          <Route path="/portal" element={<Portal />} />
        </Routes>
      ) : location.pathname === "/online-test" ? (
        <Routes>
          <Route path="/online-test" element={<OnlineTest />} />
        </Routes>
      ) : location.pathname.includes("/test-invite") ? (
        <Routes>
          <Route path="/test-invite/:token" element={<TestInvite />} />
        </Routes>
      ) : location.pathname === "/token-unavailable" ? (
        <Routes>
          <Route path="/token-unavailable" element={<TestExpired />} />
        </Routes>
      ) : location.pathname === "/result" ? (
        <Routes>
          <Route path="/result" element={<Result />} />
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
      ) : showSideBar === true ? (
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className={
              collapsed
                ? "portallayout_mobilemainsidebar"
                : "portallayout_mainsidebar"
            }
          >
            <div className="demo-logo-vertical">
              <img src={SidebarLogo} style={{ width: "90px" }} />
            </div>
            <SideMenu />
          </Sider>
          <Layout
            style={{
              height: "100vh",
              backgroundColor: "#f5f7f9",
              transition: "all 0.2s ease-in-out",
              marginLeft: collapsed ? 80 : 207,
            }}
          >
            <Content
              style={{
                margin: "20px 16px 20px 0px",
                backgroundColor: "#fff",
                borderRadius: "24px",
                border: "1px solid #80808033",
              }}
            >
              <>
                <div className="portallayout_headerContainer">
                  <Button
                    type="text"
                    icon={
                      collapsed ? (
                        <RiMenuUnfoldFill size={20} />
                      ) : (
                        <RiMenuUnfold2Fill size={20} />
                      )
                    }
                    onClick={() => {
                      setCollapsed(!collapsed);
                    }}
                    style={{
                      fontSize: "16px",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={handlePortalMenu}
                      className="portallayout_headermenubutton"
                    >
                      <TbGridDots size={20} />
                    </button>

                    <button
                      className="portallayout_headeravatarbutton"
                      onClick={handleLogoutMenu}
                    >
                      <Avatar size={34} className="admin_headeravatar">
                        {userName ? userName.charAt(0).toUpperCase() : ""}
                      </Avatar>
                    </button>
                  </div>

                  <div
                    className="portallayout_menuContainer"
                    style={{ display: portalMenu ? "block" : "none" }}
                  >
                    <div className="portallayout_menuInnerContainer">
                      <div
                        className="portallayout_menuItemContainer"
                        onClick={() => {
                          setShowPages(true);
                          dispatch(storePortalMenuStatus(false));
                          dispatch(storeLogoutMenuStatus(false));
                          navigate("/search");
                        }}
                      >
                        <img src={Placement} style={{ width: "34px" }} />
                        <p className="portallayout_menuname">Placement</p>
                      </div>

                      <div
                        className="portallayout_menuItemContainer"
                        onClick={() => {
                          setShowPages(false);
                          setShowSideBar(true);
                          dispatch(storePortalMenuStatus(false));
                          dispatch(storeLogoutMenuStatus(false));
                          navigate("/question-upload");
                        }}
                      >
                        <img
                          src={Interview}
                          className="portallayout_menuImage"
                        />
                        <p className="portallayout_menunametwo">Interview</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="portallayout_logoutmenuContainer"
                    style={{ display: logoutMenu ? "block" : "none" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "22px 22px 0px",
                      }}
                    >
                      <Avatar size={42} className="admin_headeravatar">
                        {userName ? userName.charAt(0).toUpperCase() : ""}
                      </Avatar>
                    </div>
                    <div
                      style={{
                        padding: "0px 22px 0px",
                      }}
                    >
                      <p className="portallayout_logoutmenuemail">
                        {userEmail ? userEmail : ""}
                      </p>
                      <p className="portallayout_logoutmenu_username">
                        {userName ? userName : ""}
                      </p>
                    </div>
                    <Divider className="portallayout_logoutmenu_divider" />

                    <div
                      className="logoutmenu_buttonContainer"
                      onClick={handleLogout}
                    >
                      <button className="logoutmenu_button">
                        <MdOutlineLogout
                          size={17}
                          style={{ marginRight: "12px" }}
                        />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>

                <Divider className="portallayout_header_divider" />
                <div
                  style={{ padding: "0px 20px 20px 20px" }}
                  onClick={() => {
                    dispatch(storePortalMenuStatus(false));
                    dispatch(storeLogoutMenuStatus(false));
                  }}
                >
                  <Routes>
                    <Route
                      element={<QuestionUpload />}
                      path="/question-upload"
                    />
                    <Route element={<Users />} path="/users" />
                    <Route element={<Candidates />} path="/candidates" />
                    <Route element={<Courses />} path="/courses/:courseName" />
                    <Route
                      element={<StudentResult />}
                      path="/assessment-results"
                    />
                  </Routes>
                </div>
              </>
            </Content>
          </Layout>
        </Layout>
      ) : (
        ""
      )}
    </div>
  );
};
export default MainSideMenu;

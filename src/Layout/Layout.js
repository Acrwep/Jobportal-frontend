import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
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
import LMS from "../images/study.png";
import Interview from "../images/meeting.png";
import { MdOutlineLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  storeCurrentPortalName,
  storeLogoutMenuStatus,
  storeNotificationCount,
  storePortalMenuStatus,
} from "../Redux/slice";
import TestInvite from "../Interview/TestInvite";
import TestExpired from "../Interview/TestExpired";
import Result from "../Interview/Result";
import Users from "../Users/Users";
import Candidates from "../Users/Candidates";
import Courses from "../Courses/Courses";
import SidebarLogo from "../images/old-acte-logo.png";
import {
  checkCandidateRegisteredInPlacement,
  getAssessmentLinks,
  getCourses,
} from "../Common/action";
import StudentResult from "../StudentResult/StudentResult";
import { PiWarningCircleBold } from "react-icons/pi";
import { FaRegCheckCircle } from "react-icons/fa";
import Assessments from "../StudentResult/Assessments";
import ForgotPassword from "../Login/ForgotPassword";
const { Header, Sider, Content } = Layout;

const MainSideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const portalMenu = useSelector((state) => state.portalmenu);
  const logoutMenu = useSelector((state) => state.logoutmenu);
  const currentPortalName = useSelector((state) => state.currentportalname);
  const notificationCount = useSelector((state) => state.notificationcount);

  const [showPages, setShowPages] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [placmentStatus, setPlacementStatus] = useState(false);
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    // const handleStorageUpdate = () => {
    console.log("path", location.pathname);
    const accessToken = localStorage.getItem("Accesstoken");
    const loginDetails = localStorage.getItem("loginDetails");
    const loginDetailsJson = JSON.parse(loginDetails);
    const selectedCourseName = localStorage.getItem("selectedCourseName");
    console.log("selected course name", selectedCourseName);

    if (loginDetailsJson) {
      setUserName(loginDetailsJson.name);
      setUserEmail(loginDetailsJson.email);
      setRoleId(loginDetailsJson.role_id);
      checkCandidate(loginDetailsJson.email);
    }

    if (accessToken) {
      setShowSideBar(true);
      if (loginDetailsJson) {
        if (loginDetailsJson.role_id === 1 && location.pathname === "/") {
          navigate("/trainers");
          setShowPages(false);
          setShowSideBar(true);
        } else if (
          (loginDetailsJson.role_id === 2 || loginDetailsJson.role_id === 3) &&
          location.pathname === "/"
        ) {
          const defaultCourseName = localStorage.getItem("defaultCourseName");
          localStorage.setItem("selectedCourseName", defaultCourseName);

          const defaultCourseId = localStorage.getItem("defaultCourseId");
          localStorage.setItem("selectedCourseId", defaultCourseId);
          navigate(`/courses`);
        }
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

      if (location.pathname === "/trainers") {
        navigate("/trainers");
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

      if (location.pathname === "/placementregister") {
        navigate("/placementregister");
        setShowPages(false);
        setShowSideBar(false);
      }
    } else {
      if (location.pathname === "/placementregister") {
        navigate("/placementregister");
        setShowPages(false);
        setShowSideBar(false);
      } else if (location.pathname === "/register") {
        navigate("/register");
        setShowPages(false);
        setShowSideBar(false);
      } else if (location.pathname === "/forgotpassword") {
        navigate("/forgotpassword");
        setShowPages(false);
        setShowSideBar(false);
      } else if (location.pathname === "/portal") {
        navigate("/portal");
        setShowPages(false);
        setShowSideBar(false);
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

  useEffect(() => {
    //the code below highlights the active portal even after a refresh
    const pathName = location.pathname.split("/")[1];

    if (
      pathName === "placementregister" ||
      pathName === "profiles" ||
      pathName === "search" ||
      pathName === "favorites" ||
      pathName === "foldermanagement" ||
      pathName === "folderprofiles" ||
      pathName === "profiledetails"
    ) {
      dispatch(storeCurrentPortalName("placement"));
    } else if (
      pathName === "question-upload" ||
      pathName === "candidates" ||
      pathName === "assessments" ||
      pathName === "assessment-results"
    ) {
      dispatch(storeCurrentPortalName("interview"));
    } else {
      dispatch(storeCurrentPortalName("lms"));
    }
  }, []);

  const checkCandidate = async (email) => {
    try {
      const response = await checkCandidateRegisteredInPlacement(email);
      console.log("check candidate registed in placement", response);
      const status = response?.data?.data || false;
      localStorage.setItem("checkCandidateRegisteredInPlacement", status);
      setPlacementStatus(status);
    } catch (error) {
      console.log("check candidate", error);
    } finally {
      setTimeout(() => {
        getAssessmentLinkData();
      }, 300);
    }
  };

  const getAssessmentLinkData = async () => {
    const loginuserId = localStorage.getItem("loginUserId");
    try {
      const response = await getAssessmentLinks(loginuserId);
      console.log("assesmnt link response", response);
      const data = response?.data?.data || null;
      if (data) {
        dispatch(storeNotificationCount(data?.unread_count));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handlePortalMenu = () => {
    console.log(portalMenu);
    dispatch(storePortalMenuStatus(!portalMenu));
    dispatch(storeLogoutMenuStatus(false));
  };

  const handlePlacementButton = () => {
    setShowPages(true);
    dispatch(storeCurrentPortalName("placement"));
    dispatch(storePortalMenuStatus(false));
    dispatch(storeLogoutMenuStatus(false));
    if (roleId === 3) {
      setShowPages(false);
      setShowSideBar(false);
      navigate("/placementregister");
    } else {
      console.log("adddddd", roleId);
      navigate("/search");
    }
  };

  const handleLmsClick = () => {
    setShowPages(false);
    setShowSideBar(true);
    dispatch(storeCurrentPortalName("lms"));
    dispatch(storePortalMenuStatus(false));
    dispatch(storeLogoutMenuStatus(false));
    if (roleId === 3) {
      setShowPages(false);
      setShowSideBar(true);
      const defaultCourseName = localStorage.getItem("defaultCourseName");
      localStorage.setItem("selectedCourseName", defaultCourseName);

      const defaultCourseId = localStorage.getItem("defaultCourseId");
      localStorage.setItem("selectedCourseId", defaultCourseId);
      navigate(`/courses`);
    } else if (roleId === 2) {
      setShowPages(false);
      setShowSideBar(true);
      const defaultCourseName = localStorage.getItem("defaultCourseName");
      localStorage.setItem("selectedCourseName", defaultCourseName);

      const defaultCourseId = localStorage.getItem("defaultCourseId");
      localStorage.setItem("selectedCourseId", defaultCourseId);
      navigate(`/courses`);
    } else {
      setShowPages(false);
      setShowSideBar(true);
      navigate("/trainers");
    }
  };

  const handleInterviewClick = () => {
    setShowPages(false);
    setShowSideBar(true);
    dispatch(storeCurrentPortalName("interview"));
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
      {location.pathname === "/login" ? (
        <Routes>
          <Route path="/login" element={<LmsLogin />} />
        </Routes>
      ) : location.pathname === "/placementregister" ? (
        <Routes>
          <Route path="/placementregister" element={<CandidateRegister />} />
        </Routes>
      ) : location.pathname === "/register" ? (
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : location.pathname === "/forgotpassword" ? (
        <Routes>
          <Route path="/forgotpassword" element={<ForgotPassword />} />
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
                      position: "relative",
                    }}
                  >
                    <button
                      onClick={handlePortalMenu}
                      className="portallayout_headermenubutton"
                    >
                      <TbGridDots size={20} />

                      {notificationCount >= 1 && roleId === 3 ? (
                        <div className="portallayout_notificationCount_container">
                          <p>{notificationCount}</p>
                        </div>
                      ) : (
                        ""
                      )}
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
                        className={
                          currentPortalName === "placement"
                            ? "portallayout_activemenuItemContainer"
                            : "portallayout_menuItemContainer"
                        }
                        onClick={
                          currentPortalName === "placement"
                            ? () => console.log("clicked active portal")
                            : handlePlacementButton
                        }
                      >
                        <img src={Placement} style={{ width: "34px" }} />
                        <p className="portallayout_menuname">
                          Placement <br />
                          Portal
                        </p>

                        {roleId === 3 && (
                          <>
                            {placmentStatus === true ? (
                              <FaRegCheckCircle
                                color="#52c41a"
                                className="portalmenu_placementStatusIcon"
                              />
                            ) : (
                              <PiWarningCircleBold
                                color="#faad14"
                                className="portalmenu_placementStatusIcon"
                              />
                            )}
                          </>
                        )}
                      </div>

                      <div
                        className={
                          currentPortalName === "lms"
                            ? "portallayout_activemenuItemContainer"
                            : "portallayout_menuItemContainer"
                        }
                        style={{
                          width: "84px",
                        }}
                        onClick={
                          currentPortalName === "lms"
                            ? () => console.log("clicked active portal")
                            : handleLmsClick
                        }
                      >
                        <img src={LMS} style={{ width: "34px" }} />
                        <p className="portallayout_menuname">
                          LMS <br />
                          Portal
                        </p>
                      </div>

                      <div
                        className={
                          currentPortalName === "interview"
                            ? "portallayout_activemenuItemContainer"
                            : "portallayout_menuItemContainer"
                        }
                        onClick={
                          currentPortalName === "interview"
                            ? () => console.log("clicked active portal")
                            : handleInterviewClick
                        }
                      >
                        <img
                          src={Interview}
                          className="portallayout_menuImage"
                        />
                        <p className="portallayout_menunametwo">
                          Interview
                          <br />
                          Portal
                        </p>
                        {notificationCount >= 1 && roleId === 3 ? (
                          <div className="portallayout_interviewportal_notificationCount_container">
                            <p>{notificationCount}</p>
                          </div>
                        ) : (
                          ""
                        )}
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
                    <Route element={<Users />} path="/trainers" />
                    <Route element={<Candidates />} path="/candidates" />
                    <Route element={<Courses />} path="/courses/:courseName" />
                    <Route element={<Assessments />} path="/assessments" />
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

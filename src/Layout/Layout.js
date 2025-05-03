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
import { Button, Layout, Menu, theme } from "antd";
import OnlineTest from "../Interview/OnlineTest";
import { TbGridDots } from "react-icons/tb";
import Placement from "../images/hiring-black.png";
import Interview from "../images/interview-black.png";
const { Header, Sider, Content } = Layout;

const MainSideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPages, setShowPages] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [headerMenu, setHeaderMenu] = useState(false);

  useEffect(() => {
    const handleStorageUpdate = () => {
      console.log("path", location.pathname);
      const accessToken = localStorage.getItem("Accesstoken");
      if (accessToken) {
        setShowSideBar(true);
        if (location.pathname === "/") {
          navigate("/question-upload");
          setShowPages(false);
          setShowSideBar(true);
        }

        // if (location.pathname === "/question-upload") {
        //   navigate("/question-upload");
        //   setShowPages(false);
        //   setShowSideBar(true);
        // }
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

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
            style={{ backgroundColor: "#073669" }}
          >
            <div className="demo-logo-vertical">
              <p>Logo</p>
            </div>
            <SideMenu />
          </Sider>
          <Layout style={{ height: "100vh", backgroundColor: "#fff" }}>
            <Header
              style={{
                background: colorBgContainer,
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              }}
              className="portallayout_headerContainer"
            >
              <Button
                type="text"
                icon={
                  collapsed ? (
                    <RiMenuUnfoldFill size={20} />
                  ) : (
                    <RiMenuUnfold2Fill size={20} />
                  )
                }
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                }}
              />

              <button
                onClick={() => setHeaderMenu(!headerMenu)}
                className="portallayout_headermenubutton"
              >
                <TbGridDots size={20} />
              </button>
              <div
                className="portallayout_menuContainer"
                style={{ display: headerMenu ? "block" : "none" }}
              >
                <div className="portallayout_menuInnerContainer">
                  <div className="portallayout_menuItemContainer">
                    <img src={Placement} style={{ width: "34px" }} />
                    <p className="portallayout_menuname">Placement</p>
                  </div>

                  <div className="portallayout_menuItemContainer">
                    <img src={Interview} className="portallayout_menuImage" />
                    <p className="portallayout_menunametwo">Interview</p>
                  </div>
                </div>
              </div>
            </Header>
            <Content
              style={{
                margin: "10px 16px",
                padding: "8px 12px",
                minHeight: 280,
                // background: colorBgContainer,
                // borderRadius: borderRadiusLG,
              }}
              onClick={() => setHeaderMenu(false)}
            >
              <Routes>
                <Route element={<QuestionUpload />} path="/question-upload" />
              </Routes>
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

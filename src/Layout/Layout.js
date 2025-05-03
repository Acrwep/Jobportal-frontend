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

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SideMenu from "./SideMenu";
import QuestionUpload from "../QuestionUpload/QuestionUpload";
import "./styles.css";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import OnlineTest from "../Interview/OnlineTest";
const { Header, Sider, Content } = Layout;

const drawerWidth = 210;

// const openedMixin = (theme) => ({
//   width: drawerWidth,
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: "hidden",
// });

// const closedMixin = (theme) => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(8)} + 1px)`,
//   },
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   variants: [
//     {
//       props: ({ open }) => open,
//       style: {
//         marginLeft: drawerWidth,
//         width: `calc(100% - ${drawerWidth}px)`,
//         transition: theme.transitions.create(["width", "margin"], {
//           easing: theme.transitions.easing.sharp,
//           duration: theme.transitions.duration.enteringScreen,
//         }),
//       },
//     },
//   ],
// }));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: "nowrap",
//   boxSizing: "border-box",
//   variants: [
//     {
//       props: ({ open }) => open,
//       style: {
//         ...openedMixin(theme),
//         "& .MuiDrawer-paper": openedMixin(theme),
//       },
//     },
//     {
//       props: ({ open }) => !open,
//       style: {
//         ...closedMixin(theme),
//         "& .MuiDrawer-paper": closedMixin(theme),
//       },
//     },
//   ],
// }));

const MainSideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPages, setShowPages] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleStorageUpdate = () => {
      console.log("path", location.pathname);
      const accessToken = localStorage.getItem("Accesstoken");
      if (accessToken) {
        setShowPages(true);
        if (location.pathname === "/") {
          navigate("/search");
          setShowPages(true);
          setShowSideBar(false);
        }

        if (location.pathname === "/question-upload") {
          navigate("/question-upload");
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
        } else if (location.pathname === "/lmslogin") {
          navigate("/lmslogin");
          setShowPages(false);
        } else if (location.pathname === "/portal") {
          navigate("/portal");
          setShowPages(false);
        } else if (location.pathname === "/question-upload") {
          navigate("/question-upload");
          setShowPages(false);
          setShowSideBar(true);
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
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : location.pathname === "/register" ? (
        <Routes>
          <Route path="/register" element={<CandidateRegister />} />
        </Routes>
      ) : location.pathname === "/lmsregister" ? (
        <Routes>
          <Route path="/lmsregister" element={<Register />} />
        </Routes>
      ) : location.pathname === "/lmslogin" ? (
        <Routes>
          <Route path="/lmslogin" element={<LmsLogin />} />
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
                padding: 0,
                background: colorBgContainer,
                boxShadow: "0 7px 29px 0 #64646f33",
              }}
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
                  width: 64,
                  height: 64,
                }}
              />
            </Header>
            <Content
              style={{
                margin: "10px 16px",
                padding: "8px 12px",
                minHeight: 280,
                // background: colorBgContainer,
                // borderRadius: borderRadiusLG,
              }}
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

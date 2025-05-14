import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { MdQuestionAnswer } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { MdMenuBook } from "react-icons/md";
import { FaCode } from "react-icons/fa6";
import { SlMagnifier } from "react-icons/sl";
import { GiMaterialsScience } from "react-icons/gi";
import { BsBarChartLine } from "react-icons/bs";
import { CiBullhorn } from "react-icons/ci";
import { BsCloudArrowDown } from "react-icons/bs";
import { MdScreenshotMonitor } from "react-icons/md";
import { getCourses } from "../Common/action";

const { SubMenu } = Menu;

export default function SideMenu() {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");
  const navigate = useNavigate();

  const [sidemenuList, setSubmenuList] = useState([
    {
      title: "Questions",
      icon: <MdQuestionAnswer size={17} />,
      path: "question-upload",
    },
    {
      title: "Users",
      icon: <FaUsers size={17} />,
      path: "users",
    },
    {
      title: "Candidates",
      icon: <PiStudentFill size={17} />,
      path: "candidates",
    },
  ]);

  useEffect(() => {
    console.log("current path", location.pathname, selectedKey);
    const pathName = location.pathname.split("/")[1];
    const selectedCourseId = localStorage.getItem("selectedCourseId");

    if (pathName === "") {
      setSelectedKey("question-upload");
      return;
    }
    if (pathName.includes("courses") && selectedCourseId === "1") {
      setSelectedKey("fullstack");
      return;
    } else if (pathName === "courses" && selectedCourseId === "2") {
      setSelectedKey("softwaretesting");
      return;
    } else if (pathName === "courses" && selectedCourseId === "3") {
      setSelectedKey("datascience");
      return;
    } else if (pathName === "courses" && selectedCourseId === "4") {
      setSelectedKey("dataanalytics");
      return;
    } else if (pathName === "courses" && selectedCourseId === "5") {
      setSelectedKey("cloudcomputing");
      return;
    } else if (pathName === "courses" && selectedCourseId === "6") {
      setSelectedKey("uiux");
      return;
    } else if (pathName === "courses" && selectedCourseId === "7") {
      setSelectedKey("digitalmarketing");
      return;
    }
    setSelectedKey(pathName);
  }, [location.pathname]);

  useEffect(() => {
    getCourseData();
  }, []);

  const getCourseData = async () => {
    try {
      const response = await getCourses();
      console.log("sidebar courses", response);
      const allCourses = response?.data?.data || [];

      if (
        allCourses.length >= 1 &&
        !sidemenuList.some((s) => s.title === "Courses")
      ) {
        const obj = {
          title: "Courses",
          icon: <MdMenuBook size={17} />,
          submenu: allCourses,
        };
        let addcourses = sidemenuList;
        addcourses.push(obj);

        const altersidebar = addcourses.map((item) => {
          if (item.title === "Courses") {
            const updatedSubmenu = item.submenu.map((s) => {
              if (s.name === "Fullstack Development") {
                return {
                  ...s,
                  title: s.name,
                  icon: <FaCode size={17} />,
                  path: "courses",
                  key: "fullstack",
                };
              }
              if (s.name === "Software Testing") {
                return {
                  ...s,
                  title: s.name,
                  icon: <SlMagnifier size={17} />,
                  path: "courses",
                  key: "softwaretesting",
                };
              }
              if (s.name === "Data Science") {
                return {
                  ...s,
                  title: s.name,
                  icon: <GiMaterialsScience size={17} />,
                  path: "courses",
                  key: "datascience",
                };
              }
              if (s.name === "Data Analytics") {
                return {
                  ...s,
                  title: s.name,
                  icon: <BsBarChartLine size={17} />,
                  path: "courses",
                  key: "dataanalytics",
                };
              }
              if (s.name === "Cloud Computing") {
                return {
                  ...s,
                  title: s.name,
                  icon: <BsCloudArrowDown size={17} />,
                  path: "courses",
                  key: "cloudcomputing",
                };
              }
              if (s.name === "UI-UX") {
                return {
                  ...s,
                  title: s.name,
                  icon: <MdScreenshotMonitor size={17} />,
                  path: "courses",
                  key: "uiux",
                };
              }
              if (s.name === "Digital Marketing") {
                return {
                  ...s,
                  title: s.name,
                  icon: <CiBullhorn size={19} />,
                  path: "courses",
                  key: "digitalmarketing",
                };
              }
              return s;
            });
            return {
              ...item,
              submenu: updatedSubmenu,
            };
          }
          return item;
        });

        setSubmenuList(altersidebar);
      }
    } catch (error) {
      console.log("get course error", error);
    }
  };

  const handleMenuClick = (e) => {
    const flatMenuItems = sidemenuList.flatMap((item) =>
      item.submenu ? item.submenu : [item]
    );
    console.log("flat", flatMenuItems, e);
    const selectedItem = flatMenuItems.find(
      (i) => i.key === e.key || i.path === e.key
    );
    if (selectedItem.id) {
      localStorage.setItem("selectedCourseName", selectedItem.name);
      localStorage.setItem("selectedCourseId", selectedItem.id);
    } else {
      localStorage.removeItem("selectedCourseName");
      localStorage.removeItem("selectedCourseId");
    }
    if (selectedItem) {
      setSelectedKey(e.key);
      navigate(`/${selectedItem.path}`);
    }
  };

  const renderMenuItems = (menuConfig) => {
    return Object.entries(menuConfig).map(([key, item]) => {
      if (item.submenu) {
        return (
          <SubMenu key="Courses" icon={item.icon} title={item.title}>
            {item.submenu.map((subItem) => (
              <Menu.Item
                key={subItem.key}
                icon={subItem.icon}
                disabled={["Field"].includes(subItem.title)}
              >
                <span>{subItem.title}</span>
              </Menu.Item>
            ))}
          </SubMenu>
        );
      }

      return (
        <Menu.Item
          key={item.path}
          icon={item.icon}
          style={{ marginBottom: "12px", padding: "0px 24px" }}
        >
          <span>{item.title}</span>
        </Menu.Item>
      );
    });
  };

  return (
    <Menu
      mode="inline"
      style={{ backgroundColor: "transparent", padding: "0px 4px" }}
      selectedKeys={[selectedKey]}
      defaultOpenKeys={["Courses"]}
      onClick={handleMenuClick}
    >
      {renderMenuItems(sidemenuList)}
    </Menu>
  );
}

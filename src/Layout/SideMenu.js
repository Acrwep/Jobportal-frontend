import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { MdQuestionAnswer } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { SiBookstack } from "react-icons/si";
import FullstackIcon from "../images/code.png";
import SoftwareTestingIcon from "../images/software-testing.png";
import DatascienceIcon from "../images/data-science.png";
import DataAnalyticsIcon from "../images/data-analytics.png";
import CloudComputingIcon from "../images/cloud-computing.png";
import UiUxIcon from "../images/web-design.png";
import DigitalMarketingIcon from "../images/marketing.png";
import { MdMenuBook } from "react-icons/md";

const { SubMenu } = Menu;

export default function SideMenu() {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");
  const navigate = useNavigate();

  const sidemenuList = [
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
    {
      title: "Courses",
      icon: <MdMenuBook size={17} />,
      submenu: [
        {
          title: "FullStack Development",
          icon: (
            <img src={FullstackIcon} className="portalsidebar_coursesicon" />
          ),
          path: "courses",
          key: "fullstack",
        },
        {
          title: "Software Testing",
          icon: (
            <img
              src={SoftwareTestingIcon}
              className="portalsidebar_coursesicon"
            />
          ),
          path: "courses",
          key: "softwaretesting",
        },
        {
          title: "Data Science",
          icon: (
            <img src={DatascienceIcon} className="portalsidebar_coursesicon" />
          ),
          path: "courses",
          key: "datascience",
        },
        {
          title: "Data Analytics",
          icon: (
            <img
              src={DataAnalyticsIcon}
              className="portalsidebar_coursesicon"
            />
          ),
          path: "courses",
          key: "dataanalytics",
        },
        {
          title: "Cloud Computing",
          icon: (
            <img
              src={CloudComputingIcon}
              className="portalsidebar_coursesicon"
            />
          ),
          path: "courses",
          key: "cloudcomputing",
        },
        {
          title: "UI/UX",
          icon: <img src={UiUxIcon} className="portalsidebar_coursesicon" />,
          path: "courses",
          key: "uiux",
        },
        {
          title: "Digital Marketing",
          icon: (
            <img
              src={DigitalMarketingIcon}
              className="portalsidebar_coursesicon"
            />
          ),
          path: "courses",
          key: "digitalmarketing",
        },
      ],
    },
  ];

  useEffect(() => {
    setSelectedKey("question-upload");
  }, []);

  useEffect(() => {
    console.log("current path", location.pathname, selectedKey);
    const pathName = location.pathname.split("/")[1];
    if (pathName === "question-upload") {
      setSelectedKey("question-upload");
    }
  }, [location.pathname]);

  const handleMenuClick = (e) => {
    const flatMenuItems = sidemenuList.flatMap((item) =>
      item.submenu ? item.submenu : [item]
    );
    console.log("flat", flatMenuItems, e);
    const selectedItem = flatMenuItems.find(
      (i) => i.key === e.key || i.path === e.key
    );
    if (selectedItem) {
      setSelectedKey(e.key);
      navigate(`/${selectedItem.path}`);
    }
  };

  const renderMenuItems = (menuConfig) => {
    return Object.entries(menuConfig).map(([key, item]) => {
      if (item.submenu) {
        return (
          <SubMenu
            key="Courses"
            icon={item.icon}
            title={item.title}
            style={{ marginBottom: "12px" }}
          >
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

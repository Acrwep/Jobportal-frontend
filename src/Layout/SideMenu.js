import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu } from "antd";
import { MdQuestionAnswer } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";

export default function SideMenu() {
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
  ];

  useEffect(() => {
    setSelectedKey("question-upload");
  }, []);

  const handleMenuClick = (e) => {
    navigate(`/${e.key}`);
    setSelectedKey(e.key);
  };

  const handleList = (item) => {
    console.log(item);
    navigate(`/${item.path}`);
  };

  const renderMenuItems = (menuConfig) => {
    return Object.entries(menuConfig).map(([key, item]) => {
      return (
        <Menu.Item
          key={item.path}
          icon={item.icon}
          disabled={[""].includes(item.title) ? true : false}
          style={{
            marginBottom: "12px",
            padding: "0px 24px",
            // backgroundColor: "rgb(255 255 255 / 52%)",
            // color: "#fff",
          }}
        >
          {[""].includes(item.title) ? (
            <Link style={{ cursor: "default" }}>{item.title}</Link>
          ) : (
            <Link to={`/${item.path}`}>{item.title}</Link>
          )}
        </Menu.Item>
      );
    });
  };

  return (
    <Menu
      style={{ backgroundColor: "transparent" }}
      selectedKeys={[selectedKey]}
      onClick={handleMenuClick}
    >
      {" "}
      {renderMenuItems(sidemenuList)}
    </Menu>
  );
}

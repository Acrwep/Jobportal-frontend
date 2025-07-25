import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "antd";
import {
  MdQuestionAnswer,
  MdMenuBook,
  MdScreenshotMonitor,
} from "react-icons/md";
import { FaUsers, FaCode } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { SlMagnifier } from "react-icons/sl";
import { GiMaterialsScience } from "react-icons/gi";
import { BsBarChartLine, BsCloudArrowDown } from "react-icons/bs";
import { CiBullhorn } from "react-icons/ci";
import { GrNotes } from "react-icons/gr";
import { getCourseByTrainers, getCourses } from "../Common/action";
import { FaExternalLinkAlt } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { useSelector } from "react-redux";
import { LuAlarmClock } from "react-icons/lu";

export default function SideMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPortalName = useSelector((state) => state.currentportalname);
  const [selectedKey, setSelectedKey] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const pathName = location.pathname.split("/")[1];
    const selectedCourseId = localStorage.getItem("selectedCourseId");

    const courseKeyMap = {
      1: "fullstack",
      2: "softwaretesting",
      3: "datascience",
      4: "dataanalytics",
      5: "cloudcomputing",
      6: "uiux",
      7: "digitalmarketing",
    };

    // if (pathName === "assessments" || pathName === "assessment-results") {
    //   setIsInterviewPortal(true);
    //   setSelectedKey(pathName);
    //   setInterviewPortalMenu([
    //     {
    //       key: "assessments",
    //       icon: <FaExternalLinkAlt size={17} />,
    //       label: "Assessments",
    //     },
    //     {
    //       key: "assessment-results",
    //       icon: <GrNotes size={17} />,
    //       label: "Result",
    //     },
    //   ]);
    //   return;
    // }
    // setIsInterviewPortal(false);
    // setInterviewPortalMenu([]);
    if (pathName === "") {
      setSelectedKey("question-upload");
    }
    if (pathName.includes("courses")) {
      setSelectedKey(courseKeyMap[selectedCourseId] || "courses");
    } else {
      setSelectedKey(pathName);
    }
  }, [location.pathname]);

  useEffect(() => {
    initMenu();
  }, [currentPortalName]);

  const initMenu = async () => {
    let defaultItems;
    const loginUserId = localStorage.getItem("loginUserId");
    const roleId = localStorage.getItem("loginUserRoleId");
    console.log("roleiddd", roleId, loginUserId);
    // role 1=admin
    // role 2=trainer
    // role 3=student

    if (roleId == 1) {
      if (currentPortalName === "lms") {
        defaultItems = [
          {
            key: "trainers",
            icon: <FaUsers size={17} />,
            label: "Trainers",
          },
        ];
      } else if (currentPortalName === "interview") {
        defaultItems = [
          {
            key: "question-upload",
            icon: <MdQuestionAnswer size={17} />,
            label: "Questions",
          },
          {
            key: "candidates",
            icon: <PiStudentFill size={17} />,
            label: "Candidates",
          },
          {
            key: "assessmentlogs",
            icon: <CgNotes size={17} />,
            label: "Assessment Logs",
          },
          {
            key: "assessment-scheduler",
            icon: <LuAlarmClock size={18} />,
            label: "Scheduler",
          },
        ];
      } else {
        defaultItems = [];
      }
    }

    if (roleId == 2) {
      if (currentPortalName === "interview") {
        defaultItems = [
          {
            key: "question-upload",
            icon: <MdQuestionAnswer size={17} />,
            label: "Questions",
          },
          {
            key: "candidates",
            icon: <PiStudentFill size={17} />,
            label: "Candidates",
          },
          {
            key: "assessmentlogs",
            icon: <CgNotes size={17} />,
            label: "Assessment Logs",
          },
        ];
      } else {
        defaultItems = [];
      }
    }

    if (roleId == 3) {
      if (currentPortalName === "interview") {
        defaultItems = [
          {
            key: "assessments",
            icon: <FaExternalLinkAlt size={17} />,
            label: "Assessments",
          },
          {
            key: "assessment-results",
            icon: <GrNotes size={17} />,
            label: "Result",
          },
        ];
      } else {
        defaultItems = [];
      }
    }

    if (currentPortalName === "lms") {
      if (roleId == 1 || roleId == 3) {
        try {
          const response = await getCourses();
          const allCourses = response?.data?.data || [];

          if (allCourses.length > 0) {
            const courseSubItems = allCourses.map((course) => {
              let courseKey = "";
              let courseIcon = null;

              switch (course.name) {
                case "Fullstack Development":
                  courseKey = "fullstack";
                  courseIcon = <FaCode size={17} />;
                  break;
                case "Software Testing":
                  courseKey = "softwaretesting";
                  courseIcon = <SlMagnifier size={17} />;
                  break;
                case "Data Science":
                  courseKey = "datascience";
                  courseIcon = <GiMaterialsScience size={17} />;
                  break;
                case "Data Analytics":
                  courseKey = "dataanalytics";
                  courseIcon = <BsBarChartLine size={17} />;
                  break;
                case "Cloud Computing":
                  courseKey = "cloudcomputing";
                  courseIcon = <BsCloudArrowDown size={17} />;
                  break;
                case "UI-UX":
                  courseKey = "uiux";
                  courseIcon = <MdScreenshotMonitor size={17} />;
                  break;
                case "Digital Marketing":
                  courseKey = "digitalmarketing";
                  courseIcon = <CiBullhorn size={17} />;
                  break;
                default:
                  courseKey = course.name.toLowerCase().replace(/\s+/g, "-");
              }

              return {
                key: courseKey,
                label: course.name,
                icon: courseIcon,
                courseId: course.id,
                path: "courses",
              };
            });

            if (roleId == 1) {
              defaultItems.push({
                key: "courses",
                label: "Courses",
                icon: <MdMenuBook size={17} />,
                children: courseSubItems,
              });
            } else {
              defaultItems.push({
                key: "courses",
                label: "Courses",
                icon: <MdMenuBook size={17} />,
                children: courseSubItems,
              });
            }
          }

          setMenuItems(defaultItems);
        } catch (error) {
          console.error("get course error", error);
          setMenuItems(defaultItems); // fallback to default menu only
        }
      } else {
        try {
          const response = await getCourseByTrainers(loginUserId);
          console.log("getCourseByTrainers", response);

          const allCourses = response?.data?.courses || [];
          console.log("mapping courses", allCourses);
          if (allCourses.length > 0) {
            const courseSubItems = allCourses.map((course) => {
              let courseKey = "";
              let courseIcon = null;

              switch (course.course_name) {
                case "Fullstack Development":
                  courseKey = "fullstack";
                  courseIcon = <FaCode size={17} />;
                  break;
                case "Software Testing":
                  courseKey = "softwaretesting";
                  courseIcon = <SlMagnifier size={17} />;
                  break;
                case "Data Science":
                  courseKey = "datascience";
                  courseIcon = <GiMaterialsScience size={17} />;
                  break;
                case "Data Analytics":
                  courseKey = "dataanalytics";
                  courseIcon = <BsBarChartLine size={17} />;
                  break;
                case "Cloud Computing":
                  courseKey = "cloudcomputing";
                  courseIcon = <BsCloudArrowDown size={17} />;
                  break;
                case "UI-UX":
                  courseKey = "uiux";
                  courseIcon = <MdScreenshotMonitor size={17} />;
                  break;
                case "Digital Marketing":
                  courseKey = "digitalmarketing";
                  courseIcon = <CiBullhorn size={17} />;
                  break;
                default:
                  courseKey = course.course_name
                    .toLowerCase()
                    .replace(/\s+/g, "-");
              }

              return {
                key: courseKey,
                label: course.course_name,
                icon: courseIcon,
                courseId: course.id,
                path: "courses",
              };
            });

            defaultItems.push({
              key: "courses",
              label: "Courses",
              icon: <MdMenuBook size={17} />,
              children: courseSubItems,
            });
          }

          setMenuItems(defaultItems);
        } catch (error) {
          console.error("get course error", error);
          setMenuItems(defaultItems); // fallback to default menu only
        }
      }
    } else {
      setMenuItems(defaultItems);
    }
  };

  const handleMenuClick = ({ key }) => {
    const findItem = (items) => {
      for (let item of items) {
        if (item.key === key) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    const selectedItem = findItem(menuItems);

    if (selectedItem?.courseId) {
      localStorage.setItem("selectedCourseName", selectedItem.label);
      localStorage.setItem("selectedCourseId", selectedItem.courseId);
    } else {
      localStorage.removeItem("selectedCourseName");
      localStorage.removeItem("selectedCourseId");
    }

    setSelectedKey(key);

    if (selectedItem.path === "courses") {
      navigate(`/courses/${selectedItem.label.replace(/\s+/g, "")}`);
    } else {
      navigate(`/${selectedItem?.path || key}`);
    }
  };

  return (
    <Menu
      mode="inline"
      className="portallayout_sidemenu"
      selectedKeys={[selectedKey]}
      defaultOpenKeys={["courses"]}
      onClick={handleMenuClick}
      items={menuItems}
    />
  );
}

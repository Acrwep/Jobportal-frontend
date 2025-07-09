import React, { useState, useEffect } from "react";
import { Row, Col, Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import {
  addressValidator,
  emailValidator,
  nameValidator,
} from "../Common/Validation";
import { CommonToaster } from "../Common/CommonToaster";
import {
  adminLogin,
  checkCandidateRegisteredInPlacement,
  getCourseByTrainers,
  getCourses,
} from "../Common/action";
import { LoadingOutlined } from "@ant-design/icons";
import { MdMenuBook } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import InterviewIcon from "../images/login-interview.png";
import { TbArrowBadgeRight } from "react-icons/tb";
import ActeLogo from "../images/old-acte-logo.png";
import StudentImage from "../images/login-banner.png";
import { useDispatch } from "react-redux";
import {
  storeCurrentPortalName,
  storePlacementRegisterStatus,
} from "../Redux/slice";

export default function LmsLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationTrigger(true);
    setLoading(true);

    const emailValidate = emailValidator(email);
    const passwordValidate = addressValidator(password);

    setEmailError(emailValidate);
    setPasswordError(passwordValidate);

    if (emailValidate || passwordValidate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const payload = {
      email: email,
      password: password,
    };

    try {
      const response = await adminLogin(payload);
      console.log(response);
      const loginDetails = response?.data?.details;
      localStorage.setItem("Accesstoken", loginDetails.token);
      localStorage.setItem("loginUserId", loginDetails.id);
      localStorage.setItem("loginUserRole", loginDetails.role);
      localStorage.setItem("loginUserRoleId", loginDetails.role_id);
      localStorage.setItem("loginDetails", JSON.stringify(loginDetails));
      const event = new Event("localStorageUpdated");
      window.dispatchEvent(event);

      setTimeout(() => {
        setLoading(false);
        dispatch(storeCurrentPortalName("lms"));
        if (loginDetails.role_id === 1) {
          navigate("/trainers");
        } else if (loginDetails.role_id === 2) {
          // navigate("/courses");
          getCoursesByTrainersData(loginDetails.id);
        } else {
          getCourseData(loginDetails.course_id);
          setTimeout(() => {
            checkCandidate(loginDetails.email);
          }, 500);
        }
      }, 1000);
    } catch (error) {
      console.log("login error", error);
      setLoading(false);
      CommonToaster(error?.response?.data?.message || "Internal server error.");
    }
  };

  const getCoursesByTrainersData = async (trainerid) => {
    try {
      const response = await getCourseByTrainers(trainerid);
      console.log("getCourseByTrainers", response);
      const allCourses = response?.data?.courses || [];
      if (allCourses.length >= 1) {
        const courseName = allCourses[0].course_name;
        const courseId = allCourses[0].id;
        localStorage.setItem("selectedCourseName", courseName);
        localStorage.setItem("selectedCourseId", courseId);

        localStorage.setItem("defaultCourseName", courseName);
        localStorage.setItem("defaultCourseId", courseId);
        navigate(`/courses`);
      }
    } catch (error) {
      console.log("trainer course error", error);
    }
  };

  const getCourseData = async (courseid) => {
    const payload = {
      courses: [courseid],
    };
    try {
      const response = await getCourses(payload);
      const allCourses = response?.data?.data || [];
      console.log("all courses", allCourses);
      if (allCourses.length >= 1) {
        const courseName = allCourses[0].name;
        const courseId = allCourses[0].id;
        localStorage.setItem("selectedCourseName", courseName);
        localStorage.setItem("selectedCourseId", courseId);

        localStorage.setItem("defaultCourseName", courseName);
        localStorage.setItem("defaultCourseId", courseId);
        navigate(`/courses`);
      }
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  const checkCandidate = async (email) => {
    try {
      const response = await checkCandidateRegisteredInPlacement(email);
      console.log("check candidate registed in placement", response);
      const status = response?.data?.data.is_exists || false;
      localStorage.setItem("checkCandidateRegisteredInPlacement", status);
      dispatch(storePlacementRegisterStatus(status));
    } catch (error) {
      console.log("check candidate", error);
    }
  };

  return (
    <div className="loginpage_maincontainer">
      <Row style={{ height: "100vh" }}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          xxl={14}
          style={{ backgroundColor: "#555ca3", position: "relative" }}
        >
          <div className="loginpage_leftContainer">
            <div className="loginpage_leftheadingContainer">
              <p className="loginpage_leftheading">
                AI-Powered Placement Portal
                {/* <br />
              Placement Portal */}
              </p>
            </div>
            <p className="loginpage_headingtag">{`( Login once access 3 portal )`}</p>
            <div className="loginpage_points">
              <div className="loginpage_subheadingContainer">
                <MdMenuBook color="#ffffff" size={20} />
                <h3>LMS</h3>
              </div>

              <ul>
                <li>
                  <TbArrowBadgeRight size={18} style={{ marginRight: "6px" }} />{" "}
                  Watch Top Trainers' Videos And Docs
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Learn Anytime With Videos And Documents.
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Quickly Find Topics With Organized Learning Materials.
                </li>
              </ul>

              <div className="loginpage_subheadingContainer">
                <img src={InterviewIcon} style={{ width: "22px" }} />
                <h3>Interview Practice Powered By AI</h3>
              </div>

              <ul>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Practice Company-Based Interview Questions.
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Take Online Assessment Tests To Crack Interviews
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Prepare Effectively With Real-World Questions.
                </li>
              </ul>

              <div className="loginpage_subheadingContainer">
                <FaUsers color="#ffffff" size={20} />
                <h3>Placement</h3>
              </div>
              <ul>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Upload Your Updated Resume To The Placement Portal
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Mention ACTE Course In Your Resume For Placement
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Stay Confident—Your Dream Job Awaits!
                </li>
              </ul>
            </div>
          </div>

          <div className="loginpage_leftbuttonContainer">
            <div className="loginpage_leftactive_button">Login</div>
            <div
              className="loginpage_leftinactive_button"
              onClick={() => navigate("/register")}
            >
              Sign up
            </div>
          </div>

          <div className="loginpage_leftbackground_imageContainer">
            <img
              src={StudentImage}
              className="loginpage_leftbackground_image"
            />
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xxl={10}>
          <div className="loginpage_rightContainer">
            <img src={ActeLogo} className="loginpage_logo" />
            <p className="register_smalltext">
              Don't have an account?{" "}
              <span
                style={{
                  color: "#0056b3",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </p>
            <form style={{ width: "60%" }}>
              <div style={{ marginTop: "22px" }}>
                <p className="register_inputlabel">Email</p>
                <Input
                  className={
                    emailError != "" && validationTrigger
                      ? "register_errorinput"
                      : "register_input"
                  }
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationTrigger) {
                      setEmailError(emailValidator(e.target.value));
                    }
                  }}
                  type="email"
                  name="email"
                  value={email}
                  status={emailError != "" ? "error" : ""}
                />
                <p
                  className={
                    emailError != "" && validationTrigger
                      ? "register_errorlabels_visible"
                      : "register_errorlabels_hide"
                  }
                >
                  {"Email" + " " + emailError}
                </p>
              </div>
              <div style={{ marginTop: "26px" }}>
                <p className="register_inputlabel">Password</p>
                <Input.Password
                  className={
                    passwordError != "" && validationTrigger
                      ? "register_errorinput"
                      : "register_input"
                  }
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationTrigger) {
                      setPasswordError(addressValidator(e.target.value));
                    }
                  }}
                  value={password}
                  status={passwordError != "" ? "error" : ""}
                />
                <p
                  className={
                    passwordError != "" && validationTrigger
                      ? "register_errorlabels_visible"
                      : "register_errorlabels_hide"
                  }
                >
                  {"Password" + " " + passwordError}
                </p>
              </div>

              <div className="lmslogin_forgotpasswordContainer">
                <p
                  className="lmslogin_forgotpassword"
                  onClick={() => navigate("/forgotpassword")}
                >
                  Forgot password?
                </p>
              </div>

              {loading ? (
                <button
                  className="register_disablesubmitbutton"
                  style={{ marginTop: "36px" }}
                  onClick={(e) => e.preventDefault()}
                >
                  <>
                    <Spin
                      size="default"
                      indicator={
                        <LoadingOutlined
                          style={{ color: "#ffffff", marginRight: "6px" }}
                          spin
                        />
                      }
                    />{" "}
                    Loading...
                  </>
                </button>
              ) : (
                <button
                  className="register_submitbutton"
                  style={{ marginTop: "36px" }}
                  onClick={handleSubmit}
                  type="submit"
                >
                  Sign In
                </button>
              )}
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

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
import { adminLogin, getCourses } from "../Common/action";
import { LoadingOutlined } from "@ant-design/icons";
import { MdMenuBook } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import InterviewIcon from "../images/login-interview-icon.png";

export default function LmsLogin() {
  const navigate = useNavigate();
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
        if (loginDetails.role_id === 1 || loginDetails.role_id === 2) {
          navigate("/question-upload");
        } else {
          getCourseData(loginDetails.course_id);
        }
      }, 1000);
    } catch (error) {
      console.log("login error", error);
      setLoading(false);
      CommonToaster(error?.response?.data?.message || "Internal server error.");
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

  return (
    <div className="register_mainContainer">
      <div className="register_largecard">
        <div className="lmslogin_blurBackground"></div>

        <Row gutter={0}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            className="register_left-Col-Container"
          >
            <div className="register_leftContainer">
              <p className="register_heading">
                Login Once.
                <br />
                Access 3 Portals.
              </p>

              <div className="register_points">
                <div className="lmsregister_subheadingContainer">
                  <MdMenuBook color="#ffffff" size={20} />
                  <h3>LMS</h3>
                </div>

                <ul>
                  <li>Watch top trainers' videos and docs</li>
                  <li>Learn anytime with videos and documents.</li>
                  <li>
                    Quickly find topics with organized learning materials.
                  </li>
                </ul>

                <div className="lmsregister_subheadingContainer">
                  <img src={InterviewIcon} style={{ width: "20px" }} />
                  <h3>Interview</h3>
                </div>

                <ul>
                  <li>Practice company-based interview questions.</li>
                  <li>Take online assessment tests to crack interviews</li>
                  <li>Prepare effectively with real-world questions.</li>
                </ul>

                <div className="lmsregister_subheadingContainer">
                  <FaUsers color="#ffffff" size={20} />
                  <h3>Placement</h3>
                </div>
                <ul>
                  <li>Upload your updated resume to the placement portal</li>
                  <li>Mention ACTE course in your resume for placement</li>
                  <li>Stay confident—your dream job awaits!</li>
                </ul>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} style={{ marginTop: "20px" }}>
            <div className="lmslogin_rightContainer">
              <p className="register_createaccount_heading">Sign In</p>
              <p className="register_smalltext">
                Dont have an account?{" "}
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
              <form>
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
                <div style={{ marginTop: "26px", marginBottom: "10px" }}>
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

                {loading ? (
                  <button
                    className="register_disablesubmitbutton"
                    style={{ marginTop: "30px" }}
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
                    style={{ marginTop: "30px" }}
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
    </div>
  );
}

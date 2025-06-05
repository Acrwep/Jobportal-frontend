import React, { useState, useEffect } from "react";
import { Row, Col, Input, Select, DatePicker, Spin } from "antd";
import "./styles.css";
import {
  addressValidator,
  emailValidator,
  nameValidator,
  selectValidator,
} from "../Common/Validation";
import {
  createAdmin,
  getCourses,
  getCoursesLocations,
  getRoles,
} from "../Common/action";
import { CommonToaster } from "../Common/CommonToaster";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { MdMenuBook } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { TbArrowBadgeRight } from "react-icons/tb";
import ActeLogo from "../images/old-acte-logo.png";
import StudentImage from "../images/banner-girl.png";
import axios from "axios";
import InterviewIcon from "../images/login-interview.png";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [courseOptions, setCourseOptions] = useState([]);
  const [course, setCourse] = useState(null);
  const [courseError, setCourseError] = useState("");
  const [courseLoationOptions, setCourseLoactionOptions] = useState([]);
  const [courseLoation, setCourseLoaction] = useState(null);
  const [courseLoationError, setCourseLoactionError] = useState("");
  const [coursejoingDate, setCoursejoingDate] = useState();
  const [coursejoingDateError, setCoursejoingDateError] = useState("");
  const [rolesData, setRolesData] = useState([]);
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const api = axios.create({
    baseURL: "https://actecrm.com",
    headers: { "Content-Type": "multipart/form-data" },
  });

  api.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const crmEmailValidation = async (payload) => {
    try {
      const response = await api.post("/email-validation.php", payload);
      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getCourseData();
  }, []);

  const getCourseData = async () => {
    try {
      const response = await getCourses();
      console.log("course response", response);
      if (response?.data?.data) {
        setCourseOptions(response?.data?.data);
      } else {
        setCourseOptions([]);
      }
    } catch (error) {
      setCourseOptions([]);
      console.log("course error", error);
    } finally {
      setTimeout(() => {
        getCourseLocationData(null, null);
      }, 300);
    }
  };

  const getCourseLocationData = async () => {
    try {
      const response = await getCoursesLocations();
      console.log("course location response", response);
      if (response?.data?.data) {
        setCourseLoactionOptions(response?.data?.data);
      } else {
        setCourseLoactionOptions([]);
      }
    } catch (error) {
      setCourseLoactionOptions([]);
      console.log("course location error", error);
    } finally {
      setTimeout(() => {
        getRolesData();
      }, 300);
    }
  };

  const getRolesData = async () => {
    try {
      const response = await getRoles();
      console.log("roles response", response);
      if (response?.data?.data) {
        setRolesData(response?.data?.data);
      } else {
        setRolesData([]);
      }
    } catch (error) {
      setRolesData([]);
      console.log("roles error", error);
    }
  };

  const handleEmail = async (e) => {
    setEmail(e.target.value);
    if (validationTrigger) {
      const emailValidate = emailValidator(e.target.value);
      setEmailError(emailValidate);

      const formData = new FormData();
      formData.append("email", e.target.value);
      if (emailValidate === "") {
        setTimeout(async () => {
          try {
            const response = await crmEmailValidation(formData);
            if (response?.data?.message === "Email ID is not exist.") {
              setEmailError(" is not valid. Contact acte support team.");
            } else {
              setEmailError("");
            }
            console.log("crm email response", response);
          } catch (error) {
            console.log("php email error", error);
          }
        }, 300);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationTrigger(true);

    const nameValidate = nameValidator(name);
    const emailValidate = emailValidator(email);
    let crmEmailValidate = "";
    const passwordValidate = addressValidator(password);
    const courseValidate = selectValidator(course);
    const courseLocationValidate = selectValidator(courseLoation);
    const coursejoiningValidate = selectValidator(coursejoingDate);

    setNameError(nameValidate);
    setEmailError(emailValidate);
    setPasswordError(passwordValidate);
    setCourseError(courseValidate);
    setCourseLoactionError(courseLocationValidate);
    setCoursejoingDateError(coursejoiningValidate);

    const formData = new FormData();
    formData.append("email", email);

    if (emailValidate === "") {
      try {
        const response = await crmEmailValidation(formData);
        if (response?.data?.message === "Email ID is not exist.") {
          setEmailError(" is not valid. Contact acte support team.");
          crmEmailValidate = " is not valid. Contact acte support team.";
        } else {
          crmEmailValidate = "";
          setEmailError("");
        }
        console.log("crm email response", response);
      } catch (error) {
        console.log("php email error", error);
      }
    }

    if (
      nameValidate ||
      emailValidate ||
      crmEmailValidate ||
      passwordValidate ||
      courseValidate ||
      courseLocationValidate ||
      coursejoiningValidate
    )
      return;
    setButtonLoading(true);
    let studentRoleId;
    rolesData.map((item) => {
      if (item.name === "Student") {
        studentRoleId = item.id;
      }
    });
    const payload = {
      name: name,
      email: email,
      password: password,
      role_id: studentRoleId,
      course_id: course,
      location_id: courseLoation,
      course_join_date: coursejoingDate,
    };

    try {
      await createAdmin(payload);
      CommonToaster("Registered successfully!");
      setTimeout(() => {
        setButtonLoading(false);
        navigate("/login");
      }, 1000);
    } catch (error) {
      setButtonLoading(false);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  return (
    <div className="loginpage_maincontainer">
      <Row style={{ height: "100%" }}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          style={{ backgroundColor: "#555ca3", position: "relative" }}
        >
          <div className="loginpage_leftContainer">
            <p className="loginpage_leftheading">
              Login Once.
              <br />
              Access 3 Portals.
            </p>

            <div className="loginpage_points">
              <div className="loginpage_subheadingContainer">
                <MdMenuBook color="#ffffff" size={20} />
                <h3>LMS</h3>
              </div>

              <ul>
                <li>
                  <TbArrowBadgeRight size={18} style={{ marginRight: "6px" }} />{" "}
                  Watch top trainers' videos and docs
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Learn anytime with videos and documents.
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Quickly find topics with organized learning materials.
                </li>
              </ul>

              <div className="loginpage_subheadingContainer">
                <img src={InterviewIcon} style={{ width: "22px" }} />
                <h3>Interview preparation powered by ai</h3>
              </div>

              <ul>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Practice company-based interview questions.
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Take online assessment tests to crack interviews
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Prepare effectively with real-world questions.
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
                  Upload your updated resume to the placement portal
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Mention ACTE course in your resume for placement
                </li>
                <li>
                  {" "}
                  <TbArrowBadgeRight
                    size={18}
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Stay confident—your dream job awaits!
                </li>
              </ul>
            </div>
          </div>

          <div className="loginpage_leftbuttonContainer">
            <div
              className="loginpage_leftinactive_button"
              style={{ marginBottom: "16px" }}
              onClick={() => navigate("/login")}
            >
              Login
            </div>
            <div className="loginpage_leftactive_button">Sign up</div>
          </div>

          <div className="loginpage_leftbackground_imageContainer">
            <img
              src={StudentImage}
              className="loginpage_leftbackground_image"
            />
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12}>
          <div className="loginpage_rightContainer">
            <img src={ActeLogo} className="loginpage_logo" />
            <p className="register_smalltext">
              Already have an account?{" "}
              <span
                style={{
                  color: "#0056b3",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/login")}
              >
                Sign in
              </span>
            </p>
            <form style={{ width: "90%" }}>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <div style={{ position: "relative" }}>
                    <p className="register_inputlabel">Full Name</p>
                    <Input
                      className={
                        nameError != "" && validationTrigger
                          ? "lmsregister_errorinput"
                          : "lmsregister_input"
                      }
                      onChange={(e) => {
                        setName(e.target.value);
                        if (validationTrigger) {
                          setNameError(nameValidator(e.target.value));
                        }
                      }}
                      value={name}
                      status={nameError != "" ? "error" : ""}
                    />
                    <p
                      className={
                        nameError != "" && validationTrigger
                          ? "register_errorlabels_visible"
                          : "register_errorlabels_hide"
                      }
                    >
                      {"Name" + " " + nameError}
                    </p>
                  </div>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  className="registerpage_inputright_col_container"
                >
                  <div>
                    <p className="register_inputlabel">Email</p>
                    <Input
                      className={
                        emailError != "" && validationTrigger
                          ? "lmsregister_errorinput"
                          : "lmsregister_input"
                      }
                      onChange={handleEmail}
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
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: "22px" }}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <div>
                    <p className="register_inputlabel">Password</p>
                    <Input.Password
                      className={
                        passwordError != "" && validationTrigger
                          ? "lmsregister_errorinput"
                          : "lmsregister_input"
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
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  className="registerpage_inputright_col_container"
                >
                  <div>
                    <p className="register_inputlabel">Course</p>
                    <Select
                      className={
                        courseError != "" && validationTrigger
                          ? "lmsregister_errorinput"
                          : "lmsregister_input"
                      }
                      onChange={(value) => {
                        setCourse(value);
                        if (validationTrigger) {
                          setCourseError(selectValidator(value));
                        }
                      }}
                      value={course}
                      status={courseError != "" ? "error" : ""}
                      options={courseOptions.map((item) => ({
                        value: item.id ? item.id : item.name,
                        label: item.full_Name ? item.full_Name : item.name,
                      }))}
                    />
                    <p
                      className={
                        courseError != "" && validationTrigger
                          ? "register_errorlabels_visible"
                          : "register_errorlabels_hide"
                      }
                    >
                      {"Course" + " " + courseError}
                    </p>
                  </div>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: "22px" }}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <div>
                    <p className="register_inputlabel">Course Location</p>
                    <Select
                      className={
                        courseLoationError != "" && validationTrigger
                          ? "lmsregister_errorinput"
                          : "lmsregister_input"
                      }
                      onChange={(value) => {
                        setCourseLoaction(value);
                        if (validationTrigger) {
                          setCourseLoactionError(selectValidator(value));
                        }
                      }}
                      value={courseLoation}
                      status={courseLoationError != "" ? "error" : ""}
                      options={courseLoationOptions.map((item) => ({
                        value: item.id ? item.id : item.name,
                        label: item.full_Name ? item.full_Name : item.name,
                      }))}
                    />
                    <p
                      className={
                        courseLoationError != "" && validationTrigger
                          ? "register_errorlabels_visible"
                          : "register_errorlabels_hide"
                      }
                    >
                      {"Course Location" + " " + courseLoationError}
                    </p>
                  </div>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  className="registerpage_inputright_col_container"
                >
                  <div>
                    <p className="register_inputlabel">Course Joining Date</p>
                    <DatePicker
                      className={
                        coursejoingDateError != "" && validationTrigger
                          ? "lmsregister_errorinput"
                          : "lmsregister_input"
                      }
                      onChange={(value) => {
                        setCoursejoingDate(value);
                        if (validationTrigger) {
                          setCoursejoingDateError(selectValidator(value));
                        }
                      }}
                      value={coursejoingDate}
                      status={coursejoingDateError != "" ? "error" : ""}
                    />
                    <p
                      className={
                        coursejoingDateError != "" && validationTrigger
                          ? "register_errorlabels_visible"
                          : "register_errorlabels_hide"
                      }
                    >
                      {"Course Joining Date" + " " + coursejoingDateError}
                    </p>
                  </div>
                </Col>
              </Row>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                {buttonLoading ? (
                  <button
                    className="registerpage_disablesubmitbutton"
                    onClick={(e) => e.preventDefault()}
                    style={{ marginTop: "20px" }}
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
                    className="registerpage_submitbutton"
                    style={{ marginTop: "20px" }}
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

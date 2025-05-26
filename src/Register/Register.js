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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationTrigger(true);

    const nameValidate = nameValidator(name);
    const emailValidate = emailValidator(email);
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

    if (
      nameValidate ||
      emailValidate ||
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
    <div className="register_mainContainer">
      <div className="register_largecard">
        <div className="register_blurBackground"></div>

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
                Learn Fast.
                <br />
                Break Nothing.
              </p>

              <div className="register_points">
                <h3>Remove Barriers</h3>
                <p>
                  Enrollment delays and course approvals can slow you down — now
                  you can easily remove these barriers and start learning right
                  away.
                </p>

                <h3 style={{ marginTop: "24px" }}>Access Smart Guidance</h3>
                <p>
                  We use advanced tools and personalized support to guide your
                  educational journey, making enrollment, learning, and progress
                  tracking simple and efficient.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12}>
            <div className="lmsregister_rightContainer">
              <p className="register_createaccount_heading">
                Create an account.
              </p>
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

              <form>
                <div style={{ marginTop: "16px", position: "relative" }}>
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
                <div style={{ marginTop: "22px" }}>
                  <p className="register_inputlabel">Email</p>
                  <Input
                    className={
                      emailError != "" && validationTrigger
                        ? "lmsregister_errorinput"
                        : "lmsregister_input"
                    }
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationTrigger) {
                        setEmailError(emailValidator(e.target.value));
                      }
                    }}
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
                <div style={{ marginTop: "22px" }}>
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

                <div style={{ marginTop: "22px" }}>
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

                <div style={{ marginTop: "22px" }}>
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

                <div style={{ marginTop: "22px", marginBottom: "22px" }}>
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

                {buttonLoading ? (
                  <button
                    className="register_disablesubmitbutton"
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
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Submit
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

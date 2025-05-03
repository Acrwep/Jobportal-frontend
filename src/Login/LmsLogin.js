import React, { useState, useEffect } from "react";
import { Row, Col, Input, Checkbox } from "antd";
import "./styles.css";
import {
  addressValidator,
  emailValidator,
  nameValidator,
} from "../Common/Validation";

export default function LmsLogin() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [validationTrigger, setValidationTrigger] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationTrigger(true);

    const emailValidate = emailValidator(email);
    const passwordValidate = addressValidator(password);

    setEmailError(emailValidate);
    setPasswordError(passwordValidate);

    if (emailValidate || passwordValidate) return;

    alert("success");
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
                <div style={{ marginTop: "22px", marginBottom: "10px" }}>
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
                <button
                  className="register_submitbutton"
                  onClick={handleSubmit}
                  type="submit"
                >
                  Sign In
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

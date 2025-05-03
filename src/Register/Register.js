import React, { useState, useEffect } from "react";
import { Row, Col, Input, Checkbox } from "antd";
import "./styles.css";
import {
  addressValidator,
  emailValidator,
  nameValidator,
} from "../Common/Validation";

export default function Register() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isTrainer, setIsTrainer] = useState(false);
  const [checkBoxError, setCheckBoxError] = useState(false);
  const [validationTrigger, setValidationTrigger] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationTrigger(true);

    const nameValidate = nameValidator(name);
    const emailValidate = emailValidator(email);
    const passwordValidate = addressValidator(password);
    let checkboxValidate = false;

    setNameError(nameValidate);
    setEmailError(emailValidate);
    setPasswordError(passwordValidate);

    if (isAdmin === false && isTrainer === false && isStudent === false) {
      setCheckBoxError(true);
      checkboxValidate = true;
    } else {
      checkboxValidate = false;
      setCheckBoxError(false);
    }
    if (nameValidate || emailValidate || passwordValidate || checkboxValidate)
      return;

    alert("success");
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
            <div className="register_rightContainer">
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
                >
                  Sign in
                </span>
              </p>

              <form>
                <div style={{ marginTop: "22px", position: "relative" }}>
                  <p className="register_inputlabel">Name</p>
                  <Input
                    className={
                      nameError != "" && validationTrigger
                        ? "register_errorinput"
                        : "register_input"
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
                <div style={{ marginTop: "22px" }}>
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

                <div className="register_checkboxContainer">
                  <Checkbox
                    checked={isAdmin}
                    onChange={(e) => {
                      setIsAdmin(e.target.checked);
                      if (e.target.checked === true) {
                        setIsTrainer(false);
                        setIsStudent(false);
                      }
                      if (validationTrigger) {
                        if (
                          e.target.checked === true ||
                          isStudent === true ||
                          isTrainer === true
                        ) {
                          setCheckBoxError(false);
                        }
                      }
                    }}
                    className={checkBoxError && "register_errorcheckbox"}
                  >
                    Admin
                  </Checkbox>
                  <Checkbox
                    checked={isTrainer}
                    onChange={(e) => {
                      setIsTrainer(e.target.checked);
                      if (e.target.checked === true) {
                        setIsAdmin(false);
                        setIsStudent(false);
                      }
                      if (validationTrigger) {
                        if (
                          e.target.checked === true ||
                          isStudent === true ||
                          isAdmin === true
                        ) {
                          setCheckBoxError(false);
                        }
                      }
                    }}
                    className={checkBoxError && "register_errorcheckbox"}
                  >
                    Trainer
                  </Checkbox>
                  <Checkbox
                    checked={isStudent}
                    onChange={(e) => {
                      setIsStudent(e.target.checked);
                      if (e.target.checked === true) {
                        setIsAdmin(false);
                        setIsTrainer(false);
                      }
                      if (validationTrigger) {
                        if (
                          e.target.checked === true ||
                          isTrainer === true ||
                          isAdmin === true
                        ) {
                          setCheckBoxError(false);
                        }
                      }
                    }}
                    className={checkBoxError && "register_errorcheckbox"}
                  >
                    Student
                  </Checkbox>
                </div>
                <button
                  className="register_submitbutton"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import {
  emailValidator,
  passwordValidator,
  selectValidator,
} from "../Common/Validation";
import "./styles.css";
import { adminLogin } from "../Common/action";
import { CommonToaster } from "../Common/CommonToaster";
import { LoadingOutlined } from "@ant-design/icons";
import Actelogo from "../images/acte-logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    setValidationTrigger(true);
    const emailValidate = emailValidator(email);
    const passwordValidate = passwordValidator(password);

    setEmailError(emailValidate);
    setPasswordError(passwordValidate);

    if (emailValidate || passwordValidate) {
      setLoading(false);
      return;
    }

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
      localStorage.setItem("loginDetails", JSON.stringify(loginDetails));
      const event = new Event("localStorageUpdated");
      window.dispatchEvent(event);

      setTimeout(() => {
        setLoading(false);
        navigate("/search");
      }, 1000);
    } catch (error) {
      setLoading(false);
      CommonToaster(error?.response?.data?.message || "Internal server error.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f3f2f1",
        overflowY: "hidden",
        height: "100vh",
      }}
    >
      <div className="login_headerContainer">
        <img src={Actelogo} className="login_actelogo" />
      </div>
      <div className="login_maincontainer">
        <div className="login_card">
          <p className="logincard_heading">Sign in</p>

          <form>
            <div style={{ position: "relative" }}>
              <label className="inputfields_label">Email</label>
              <Input
                className={
                  emailError ? "login_errorinputfields" : "login_inputfields"
                }
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationTrigger) {
                    setEmailError(emailValidator(e.target.value));
                  }
                }}
                status={emailError ? "error" : ""}
              />
              <div
                className={
                  emailError
                    ? "commoninput_errormessage_activediv"
                    : "commoninput_errormessagediv"
                }
              >
                <p style={{ color: "#ff4d4f", marginTop: "2px" }}>
                  {`Email ${emailError}`}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "24px", position: "relative" }}>
              <label className="inputfields_label">Password</label>
              <Input.Password
                className={
                  passwordError
                    ? "login_errorinputfields"
                    : "login_passwordinputfield"
                }
                name="password"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationTrigger) {
                    setPasswordError(passwordValidator(e.target.value));
                  }
                }}
                status={passwordError ? "error" : ""}
              />
              <div
                className={
                  passwordError
                    ? "commoninput_errormessage_activediv"
                    : "commoninput_errormessagediv"
                }
              >
                <p style={{ color: "#ff4d4f", marginTop: "2px" }}>
                  {passwordError}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <p className="login_forgotpasswordtext">Forgot Password?</p>
            </div>
            <button
              className={loading ? "loading_loginbutton" : "loginbutton"}
              type="submit"
              onClick={handleSubmit}
            >
              {loading ? (
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
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

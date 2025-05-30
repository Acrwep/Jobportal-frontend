import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Spin } from "antd";
import { HiOutlineFingerPrint } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io";
import "./styles.css";
import PortalInputField from "../Common/PortalInputField";
import { forgotPassword, sendOTP, validateOTP } from "../Common/action";
import {
  confirmPasswordValidator,
  emailValidator,
  passwordValidator,
} from "../Common/Validation";
import { CommonToaster } from "../Common/CommonToaster";
import { LoadingOutlined } from "@ant-design/icons";
import { HiOutlineMailOpen } from "react-icons/hi";
import { CgPassword } from "react-icons/cg";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [passwordValidationTrigger, setPasswordValidationTrigger] =
    useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleEmail = async (e) => {
    setEmail(e.target.value);
    if (validationTrigger) {
      setEmailError(emailValidator(e.target.value));
    }
  };
  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    setValidationTrigger(true);
    const emailValidate = emailValidator(email);

    setEmailError(emailValidate);

    if (emailValidate) return;
    setButtonLoading(true);
    try {
      const response = await sendOTP(email);
      console.log("otp response", response);
      setTabs("otp");
      CommonToaster("OTP send to your email!");
    } catch (error) {
      console.log("error", error);
      const Error = error?.response?.data?.details || "";
      if (
        Error ===
        "Error while sending otp:Error! Your email is not available in the database."
      ) {
        setEmailError(" is not valid");
      } else {
        CommonToaster(
          error?.response?.data || "Something went wrong.Try again later."
        );
      }
    } finally {
      setTimeout(() => {
        setButtonLoading(false);
      }, 300);
    }
  };

  const handleValidateOTP = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    const payload = {
      email: email,
      otp: otp,
    };
    try {
      const response = await validateOTP(payload);
      setTimeout(() => {
        setButtonLoading(false);
        setTabs("password");
      }, 300);
      console.log(response);
    } catch (error) {
      CommonToaster("Invalid OTP");
      setButtonLoading(false);
      console.log("otp error", error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setPasswordValidationTrigger(true);

    const passwordValidate = passwordValidator(password);
    const confirmPasswordValidate = confirmPasswordValidator(
      confirmPassword,
      password
    );

    setPasswordError(passwordValidate);
    setConfirmPasswordError(confirmPasswordValidate);

    if (passwordValidate || confirmPasswordValidate) return;
    setButtonLoading(true);
    const payload = {
      email: email,
      password: password,
    };
    try {
      const response = await forgotPassword(payload);
      console.log(response);
      CommonToaster("Password reset successfully!");
      setTimeout(() => {
        setButtonLoading(false);
      }, 1000);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setButtonLoading(false);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  return (
    <div className="forgotpassword_maincontainer">
      {tabs === "email" ? (
        <div className="forgotpassword_innercontainer">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="forgotpassword_iconContainer">
              <HiOutlineFingerPrint size={24} />
            </div>
          </div>

          <form>
            <p className="forgotpassword_heading">Forgot Password?</p>
            <div style={{ marginTop: "30px", position: "relative" }}>
              <p className="forgotpassword_emailinputlabel">Email</p>
              <Input
                label="Email"
                name="email"
                className={
                  emailError
                    ? "forgotpassword_emailerrorinputfield"
                    : "forgotpassword_emailinputfield"
                }
                placeholder="Enter your email"
                value={email}
                onChange={handleEmail}
                error={emailError}
              />
              <p
                className={
                  emailError === ""
                    ? "forgotpassword_emailerrorhide"
                    : "forgotpassword_emailerror"
                }
              >
                {"Email" + emailError}
              </p>
            </div>

            <div className="forgotpassword_buttonContainer">
              {buttonLoading ? (
                <button className="forgotpassword_disablebutton">
                  <>
                    <Spin
                      size="medium"
                      indicator={
                        <LoadingOutlined
                          style={{ color: "#ffffff", marginRight: "6px" }}
                          spin
                        />
                      }
                    />{" "}
                  </>
                </button>
              ) : (
                <button
                  className="forgotpassword_button"
                  onClick={handleGenerateOTP}
                  type="submit"
                >
                  Generate OTP
                </button>
              )}
            </div>
          </form>
          <div
            className="forgotpassword_backbuttonContainer"
            onClick={() => navigate("/login")}
          >
            <IoMdArrowBack size={19} />
            <p className="forgotpassword_backbutton">Back to login</p>
          </div>
        </div>
      ) : tabs === "otp" ? (
        <div className="forgotpassword_innercontainer">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="forgotpassword_iconContainer">
              <HiOutlineMailOpen size={24} />
            </div>
          </div>

          <form>
            <p className="forgotpassword_heading">Enter your code</p>
            <p className="forgotpassword_subheading">
              we send a code to{" "}
              <span style={{ fontWeight: 600, color: "#000" }}>{email}</span>
            </p>
            <div className="forgotpassword_otpinputfieldContainer">
              <Input.OTP
                length={6}
                onChange={(value) => {
                  setOtp(value);
                }}
              />
            </div>

            <div className="forgotpassword_buttonContainer">
              {buttonLoading ? (
                <button className="forgotpassword_disablebutton">
                  <>
                    <Spin
                      size="medium"
                      indicator={
                        <LoadingOutlined
                          style={{ color: "#ffffff", marginRight: "6px" }}
                          spin
                        />
                      }
                    />{" "}
                  </>
                </button>
              ) : (
                <button
                  className="forgotpassword_button"
                  onClick={handleValidateOTP}
                >
                  Continue
                </button>
              )}
            </div>
          </form>

          <div
            className="forgotpassword_backbuttonContainer"
            onClick={() => navigate("/login")}
          >
            <IoMdArrowBack size={19} />
            <p className="forgotpassword_backbutton">Back to login</p>
          </div>
        </div>
      ) : (
        <div className="forgotpassword_innercontainer">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="forgotpassword_iconContainer">
              <CgPassword size={24} />
            </div>
          </div>

          <form>
            <p className="forgotpassword_heading">Set new password</p>
            <div className="forgotpassword_emailinputContainer">
              <p className="forgotpassword_emailinputlabel">Password</p>
              <Input.Password
                className={
                  passwordError
                    ? "forgotpassword_emailerrorinputfield"
                    : "forgotpassword_emailinputfield"
                }
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordValidationTrigger) {
                    setPasswordError(passwordValidator(e.target.value));
                    setConfirmPasswordError(
                      confirmPasswordValidator(confirmPassword, e.target.value)
                    );
                  }
                }}
                error={passwordError}
              />
              <p
                className={
                  passwordError === ""
                    ? "forgotpassword_emailerrorhide"
                    : "forgotpassword_emailerror"
                }
              >
                {"Password" + passwordError}
              </p>
            </div>

            <div className="forgotpassword_emailinputContainer">
              <p className="forgotpassword_emailinputlabel">Confirm Password</p>
              <Input.Password
                className={
                  confirmPasswordError
                    ? "forgotpassword_emailerrorinputfield"
                    : "forgotpassword_emailinputfield"
                }
                placeholder="Enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordValidationTrigger) {
                    setConfirmPasswordError(
                      confirmPasswordValidator(e.target.value, password)
                    );
                  }
                }}
                error={confirmPasswordError}
              />
              <p
                className={
                  confirmPasswordError === ""
                    ? "forgotpassword_emailerrorhide"
                    : "forgotpassword_emailerror"
                }
              >
                {"Confirm Password" + confirmPasswordError}
              </p>
            </div>

            <div className="forgotpassword_buttonContainer">
              {buttonLoading ? (
                <button className="forgotpassword_disablebutton">
                  <>
                    <Spin
                      size="medium"
                      indicator={
                        <LoadingOutlined
                          style={{ color: "#ffffff", marginRight: "6px" }}
                          spin
                        />
                      }
                    />{" "}
                  </>
                </button>
              ) : (
                <button
                  className="forgotpassword_button"
                  onClick={handleResetPassword}
                >
                  Submit
                </button>
              )}
            </div>
          </form>

          <div
            className="forgotpassword_backbuttonContainer"
            onClick={() => navigate("/login")}
          >
            <IoMdArrowBack size={19} />
            <p className="forgotpassword_backbutton">Back to login</p>
          </div>
        </div>
      )}
    </div>
  );
}

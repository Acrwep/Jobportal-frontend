import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Spin } from "antd";
import Actelogo from "../images/acte-logo.png";
import CommonInputField from "../Common/CommonInputField";
import { getAllUsers, getCourses } from "../Common/action";
import {
  addressValidator,
  emailValidator,
  selectValidator,
} from "../Common/Validation";
import { LoadingOutlined } from "@ant-design/icons";
import { CommonToaster } from "../Common/CommonToaster";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

export default function TestInvite() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const today = new Date();

  useEffect(() => {
    if (isTokenExpired(token)) {
      console.log("Token is expired");
      navigate("/token-unavailable");
    } else {
      localStorage.setItem("Accesstoken", token);
      console.log("Token is valid");
    }
  }, []);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return true;

      const currentTime = Date.now() / 1000; // in seconds
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Invalid token:", error);
      return true; // treat invalid tokens as expired
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationTrigger(true);
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    console.log(isMobile);
    if (isMobile) {
      CommonToaster("Please use laptop or desktop");
      return;
    }
    const fullnameValidate = addressValidator(fullName);
    const emailValidate = emailValidator(email);
    // const courseValidate = selectValidator(courseId);

    setFullNameError(fullnameValidate);
    setEmailError(emailValidate);
    // setCourseIdError(courseValidate);

    if (fullnameValidate || emailValidate) return;
    setButtonLoading(true);
    const payload = {
      email: email,
    };
    try {
      const response = await getAllUsers(payload);
      console.log(response);
      const users = response?.data?.data || [];
      if (users.length >= 1) {
        setTimeout(() => {
          navigate("/online-test", {
            state: {
              userId: users[0].id,
              courseId: users[0].course_id,
            },
          });
          setButtonLoading(false);
        }, 1000);
      } else {
        setButtonLoading(false);
        CommonToaster("Your not registered yet. Contact Acte Support");
      }
    } catch (error) {
      setButtonLoading(false);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  return (
    <div className="testinvite_mainContainer">
      <Row style={{ height: "84vh" }}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          style={{ borderRight: "1px solid rgba(128, 128, 128, 0.404)" }}
        >
          <img src={Actelogo} className="testinvite_logo" />
          <div style={{ marginTop: "20px" }}>
            <p className="testinvite_sessionheading">Test Overview</p>

            <div className="testinvite_detailsContainer">
              <div>
                <p className="testinvite_detailsheadings">Test Name: </p>
                <p className="testinvite_detailsheadings">Total Duration: </p>
                <p className="testinvite_detailsheadings">Date: </p>
              </div>

              <div>
                <p className="testinvite_detailstext">Online Assessment</p>
                <p className="testinvite_detailstext">30 Minutes</p>
                <p className="testinvite_detailstext">
                  {moment(today).format("DD MMMM YYYY")}
                </p>
              </div>
            </div>

            <p className="testinvite_sectionoverview_heading">
              Sections Overview
            </p>

            <div className="testinvite_detailsContainer">
              <div>
                <p className="testinvite_sectiontableheading">Section</p>
                <p className="testinvite_sectiontabledatas">Section A</p>
                <p className="testinvite_sectiontabledatas">Section B</p>
              </div>

              <div>
                <p className="testinvite_sectiontableheading">
                  No. of Questions
                </p>
                <p className="testinvite_sectiontabledatas">10</p>
                <p className="testinvite_sectiontabledatas">10</p>
              </div>

              <div>
                <p className="testinvite_sectiontableheading">Time</p>
                <p className="testinvite_sectiontabledatas">20</p>
                <p className="testinvite_sectiontabledatas">25</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12}>
          <div className="testinvite_formmainContainer">
            <p className="testinvite_formheading">Please fill your details</p>

            <form className="testinvite_formContainer">
              <div style={{ marginBottom: "22px" }}>
                <CommonInputField
                  label="Full Name"
                  mandatory
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (validationTrigger) {
                      setFullNameError(addressValidator(e.target.value));
                    }
                  }}
                  error={fullNameError}
                />
              </div>
              <div>
                <CommonInputField
                  label="Email"
                  mandatory
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationTrigger) {
                      setEmailError(addressValidator(e.target.value));
                    }
                  }}
                  error={emailError}
                />
              </div>
              <div className="testinvite_formbuttonContainer">
                {buttonLoading ? (
                  <button
                    className="testinvite_formbuttondisable"
                    onClick={(e) => e.preventDefault()}
                  >
                    <>
                      <Spin
                        size="small"
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
                    className="testinvite_formbutton"
                    onClick={handleSubmit}
                  >
                    Start Test
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

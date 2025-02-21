import React, { useState } from "react";
import CommonInputField from "../Common/CommonInputField";
import { Col, Row, Upload } from "antd";
import {
  addressValidator,
  emailValidator,
  mobileValidator,
  nameValidator,
  selectValidator,
} from "../Common/Validation";
import CommonDatePicker from "../Common/CommonDatePicker";
import CommonSelectField from "../Common/CommonSelectField";
import { CloudUploadOutlined } from "@ant-design/icons";
import "./styles.css";
import { CommonToaster } from "../Common/CommonToaster";
import { createStudent } from "../Common/action";
import moment from "moment";

export default function StudentRegister() {
  const { Dragger } = Upload;

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobile, setMobile] = useState();
  const [mobileError, setMobileError] = useState("");
  const [dateOfbirth, setDateOfbirth] = useState();
  const [dateOfbirthError, setDateOfbirthError] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [collegeNameError, setCollegeNameError] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [passedOut, setPassedOut] = useState("");
  const [passedOutError, setPassedOutError] = useState("");
  const skillsOptions = [
    { id: "1", name: "HTML" },
    { id: "2", name: "CSS" },
    { id: "3", name: "Java" },
  ];
  const [skills, setSkills] = useState([]);
  const [skillsError, setSkillsError] = useState("");
  const [interest, setInterest] = useState("");
  const [interestError, setInterestError] = useState("");
  const experienceOptions = [
    { id: 1, name: "Fresher" },
    { id: 2, name: "0-1 Year" },
    { id: 3, name: "1-2 Years" },
    { id: 4, name: "2-4 Tears" },
    { id: 5, name: "Greater Than 5 Years" },
  ];
  const [experience, setExperience] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [designation, setDesignation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [workingStatus, setWorkingStatus] = useState();

  const workingStatusOptions = [
    { id: 1, name: "Yes" },
    { id: 2, name: "No" },
  ];
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [resume, setResume] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [resumeError, setResumeError] = useState("");

  const handleAttachment = ({ file }) => {
    const OriginFile = file.originFileObj;
    const ValidType = file.type === "application/pdf";

    if (file.status === "uploading") {
      return;
    }
    if (ValidType) {
      console.log("fileeeee", OriginFile);
      CommonToaster("Attachment uploaded successfully");
      setResumeName(OriginFile.name);
      const reader = new FileReader();
      reader.readAsDataURL(OriginFile);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Extract Base64 content
        console.log("Base64 Resume:", base64String);
        setResume(base64String); // Store in state
        setResumeError(selectValidator(base64String));
      };
    } else {
      CommonToaster("Accept only .png");
      setResume("");
      setResumeError(" is required");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setValidationTrigger(true);

    const nameValidate = nameValidator(name);
    const emailValidate = emailValidator(email);
    const mobileValidate = mobileValidator(mobile);
    const dobValidate = selectValidator(dateOfbirth);
    const addressValidate = addressValidator(address);
    const locationValidate = addressValidator(location);
    const collegeNameValidate = addressValidator(collegeName);
    const departmentValidate = addressValidator(department);
    const passedOutValidate = addressValidator(passedOut);
    const skillsValidate = selectValidator(skills);
    const interestValidate = addressValidator(interest);
    const experienceValidate = selectValidator(experience);
    const resumeValidate = selectValidator(resume);

    setNameError(nameValidate);
    setEmailError(emailValidate);
    setMobileError(mobileValidate);
    setDateOfbirthError(dobValidate);
    setAddressError(addressValidate);
    setLocationError(locationValidate);
    setCollegeNameError(collegeNameValidate);
    setDepartmentError(departmentValidate);
    setPassedOutError(passedOutValidate);
    setSkillsError(skillsValidate);
    setInterestError(interestValidate);
    setExperienceError(experienceValidate);
    if (resumeValidate) {
      CommonToaster("Resume is required");
    }
    if (
      nameValidate ||
      emailValidate ||
      mobileValidate ||
      dobValidate ||
      addressValidate ||
      locationValidate ||
      collegeNameValidate ||
      departmentValidate ||
      passedOutValidate ||
      skillsValidate ||
      interestValidate ||
      experienceValidate ||
      resumeValidate
    )
      return;

    const payload = {
      name: name,
      email: email,
      mobile: mobile,
      DOB: moment(dateOfbirth).format("YYYY-MM-DD"),
      address: address,
      location: location,
      collegeName: collegeName,
      collegeDepartment: department,
      passedout: passedOut,
      skills: skills,
      interest: interest,
      experience: experience,
      designation: designation,
      companyname: companyName,
      workingStatus: workingStatus === 1 ? true : false,
      resume: resume,
    };
    console.log("payload", payload);
    try {
      const response = await createStudent(payload);
      CommonToaster(response?.data?.message);
      formReset();
    } catch (error) {
      console.log(error);
    }
  };

  const formReset = () => {
    setValidationTrigger(false);
    setName("");
    setNameError("");
    setEmail("");
    setEmailError("");
    setMobile("");
    setMobileError("");
    setDateOfbirth();
    setDateOfbirthError("");
    setAddress("");
    setAddressError("");
    setLocation("");
    setLocationError("");
    setCollegeName("");
    setCollegeNameError("");
    setDepartment("");
    setDepartmentError("");
    setPassedOut("");
    setPassedOutError("");
    setSkills("");
    setSkillsError("");
    setInterest("");
    setInterestError("");
    setExperience("");
    setExperienceError("");
    setDesignation("");
    setCompanyName("");
    setWorkingStatus();
    setResume("");
    setResumeName("");
    setResumeError("");
  };

  return (
    <div className="register_mainContainer">
      <div className="register_cardContainer">
        <p className="register_heading">Job Portal</p>
        {/* row 1 */}
        <Row gutter={32} className="register_formfieldrowcontainer">
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
            <CommonInputField
              label="Name"
              value={name}
              mandatory={true}
              onChange={(e) => {
                setName(e.target.value);
                if (validationTrigger) {
                  setNameError(nameValidator(e.target.value));
                }
              }}
              error={nameError}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className="register_formfieldcolumncontainer"
          >
            <CommonInputField
              label="Email"
              value={email}
              mandatory={true}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationTrigger) {
                  setEmailError(emailValidator(e.target.value));
                }
              }}
              error={emailError}
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
            <CommonInputField
              label="Mobile"
              value={mobile}
              mandatory={true}
              onChange={(e) => {
                setMobile(e.target.value);
                if (validationTrigger) {
                  setMobileError(mobileValidator(e.target.value));
                }
              }}
              error={mobileError}
              maxLength={10}
            />
          </Col>
        </Row>

        {/* row 2 */}
        <Row gutter={32} className="register_formfieldrowcontainer">
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className="register_formfieldcolumncontainer"
          >
            <CommonDatePicker
              label="Date Of Birth"
              value={dateOfbirth}
              mandatory={true}
              onChange={(value) => {
                setDateOfbirth(value);
                if (validationTrigger) {
                  setDateOfbirthError(selectValidator(value));
                }
              }}
              error={dateOfbirthError}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className="register_formfieldcolumncontainer"
          >
            <CommonInputField
              label="Address"
              value={address}
              mandatory={true}
              onChange={(e) => {
                setAddress(e.target.value);
                if (validationTrigger) {
                  setAddressError(addressValidator(e.target.value));
                }
              }}
              error={addressError}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className="register_formfieldcolumncontainer"
          >
            <CommonInputField
              label="Location"
              value={location}
              mandatory={true}
              onChange={(e) => {
                setLocation(e.target.value);
                if (validationTrigger) {
                  setLocationError(addressValidator(e.target.value));
                }
              }}
              error={locationError}
            />
          </Col>
        </Row>
        {/* row 3 */}
        <Row gutter={32} className="register_formfieldrowcontainer">
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
            <CommonInputField
              label="College Name"
              value={collegeName}
              mandatory={true}
              onChange={(e) => {
                setCollegeName(e.target.value);
                if (validationTrigger) {
                  setCollegeNameError(addressValidator(e.target.value));
                }
              }}
              error={collegeNameError}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className="register_formfieldcolumncontainer"
          >
            <CommonInputField
              label="College Department"
              value={department}
              mandatory={true}
              onChange={(e) => {
                setDepartment(e.target.value);
                if (validationTrigger) {
                  setDepartmentError(addressValidator(e.target.value));
                }
              }}
              error={departmentError}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className="register_formfieldcolumncontainer"
          >
            <CommonInputField
              label="Year Of Passedout"
              value={passedOut}
              mandatory={true}
              onChange={(e) => {
                setPassedOut(e.target.value);
                if (validationTrigger) {
                  setPassedOutError(addressValidator(e.target.value));
                }
              }}
              error={passedOutError}
            />
          </Col>
        </Row>

        {/* row 4 */}
        <Row gutter={32} className="register_formfieldrowcontainer">
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
            <CommonSelectField
              label="Skills"
              mode="tags"
              mandatory={true}
              options={skillsOptions}
              value={skills}
              onChange={(value) => {
                console.log("skillsss", value);
                setSkills(value);
                if (validationTrigger) {
                  setSkillsError(selectValidator(value));
                }
              }}
              error={skillsError}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className="register_formfieldcolumncontainer"
          >
            <CommonInputField
              label="Interest"
              value={interest}
              mandatory={true}
              onChange={(e) => {
                setInterest(e.target.value);
                if (validationTrigger) {
                  setInterestError(addressValidator(e.target.value));
                }
              }}
              error={interestError}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className="register_formfieldcolumncontainer"
          >
            <CommonSelectField
              label="Experience"
              options={experienceOptions}
              value={experience}
              mandatory={true}
              onChange={(value) => {
                setExperience(value);
                if (validationTrigger) {
                  setExperienceError(selectValidator(value));
                }
              }}
              error={experienceError}
            />
          </Col>
        </Row>

        {/* row 5 */}
        <Row
          gutter={32}
          className="register_formfieldrowcontainer"
          style={{ marginBottom: "20px" }}
        >
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
            <CommonInputField
              label="Designation"
              mandatory={false}
              value={designation}
              onChange={(e) => {
                setDesignation(e.target.value);
              }}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className="register_formfieldcolumncontainer"
          >
            <CommonInputField
              label="Company Name"
              mandatory={false}
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
              }}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            xl={8}
            xxl={8}
            className="register_formfieldcolumncontainer"
          >
            <CommonSelectField
              label="Currently Working"
              options={workingStatusOptions}
              onChange={(value) => {
                setWorkingStatus(value);
              }}
              value={workingStatus}
              mandatory={false}
            />
          </Col>
        </Row>
        <Dragger
          className="draganddrop_container"
          multiple={false}
          onChange={handleAttachment}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined style={{ color: "#0056b3" }} />
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="register_resumeContainer">
              <p>Upload Resume</p>
            </div>
          </div>
        </Dragger>
        {resumeName && <p className="register_resumename">{resumeName}</p>}
        <div className="register_submitContainer">
          <button className="register_submitbutton" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

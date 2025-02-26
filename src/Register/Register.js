import React, { useState, useEffect } from "react";
import "./styles.css";
import CommonInputField from "../Common/CommonInputField";
import CommonDatePicker from "../Common/CommonDatePicker";
import { Col, Divider, Row, Button, Checkbox, Upload, Spin } from "antd";
import CommonSelectField from "../Common/CommonSelectField";
import { CloudUploadOutlined } from "@ant-design/icons";
import { CommonToaster } from "../Common/CommonToaster";
import {
  addressValidator,
  emailValidator,
  lastNameValidator,
  mobileValidator,
  nameValidator,
  selectValidator,
} from "../Common/Validation";
import { candidateRegistration, getCandidates } from "../Common/action";
import CommonMultiSelect from "../Common/CommonMultiSelect";
import { LoadingOutlined } from "@ant-design/icons";
import Actelogo from "../images/acte-logo.png";
import cardImage from "../images/registrationimage.png";
import { BsPatchCheckFill } from "react-icons/bs";

export default function Register() {
  const { Dragger } = Upload;
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobile, setMobile] = useState();
  const [mobileError, setMobileError] = useState("");
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [experienceYear, setExperienceYear] = useState(null);
  const [experienceYearError, setExperienceYearError] = useState("");
  const [experienceMonth, setExperienceMonth] = useState(null);
  const [experienceMonthError, setExperienceMonthError] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [designation, setDesignation] = useState("");
  const [designationError, setDesignationError] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startDateError, setStartDateError] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [endDateError, setEndDateError] = useState("");
  const [workingStatus, setworkingStatus] = useState(false);
  const [showCompanyfields, setShowCompanyfields] = useState(true);

  const [validationTrigger, setValidationTrigger] = useState(false);

  const experienceYearsOptions = [
    { id: 0, name: "0 years" },
    { id: 1, name: "1 years" },
    { id: 2, name: "2 years" },
    { id: 3, name: "3 years" },
    { id: 4, name: "4 years" },
    { id: 5, name: "5 years" },
    { id: 6, name: "6 years" },
    { id: 7, name: "7 years" },
    { id: 8, name: "8 years" },
    { id: 9, name: "9 years" },
    { id: 10, name: "10 years" },
    { id: 11, name: "11 years" },
    { id: 12, name: "12 years" },
    { id: 13, name: "13 years" },
    { id: 14, name: "14 years" },
    { id: 15, name: "15 years" },
  ];
  const experienceMonthsOptions = [
    { id: 0, name: "0 months" },
    { id: 1, name: "1 months" },
    { id: 2, name: "2 months" },
    { id: 3, name: "3 months" },
    { id: 4, name: "4 months" },
    { id: 5, name: "5 months" },
    { id: 6, name: "6 months" },
    { id: 7, name: "7 months" },
    { id: 8, name: "8 months" },
    { id: 9, name: "9 months" },
    { id: 10, name: "10 months" },
    { id: 11, name: "11 months" },
    { id: 12, name: "12 months" },
  ];

  const [companyDetails, setCompanyDetails] = useState([]);

  const [certificationDetails, setCertificationDetails] = useState([]);

  const skillsOptions = [
    { id: 1, name: "HTML" },
    { id: 2, name: "CSS" },
    { id: 3, name: "Javascript" },
    { id: 5, name: "React.js" },
    { id: 6, name: "MS SQL" },
    { id: 7, name: "MY SQL" },
  ];
  const [skills, setSkills] = useState([]);
  const [skillsError, setSkillsError] = useState("");

  const [qualification, setQualification] = useState("");
  const [qualificationError, setQualificationError] = useState("");
  const [university, setUniversity] = useState("");
  const [universityError, setUniversityError] = useState("");
  const [graduateYear, setGraduateYear] = useState("");
  const [graduateYearError, setGraduateYearError] = useState("");
  const [typeofEducation, setTypeofEducation] = useState(null);
  const [typeofEducationError, setTypeofEducationError] = useState();
  const [gender, setGender] = useState(null);
  const [genderError, setGenderError] = useState();
  const [noticePeriod, setNoticePeriod] = useState("");
  const [noticePeriodError, setNoticePeriodError] = useState();
  const [ctc, setCtc] = useState("");
  const [ctcError, setCtcError] = useState("");
  const [ectc, setEctc] = useState("");
  const [ectcError, setEctcError] = useState("");
  const [jobTitles, setJobTitles] = useState([]);
  const [jobTitlesError, setJobTitlesError] = useState("");
  const [jobLocations, setJobLocations] = useState([]);
  const [jobLocationsError, setJobLocationsError] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinUrlError, setLinkedinUrlError] = useState("");

  const typeofEducationOptions = [
    { id: 1, name: "Full time" },
    { id: 2, name: "Part time" },
    { id: 3, name: "Correspondence" },
  ];
  const genderOptions = [
    { id: "Male", name: "Male" },
    { id: "Female", name: "Female" },
  ];

  const noticePeriodOptions = [
    { id: "Serving notice period", name: "Serving notice period" },
    { id: "Immediately available", name: "Immediately available" },
    { id: "15 Days", name: "15 Days" },
    { id: "30 Days", name: "30 Days" },
    { id: "45 Days", name: "45 Days" },
    { id: "2 Months", name: "2 Months" },
    { id: "3 Months", name: "3 Months" },
    { id: "6 Months", name: "6 Months" },
  ];
  const [resume, setResume] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCandidatesData();
  }, []);

  const getCandidatesData = async () => {
    try {
      const response = await getCandidates();
      console.log("candidates list", response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addCompanyDetails = () => {
    if (experienceYear === 1 && experienceMonth === 1) {
      return CommonToaster("Add experience for add company");
    }
    const object = {
      id: Date.now(),
      companyName: "",
      designation: "",
      startDate: "",
      endDate: "",
      workingStatus: false,
      companyError: "",
      designationError: "",
      startDateError: "",
      endDateError: "",
    };

    setCompanyDetails([...companyDetails, object]);
  };

  const onChangeCompanyfields = (index, field, value) => {
    const updatedDetails = [...companyDetails];

    // Update the value
    updatedDetails[index][field] = value;

    // Validation:
    if (field === "companyName") {
      updatedDetails[index].companyError = addressValidator(value);
    }
    if (field === "designation") {
      updatedDetails[index].designationError = addressValidator(value);
    }
    if (field === "startDate") {
      updatedDetails[index].startDateError = selectValidator(value);
    }
    if (field === "currentlyWorking") {
      if (updatedDetails[index]["currentlyWorking"] === true) {
        updatedDetails[index].endDate = null;
        updatedDetails[index].disbleStatus = true;
        updatedDetails[index].endDateError = "";
      } else {
        updatedDetails[index].disbleStatus = false;
      }
    }
    setCompanyDetails(updatedDetails);
  };

  const deleteCompanydetails = (index) => {
    if (companyDetails.length === 1) {
      return;
    }
    let data = [...companyDetails];
    data.splice(index, 1);
    setCompanyDetails(data);
  };

  //certicate functions
  const addCertificateDetails = () => {
    const object = {
      id: Date.now(),
      name: "",
      startDate: "",
      endDate: "",
      courseStatus: false,
    };

    setCertificationDetails([...certificationDetails, object]);
  };

  const onChangeCertificatefields = (index, field, value) => {
    const updatedDetails = [...certificationDetails];

    // Update the value
    updatedDetails[index][field] = value;

    // Validation: Check if company name length is less than 3
    if (field === "name") {
      updatedDetails[index].nameError = addressValidator(value);
    }
    if (field === "startDate") {
      updatedDetails[index].startDateError = selectValidator(value);
    }

    if (field === "courseStatus") {
      if (updatedDetails[index]["courseStatus"] === true) {
        updatedDetails[index].endDate = null;
        updatedDetails[index].disbleStatus = true;
        updatedDetails[index].endDateError = "";
      } else {
        updatedDetails[index].disbleStatus = false;
      }
    }

    setCertificationDetails(updatedDetails);
  };

  const deleteCertificatedetails = (index) => {
    let data = [...certificationDetails];
    data.splice(index, 1);
    setCertificationDetails(data);
  };

  //resume function
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationTrigger(true);
    const firstNameValidate = nameValidator(firstName);
    const lastNameValidate = lastNameValidator(lastName);
    const emailValidate = emailValidator(email);
    const mobileValidate = mobileValidator(mobile);
    const countryValidate = nameValidator(country);
    const addressValidate = addressValidator(address);
    const cityValidate = addressValidator(city);
    const pincodeValidate = selectValidator(pincode);
    const expYearValidate = selectValidator(experienceYear);
    const expMonthValidate = selectValidator(experienceMonth);
    let companyNameValidate = addressValidator(companyName);
    let designationValidate = addressValidator(designation);
    let startDateValidate = selectValidator(startDate);
    let endDateValidate = selectValidator(endDate);
    const skillsValidate = selectValidator(skills);
    const qualificationValidate = addressValidator(qualification);
    const universityValidate = addressValidator(university);
    const graduateValidate = addressValidator(graduateYear);
    const typeofEducationValidate = selectValidator(typeofEducation);
    const genderValidate = selectValidator(gender);
    const noticePeriodValidate = selectValidator(noticePeriod);
    const currentCtcValidate = addressValidator(ctc);
    const expectedCtcValidate = addressValidator(ectc);
    const jobtitlesValidate = selectValidator(jobTitles);
    const joblocationsValidate = selectValidator(jobLocations);
    const linkedinUrlValidate = addressValidator(linkedinUrl);
    const resumeValidate = selectValidator(resume);

    setFirstNameError(firstNameValidate);
    setLastNameError(lastNameValidate);
    setEmailError(emailValidate);
    setMobileError(mobileValidate);
    setCountryError(countryValidate);
    setAddressError(addressValidate);
    setCityError(cityValidate);
    setPincodeError(pincodeValidate);
    setExperienceYearError(expYearValidate);
    setExperienceMonthError(expMonthValidate);
    setSkillsError(skillsValidate ? "Skills" + skillsValidate : "");
    setQualificationError(qualificationValidate);
    setUniversityError(universityValidate);
    setGraduateYearError(graduateValidate);
    setTypeofEducationError(typeofEducationValidate);
    setGenderError(genderValidate);
    setNoticePeriodError(noticePeriodValidate);
    setCtcError(currentCtcValidate);
    setEctcError(expectedCtcValidate);
    setJobTitlesError(jobtitlesValidate);
    setJobLocationsError(joblocationsValidate);
    setLinkedinUrlError(linkedinUrlValidate);

    //contact info validation
    if (
      firstNameValidate ||
      lastNameValidate ||
      emailValidate ||
      mobileValidate ||
      countryValidate ||
      addressValidate ||
      cityValidate ||
      pincodeValidate
    ) {
      const contactContainer = document.getElementById(
        "registration_contactsection"
      );
      contactContainer.scrollIntoView({ behavior: "smooth" });
      return;
    }

    //experience session validate
    if (showCompanyfields === true) {
      setCompanyNameError(companyNameValidate);
      setDesignationError(designationValidate);
      setStartDateError(startDateValidate);

      if (workingStatus === false) {
        setEndDateError(endDateValidate);
      } else {
        endDateValidate = "";
        setEndDateError("");
      }
    } else {
      companyNameValidate = "";
      designationValidate = "";
      startDateValidate = "";
      setCompanyNameError("");
      setDesignationError("");
      setStartDateError("");
      endDateValidate = "";
      setEndDateError("");
    }
    if (
      expYearValidate ||
      expMonthValidate ||
      companyNameValidate ||
      designationValidate ||
      startDateValidate ||
      endDateValidate
    ) {
      const experienceContainer = document.getElementById(
        "registration_experiencesection"
      );
      experienceContainer.scrollIntoView({ behavior: "smooth" });
      return;
    }

    //skills section validation
    if (skillsValidate) {
      const skillsContainer = document.getElementById(
        "registration_skillssection"
      );
      skillsContainer.scrollIntoView({ behavior: "smooth" });
      return;
    }

    //education section validate
    if (
      qualificationValidate ||
      universityValidate ||
      graduateValidate ||
      typeofEducationValidate
    ) {
      const educationContainer = document.getElementById(
        "registration_educationsection"
      );
      educationContainer.scrollIntoView({ behavior: "smooth" });
      return;
    }

    //certificate validate
    let checkCertificateErrors = [];
    if (certificationDetails.length >= 1) {
      const validateCertificateDetails = certificationDetails.map((item) => {
        return {
          ...item,
          nameError: addressValidator(item.name),
          startDateError: selectValidator(item.startDate),
          endDateError:
            item.courseStatus === false || item.courseStatus === undefined
              ? selectValidator(item.endDate)
              : "",
        };
      });

      checkCertificateErrors = validateCertificateDetails.filter(
        (f) =>
          f.nameError != "" || f.startDateError != "" || f.endDateError != ""
      );
      setCertificationDetails(validateCertificateDetails);
    }

    if (checkCertificateErrors.length >= 1) {
      const certificateContainer = document.getElementById(
        "registration_certsection"
      );
      certificateContainer.scrollIntoView({ behavior: "smooth" });
      return;
    }

    //personal info validate
    if (
      genderValidate ||
      noticePeriodValidate ||
      currentCtcValidate ||
      expectedCtcValidate ||
      jobtitlesValidate ||
      joblocationsValidate ||
      linkedinUrlValidate
    ) {
      const personalContainer = document.getElementById(
        "registration_personalinfosection"
      );
      personalContainer.scrollIntoView({ behavior: "smooth" });
      return;
    }

    //resume validate
    if (resumeValidate) {
      CommonToaster("Resume is required");
      return;
    }

    const payload = {
      firstName: firstName,
      lastName: lastName,
      mobile: mobile,
      email: email,
      country: country,
      address: address,
      state: city,
      pincode: pincode,
      yearsOfExperience: experienceYear,
      monthOfExperience: experienceMonth,
      companyName: companyName,
      designation: designation,
      companyStartdate: startDate,
      companyEnddate: endDate,
      workingStatus: workingStatus,
      skills: skills,
      qualification: qualification,
      university: university,
      graduateYear: graduateYear,
      typeOfEducation: typeofEducation,
      certifications: certificationDetails,
      gender: gender === 1 ? "Male" : "Female",
      preferredJobTitles: jobTitles,
      preferredJobLocations: jobLocations,
      noticePeriod: noticePeriod,
      currentCTC: ctc,
      expectedCTC: ectc,
      linkedinURL: linkedinUrl,
      resume: resume,
      createdAt: new Date(),
    };

    console.log("registration payload", payload);
    setLoading(true);
    try {
      const response = await candidateRegistration(payload);
      console.log("registration response", response);
      CommonToaster("Register successfull!");
      formReset();
    } catch (error) {
      console.log("registration error", error);
      setLoading(false);
      const Error = error?.response?.data?.details;

      if (Error.includes("for key 'mobile'")) {
        CommonToaster("Mobile number already exists");
      } else if (Error.includes("for key 'email'")) {
        CommonToaster("Email already exists");
      } else {
        CommonToaster(error?.response?.data?.message || "Error while register");
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const formReset = () => {
    setValidationTrigger(false);
    setFirstName("");
    setFirstNameError("");
    setLastName("");
    setLastNameError("");
    setMobile("");
    setMobileError("");
    setEmail("");
    setEmailError("");
    setCountry("");
    setCountryError("");
    setAddress("");
    setAddressError("");
    setCity("");
    setCityError("");
    setPincode("");
    setPincodeError("");
    setExperienceYear("");
    setExperienceYearError("");
    setExperienceMonth("");
    setExperienceMonthError("");
    setCompanyName("");
    setCompanyNameError("");
    setDesignation("");
    setDesignationError("");
    setStartDate(null);
    setStartDateError("");
    setEndDate(null);
    setEndDateError("");
    setworkingStatus(false);
    setSkills([]);
    setSkillsError("");
    setQualification("");
    setQualificationError("");
    setUniversity("");
    setUniversityError("");
    setGraduateYear("");
    setGraduateYearError("");
    setTypeofEducation(null);
    setTypeofEducationError("");
    setCertificationDetails([]);
    setGender(null);
    setGenderError("");
    setNoticePeriod("");
    setNoticePeriodError("");
    setCtc("");
    setCtcError("");
    setEctc("");
    setEctcError("");
    setJobTitles([]);
    setJobTitlesError("");
    setJobLocations([]);
    setJobLocationsError("");
    setLinkedinUrl("");
    setLinkedinUrlError("");
    setResume("");
    setResumeName("");
    setResumeError("");
    const container = document.getElementById("registration_mainContainer");
    container.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="registration_headerContainer">
        <Row>
          <Col span={12} style={{ display: "flex", alignItems: "center" }}>
            <img src={Actelogo} className="registration_actelogo" />
          </Col>
          <Col span={12} className="registration_headertextContainer">
            <p style={{ color: "#0056b3", fontWeight: "500" }}>Register here</p>
          </Col>
        </Row>
      </div>
      <div
        className="registration_mainContainer"
        id="registration_mainContainer"
      >
        <Row>
          <Col
            xs={0}
            sm={0}
            md={0}
            lg={9}
            xl={9}
            xxl={9}
            className="registration_leftcardColdiv"
          >
            <div className="registration_leftcardContainer">
              <img src={cardImage} className="registration_cardimage" />
              <p className="registration_cardheading">
                On registering, you can
              </p>
              <div className="registration_cardtextdiv">
                <BsPatchCheckFill size={17} color="#47b749" />
                <p className="registration_cardtext">
                  Build your profile and let recruiters find you
                </p>
              </div>

              <div className="registration_cardtextdiv">
                <BsPatchCheckFill size={17} color="#47b749" />
                <p className="registration_cardtext">
                  Get job postings delivered right to your email
                </p>
              </div>

              <div className="registration_cardtextdiv">
                <BsPatchCheckFill size={17} color="#47b749" />
                <p className="registration_cardtext">
                  Find a job and grow your career
                </p>
              </div>

              <div className="registration_cardtextdiv">
                <BsPatchCheckFill size={17} color="#47b749" />
                <p className="registration_cardtext">
                  Take the next step toward your dream career
                </p>
              </div>

              <div className="registration_cardtextdiv">
                <BsPatchCheckFill size={17} color="#47b749" />
                <p className="registration_cardtext">
                  Showcase your skills and land your job
                </p>
              </div>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={15}
            xl={15}
            xxl={15}
            className="registration_formColcontainer"
          >
            <div>
              <div
                className="registration_contactsection"
                id="registration_contactsection"
              >
                <p className="registration_sectionheadings">
                  Contact information
                </p>
                <Row gutter={24} className="registration_fieldrowdiv">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="registration_fieldcolumndiv"
                  >
                    <CommonInputField
                      label="First name"
                      mandatory={true}
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (validationTrigger) {
                          setFirstNameError(nameValidator(e.target.value));
                        }
                      }}
                      error={firstNameError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonInputField
                      label="Last name"
                      mandatory={true}
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (validationTrigger) {
                          setLastNameError(lastNameValidator(e.target.value));
                        }
                      }}
                      error={lastNameError}
                    />
                  </Col>
                </Row>

                <Row gutter={24} className="registration_fieldrowdiv">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="registration_fieldcolumndiv"
                  >
                    <CommonInputField
                      label="Mobile"
                      mandatory={true}
                      value={mobile}
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
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonInputField
                      label="Email"
                      mandatory={true}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationTrigger) {
                          setEmailError(emailValidator(e.target.value));
                        }
                      }}
                      error={emailError}
                    />
                  </Col>
                </Row>

                <Row gutter={24} className="registration_fieldrowdiv">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="registration_fieldcolumndiv"
                  >
                    <CommonInputField
                      label="Country"
                      mandatory={true}
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        if (validationTrigger) {
                          setCountryError(nameValidator(e.target.value));
                        }
                      }}
                      error={countryError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonInputField
                      label="Address"
                      mandatory={true}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (validationTrigger) {
                          setAddressError(addressValidator(e.target.value));
                        }
                      }}
                      error={addressError}
                    />
                  </Col>
                </Row>

                <Row gutter={24} className="registration_fieldrowdiv">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="registration_fieldcolumndiv"
                  >
                    <CommonInputField
                      label="City, State"
                      mandatory={true}
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (validationTrigger) {
                          setCityError(addressValidator(e.target.value));
                        }
                      }}
                      error={cityError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonInputField
                      label="Pincode"
                      mandatory={true}
                      type="number"
                      value={pincode}
                      onChange={(e) => {
                        setPincode(e.target.value);
                        if (validationTrigger) {
                          setPincodeError(selectValidator(e.target.value));
                        }
                      }}
                      error={pincodeError}
                    />
                  </Col>
                </Row>

                <Divider className="registration_sectiondivider" />
              </div>

              <div id="registration_experiencesection">
                <p className="registration_sectionheadings">Experience</p>
                <Row
                  gutter={24}
                  className="registration_fieldrowdiv"
                  style={{ marginBottom: "22px" }}
                >
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="registration_fieldcolumndiv"
                  >
                    <CommonSelectField
                      label="Total years of experience"
                      options={experienceYearsOptions}
                      mandatory={true}
                      value={experienceYear}
                      onChange={(value) => {
                        setExperienceYear(value);
                        console.log("exp year", value, experienceMonth);
                        if (value === null || experienceMonth === null) {
                          setShowCompanyfields(false);
                        } else if (value === 0 && experienceMonth === 0) {
                          setShowCompanyfields(false);
                        } else {
                          setShowCompanyfields(true);
                          setCompanyDetails([
                            {
                              id: Date.now(),
                              companyName: "",
                              designation: "",
                              startDate: "",
                              endDate: "",
                              workingStatus: false,
                            },
                          ]);
                        }
                        if (validationTrigger) {
                          setExperienceYearError(selectValidator(value));
                        }
                      }}
                      error={experienceYearError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonSelectField
                      label="Total months of experience"
                      options={experienceMonthsOptions}
                      mandatory={true}
                      value={experienceMonth}
                      onChange={(value) => {
                        setExperienceMonth(value);
                        if (value === null || experienceYear === null) {
                          setShowCompanyfields(false);
                          setCompanyDetails([]);
                        } else if (value === 0 && experienceYear === 0) {
                          setShowCompanyfields(false);
                          setCompanyDetails([]);
                        } else {
                          setShowCompanyfields(true);
                          setCompanyDetails([
                            {
                              id: Date.now(),
                              companyName: "",
                              designation: "",
                              startDate: "",
                              endDate: "",
                              workingStatus: false,
                            },
                          ]);
                        }
                        if (validationTrigger) {
                          setExperienceMonthError(selectValidator(value));
                        }
                      }}
                      error={experienceMonthError}
                    />
                  </Col>
                </Row>

                {showCompanyfields === true ? (
                  <>
                    <Row gutter={16} style={{ marginBottom: "22px" }}>
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        className="registration_fieldcolumndiv"
                      >
                        <CommonInputField
                          label="Company Name"
                          mandatory={true}
                          value={companyName}
                          onChange={(e) => {
                            setCompanyName(e.target.value);
                            if (validationTrigger) {
                              setCompanyNameError(
                                addressValidator(e.target.value)
                              );
                            }
                          }}
                          error={companyNameError}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={12}>
                        <CommonInputField
                          label="Designation"
                          value={designation}
                          mandatory={true}
                          onChange={(e) => {
                            setDesignation(e.target.value);
                            if (validationTrigger) {
                              setDesignationError(
                                addressValidator(e.target.value)
                              );
                            }
                          }}
                          error={designationError}
                        />
                      </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: "16px" }}>
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        className="registration_fieldcolumndiv"
                      >
                        <CommonDatePicker
                          label="Start Date"
                          mandatory={true}
                          value={startDate}
                          onChange={(value) => {
                            setStartDate(value);
                            if (validationTrigger) {
                              setStartDateError(selectValidator(value));
                            }
                          }}
                          error={startDateError}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={12}>
                        <CommonDatePicker
                          label="End Date"
                          value={endDate}
                          onChange={(value) => {
                            setEndDate(value);
                            if (validationTrigger) {
                              setEndDateError(selectValidator(value));
                            }
                          }}
                          error={endDateError}
                          disabled={workingStatus === true ? true : false}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginTop: "22px" }}>
                      <Col span={24}>
                        <Checkbox
                          checked={workingStatus} // Ensure it's always a boolean
                          onChange={(e) => {
                            setworkingStatus(e.target.checked);
                            if (e.target.checked === true) {
                              setEndDate(null);
                              setEndDateError("");
                            }
                          }}
                        >
                          Currenly Working
                        </Checkbox>
                      </Col>
                    </Row>
                  </>
                ) : (
                  ""
                )}

                {/* {companyDetails.map((company, index) => (
            <React.Fragment key={company.id}>
              <Row gutter={16} style={{ marginBottom: "22px" }}>
                <Col xs={24} sm={24} md={12}>
                  <CommonInputField
                    label="Company Name"
                    mandatory={true}
                    value={company.companyName}
                    onChange={(e) =>
                      onChangeCompanyfields(
                        index,
                        "companyName",
                        e.target.value
                      )
                    }
                    error={company.companyError}
                  />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <CommonInputField
                    label="Designation"
                    value={company.designation}
                    mandatory={true}
                    onChange={(e) =>
                      onChangeCompanyfields(
                        index,
                        "designation",
                        e.target.value
                      )
                    }
                    error={company.designationError}
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: "16px" }}>
                <Col xs={24} sm={24} md={12}>
                  <CommonDatePicker
                    label="Start Date"
                    mandatory={true}
                    value={company.startDate}
                    onChange={(value) =>
                      onChangeCompanyfields(index, "startDate", value)
                    }
                    error={company.startDateError}
                  />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <CommonDatePicker
                    label="End Date"
                    value={company.endDate}
                    onChange={(value) =>
                      onChangeCompanyfields(index, "endDate", value)
                    }
                    error={company.endDateError}
                    disabled={company.disbleStatus}
                  />
                </Col>
              </Row>

              <Row gutter={16} className="candidate_companydeleterowdiv">
                <Col xs={24} sm={24} md={12}>
                  <Checkbox
                    checked={company.currentlyWorking ?? false} // Ensure it's always a boolean
                    onChange={(e) => {
                      onChangeCompanyfields(
                        index,
                        "currentlyWorking",
                        e.target.checked
                      );
                    }}
                  >
                    Currenly Working
                  </Checkbox>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    onClick={() => deleteCompanydetails(index)}
                    className="registration_deletecompanybutton"
                  >
                    Delete
                  </Button>
                </Col>
              </Row>

              {companyDetails.length <= 1 ||
              companyDetails.length - 1 === index ? (
                ""
              ) : (
                <Divider className="registration_companyfields_divider" />
              )}
            </React.Fragment>
          ))} */}
                {/* <Button
            onClick={addCompanyDetails}
            className="registration_addcompanybutton"
          >
            Add Company
          </Button> */}

                <Divider className="registration_sectiondivider" />
              </div>

              <div id="registration_skillssection">
                <p className="registration_sectionheadings">Skills</p>
                <p className="registration_skillsdescription">
                  List your skills to showcase your expertise!
                </p>
                <CommonSelectField
                  options={skillsOptions}
                  mode="tags"
                  value={skills}
                  onChange={(value) => {
                    setSkills(value);
                    const err = selectValidator(value);
                    setSkillsError(err ? "Skills" + err : "");
                  }}
                  error={skillsError}
                  className="registration_skillsfield"
                />

                <Divider className="registration_sectiondivider" />
              </div>

              <div id="registration_educationsection">
                <p className="registration_sectionheadings">Education</p>
                <Row gutter={24} className="registration_fieldrowdiv">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="registration_fieldcolumndiv"
                  >
                    <CommonInputField
                      label="Highest qualification"
                      mandatory={true}
                      value={qualification}
                      onChange={(e) => {
                        setQualification(e.target.value);
                        if (validationTrigger) {
                          setQualificationError(
                            addressValidator(e.target.value)
                          );
                        }
                      }}
                      error={qualificationError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonInputField
                      label="University"
                      mandatory={true}
                      value={university}
                      onChange={(e) => {
                        setUniversity(e.target.value);
                        if (validationTrigger) {
                          setUniversityError(addressValidator(e.target.value));
                        }
                      }}
                      error={universityError}
                    />
                  </Col>
                </Row>

                <Row gutter={24} className="registration_fieldrowdiv">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="registration_fieldcolumndiv"
                  >
                    <CommonInputField
                      label="Graduate year"
                      mandatory={true}
                      type="number"
                      value={graduateYear}
                      onChange={(e) => {
                        setGraduateYear(e.target.value);
                        if (validationTrigger) {
                          setGraduateYearError(
                            addressValidator(e.target.value)
                          );
                        }
                      }}
                      error={graduateYearError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonSelectField
                      label="Type of education"
                      options={typeofEducationOptions}
                      mandatory={true}
                      value={typeofEducation}
                      onChange={(value) => {
                        setTypeofEducation(value);
                        if (validationTrigger) {
                          setTypeofEducationError(selectValidator(value));
                        }
                      }}
                      error={typeofEducationError}
                    />
                  </Col>
                </Row>

                <Divider className="registration_sectiondivider" />
              </div>

              <div id="registration_certsection">
                <p className="registration_sectionheadings">Certification</p>
                <div style={{ marginTop: "22px" }}>
                  {certificationDetails.map((cer, index) => (
                    <React.Fragment key={cer.id}>
                      <Row gutter={16} style={{ marginBottom: "22px" }}>
                        <Col span={24}>
                          <CommonInputField
                            label="Certification name"
                            value={cer.name}
                            onChange={(e) =>
                              onChangeCertificatefields(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            error={cer.nameError}
                          />
                        </Col>
                      </Row>

                      <Row gutter={16} style={{ marginBottom: "16px" }}>
                        <Col xs={24} sm={24} md={12}>
                          <CommonDatePicker
                            label="Start Date"
                            value={cer.startDate}
                            onChange={(value) =>
                              onChangeCertificatefields(
                                index,
                                "startDate",
                                value
                              )
                            }
                            error={cer.startDateError}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                          <CommonDatePicker
                            label="End Date"
                            value={cer.endDate}
                            onChange={(value) =>
                              onChangeCertificatefields(index, "endDate", value)
                            }
                            error={cer.endDateError}
                            disabled={cer.disbleStatus}
                          />
                        </Col>
                      </Row>

                      <Row
                        gutter={16}
                        className="candidate_companydeleterowdiv"
                      >
                        <Col xs={24} sm={24} md={12}>
                          <Checkbox
                            checked={cer.courseStatus ?? false} // Ensure it's always a boolean
                            onChange={(e) => {
                              onChangeCertificatefields(
                                index,
                                "courseStatus",
                                e.target.checked
                              );
                            }}
                          >
                            Inprogress
                          </Checkbox>
                        </Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={12}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            onClick={() => deleteCertificatedetails(index)}
                            className="registration_deletecompanybutton"
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>

                      {certificationDetails.length <= 1 ||
                      certificationDetails.length - 1 === index ? (
                        ""
                      ) : (
                        <Divider className="registration_companyfields_divider" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <Button
                  onClick={addCertificateDetails}
                  className="registration_addcompanybutton"
                >
                  Add Certificate
                </Button>

                <Divider className="registration_sectiondivider" />
              </div>

              <div id="registration_personalinfosection">
                <p className="registration_sectionheadings">
                  Profile information
                </p>
                <Row gutter={24} className="registration_fieldrowdiv">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="registration_fieldcolumndiv"
                  >
                    <CommonSelectField
                      label="Gender"
                      mandatory={true}
                      options={genderOptions}
                      value={gender}
                      onChange={(value) => {
                        setGender(value);
                        if (validationTrigger) {
                          setGenderError(selectValidator(value));
                        }
                      }}
                      error={genderError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonSelectField
                      label="Notice period"
                      mandatory={true}
                      options={noticePeriodOptions}
                      value={noticePeriod}
                      onChange={(value) => {
                        setNoticePeriod(value);
                        console.log("notice period", value);
                        if (validationTrigger) {
                          setNoticePeriodError(selectValidator(value));
                        }
                      }}
                      error={noticePeriodError}
                    />
                  </Col>
                </Row>

                <Row gutter={24} className="registration_fieldrowdiv">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="registration_fieldcolumndiv"
                  >
                    <CommonInputField
                      label="Current ctc"
                      mandatory={true}
                      type="number"
                      value={ctc}
                      onChange={(e) => {
                        setCtc(e.target.value);
                        if (validationTrigger) {
                          setCtcError(selectValidator(e.target.value));
                        }
                      }}
                      error={ctcError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonInputField
                      label="Expected ctc"
                      mandatory={true}
                      type="number"
                      value={ectc}
                      onChange={(e) => {
                        setEctc(e.target.value);
                        if (validationTrigger) {
                          setEctcError(addressValidator(e.target.value));
                        }
                      }}
                      error={ectcError}
                    />
                  </Col>
                </Row>

                <Row gutter={24} className="registration_fieldrowdiv">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="registration_fieldcolumndiv"
                  >
                    <CommonMultiSelect
                      label="Preferred job titles"
                      mandatory={true}
                      value={jobTitles}
                      onChange={(value) => {
                        setJobTitles(value);
                        console.log("job titles", value);
                        if (validationTrigger) {
                          setJobTitlesError(selectValidator(value));
                        }
                      }}
                      error={jobTitlesError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonMultiSelect
                      label="Preferred job locations"
                      mandatory={true}
                      value={jobLocations}
                      onChange={(value) => {
                        setJobLocations(value);
                        console.log("job titles", value);
                        if (validationTrigger) {
                          setJobLocationsError(selectValidator(value));
                        }
                      }}
                      error={jobLocationsError}
                    />
                  </Col>
                </Row>

                <Row className="registration_fieldrowdiv">
                  <Col span={24} className="registration_fieldcolumndiv">
                    <CommonInputField
                      label="Linkedin profile link"
                      mandatory={true}
                      value={linkedinUrl}
                      onChange={(e) => {
                        setLinkedinUrl(e.target.value);
                        if (validationTrigger) {
                          setLinkedinUrlError(addressValidator(e.target.value));
                        }
                      }}
                      error={linkedinUrlError}
                    />
                  </Col>
                </Row>
                <Divider className="registration_sectiondivider" />
              </div>

              <p className="registration_sectionheadings">Resume</p>
              <Dragger
                className="registration_draganddropcontainer"
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
                  <div className="registration_resumeContainer">
                    <p>Upload Resume</p>
                  </div>
                </div>
              </Dragger>
              {resumeName && (
                <div className="registration_resumenameContainer">
                  <p className="registration_resumename">{resumeName}</p>
                </div>
              )}

              <div className="registration_registerbutton_div">
                {loading ? (
                  <Button className="loading_registration_registerbutton">
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
                  </Button>
                ) : (
                  <Button
                    className="registration_registerbutton"
                    onClick={handleSubmit}
                  >
                    Register
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

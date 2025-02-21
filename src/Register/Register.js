import React, { useState, useEffect } from "react";
import "./styles.css";
import CommonInputField from "../Common/CommonInputField";
import CommonDatePicker from "../Common/CommonDatePicker";
import { Col, Divider, Row, Button, Checkbox, Upload } from "antd";
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
  const [validationTrigger, setValidationTrigger] = useState(false);

  const experienceYearsOptions = [
    { id: 1, name: "0 years" },
    { id: 2, name: "1 years" },
    { id: 3, name: "2 years" },
    { id: 4, name: "3 years" },
    { id: 5, name: "4 years" },
    { id: 6, name: "5 years" },
    { id: 7, name: "6 years" },
    { id: 8, name: "7 years" },
    { id: 9, name: "8 years" },
    { id: 10, name: "9 years" },
    { id: 11, name: "10 years" },
    { id: 13, name: "12 years" },
    { id: 14, name: "13 years" },
    { id: 15, name: "14 years" },
    { id: 16, name: "15 years" },
    { id: 17, name: "16 years" },
  ];
  const experienceMonthsOptions = [
    { id: 1, name: "0 months" },
    { id: 2, name: "1 months" },
    { id: 3, name: "2 months" },
    { id: 4, name: "3 months" },
    { id: 5, name: "4 months" },
    { id: 6, name: "5 months" },
    { id: 7, name: "6 months" },
    { id: 8, name: "7 months" },
    { id: 9, name: "8 months" },
    { id: 10, name: "9 months" },
    { id: 11, name: "10 months" },
    { id: 12, name: "11 months" },
    { id: 13, name: "12 months" },
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
  const [noticePeriod, setNoticePeriod] = useState(null);
  const [noticePeriodError, setNoticePeriodError] = useState();
  const [ctc, setCtc] = useState("");
  const [ctcError, setCtcError] = useState("");
  const [ectc, setEctc] = useState("");
  const [ectcError, setEctcError] = useState("");
  const jobTitlesOptions = [
    { id: 1, name: "Developer" },
    { id: 2, name: "Designer" },
  ];
  const [jobTitles, setJobTitles] = useState([]);
  const [jobTitlesError, setJobTitlesError] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinUrlError, setLinkedinUrlError] = useState("");

  const typeofEducationOptions = [
    { id: 1, name: "Full time" },
    { id: 2, name: "Part time" },
    { id: 3, name: "Correspondence" },
  ];
  const genderOptions = [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
  ];

  const noticePeriodOptions = [
    { id: 1, name: "Serving notice period" },
    { id: 2, name: "Immediately available" },
    { id: 3, name: "15 Days" },
    { id: 4, name: "30 Days" },
    { id: 5, name: "45 Days" },
    { id: 6, name: "2 Months" },
    { id: 7, name: "3 Months" },
    { id: 8, name: "6 Months" },
  ];
  const [resume, setResume] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [resumeError, setResumeError] = useState("");

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
    let checkCompanyErrors = [];
    if (companyDetails.length >= 1) {
      const validateCompanyDetails = companyDetails.map((company) => {
        console.log(company.currentlyWorking);
        return {
          ...company,
          companyError: addressValidator(company.companyName),
          designationError: addressValidator(company.designation),
          startDateError: selectValidator(company.startDate),
          endDateError:
            company.currentlyWorking === false ||
            company.currentlyWorking === undefined
              ? selectValidator(company.endDate)
              : "",
        };
      });

      console.log("valll", validateCompanyDetails);
      setCompanyDetails(validateCompanyDetails);

      checkCompanyErrors = validateCompanyDetails.filter(
        (item) =>
          item.companyError != "" ||
          item.designationError != "" ||
          item.startDateError != "" ||
          item.endDateError != ""
      );
    }

    if (expYearValidate || expMonthValidate || checkCompanyErrors.length >= 1) {
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
      companyDetails: companyDetails,
      skills: skills,
      qualification: qualification,
      university: university,
      graduateYear: graduateYear,
      typeOfEducation: typeofEducation,
      certifications: certificationDetails,
      gender: gender === 1 ? "Male" : "Female",
      preferredJobTitles: jobTitles,
      noticePeriod: noticePeriod,
      currentCTC: ctc,
      expectedCTC: ectc,
      linkedinURL: linkedinUrl,
      resume: resume,
      createdAt: new Date(),
    };

    console.log("registration payload", payload);
    try {
      const response = await candidateRegistration(payload);
      console.log("registration response", response);
    } catch (error) {
      console.log("registration error", error);
    }
  };

  return (
    <div className="registration_mainContainer">
      <div className="registration_sectioncontainer">
        <div
          className="registration_contactsection"
          id="registration_contactsection"
        >
          <p className="registration_sectionheadings">Contact information</p>
          <Row gutter={24} className="registration_fieldrowdiv">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <CommonSelectField
                label="Total years of experience"
                options={experienceYearsOptions}
                mandatory={true}
                value={experienceYear}
                onChange={(value) => {
                  setExperienceYear(value);
                  if (value === null || experienceMonth === null) {
                    setCompanyDetails([]);
                  } else if (value === 1 && experienceMonth === 1) {
                    setCompanyDetails([]);
                  } else if (companyDetails.length <= 0) {
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
                    setCompanyDetails([]);
                  } else if (value === 1 && experienceYear === 1) {
                    setCompanyDetails([]);
                  } else if (companyDetails.length <= 0) {
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

          {companyDetails.map((company, index) => (
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
          ))}
          <Button
            onClick={addCompanyDetails}
            className="registration_addcompanybutton"
          >
            Add Company
          </Button>

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
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <CommonInputField
                label="Highest qualification"
                mandatory={true}
                value={qualification}
                onChange={(e) => {
                  setQualification(e.target.value);
                  if (validationTrigger) {
                    setQualificationError(addressValidator(e.target.value));
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
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <CommonInputField
                label="Graduate year"
                mandatory={true}
                type="number"
                value={graduateYear}
                onChange={(e) => {
                  setGraduateYear(e.target.value);
                  if (validationTrigger) {
                    setGraduateYearError(addressValidator(e.target.value));
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
                        onChangeCertificatefields(index, "name", e.target.value)
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
                        onChangeCertificatefields(index, "startDate", value)
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

                <Row gutter={16} className="candidate_companydeleterowdiv">
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
                    style={{ display: "flex", justifyContent: "flex-end" }}
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
          <p className="registration_sectionheadings">Profile information</p>
          <Row gutter={24} className="registration_fieldrowdiv">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
                  if (validationTrigger) {
                    setNoticePeriodError(selectValidator(value));
                  }
                }}
                error={noticePeriodError}
              />
            </Col>
          </Row>

          <Row gutter={24} className="registration_fieldrowdiv">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <CommonSelectField
                label="Preferred job titles"
                mandatory={true}
                mode="tags"
                options={jobTitlesOptions}
                value={jobTitles}
                onChange={(value) => {
                  setJobTitles(value);
                  if (validationTrigger) {
                    setJobTitlesError(selectValidator(value));
                  }
                }}
                error={jobTitlesError}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
          <Button
            className="registration_registerbutton"
            onClick={handleSubmit}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}

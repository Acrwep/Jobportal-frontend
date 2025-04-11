import React, { useState, useEffect } from "react";
import "./styles.css";
import CommonInputField from "../Common/CommonInputField";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import CommonSelectField from "../Common/CommonSelectField";
import { Row, Col, Button, Checkbox, Divider, Upload, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import CommonDatePicker from "../Common/CommonDatePicker";
import { AiOutlineDelete } from "react-icons/ai";
import Actelogo from "../images/acte-logo.png";
import { BsPatchCheckFill } from "react-icons/bs";
import cardImage from "../images/registrationimage.png";
import {
  nameValidator,
  lastNameValidator,
  mobileValidator,
  selectValidator,
  emailValidator,
  addressValidator,
} from "../Common/Validation";
import CommonMultiSelect from "../Common/CommonMultiSelect";
import { CommonToaster } from "../Common/CommonToaster";
import axios from "axios";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Country, State, City } from "country-state-city";
import { candidateRegistration } from "../Common/action";
import moment from "moment";

export default function CandidateRegister() {
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
  const { TextArea } = Input;
  const { Dragger } = Upload;
  const [pageSection, setPageSection] = useState(1);
  //contact info usestates
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobile, setMobile] = useState();
  const [mobileError, setMobileError] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryError, setCountryError] = useState("");
  const [stateOptions, setStateOptions] = useState([]);
  const [state, setState] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [experienceYear, setExperienceYear] = useState(null);
  const [experienceYearError, setExperienceYearError] = useState("");
  const [experienceMonth, setExperienceMonth] = useState(null);
  const [experienceMonthError, setExperienceMonthError] = useState("");

  //experience usestates
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

  //skills usestates
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

  //education usestates
  const [qualification, setQualification] = useState("");
  const [qualificationError, setQualificationError] = useState("");
  const [university, setUniversity] = useState("");
  const [universityError, setUniversityError] = useState("");
  const [graduateYear, setGraduateYear] = useState("");
  const [graduateYearError, setGraduateYearError] = useState("");
  const [typeofEducation, setTypeofEducation] = useState(null);
  const [typeofEducationError, setTypeofEducationError] = useState();
  //course status usestates
  const [courseName, setCourseName] = useState("");
  const [courseNameError, setCourseNameError] = useState("");
  const courseLocationOptions = [
    { id: "Anna nagar", name: "Anna nagar" },
    { id: "Velachery", name: "Velachery" },
  ];
  const [courseLocation, setCourseLocation] = useState("");
  const [courseLocationError, setCourseLocationError] = useState("");
  const [courseJoiningDate, setCourseJoiningDate] = useState(null);
  const [courseJoiningDateError, setCourseJoiningDateError] = useState("");
  const courseModeOptions = [
    { id: 1, name: "Offline" },
    { id: 2, name: "Online" },
  ];
  const [courseMode, setCourseMode] = useState(null);
  const [courseModeError, setCourseModeError] = useState("");

  const courseStatusOptions = [
    { id: 1, name: "Inprogress" },
    { id: 2, name: "Completed" },
  ];
  const [courseStatus, setCourseStatus] = useState("");
  const [courseStatusError, setCourseStatusError] = useState("");
  const mockUpPercentageOptions = [
    { id: 1, name: ">25" },
    { id: 2, name: ">50" },
    { id: 3, name: ">75" },
    { id: 4, name: ">90" },
  ];
  const [mockupPrecentage, setMockupPrecentage] = useState(null);
  //profiles info usestates
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
    { id: "Full time", name: "Full time" },
    { id: "Part time", name: "Part time" },
    { id: "Correspondence", name: "Correspondence" },
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
  const [profilePictureArray, setProfilePictureArray] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [languages, setLanguages] = useState([
    {
      id: Date.now(),
      name: "",
      levelStatus: [],
    },
  ]);
  const languageLevelOptions = [
    { label: "Read", value: "Read" },
    { label: "Speak", value: "Speak" },
    { label: "Write", value: "Write" },
  ];
  const [resume, setResume] = useState("");
  const [resumeArray, setResumeArray] = useState([]);
  const [resumeError, setResumeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactInfoValidationTrigger, setContactInfoValidationTrigger] =
    useState(false);
  const [expValidationTrigger, setExpValidationTrigger] = useState(false);
  const [skillsValidationTrigger, setSkillsValidationTrigger] = useState(false);
  const [educationValidationTrigger, setEducationValidationTrigger] =
    useState(false);
  const [courseValidationTrigger, setCourseValidationTrigger] = useState(false);
  const [profileInfoValidationTrigger, setProfileInfoValidationTrigger] =
    useState(false);
  const [resumeValidationTrigger, setResumeValidationTrigger] = useState(false);

  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountryOptions(countries);
  }, []);

  //onchnage functions
  const handleEmail = async (e) => {
    setEmail(e.target.value);
    if (contactInfoValidationTrigger) {
      const emailValidate = emailValidator(e.target.value);
      setEmailError(emailValidate);
      const formData = new FormData();
      formData.append("email", e.target.value);
      if (emailValidate === "") {
        setTimeout(async () => {
          try {
            const response = await crmEmailValidation(formData);
            if (response?.data?.message === "Email ID is not exist.") {
              setEmailError(" is not matching. Contact acte support team.");
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

  const handleCountry = (value) => {
    setCountry(value);
    const selectedCountry = countryOptions.find((f) => f.name === value);
    console.log("selected country", value, selectedCountry);
    setCountryCode(selectedCountry.isoCode);
    setStateOptions(State.getStatesOfCountry(selectedCountry.isoCode));
    if (contactInfoValidationTrigger) {
      setCountryError(selectValidator(value));
    }
  };

  const handleState = (value) => {
    setState(value);
    const selectedState = stateOptions.find((f) => f.name === value);
    console.log("selected state", value, selectedState);
    setCityOptions(City.getCitiesOfState(countryCode, selectedState.isoCode));
    if (contactInfoValidationTrigger) {
      setStateError(selectValidator(value));
    }
  };
  //certicate functions

  //language functions
  const addLanguage = () => {
    const obj = {
      id: Date.now(),
      name: "",
      levelStatus: [],
    };

    setLanguages([...languages, obj]);
  };

  const handleLanguages = (index, field, value) => {
    const updatedDetails = [...languages];
    updatedDetails[index][field] = value;

    if (field === "name" && profileInfoValidationTrigger) {
      updatedDetails[index].languageError = addressValidator(value);
    }
    setLanguages(updatedDetails);
  };

  const deleteLanguage = (index) => {
    if (languages.length <= 1) {
      return;
    }
    let data = [...languages];
    data.splice(index, 1);
    setLanguages(data);
  };

  const handleProfileAttachment = ({ file }) => {
    const isValidType =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg";

    if (file.status === "uploading" || file.status === "removed") {
      setProfilePictureArray([]);
      return;
    }
    if (isValidType) {
      console.log("fileeeee", file);
      setProfilePictureArray([file]);
      CommonToaster("Profile uploaded");
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Extract Base64 content
        setProfilePicture(base64String); // Store in state
      };
    } else {
      CommonToaster("Accept only .png, .jpg and .jpeg");
      setProfilePicture("");
      setProfilePictureArray([]);
    }
  };

  //resume function
  const handleResumeAttachment = ({ file }) => {
    console.log("fileee", file);
    const ValidType = file.type === "application/pdf";

    if (file.status === "uploading" || file.status === "removed") {
      setResume("");
      setResumeArray([]);
      return;
    }
    if (ValidType) {
      console.log("fileeeee", file);
      setResumeArray([file]);
      CommonToaster("Attachment uploaded");
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Extract Base64 content
        setResume(base64String); // Store in state
        setResumeError(selectValidator(base64String));
      };
    } else {
      CommonToaster("Accept only .pdf");
      setResume("");
      setResumeError(" is required");
      setResumeArray([]);
    }
  };

  const handleBackward = () => {
    if (pageSection === 1) {
      return;
    } else {
      setPageSection(pageSection - 1);
    }
  };

  const handleForward = () => {
    // setPageSection(pageSection + 1);
    if (pageSection === 1) {
      handleContactInfoSubmit();
    } else if (pageSection === 2) {
      handleExperienceSubmit();
    } else if (pageSection === 3) {
      handleSkillsSubmit();
    } else if (pageSection === 4) {
      handleEducationSubmit();
    } else if (pageSection === 5) {
      handleCourseSubmit();
    } else if (pageSection === 6) {
      handleProfileInfoSubmit();
    } else if (pageSection === 7) {
      handleResumeSubmit();
    }
  };

  const handleContactInfoSubmit = async () => {
    setContactInfoValidationTrigger(true);
    const firstNameValidate = nameValidator(firstName);
    const lastNameValidate = lastNameValidator(lastName);
    const emailValidate = emailValidator(email);
    const mobileValidate = mobileValidator(mobile);
    const countryValidate = selectValidator(country);
    const stateValidate = selectValidator(state);
    const cityValidate = selectValidator(city);
    const pincodeValidate = selectValidator(pincode);

    setFirstNameError(firstNameValidate);
    setLastNameError(lastNameValidate);
    setEmailError(emailValidate);
    setMobileError(mobileValidate);
    setCountryError(countryValidate);
    setStateError(stateValidate);
    setCityError(cityValidate);
    setPincodeError(pincodeValidate);

    let crmEmailValidate = "";
    if (emailValidate === "") {
      try {
        const formData = new FormData();
        formData.append("email", email);
        const response = await crmEmailValidation(formData);
        if (response?.data?.message === "Email ID is not exist.") {
          crmEmailValidate = " is not matching. Contact acte support team.";
        } else {
          crmEmailValidate = "";
        }
        console.log("crm email response", response);
      } catch (error) {
        console.log("php email error", error);
      }

      setEmailError(crmEmailValidate);
    }
    //contact info validation
    if (
      firstNameValidate ||
      lastNameValidate ||
      emailValidate ||
      mobileValidate ||
      countryValidate ||
      stateValidate ||
      cityValidate ||
      pincodeValidate ||
      crmEmailValidate
    ) {
      setPageSection(1);
      return;
    }
    setPageSection(2);
  };

  const handleExperienceSubmit = () => {
    setExpValidationTrigger(true);
    const expYearValidate = selectValidator(experienceYear);
    const expMonthValidate = selectValidator(experienceMonth);
    let companyNameValidate = addressValidator(companyName);
    let designationValidate = addressValidator(designation);
    let startDateValidate = selectValidator(startDate);
    let endDateValidate = selectValidator(endDate);

    setExperienceYearError(expYearValidate);
    setExperienceMonthError(expMonthValidate);

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
      setPageSection(2);
      return;
    }
    setPageSection(3);
  };

  const handleSkillsSubmit = () => {
    setSkillsValidationTrigger(true);
    const skillsValidate = selectValidator(skills);

    setSkillsError(
      skillsValidate != "" ? "Skills" + skillsValidate : skillsValidate
    );

    if (skillsValidate) {
      setPageSection(3);
      return;
    }
    setPageSection(4);
  };

  const handleEducationSubmit = () => {
    setEducationValidationTrigger(true);

    const qualificationValidate = addressValidator(qualification);
    const universityValidate = addressValidator(university);
    const graduateValidate = addressValidator(graduateYear);
    const typeofEducationValidate = selectValidator(typeofEducation);

    setQualificationError(qualificationValidate);
    setUniversityError(universityValidate);
    setGraduateYearError(graduateValidate);
    setTypeofEducationError(typeofEducationValidate);

    if (
      qualificationValidate ||
      universityValidate ||
      graduateValidate ||
      typeofEducationValidate
    ) {
      setPageSection(4);
      return;
    }
    setPageSection(5);
  };

  const handleCourseSubmit = () => {
    setCourseValidationTrigger(true);
    const courseNameValidate = addressValidator(courseName);
    const courseModeValidate = selectValidator(courseMode);
    const courseLocationValidate = addressValidator(courseLocation);
    const courseJoiningValidate = selectValidator(courseJoiningDate);
    const courseStatusValidate = selectValidator(courseStatus);

    setCourseNameError(courseNameValidate);
    setCourseModeError(courseModeValidate);
    setCourseLocationError(courseLocationValidate);
    setCourseJoiningDateError(courseJoiningValidate);
    setCourseStatusError(courseStatusValidate);

    if (
      courseNameValidate ||
      courseModeValidate ||
      courseLocationValidate ||
      courseJoiningValidate ||
      courseStatusValidate
    ) {
      setPageSection(5);
      return;
    }
    setPageSection(6);
  };

  const handleProfileInfoSubmit = () => {
    setProfileInfoValidationTrigger(true);
    const genderValidate = selectValidator(gender);
    const noticePeriodValidate = selectValidator(noticePeriod);
    const currentCtcValidate = addressValidator(ctc);
    const expectedCtcValidate = addressValidator(ectc);
    const jobtitlesValidate = selectValidator(jobTitles);
    const joblocationsValidate = selectValidator(jobLocations);
    const linkedinUrlValidate = addressValidator(linkedinUrl);
    const summaryValidate = addressValidator(summary);

    setGenderError(genderValidate);
    setNoticePeriodError(noticePeriodValidate);
    setCtcError(currentCtcValidate);
    setEctcError(expectedCtcValidate);
    setJobTitlesError(jobtitlesValidate);
    setJobLocationsError(joblocationsValidate);
    setSummaryError(summaryValidate);
    setLinkedinUrlError(linkedinUrlValidate);

    let checkLanguagesErrors = [];
    if (languages.length >= 1) {
      const validateLanguages = languages.map((item) => {
        return {
          ...item,
          languageError: addressValidator(item.name),
        };
      });

      checkLanguagesErrors = validateLanguages.filter(
        (f) => f.languageError != ""
      );
      setLanguages(validateLanguages);
    }

    if (
      genderValidate ||
      noticePeriodValidate ||
      currentCtcValidate ||
      expectedCtcValidate ||
      jobtitlesValidate ||
      joblocationsValidate ||
      summaryValidate ||
      linkedinUrlValidate ||
      checkLanguagesErrors.length >= 1
    ) {
      setPageSection(6);
      return;
    }
    setPageSection(7);
  };

  const handleResumeSubmit = () => {
    setResumeValidationTrigger(true);
    const resumeValidate = selectValidator(resume);

    if (resumeValidate) {
      CommonToaster("Resume is required");
      setPageSection(7);
      return;
    }
    handleRegister();
  };

  const formatDateTimeIST = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 24-hour format
      timeZone: "Asia/Kolkata", // IST timezone
    })
      .format(date)
      .replace(",", ""); // Remove comma
  };

  const convertToBackendFormat = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/");
    return `${year}-${month}-${day} ${timePart}`;
  };

  const handleRegister = async () => {
    const formatJoingdate = formatDateTimeIST(new Date(courseJoiningDate));

    const payload = {
      firstName: firstName,
      lastName: lastName,
      mobile: mobile,
      email: email,
      country: country,
      state: state,
      city: city,
      pincode: pincode,
      yearsOfExperience: experienceYear + " " + "Years",
      monthOfExperience: experienceMonth + " " + "Months",
      companyName: companyName,
      designation: designation,
      companyStartdate: moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
      companyEnddate: endDate
        ? moment(endDate).format("YYYY-MM-DD HH:mm:ss")
        : null,
      workingStatus: workingStatus,
      skills: skills,
      qualification: qualification,
      university: university,
      graduateYear: graduateYear,
      typeOfEducation: typeofEducation,
      gender: gender,
      preferredJobTitles: jobTitles,
      preferredJobLocations: jobLocations,
      noticePeriod: noticePeriod,
      currentCTC: ctc,
      expectedCTC: ectc,
      linkedinURL: linkedinUrl,
      profileImage: profilePicture,
      profileSummary: summary,
      languages: languages,
      resume: resume,
      courseName: courseName,
      courseLocation: courseLocation,
      courseMode: courseMode === 1 ? "Offline" : "Online",
      courseStatus: courseStatus === 1 ? "Inprogress" : "Completed",
      mockupPercentage:
        mockupPrecentage === 1
          ? ">25"
          : mockupPrecentage === 2
          ? ">50"
          : mockupPrecentage === 3
          ? ">75"
          : ">90",
      courseJoiningDate: convertToBackendFormat(formatJoingdate),
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
    setContactInfoValidationTrigger(false);
    setExpValidationTrigger(false);
    setSkillsValidationTrigger(false);
    setEducationValidationTrigger(false);
    setContactInfoValidationTrigger(false);
    setProfileInfoValidationTrigger(false);
    setResumeValidationTrigger(false);

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
    setState("");
    setStateError("");
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
    setCourseName("");
    setCourseNameError("");
    setCourseMode(null);
    setCourseModeError("");
    setCourseLocation("");
    setCourseLocationError("");
    setCourseJoiningDate(null);
    setCourseJoiningDateError("");
    setCourseStatus(null);
    setCourseStatusError("");
    setMockupPrecentage(null);
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
    setProfilePicture("");
    setProfilePictureArray([]);
    setSummary("");
    setSummaryError("");
    setLanguages([{ id: Date.now(), name: "", levelStatus: [] }]);
    setLinkedinUrl("");
    setLinkedinUrlError("");
    setResumeArray([]);
    setResume("");
    setResumeError("");
    setPageSection(1);
  };

  return (
    <div style={{ position: "relative", backgroundColor: "#f8f9fa" }}>
      <div className="candidate_headerContainer">
        <Row align="middle">
          <Col span={12} className="candidate_headerlogoContainer">
            <img src={Actelogo} className="candidateregister_actelogo" />
          </Col>
          <Col span={12} className="candidate_headertextContainer">
            <p style={{ color: "#0056b3", fontWeight: "500" }}>Register here</p>
          </Col>
        </Row>
      </div>
      <div className="candidate_maincontainer" id="candidate_maincontainer">
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
            className="candidate_formColcontainer"
          >
            {pageSection === 1 ? (
              //contact info
              <div className="candidate_contactsection">
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
                        if (contactInfoValidationTrigger) {
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
                        if (contactInfoValidationTrigger) {
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
                        if (contactInfoValidationTrigger) {
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
                      onChange={handleEmail}
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
                    <CommonSelectField
                      label="Country"
                      options={countryOptions}
                      mandatory={true}
                      value={country}
                      onChange={handleCountry}
                      error={countryError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonSelectField
                      label="State"
                      mandatory={true}
                      options={stateOptions}
                      value={state}
                      onChange={handleState}
                      error={stateError}
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
                    <CommonSelectField
                      label="City"
                      options={cityOptions}
                      mandatory={true}
                      value={city}
                      onChange={(value) => {
                        setCity(value);
                        if (contactInfoValidationTrigger) {
                          setCityError(selectValidator(value));
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
                        if (contactInfoValidationTrigger) {
                          setPincodeError(selectValidator(e.target.value));
                        }
                      }}
                      error={pincodeError}
                    />
                  </Col>
                </Row>
              </div>
            ) : pageSection === 2 ? (
              //experience
              <div>
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
                        console.log("expppp", value, experienceMonth);
                        if (value === null || experienceMonth === null) {
                          setShowCompanyfields(false);
                        } else if (
                          (value === 0 || value === "0 years") &&
                          (experienceMonth === 0 ||
                            experienceMonth === "0 months")
                        ) {
                          setShowCompanyfields(false);
                        } else {
                          setShowCompanyfields(true);
                        }
                        if (expValidationTrigger) {
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
                        } else if (
                          (value === 0 || value === "0 months") &&
                          (experienceYear === 0 || experienceYear === "0 years")
                        ) {
                          setShowCompanyfields(false);
                        } else {
                          setShowCompanyfields(true);
                        }
                        if (expValidationTrigger) {
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
                            if (expValidationTrigger) {
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
                            if (expValidationTrigger) {
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
                            if (expValidationTrigger) {
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
                            if (expValidationTrigger) {
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
                          checked={workingStatus}
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
              </div>
            ) : pageSection === 3 ? (
              <div id="registration_skillssection">
                <p className="registration_sectionheadings">Skills</p>
                <p className="registration_skillsdescription">
                  List your skills to showcase your expertise!
                </p>
                <CommonMultiSelect
                  className="registration_skillsfield"
                  mandatory={true}
                  value={skills}
                  onChange={(value) => {
                    setSkills(value);
                    console.log("skillsss", value);
                    if (skillsValidationTrigger) {
                      const err = selectValidator(value);
                      setSkillsError(err ? "Skills" + err : "");
                    }
                  }}
                  error={skillsError}
                />
              </div>
            ) : pageSection === 4 ? (
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
                        if (educationValidationTrigger) {
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
                        if (educationValidationTrigger) {
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
                        if (educationValidationTrigger) {
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
                        if (educationValidationTrigger) {
                          setTypeofEducationError(selectValidator(value));
                        }
                      }}
                      error={typeofEducationError}
                    />
                  </Col>
                </Row>
              </div>
            ) : pageSection === 5 ? (
              <div className="registration_certsection">
                <p className="registration_sectionheadings">Course Status</p>
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
                      label="Course name"
                      mandatory={true}
                      value={courseName}
                      onChange={(e) => {
                        setCourseName(e.target.value);
                        if (courseValidationTrigger) {
                          setCourseNameError(addressValidator(e.target.value));
                        }
                      }}
                      error={courseNameError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonSelectField
                      label="Course mode"
                      mandatory={true}
                      options={courseModeOptions}
                      value={courseMode}
                      onChange={(value) => {
                        setCourseMode(value);
                        if (courseValidationTrigger) {
                          setCourseModeError(selectValidator(value));
                        }
                      }}
                      error={courseModeError}
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
                    <CommonSelectField
                      options={courseLocationOptions}
                      label="Branch location"
                      allowClear={true}
                      onChange={(value) => {
                        setCourseLocation(value);
                        if (courseValidationTrigger) {
                          setCourseLocationError(addressValidator(value));
                        }
                      }}
                      error={courseLocationError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonDatePicker
                      label="Course joining date"
                      mandatory={true}
                      value={courseJoiningDate}
                      onChange={(value) => {
                        setCourseJoiningDate(value);
                        if (courseValidationTrigger) {
                          setCourseJoiningDateError(selectValidator(value));
                        }
                      }}
                      error={courseJoiningDateError}
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
                    <CommonSelectField
                      label="Course status"
                      mandatory={true}
                      options={courseStatusOptions}
                      value={courseStatus}
                      onChange={(value) => {
                        setCourseStatus(value);
                        if (courseValidationTrigger) {
                          setCourseStatusError(selectValidator(value));
                        }
                      }}
                      error={courseStatusError}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonSelectField
                      label="Mockup interview percentage"
                      mandatory={false}
                      options={mockUpPercentageOptions}
                      value={mockupPrecentage}
                      allowClear={true}
                      onChange={(value) => {
                        setMockupPrecentage(value);
                      }}
                    />
                  </Col>
                </Row>
              </div>
            ) : pageSection === 6 ? (
              <div className="registration_personalinfosection">
                <p className="registration_sectionheadings">
                  Almost there. Profile information
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
                        if (profileInfoValidationTrigger) {
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
                        if (profileInfoValidationTrigger) {
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
                        if (profileInfoValidationTrigger) {
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
                        if (profileInfoValidationTrigger) {
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
                        if (profileInfoValidationTrigger) {
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
                        if (profileInfoValidationTrigger) {
                          setJobLocationsError(selectValidator(value));
                        }
                      }}
                      error={jobLocationsError}
                    />
                  </Col>
                </Row>

                <Row className="registration_fieldrowdiv">
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={12}
                    xl={12}
                    xxl={12}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div className="registration_uploadprofileContainer">
                      <p>Upload Profile Picture</p>
                      <Upload
                        beforeUpload={(file) => {
                          console.log(file);
                          return false; // Prevent auto-upload
                        }}
                        multiple={false}
                        onChange={handleProfileAttachment}
                        maxCount={1}
                        fileList={profilePictureArray}
                      >
                        <Button className="registration_profilechoosebutton">
                          Browse
                        </Button>
                      </Upload>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <CommonInputField
                      label="Linkedin profile link"
                      mandatory={true}
                      value={linkedinUrl}
                      onChange={(e) => {
                        setLinkedinUrl(e.target.value);
                        if (profileInfoValidationTrigger) {
                          setLinkedinUrlError(addressValidator(e.target.value));
                        }
                      }}
                      error={linkedinUrlError}
                    />
                  </Col>
                </Row>
                <Row className="registration_fieldrowdiv">
                  <Col span={24} className="registration_fieldcolumndiv">
                    <div style={{ display: "flex" }}>
                      <label className="registration_summarytextarealabel">
                        Profile summary
                      </label>
                      <p className="registration_summarytextareaasterisk">*</p>
                    </div>
                    <TextArea
                      className={
                        summaryError
                          ? "registration_errorsummarytextarea"
                          : "registration_summarytextarea"
                      }
                      rows={4}
                      value={summary}
                      onChange={(e) => {
                        setSummary(e.target.value);
                        if (profileInfoValidationTrigger) {
                          setSummaryError(addressValidator(e.target.value));
                        }
                      }}
                    />
                    {summaryError && (
                      <p className="registration_summaryerrortext">
                        {"Profile summary" + " " + summaryError}
                      </p>
                    )}
                  </Col>
                </Row>

                <div style={{ marginTop: "22px" }}>
                  {languages.map((lang, index) => (
                    <React.Fragment key={lang.id}>
                      <Row
                        gutter={16}
                        className="registration_languagesContainer"
                      >
                        <Col xs={24} sm={24} md={24} lg={9}>
                          <CommonInputField
                            label={`Language ${index + 1} `}
                            mandatory={true}
                            value={lang.name}
                            onChange={(e) =>
                              handleLanguages(index, "name", e.target.value)
                            }
                            error={lang.languageError}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={9}>
                          <Checkbox.Group
                            options={languageLevelOptions}
                            value={lang.levelStatus}
                            onChange={(checkedValues) =>
                              handleLanguages(
                                index,
                                "levelStatus",
                                checkedValues
                              )
                            }
                          />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6}>
                          <Button
                            onClick={() => deleteLanguage(index)}
                            className="registration_deletecompanybutton"
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                      {languages.length <= 1 ||
                      languages.length - 1 === index ? (
                        ""
                      ) : (
                        <Divider className="registration_companyfields_divider" />
                      )}
                    </React.Fragment>
                  ))}
                  <Button
                    onClick={addLanguage}
                    className="registration_addcompanybutton"
                  >
                    Add Language
                  </Button>
                </div>
              </div>
            ) : pageSection === 7 ? (
              <div className="registration_personalinfosection">
                <p className="registration_sectionheadings">
                  Upload Your Resume
                </p>
                <div style={{ marginTop: "24px" }}>
                  <Dragger
                    className="registration_draganddropcontainer"
                    multiple={false}
                    onChange={handleResumeAttachment}
                    beforeUpload={(file) => {
                      console.log(file);
                      return false; // Prevent auto-upload
                    }}
                    maxCount={1}
                    fileList={resumeArray}
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
                </div>
              </div>
            ) : (
              ""
            )}

            {/* footer */}
            <div className="candidate_footercontainer">
              <div className="candidate_backwarddiv" onClick={handleBackward}>
                {pageSection === 1 ? (
                  ""
                ) : (
                  <>
                    <IoIosArrowBack
                      size={20}
                      color="#0056b3"
                      style={{ marginTop: "1px" }}
                    />
                    <p className="candidate_backtext">Back</p>
                  </>
                )}
              </div>
              {loading ? (
                <button className="candidate_forwardloadingbutton">
                  <Spin
                    indicator={
                      <LoadingOutlined
                        spin
                        style={{ marginRight: "4px", color: "#ffffff" }}
                      />
                    }
                    size={26}
                  />{" "}
                </button>
              ) : (
                <button
                  className="candidate_forwardbutton"
                  onClick={handleForward}
                >
                  <IoIosArrowForward size={26} color="#ffffff" />
                </button>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import "./styles.css";
import { Row, Col, Divider, Modal, Avatar, Pagination, Button } from "antd";
import {
  addToFavorite,
  createFolder,
  deleteFavorite,
  getCandidates,
  getFavoriteCandidates,
  getFavorites,
  getSkills,
} from "../Common/action";
import { CommonToaster } from "../Common/CommonToaster";
import moment from "moment";
import CommonSelectField from "../Common/CommonSelectField";
import CommonInputField from "../Common/CommonInputField";
import { Layout, Menu, theme } from "antd";
import Actelogo from "../images/acte-logo.png";
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { PiGraduationCapDuotone } from "react-icons/pi";
import { BsGenderMale } from "react-icons/bs";
import { BsGenderFemale } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FiAward } from "react-icons/fi";
import { BsBuildings } from "react-icons/bs";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { IoMdArrowRoundUp } from "react-icons/io";
import { pdfjs, Document, Page } from "react-pdf";
import Header from "../Header/Header";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import CommonMultiSelect from "../Common/CommonMultiSelect";
import { addressValidator } from "../Common/Validation";

const { Content, Footer, Sider } = Layout;

export default function Favorites() {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalRecords: 0,
    totalPages: 0,
    limit: 40,
  });
  const navigate = useNavigate();
  const [totalProfileCount, setTotalProfileCount] = useState(0);

  const [skillsModal, setSkillsModal] = useState(false);
  const [experienceModal, setExperienceModal] = useState(false);
  const [noticePeriodModal, setNoticePeriodModal] = useState(false);
  const [salaryModal, setSalaryModal] = useState(false);
  const [mobileModal, setMobileModal] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [educationModal, setEducationModal] = useState(false);
  const [genderModal, setGenderModal] = useState(false);
  const [companyModal, setCompanyModal] = useState(false);
  const [designationModal, setDesignationModal] = useState(false);
  const [conatactInfoModal, setConatactInfoModal] = useState(false);
  const [resumeViewerModal, setResumeViewerModal] = useState(false);
  const [folderModal, setFolderModal] = useState(false);

  const [skillsFilter, setSkillsFilter] = useState([]);
  const [skillsFilterRender, setSkillsFilterRender] = useState([]);
  const [experienceYear, setExperienceYear] = useState("");
  const [experienceMonth, setExperienceMonth] = useState("");
  const [noticePeriods, setNoticePeriods] = useState("");
  const [salary, setSalary] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLoaction] = useState("");
  const [gender, setGender] = useState(null);
  const [CompanyName, setCompanyName] = useState("");
  const [Designation, setDesignation] = useState("");
  const [degree, setDegree] = useState("");
  const [passedOut, setPassedOut] = useState("");
  const [resumeBase64, setResumeBase64] = useState("");
  const [folderName, setFolderName] = useState("");
  const [folderNameError, setFolderNameError] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const [contactInfoFirstName, setContactInfoFirstName] = useState("");
  const [contactInfoLastName, setContactInfoLastName] = useState("");
  const [contactInfoMobile, setContactInfoMobile] = useState("");
  const [contactInfoEmail, setContactInfoEmail] = useState("");
  const [contactInfoLinkedin, setContactInfoLinkedin] = useState("");

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

  const filterList = [
    { id: 1, name: "Experience" },
    { id: 10, name: "Skills" },
    { id: 2, name: "Location" },
    { id: 3, name: "Salary" },
    { id: 4, name: "Education" },
    { id: 5, name: "Notice Period" },
    { id: 6, name: "Mobile" },
    { id: 7, name: "Gender" },
    { id: 8, name: "Company" },
    { id: 9, name: "Designation" },
  ];
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

  const [skillsList, setSkillsList] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);

  useEffect(() => {
    getFavoritesData();
  }, []);

  const getFavoritesData = async () => {
    try {
      const response = await getFavorites();
      console.log("favorites list", response);
      setFavoritesList(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCandidatesData();
  }, [pagination.currentPage, pagination.limit]);

  const getCandidatesData = async (
    yearsOfExperience,
    monthOfExperience,
    noticePeriod,
    currentCTC,
    mobile,
    city,
    qualification,
    graduateYear,
    gen,
    companyName,
    designation,
    skills
  ) => {
    console.log("skills list", skills);
    const userId = localStorage.getItem("loginUserId");
    const payload = {
      userId: userId,
      yearsOfExperience:
        yearsOfExperience != undefined ? yearsOfExperience : experienceYear,
      monthOfExperience:
        monthOfExperience != undefined ? monthOfExperience : experienceMonth,
      noticePeriod: noticePeriod != undefined ? noticePeriod : noticePeriods,
      currentCTC: currentCTC != undefined ? currentCTC : salary,
      mobile: mobile != undefined ? mobile : phone,
      city: city != undefined ? city : location,
      qualification: qualification != undefined ? qualification : degree,
      graduateYear: graduateYear != undefined ? graduateYear : passedOut,
      gender: gen != undefined ? gen : gender,
      companyName: companyName != undefined ? companyName : CompanyName,
      designation: designation != undefined ? designation : Designation,
      skills: Array.isArray(skills) ? skills : skills ? [skills] : skillsFilter,
      // favorites: 1,
      page: pagination.currentPage,
      limit: pagination.limit,
    };
    try {
      const response = await getFavoriteCandidates(payload);
      console.log("favorite candidates response", response);
      setCandidates(response?.data?.data?.data);
      setTotalProfileCount(response?.data?.data?.pagination?.total);
    } catch (error) {
      console.log(error);
    } finally {
      getSkillsData();
    }
  };

  const getSkillsData = async () => {
    try {
      const response = await getSkills();
      setSkillsList(response?.data?.data);
    } catch (error) {
      CommonToaster(error?.response?.data?.message);
    }
  };

  const handleExperienceModal = () => {
    getCandidatesData(
      experienceYear,
      experienceMonth,
      noticePeriods,
      salary,
      phone,
      location,
      degree,
      passedOut,
      gender,
      CompanyName,
      Designation,
      skillsFilter
    );
    setExperienceModal(false);
  };

  const handleLocationModal = () => {
    getCandidatesData(
      experienceYear,
      experienceMonth,
      noticePeriods,
      salary,
      phone,
      location,
      degree,
      passedOut,
      gender,
      CompanyName,
      Designation,
      skillsFilter
    );
    setLocationModal(false);
  };

  const handleSalaryModal = () => {
    getCandidatesData(
      experienceYear,
      experienceMonth,
      noticePeriods,
      salary,
      phone,
      location,
      degree,
      passedOut,
      gender,
      CompanyName,
      Designation,
      skillsFilter
    );
    setSalaryModal(false);
  };

  const handleEducationModal = () => {
    getCandidatesData(
      experienceYear,
      experienceMonth,
      noticePeriods,
      salary,
      phone,
      location,
      degree,
      passedOut,
      gender,
      CompanyName,
      Designation,
      skillsFilter
    );
    setEducationModal(false);
  };

  const handleNoticePeriodModal = () => {
    getCandidatesData(
      experienceYear,
      experienceMonth,
      noticePeriods,
      salary,
      phone,
      location,
      degree,
      passedOut,
      gender,
      CompanyName,
      Designation,
      skillsFilter
    );
    setNoticePeriodModal(false);
  };

  const handleMobileModal = () => {
    getCandidatesData(
      experienceYear,
      experienceMonth,
      noticePeriods,
      salary,
      phone,
      location,
      degree,
      passedOut,
      gender,
      CompanyName,
      Designation,
      skillsFilter
    );
    setMobileModal(false);
  };

  const handleGenderModal = () => {
    getCandidatesData(
      experienceYear,
      experienceMonth,
      noticePeriods,
      salary,
      phone,
      location,
      degree,
      passedOut,
      gender,
      CompanyName,
      Designation,
      skillsFilter
    );
    setGenderModal(false);
  };

  const handleCompanyModal = () => {
    getCandidatesData(
      experienceYear,
      experienceMonth,
      noticePeriods,
      salary,
      phone,
      location,
      degree,
      passedOut,
      gender,
      CompanyName,
      Designation,
      skillsFilter
    );
    setCompanyModal(false);
  };

  const handleDesignationModal = () => {
    getCandidatesData(
      experienceYear,
      experienceMonth,
      noticePeriods,
      salary,
      phone,
      location,
      degree,
      passedOut,
      gender,
      CompanyName,
      Designation,
      skillsFilter
    );
    setDesignationModal(false);
  };

  const handleSkillsModal = () => {
    const result = skillsList.filter((f) =>
      skillsFilter.some((s) => f.id === s)
    );
    console.log(result);
    setSkillsFilterRender(result);
    getCandidatesData(
      experienceYear,
      experienceMonth,
      noticePeriods,
      salary,
      phone,
      location,
      degree,
      passedOut,
      gender,
      CompanyName,
      Designation,
      skillsFilter
    );
    setSkillsModal(false);
  };

  const handleContactInfoModal = (
    firstName,
    lastName,
    mobile,
    email,
    linkedinURL
  ) => {
    setContactInfoFirstName(firstName);
    setContactInfoLastName(lastName);
    setContactInfoMobile(mobile);
    setContactInfoEmail(email);
    setContactInfoLinkedin(linkedinURL);
    setConatactInfoModal(true);
  };

  const handleFolderModal = async () => {
    console.log("folderss");
    const folderNameValidate = addressValidator(folderName);

    const payload = {
      name: folderName,
      city: location,
      yearsOfExperience: experienceYear,
      monthOfExperience: experienceMonth,
      skills: skillsFilter,
      qualification: degree,
      graduateYear: passedOut,
      gender: gender,
      noticePeriod: noticePeriods,
      currentCTC: salary,
      companyName: CompanyName,
      designation: Designation,
    };

    try {
      const response = await createFolder(payload);
      console.log("folder response", response);
      setFolderName("");
      setFolderModal(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleFiterClear = async () => {
    if (
      experienceYear === "" &&
      experienceMonth === "" &&
      noticePeriods === "" &&
      salary === "" &&
      phone === "" &&
      location === "" &&
      degree === "" &&
      passedOut === "" &&
      gender === null
    ) {
      return;
    }
    setExperienceYear("");
    setExperienceMonth("");
    setNoticePeriods("");
    setSalary("");
    setPhone("");
    setLoaction("");
    setDegree("");
    setPassedOut("");
    setGender(null);
    setCompanyName("");
    const userId = localStorage.getItem("loginUserId");

    const payload = {
      userId: userId,
    };
    try {
      const response = await getFavoriteCandidates(payload);
      console.log("candidates response", response);
      setCandidates(response?.data?.data?.data);
      setTotalProfileCount(response?.data?.data?.pagination?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearParticularFilter = (id) => {
    if (id === 1) {
      setExperienceYear("");
      setExperienceMonth("");
      getCandidatesData(
        "",
        "",
        noticePeriods,
        salary,
        phone,
        location,
        degree,
        passedOut,
        gender
      );
    }
    if (id === 2) {
      setLoaction("");
      getCandidatesData(
        experienceYear,
        experienceMonth,
        noticePeriods,
        salary,
        phone,
        "",
        degree,
        passedOut,
        gender
      );
    }
    if (id === 3) {
      setSalary("");
      getCandidatesData(
        experienceYear,
        experienceMonth,
        noticePeriods,
        "",
        phone,
        location,
        degree,
        passedOut,
        gender
      );
    }
    if (id === 4) {
      setDegree("");
      setPassedOut("");
      getCandidatesData(
        experienceYear,
        experienceMonth,
        noticePeriods,
        salary,
        phone,
        location,
        "",
        "",
        gender
      );
    }
    if (id === 5) {
      setNoticePeriods("");
      getCandidatesData(
        experienceYear,
        experienceMonth,
        null,
        salary,
        phone,
        location,
        degree,
        passedOut,
        gender
      );
    }
    if (id === 6) {
      setPhone("");
      getCandidatesData(
        experienceYear,
        experienceMonth,
        noticePeriods,
        salary,
        "",
        location,
        degree,
        passedOut,
        gender
      );
    }
    if (id === 7) {
      setGender(null);
      getCandidatesData(
        experienceYear,
        experienceMonth,
        noticePeriods,
        salary,
        phone,
        location,
        degree,
        passedOut,
        ""
      );
    }
    if (id === 8) {
      setCompanyName("");
      getCandidatesData(
        experienceYear,
        experienceMonth,
        noticePeriods,
        salary,
        phone,
        location,
        degree,
        passedOut,
        gender,
        ""
      );
    }

    if (id === 9) {
      setDesignation("");
      getCandidatesData(
        experienceYear,
        experienceMonth,
        noticePeriods,
        salary,
        phone,
        location,
        degree,
        passedOut,
        gender,
        CompanyName,
        ""
      );
    }

    if (id === 10) {
      setSkillsFilter([]);
      setSkillsFilterRender([]);
      getCandidatesData(
        experienceYear,
        experienceMonth,
        noticePeriods,
        salary,
        phone,
        location,
        degree,
        passedOut,
        gender,
        CompanyName,
        Designation,
        []
      );
    }
  };

  const [scrollValue, setScrollValue] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollValue(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddfavorite = async (Id, favoriteStatus) => {
    const userId = localStorage.getItem("loginUserId");
    if (favoriteStatus === false) {
      const payload = {
        userId: userId,
        candidateId: Id,
      };
      try {
        const response = await addToFavorite(payload);
        CommonToaster("Added to favorites");
        getFavoritesData();
      } catch (error) {
        console.log("add to favorite error");
      } finally {
        getCandidatesData();
      }
    } else {
      const payload = {
        userId: userId,
        candidateId: Id,
      };
      try {
        const response = await deleteFavorite(payload);
        CommonToaster("Removed from favorites");
        getFavoritesData();
      } catch (error) {
        console.log("add to favorite error");
      } finally {
        getCandidatesData();
      }
    }
  };

  return (
    <div className="admin_mainContainer" id="admin_mainContainer">
      <Header />
      <Row className="admin_layoutrowContainer">
        <Col span={6}>
          <div
            className="admin_filtersmainContainer"
            style={{
              position:
                candidates.length >= 2 && scrollValue > 100
                  ? "fixed"
                  : "relative",
              transform:
                candidates.length >= 2 && scrollValue > 50 && scrollValue < 100
                  ? "translateY(-15px)"
                  : candidates.length >= 2 && scrollValue > 100
                  ? "translateY(-85px)"
                  : "translateY(0px)",
              transition: scrollValue < 50 ? "transform 0.3s ease-in-out" : "",
            }}
          >
            <Row
              className="admin_filtersubContainer"
              style={{ paddingTop: "19px" }}
            >
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={12}
                xxl={12}
                className="admin_leftheding_coldiv"
              >
                <p className="filters_heading">Filters</p>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={12}
                xxl={12}
                className="admin_clearContainer"
              >
                <p className="admin_clearalltext" onClick={handleFiterClear}>
                  Clear All
                </p>
              </Col>
            </Row>
            <Divider className="admin_filterdivider" />

            {filterList.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <Row className="admin_filtersubContainer">
                    <Col span={12} className="admin_leftheding_coldiv">
                      <p className="filters_heading">{item.name}</p>
                    </Col>
                    <Col span={12} className="admin_clearContainer">
                      <div className="admin_filterbuttonContainer">
                        {item.id === 1 &&
                          (experienceYear !== "" || experienceMonth !== "") && (
                            <div
                              className="admin_filtercloseicondiv"
                              onClick={() =>
                                handleClearParticularFilter(item.id)
                              }
                            >
                              <IoCloseSharp size={17} />
                            </div>
                          )}

                        {item.id === 2 && location !== "" && (
                          <div
                            className="admin_filtercloseicondiv"
                            onClick={() => handleClearParticularFilter(item.id)}
                          >
                            <IoCloseSharp size={17} />
                          </div>
                        )}

                        {item.id === 3 && salary !== "" && (
                          <div
                            className="admin_filtercloseicondiv"
                            onClick={() => handleClearParticularFilter(item.id)}
                          >
                            <IoCloseSharp size={17} />
                          </div>
                        )}

                        {item.id === 4 && (degree != "" || passedOut != "") && (
                          <div
                            className="admin_filtercloseicondiv"
                            onClick={() => handleClearParticularFilter(item.id)}
                          >
                            <IoCloseSharp size={17} />
                          </div>
                        )}

                        {item.id === 5 && noticePeriods != "" && (
                          <div
                            className="admin_filtercloseicondiv"
                            onClick={() => handleClearParticularFilter(item.id)}
                          >
                            <IoCloseSharp size={17} />
                          </div>
                        )}

                        {item.id === 6 && phone != "" && (
                          <div
                            className="admin_filtercloseicondiv"
                            onClick={() => handleClearParticularFilter(item.id)}
                          >
                            <IoCloseSharp size={17} />
                          </div>
                        )}

                        {item.id === 7 && gender && (
                          <div
                            className="admin_filtercloseicondiv"
                            onClick={() => handleClearParticularFilter(item.id)}
                          >
                            <IoCloseSharp size={17} />
                          </div>
                        )}

                        {item.id === 8 && CompanyName && (
                          <div
                            className="admin_filtercloseicondiv"
                            onClick={() => handleClearParticularFilter(item.id)}
                          >
                            <IoCloseSharp size={17} />
                          </div>
                        )}

                        {item.id === 9 && Designation && (
                          <div
                            className="admin_filtercloseicondiv"
                            onClick={() => handleClearParticularFilter(item.id)}
                          >
                            <IoCloseSharp size={17} />
                          </div>
                        )}

                        {item.id === 10 && skillsFilter.length >= 1 && (
                          <div
                            className="admin_filtercloseicondiv"
                            onClick={() => handleClearParticularFilter(item.id)}
                          >
                            <IoCloseSharp size={17} />
                          </div>
                        )}
                        <div
                          className="admin_filterarrowicondiv"
                          onClick={() => {
                            if (item.id === 1) {
                              setExperienceModal(true);
                            }
                            if (item.id === 2) {
                              setLocationModal(true);
                            }
                            if (item.id === 3) {
                              setSalaryModal(true);
                            }
                            if (item.id === 4) {
                              setEducationModal(true);
                            }
                            if (item.id === 5) {
                              setNoticePeriodModal(true);
                            }
                            if (item.id === 6) {
                              setMobileModal(true);
                            }
                            if (item.id === 7) {
                              setGenderModal(true);
                            }
                            if (item.id === 8) {
                              setCompanyModal(true);
                            }
                            if (item.id === 9) {
                              setDesignationModal(true);
                            }
                            if (item.id === 10) {
                              setSkillsModal(true);
                            }
                          }}
                        >
                          <IoIosArrowForward size={17} />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  {item.id === 1 ? (
                    <div className="admin_filtervaluesmaindiv">
                      {experienceYear !== null &&
                        experienceYear !== "" &&
                        experienceYear !== undefined && (
                          <div className="admin_filtervaluesdiv">
                            <p>{experienceYear + " " + "years"}</p>
                          </div>
                        )}
                      {experienceMonth !== null &&
                        experienceMonth !== "" &&
                        experienceMonth !== undefined && (
                          <div className="admin_filtervaluesdiv">
                            <p>{experienceMonth + " " + "months"}</p>
                          </div>
                        )}
                    </div>
                  ) : item.id === 2 ? (
                    <div className="admin_filtervaluesmaindiv">
                      {location && (
                        <div className="admin_filtervaluesdiv">
                          <p>{location}</p>
                        </div>
                      )}
                    </div>
                  ) : item.id === 3 ? (
                    <div className="admin_filtervaluesmaindiv">
                      {salary && (
                        <div className="admin_filtervaluesdiv">
                          <p>{salary}</p>
                        </div>
                      )}
                    </div>
                  ) : item.id === 4 ? (
                    <div className="admin_filtervaluesmaindiv">
                      {degree && (
                        <div className="admin_filtervaluesdiv">
                          <p>{degree}</p>
                        </div>
                      )}
                      {passedOut != "" && (
                        <div className="admin_filtervaluesdiv">
                          <p>{passedOut}</p>
                        </div>
                      )}
                    </div>
                  ) : item.id === 5 ? (
                    <div className="admin_filtervaluesmaindiv">
                      {noticePeriods && (
                        <div className="admin_filtervaluesdiv">
                          <p>{noticePeriods}</p>
                        </div>
                      )}
                    </div>
                  ) : item.id === 6 ? (
                    <div className="admin_filtervaluesmaindiv">
                      {phone && (
                        <div className="admin_filtervaluesdiv">
                          <p>{phone}</p>
                        </div>
                      )}
                    </div>
                  ) : item.id === 7 ? (
                    <div className="admin_filtervaluesmaindiv">
                      {gender && (
                        <div className="admin_filtervaluesdiv">
                          <p>{gender}</p>
                        </div>
                      )}
                    </div>
                  ) : item.id === 8 ? (
                    <div className="admin_filtervaluesmaindiv">
                      {CompanyName && (
                        <div className="admin_filtervaluesdiv">
                          <p>{CompanyName}</p>
                        </div>
                      )}
                    </div>
                  ) : item.id === 9 ? (
                    <div className="admin_filtervaluesmaindiv">
                      {Designation && (
                        <div className="admin_filtervaluesdiv">
                          <p>{Designation}</p>
                        </div>
                      )}
                    </div>
                  ) : item.id === 10 ? (
                    <div className="admin_filtervaluesmaindiv">
                      {skillsFilterRender.length >= 1 && (
                        <>
                          {skillsFilterRender.map((item, index) => (
                            <div key={index} className="admin_filtervaluesdiv">
                              <p>{item.name}</p>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  <Divider className="admin_filterdivider" />
                </React.Fragment>
              );
            })}
          </div>
        </Col>
        <Col span={18}>
          <Row
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <p className="admin_profilefound_heading">
                {totalProfileCount} Profile found
              </p>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              xxl={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Pagination
                current={pagination.currentPage}
                total={pagination.totalRecords}
                pageSize={pagination.limit}
                onChange={(page, pageSize) =>
                  setPagination({
                    ...pagination,
                    currentPage: page,
                    limit: pageSize,
                  })
                }
                showSizeChanger
                pageSizeOptions={["20", "40", "80", "160"]}
              />
            </Col>

            {candidates.length >= 1 ? (
              <>
                {candidates.map((item, index) => {
                  const profileBase64String = `data:image/jpeg;base64,${item.profileImage}`;
                  const isFavorite = favoritesList.some(
                    (fav) => fav.candidateId === item.id
                  );
                  return (
                    <React.Fragment key={index}>
                      <div className="admin_candidatesDetailscard">
                        <Row
                          gutter={16}
                          className="admin_candidatesDetailsmainContainer"
                        >
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={12}
                            xl={12}
                            xxl={12}
                            style={{ borderRight: "1px solid #0e0c0c33" }}
                          >
                            <Row>
                              <Col span={6}>
                                {item.profileImage ? (
                                  <img
                                    src={profileBase64String}
                                    className="admin_candidateprofileimage"
                                  />
                                ) : (
                                  <FaRegUser size={55} color="#212121" />
                                )}
                              </Col>
                              <Col span={18}>
                                <p
                                  className="admin_candidatename"
                                  onClick={() =>
                                    navigate("/profile", {
                                      state: { candidateId: item.id },
                                    })
                                  }
                                >
                                  {item.firstName + " " + item.lastName}
                                </p>

                                {item.gender === "Male" ? (
                                  <div className="admin_candidateprofdiv">
                                    <BsGenderMale
                                      size={15}
                                      color="#333"
                                      className="admin_candidatecard_icons"
                                    />
                                    <p className="admin_candidategender">
                                      {item.gender}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="admin_candidateprofdiv">
                                    <BsGenderFemale
                                      size={15}
                                      color="#333"
                                      className="admin_candidatecard_icons"
                                    />
                                    <p className="admin_candidategender">
                                      {item.gender}
                                    </p>
                                  </div>
                                )}

                                <div className="admin_candidateprofdiv">
                                  <HiOutlineUserCircle
                                    size={16}
                                    color="#333"
                                    className="admin_candidatecard_icons"
                                  />
                                  <p className="admin_candidatedesignation">
                                    {item.designation.charAt(0).toUpperCase() +
                                      item.designation.slice(1)}
                                  </p>
                                </div>

                                <div className="admin_candidateprofdiv">
                                  <BsBuildings className="admin_candidatecard_icons" />
                                  <p className="admin_candidategender">
                                    {item.companyName}
                                  </p>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <FiAward
                                    color="#333"
                                    size={15}
                                    className="admin_candidatecard_icons"
                                  />
                                  <p className="admin_candidategender">
                                    {item.companyStartdate === null &&
                                    item.companyEnddate === null
                                      ? "Fresher"
                                      : item.companyStartdate != null &&
                                        item.companyEnddate === null
                                      ? moment(item.companyStartdate).format(
                                          "MMM YYYY"
                                        ) +
                                        " " +
                                        "-" +
                                        " " +
                                        "Present"
                                      : moment(item.companyStartdate).format(
                                          "MMM YYYY"
                                        ) +
                                        " - " +
                                        moment(item.companyEnddate).format(
                                          "MMM YYYY"
                                        )}
                                  </p>
                                </div>
                              </Col>
                            </Row>

                            <Row style={{ marginTop: "6px" }}>
                              <Col span={6}>
                                <p className="admin_candidate_lefttext">
                                  Location:
                                </p>
                              </Col>
                              <Col span={18}>
                                <p className="admin_candidate_locationtext">
                                  {item.city
                                    ? item.city.charAt(0).toUpperCase() +
                                      item.city.slice(1)
                                    : "-"}
                                </p>
                              </Col>
                            </Row>

                            <Row style={{ marginTop: "12px" }}>
                              <Col span={6}>
                                <p className="admin_candidate_lefttext">
                                  Pref. location:
                                </p>
                              </Col>
                              <Col span={18}>
                                <p className="admin_candidate_locationtext">
                                  {item.preferredJobLocations.length >= 1
                                    ? item.preferredJobLocations
                                        .map(
                                          (location) =>
                                            location.charAt(0).toUpperCase() +
                                            location.slice(1)
                                        )
                                        .join(", ")
                                    : "-"}
                                </p>
                              </Col>
                            </Row>

                            <Row style={{ marginTop: "12px" }}>
                              <Col span={6}>
                                <p className="admin_candidate_lefttext">
                                  Nationality:
                                </p>
                              </Col>
                              <Col span={18}>
                                <p className="admin_candidate_locationtext">
                                  {item.country.charAt(0).toUpperCase() +
                                    item.country.slice(1)}
                                </p>
                              </Col>
                            </Row>

                            <Row style={{ marginTop: "12px" }}>
                              <Col span={6}>
                                <p className="admin_candidate_lefttext">
                                  Education:
                                </p>
                              </Col>
                              <Col span={18}>
                                <div style={{ display: "flex" }}>
                                  <PiGraduationCapDuotone
                                    size={15}
                                    className="admin_candidatecard_icons"
                                  />
                                  <p className="admin_candidate_locationtext">
                                    {item.qualification +
                                      " " +
                                      "at" +
                                      " " +
                                      item.university +
                                      " " +
                                      "in" +
                                      " " +
                                      item.graduateYear}
                                  </p>
                                </div>
                              </Col>
                            </Row>

                            <Row style={{ marginTop: "12px" }}>
                              <Col span={6}>
                                <p className="admin_candidate_lefttext">
                                  Skills:
                                </p>
                              </Col>
                              <Col span={18}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "0px",
                                  }}
                                >
                                  {item.skills.map((item, index) => {
                                    const isHighlighted = skillsFilter.includes(
                                      item.id
                                    );
                                    return (
                                      <React.Fragment key={index}>
                                        <div className="admin_candidateskills_container">
                                          <p
                                            className={
                                              isHighlighted
                                                ? "highlighted-skill"
                                                : ""
                                            }
                                          >
                                            {item.name.charAt(0).toUpperCase() +
                                              item.name.slice(1)}
                                          </p>
                                        </div>
                                      </React.Fragment>
                                    );
                                  })}
                                </div>
                              </Col>
                            </Row>

                            <Row
                              gutter={16}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "16px",
                              }}
                            >
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={12}
                                xl={12}
                                xxl={12}
                              >
                                <p className="admin_candidate_lefttext">
                                  Created At:{" "}
                                  {moment(item.createdAt).format("DD/MM/YYYY")}
                                </p>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={12}
                                xl={12}
                                xxl={12}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                  }}
                                >
                                  <button
                                    className="admin_favoritesbutton"
                                    onClick={() =>
                                      handleAddfavorite(item.id, isFavorite)
                                    }
                                  >
                                    {isFavorite ? (
                                      <IoBookmark
                                        color="#FFC107"
                                        size={16}
                                        style={{ marginRight: "6px" }}
                                      />
                                    ) : (
                                      <IoBookmarkOutline
                                        size={16}
                                        style={{ marginRight: "6px" }}
                                      />
                                    )}
                                    Favorite
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            <div
                              style={{
                                position: "relative",
                                height: "100%",
                                padding: "0px 6px",
                              }}
                            >
                              <p className="admin_candidate_profilesummaryheading">
                                Profile Summary
                              </p>
                              {item.profileSummary ? (
                                <p className="admin_candidate_profilesummary">
                                  {item.profileSummary}
                                </p>
                              ) : (
                                <p className="admin_candidate_nosummary">
                                  No data found
                                </p>
                              )}
                              <Row
                                gutter={16}
                                className="admin_profilesummaryrow"
                              >
                                <Col span={8}>
                                  <p className="admin_experienceheading">
                                    Total Experience
                                  </p>
                                  <p className="admin_ctctext">
                                    {item.yearsOfExperience === 0 &&
                                    item.monthOfExperience === 0
                                      ? "Fresher"
                                      : item.yearsOfExperience +
                                        " " +
                                        "Years" +
                                        " " +
                                        item.monthOfExperience +
                                        " " +
                                        "Months"}
                                  </p>
                                </Col>
                                <Col span={8}>
                                  <p className="admin_experienceheading">
                                    CTC Anually
                                  </p>
                                  <p className="admin_ctctext">
                                    {item.currentCTC}
                                  </p>
                                </Col>
                                <Col span={8}>
                                  <p className="admin_experienceheading">
                                    Notice period
                                  </p>
                                  <p className="admin_ctctext">
                                    {item.noticePeriod}
                                  </p>
                                </Col>
                              </Row>

                              <div className="admin_contactinfo_buttondiv">
                                <Row style={{ width: "100%" }}>
                                  <Col span={12}>
                                    <button
                                      className="admin_viewresumebutton"
                                      onClick={() => {
                                        const pdfDataUrl = `data:application/pdf;base64,${item.resume}`;
                                        setResumeBase64(pdfDataUrl);
                                        setResumeViewerModal(true);
                                      }}
                                    >
                                      <FaRegFileAlt
                                        style={{ marginRight: "6px" }}
                                      />
                                      View Resume
                                    </button>
                                  </Col>
                                  <Col
                                    span={12}
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <button
                                      className="admin_contactinfo_button"
                                      onClick={() =>
                                        handleContactInfoModal(
                                          item.firstName,
                                          item.lastName,
                                          item.mobile,
                                          item.email,
                                          item.linkedinURL,
                                          item.resume
                                        )
                                      }
                                    >
                                      Contact Info
                                    </button>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              <div className="admin_candidatenodatadiv">
                <p>No data found</p>
              </div>
            )}
          </Row>
        </Col>
      </Row>

      {window.scrollY > 300 && (
        <div className="admin_movetotop_buttonContainer">
          <button
            className="admin_movetotop_button"
            onClick={() => {
              const container = document.getElementById("admin_mainContainer");
              container.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <IoMdArrowRoundUp size={22} color="#ffffff" />
          </button>
        </div>
      )}
      <Modal
        title="Filter experience"
        open={experienceModal}
        onOk={handleExperienceModal}
        onCancel={() => {
          setExperienceModal(false);
        }}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleExperienceModal}
          >
            Submit
          </button>,
        ]}
      >
        <div style={{ marginTop: "16px" }}>
          <CommonSelectField
            options={experienceYearsOptions}
            label="Years of experience"
            value={experienceYear}
            onChange={(value) => setExperienceYear(value)}
          />
        </div>

        <div style={{ marginTop: "22px", marginBottom: "22px" }}>
          <CommonSelectField
            options={experienceMonthsOptions}
            label="Years of month"
            value={experienceMonth}
            onChange={(value) => setExperienceMonth(value)}
          />
        </div>
      </Modal>

      {/* notice period modal */}
      <Modal
        title="Filter notice period"
        open={noticePeriodModal}
        onOk={handleNoticePeriodModal}
        onCancel={() => {
          setNoticePeriodModal(false);
        }}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleNoticePeriodModal}
          >
            Submit
          </button>,
        ]}
      >
        <div style={{ marginTop: "16px" }}>
          <CommonSelectField
            options={noticePeriodOptions}
            label="Notice period"
            value={noticePeriods}
            onChange={(value) => setNoticePeriods(value)}
          />
        </div>
      </Modal>

      {/* salary modal */}
      <Modal
        title="Filter salary"
        open={salaryModal}
        onOk={handleSalaryModal}
        onCancel={() => {
          setSalaryModal(false);
        }}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleSalaryModal}
          >
            Submit
          </button>,
        ]}
      >
        <div style={{ marginTop: "16px" }}>
          <CommonInputField
            label="Current ctc"
            value={salary}
            type="number"
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
      </Modal>

      {/* gender modal */}
      <Modal
        title="Filter gender"
        open={genderModal}
        onOk={handleGenderModal}
        onCancel={() => {
          setGenderModal(false);
        }}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleGenderModal}
          >
            Submit
          </button>,
        ]}
      >
        <div style={{ marginTop: "16px" }}>
          <CommonSelectField
            options={genderOptions}
            label="Gender"
            value={gender}
            onChange={(value) => setGender(value)}
          />
        </div>
      </Modal>

      {/* mobile modal */}
      <Modal
        title="Filter mobile number"
        open={mobileModal}
        onOk={handleMobileModal}
        onCancel={() => {
          setMobileModal(false);
        }}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleMobileModal}
          >
            Submit
          </button>,
        ]}
      >
        <div style={{ marginTop: "16px" }}>
          <CommonInputField
            label="Mobile"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </Modal>

      {/* education modal */}
      <Modal
        title="Filter education"
        open={educationModal}
        onOk={handleEducationModal}
        onCancel={() => {
          setEducationModal(false);
        }}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleEducationModal}
          >
            Submit
          </button>,
        ]}
      >
        <div style={{ marginTop: "16px" }}>
          <CommonInputField
            label="Qualification"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            style={{ marginBottom: "22px" }}
          />
          <CommonInputField
            label="Graduate year"
            value={passedOut}
            onChange={(e) => setPassedOut(e.target.value)}
          />
        </div>
      </Modal>

      {/* location modal */}
      <Modal
        title="Filter mobile number"
        open={locationModal}
        onOk={handleLocationModal}
        onCancel={() => {
          setLocationModal(false);
        }}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleLocationModal}
          >
            Submit
          </button>,
        ]}
      >
        <div style={{ marginTop: "16px" }}>
          <CommonInputField
            label="Location"
            value={location}
            onChange={(e) => setLoaction(e.target.value)}
          />
        </div>
      </Modal>

      {/* comapany modal */}
      <Modal
        title="Filter company"
        open={companyModal}
        onOk={handleCompanyModal}
        onCancel={() => {
          setCompanyModal(false);
        }}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleCompanyModal}
          >
            Submit
          </button>,
        ]}
      >
        <div style={{ marginTop: "16px" }}>
          <CommonInputField
            label="Company name"
            value={CompanyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
      </Modal>

      {/* designation modal */}
      <Modal
        title="Filter designation"
        open={designationModal}
        onOk={handleDesignationModal}
        onCancel={() => {
          setDesignationModal(false);
        }}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleDesignationModal}
          >
            Submit
          </button>,
        ]}
      >
        <div style={{ marginTop: "16px" }}>
          <CommonInputField
            label="Designation"
            value={Designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </div>
      </Modal>

      {/* skills modal */}
      <Modal
        title="Filter skills"
        open={skillsModal}
        onOk={handleSkillsModal}
        onCancel={() => {
          setSkillsModal(false);
        }}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleSkillsModal}
          >
            Submit
          </button>,
        ]}
      >
        <div style={{ marginTop: "16px" }}>
          <CommonSelectField
            mode="tags"
            label="Skills"
            options={skillsList}
            value={skillsFilter}
            onChange={(value) => {
              setSkillsFilter(value);
            }}
          />
        </div>
      </Modal>

      {/* folders modal */}
      <Modal
        title="Save current filter profiles to folder"
        open={folderModal}
        onOk={handleFolderModal}
        onCancel={() => {
          setFolderModal(false);
        }}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleFolderModal}
          >
            Submit
          </button>,
        ]}
      >
        <div style={{ marginTop: "16px" }}>
          <CommonInputField
            label="Name"
            mandatory={true}
            value={folderName}
            error={folderNameError}
            onChange={(e) => {
              setFolderName(e.target.value);
              setFolderNameError(addressValidator(e.target.value));
            }}
          />
        </div>
      </Modal>

      {/* contactinfo modal */}
      <Modal
        title="Contact Details"
        open={conatactInfoModal}
        onCancel={() => {
          setConatactInfoModal(false);
        }}
        footer={false}
      >
        <CommonInputField
          label="First name"
          value={contactInfoFirstName}
          onChange={(e) => setContactInfoFirstName(e.target.value)}
          disabled={true}
          style={{ marginTop: "16px" }}
        />
        <CommonInputField
          label="Last name"
          value={contactInfoLastName}
          onChange={(e) => setContactInfoLastName(e.target.value)}
          disabled={true}
          style={{ marginTop: "12px" }}
        />
        <CommonInputField
          label="Mobile"
          value={contactInfoMobile}
          onChange={(e) => setContactInfoMobile(e.target.value)}
          disabled={true}
          style={{ marginTop: "12px" }}
        />
        <CommonInputField
          label="Email"
          value={contactInfoEmail}
          onChange={(e) => setContactInfoEmail(e.target.value)}
          disabled={true}
          style={{ marginTop: "12px" }}
        />
        <CommonInputField
          label="Linkedin url"
          value={contactInfoLinkedin}
          onChange={(e) => setContactInfoLinkedin(e.target.value)}
          disabled={true}
          style={{ marginTop: "12px" }}
        />
      </Modal>

      {/* resume modal */}
      <Modal
        title="Resume"
        open={resumeViewerModal}
        onCancel={() => {
          setResumeViewerModal(false);
        }}
        footer={false}
        width="50%"
        centered
      >
        <div className="admin_resumemodal_resumeview">
          <Document file={resumeBase64} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </div>

        <div className="admin_resumemodal_paginationdiv">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className="admin_resumemodal_paginationbutton"
          >
            <MdArrowBackIosNew size={12} style={{ marginTop: "2px" }} />
          </button>
          <button className="admin_resumemodal_activepaginationbutton">
            {pageNumber}
          </button>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(pageNumber + 1)}
            className="admin_resumemodal_paginationbutton"
          >
            <MdArrowForwardIos size={12} style={{ marginTop: "2px" }} />
          </button>
        </div>
      </Modal>
    </div>
  );
}

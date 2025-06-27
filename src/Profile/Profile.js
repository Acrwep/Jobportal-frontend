import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Divider, Modal } from "antd";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";
import { BsBuildings } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { pdfjs, Document, Page } from "react-pdf";
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";
import { LuDownload } from "react-icons/lu";
import "./styles.css";
import Header from "../Header/Header";
import { getCandidateById } from "../Common/action";
import moment from "moment";
import PrismaZoom from "react-prismazoom";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export default function Profile() {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [candidateData, setCandidateData] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [profileImageModal, setProfileImageModal] = useState(false);
  const [viewProfile, setViewProfile] = useState("");

  useEffect(() => {
    console.log(location, "locccc");
    getCandidateData();
  }, []);

  const getCandidateData = async () => {
    // const candidateId = location?.state?.candidateId || null;
    const candidateId = params.get("candidateId");
    if (candidateId) {
      try {
        const response = await getCandidateById(candidateId);
        console.log("candidate response", response);
        const candidateDetails = response?.data?.data;
        if (candidateDetails.length >= 1) {
          const updateCandidateDetails = candidateDetails.map((c) => {
            return {
              ...c,
              attempt_result: c.attempt_result.filter(
                (f) => f.attempt_number != 0
              ),
            };
          });
          console.log("updateCandidateDetails", updateCandidateDetails);
          setCandidateData(updateCandidateDetails);
        } else {
          setCandidateData([]);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/profiles");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDownloadResume = (pdfUrl, item) => {
    const link = document.createElement("a");
    link.href = pdfUrl; // Ensure this is a valid PDF URL or Blob URL
    link.download = `${item.firstName}_${item.lastName}_Resume.pdf`; // Set file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="profile_mainContainer">
      <Header />

      <div className="profile_innerContainer">
        {candidateData.map((item, index) => {
          const profileBase64String = `data:image/jpeg;base64,${item.profileImage}`;
          const pdfDataUrl = `data:application/pdf;base64,${item.resume}`;
          return (
            <React.Fragment key={index}>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={7} xl={7} xxl={7}>
                  <div className="profile_profilecard">
                    <div className="profilecard_imageContainer">
                      {item.profileImage ? (
                        <div className="profile_profileimage_container">
                          <img
                            src={profileBase64String}
                            className="admin_candidateprofileimage"
                          />
                          <MdOutlineRemoveRedEye
                            className="profile_profileimage_viewicon"
                            color="#fff"
                            size={16}
                            onClick={() => {
                              setProfileImageModal(true);
                              setViewProfile(profileBase64String);
                            }}
                          />
                        </div>
                      ) : (
                        <FaRegUser size={55} color="#212121" />
                      )}
                      <div>
                        <p className="profilecard_candidatename">
                          {item.firstName + " " + item.lastName}
                        </p>
                        <p className="profilecard_candidategender">
                          {item.gender}
                        </p>
                        <p className="profilecard_candidatedesignation">
                          {item.designation}
                        </p>
                        <p className="profilecard_candidatedesignation">
                          {item.companyName}
                        </p>
                        <p className="profilecard_candidategender">
                          {(item.companyStartdate === null ||
                            item.companyStartdate === "0000-00-00 00:00:00") &&
                          item.companyEnddate === null
                            ? "Fresher"
                            : item.companyStartdate != null &&
                              item.companyEnddate === null
                            ? moment(item.companyStartdate).format("MMM YYYY") +
                              " " +
                              "-" +
                              " " +
                              "Present"
                            : moment(item.companyStartdate).format("MMM YYYY") +
                              " - " +
                              moment(item.companyEnddate).format("MMM YYYY")}
                        </p>
                        <p className="profilecard_candidategender">
                          {item.city}
                        </p>
                      </div>
                    </div>

                    <div className="profilecard_ExperienceContainer">
                      <div>
                        <p className="profilecard_Experienceheading">
                          Total Experience
                        </p>
                        <p className="profilecard_Experienceyear">
                          {item.yearsOfExperience === 0 &&
                          item.monthOfExperience === 0
                            ? "Fresher"
                            : item.yearsOfExperience +
                              " " +
                              item.monthOfExperience}
                        </p>
                      </div>
                      <Divider
                        type="vertical"
                        className="profilecard_ExperienceDivider"
                      />

                      <div>
                        <p className="profilecard_Experienceheading">
                          CTC Annually
                        </p>
                        <p className="profilecard_Experienceyear">
                          {item.currentCTC ? item.currentCTC : "-"}
                        </p>
                      </div>

                      <Divider
                        type="vertical"
                        className="profilecard_ExperienceDivider"
                      />

                      <div>
                        <p className="profilecard_Experienceheading">
                          Notice period
                        </p>
                        <p className="profilecard_Experienceyear">
                          {item.noticePeriod}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="profile_contactinfoCard">
                    <p className="contactinfocard_heading">Contact info</p>
                    <div className="contactinfocard_numberdiv">
                      <div className="contactinfocard_calliconContainer">
                        <IoCallOutline color="#333" />
                      </div>
                      <p className="contactinfocard_number">
                        +91 {item.mobile}
                      </p>
                    </div>
                    <Divider className="contactinfocard_divider" />
                    <div className="contactinfocard_numberdiv">
                      <MdOutlineMailOutline color="#333" />
                      <p className="contactinfocard_number">{item.email}</p>
                    </div>
                  </div>

                  <div className="profile_contactinfoCard">
                    <p className="contactinfocard_heading">Job preferences</p>
                    <div className="jobprefcard_contentdiv">
                      <p className="jobprefcard_locationheading">
                        Pref. Designation
                      </p>
                      <p className="jobprefcard_locationtext">
                        {item.preferredJobTitles.length >= 1
                          ? item.preferredJobTitles
                              .map(
                                (location) =>
                                  location.charAt(0).toUpperCase() +
                                  location.slice(1)
                              )
                              .join(", ")
                          : "-"}
                      </p>
                    </div>
                    <div className="jobprefcard_contentdiv">
                      <p className="jobprefcard_locationheading">
                        Pref. Location
                      </p>
                      <p className="jobprefcard_locationtext">
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
                    </div>
                  </div>

                  <div className="profile_contactinfoCard">
                    <p className="contactinfocard_heading">Course Details</p>
                    <div className="jobprefcard_contentdiv">
                      <p className="jobprefcard_locationheading">Course Name</p>
                      <p className="jobprefcard_locationtext">
                        {item.course_name}
                      </p>
                    </div>
                    <div className="jobprefcard_contentdiv">
                      <p className="jobprefcard_locationheading">
                        Course location
                      </p>
                      <p className="jobprefcard_locationtext">
                        {item.courseLocation}
                      </p>
                    </div>

                    <div className="jobprefcard_contentdiv">
                      <p className="jobprefcard_locationheading">
                        Course Status
                      </p>
                      <p className="jobprefcard_locationtext">
                        {item.courseStatus}
                      </p>
                    </div>

                    <div className="jobprefcard_contentdiv">
                      <p className="jobprefcard_locationheading">
                        Mockup Interview Percentage
                      </p>
                      <p className="jobprefcard_locationtext">
                        {item.mockupPercentage}
                      </p>
                    </div>

                    <div className="jobprefcard_contentdiv">
                      <p className="jobprefcard_locationheading">
                        Course Joing Date
                      </p>
                      <p className="jobprefcard_locationtext">
                        {moment(item.courseJoiningDate).format("DD/MM/YYYY")}
                      </p>
                    </div>

                    <div className="jobprefcard_contentdiv">
                      <p className="jobprefcard_locationheading">
                        Blacklist Status
                      </p>
                      <p className="jobprefcard_locationtext">
                        {item.eligibleCandidates === 0
                          ? "Not Blacklisted"
                          : "Blacklisted"}
                      </p>
                    </div>
                  </div>

                  <div className="profile_contactinfoCard">
                    <p className="contactinfocard_heading">Languages</p>
                    {item.languages.map((lan) => {
                      return (
                        <Row>
                          <Col span={8}>
                            <p className="languagecard_text">{lan.name}</p>
                          </Col>
                          <Col span={16} style={{ display: "flex" }}>
                            {lan.levelStatus.map((item, index) => (
                              <>
                                {lan.levelStatus.length - 1 === index ? (
                                  <div style={{ display: "flex" }}>
                                    <p className="languagecard_statustext">
                                      {item}
                                    </p>
                                  </div>
                                ) : (
                                  <div style={{ display: "flex" }}>
                                    <p className="languagecard_statustext">
                                      {item + ","}
                                    </p>
                                  </div>
                                )}
                              </>
                            ))}
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                </Col>

                <Col xs={24} sm={24} md={24} lg={17} xl={17} xxl={17}>
                  <div className="profile_skillscard">
                    <p className="skillscard_headline">Headline</p>
                    <p className="skillscard_headlinecontent">
                      {item.profileSummary}
                    </p>

                    <p className="skillscard_skillsheading">Skills</p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0px",
                        marginTop: "16px",
                      }}
                    >
                      {item.skills.map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div className="admin_candidateskills_container">
                              <p>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                              </p>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  <div className="profile_skillscard">
                    <p className="skillscard_headline">Work Experience</p>

                    <div className="experiencecard_companydiv">
                      <BsBuildings size={20} color="#333" />
                      <div>
                        <p className="experiencecard_companyname">
                          {item.designation}
                        </p>
                        <p className="experiencecard_companyexp">
                          {item.companyName ? item.companyName + "|" : ""}{" "}
                          {(item.companyStartdate === null ||
                            item.companyStartdate === "0000-00-00 00:00:00") &&
                          item.companyEnddate === null
                            ? "Fresher"
                            : item.companyStartdate != null &&
                              item.companyEnddate === null
                            ? moment(item.companyStartdate).format("MMM YYYY") +
                              " " +
                              "-" +
                              " " +
                              "Present"
                            : moment(item.companyStartdate).format("MMM YYYY") +
                              " - " +
                              moment(item.companyEnddate).format(
                                "MMM YYYY"
                              )}{" "}
                          |{" "}
                          {item.yearsOfExperience === 0 &&
                          item.monthOfExperience === 0
                            ? "Fresher"
                            : item.yearsOfExperience +
                              " " +
                              item.monthOfExperience}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="profile_skillscard">
                    <p className="skillscard_headline">Education</p>

                    <div className="experiencecard_companydiv">
                      <IoBookOutline size={20} color="#333" />
                      <div>
                        <p className="experiencecard_companyname">
                          {item.qualification}
                        </p>
                        <p className="experiencecard_companyexp">
                          {item.graduateYear} - {item.university}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="profile_skillscard">
                    <p className="skillscard_headline">Assessment Results</p>

                    {item.attempt_result && item.attempt_result.length >= 1 ? (
                      <div className="profile_assessmentContainer">
                        <Row className="profile_assessment_heading_rowContainer">
                          <Col span={6}>
                            <p className="profile_assessment_heading">Date</p>
                          </Col>
                          <Col span={6}>
                            <p className="profile_assessment_heading">
                              Question Type
                            </p>
                          </Col>
                          <Col span={6}>
                            <p className="profile_assessment_heading">
                              Perentage
                            </p>
                          </Col>
                          <Col span={6}>
                            <p
                              className="profile_assessment_heading"
                              style={{ borderRight: "none" }}
                            >
                              Remark
                            </p>
                          </Col>
                        </Row>

                        {item.attempt_result.map((result, index) => {
                          const lastIndex = item.attempt_result.length - 1;
                          return (
                            <React.Fragment key={index}>
                              <Row>
                                <Col
                                  span={6}
                                  className="profile_assessment_datasContainer"
                                  style={{
                                    borderBottom:
                                      index === lastIndex
                                        ? ""
                                        : "1px solid rgba(128, 128, 128, 0.411)",
                                  }}
                                >
                                  <p className="profile_assessment_datas">
                                    {moment(result.attempt_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </p>
                                </Col>
                                <Col
                                  span={6}
                                  className="profile_assessment_datasContainer"
                                  style={{
                                    borderBottom:
                                      index === lastIndex
                                        ? ""
                                        : "1px solid rgba(128, 128, 128, 0.411)",
                                  }}
                                >
                                  <p className="profile_assessment_datas">
                                    {result.question_type}
                                  </p>
                                </Col>
                                <Col
                                  span={6}
                                  className="profile_assessment_datasContainer"
                                  style={{
                                    borderBottom:
                                      index === lastIndex
                                        ? ""
                                        : "1px solid rgba(128, 128, 128, 0.411)",
                                  }}
                                >
                                  <p className="profile_assessment_datas">
                                    {result.attempt_percentage + "%"}
                                  </p>
                                </Col>
                                <Col
                                  span={6}
                                  className="profile_assessment_datasContainer"
                                  style={{
                                    borderRight: "none",
                                    borderBottom:
                                      index === lastIndex
                                        ? ""
                                        : "1px solid rgba(128, 128, 128, 0.411)",
                                  }}
                                >
                                  <p
                                    className="profile_assessment_datas"
                                    style={{
                                      color:
                                        result.grade === "Average" ||
                                        result.grade === "Above Average"
                                          ? "#fabb00"
                                          : result.grade === "Good" ||
                                            result.grade === "Very good" ||
                                            result.grade === "Excellent"
                                          ? "#14b8a6"
                                          : "#f44336d1",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {result.grade}
                                  </p>
                                </Col>
                              </Row>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="profile_assessment_nodatamessage">
                        No data found
                      </p>
                    )}
                  </div>

                  <div className="profile_skillscard">
                    <div className="profile_resumenameContainer">
                      <p className="profile_resumecardname">
                        {item.firstName +
                          " " +
                          item.lastName +
                          "'s" +
                          " " +
                          "Resume"}
                      </p>

                      <LuDownload
                        size={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDownloadResume(pdfDataUrl, item)}
                      />
                    </div>
                    <div className="admin_resumemodal_resumeview">
                      <PrismaZoom>
                        <Document
                          file={pdfDataUrl}
                          onLoadSuccess={onDocumentLoadSuccess}
                        >
                          <Page pageNumber={pageNumber} />
                        </Document>
                      </PrismaZoom>
                    </div>

                    <div className="admin_resumemodal_paginationdiv">
                      <button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(pageNumber - 1)}
                        className={
                          pageNumber <= 1
                            ? "admin_resumemodal_disablepaginationbutton"
                            : "admin_resumemodal_paginationbutton"
                        }
                      >
                        <MdArrowBackIosNew
                          size={12}
                          style={{ marginTop: "2px" }}
                        />
                      </button>
                      <button className="admin_resumemodal_activepaginationbutton">
                        {pageNumber}
                      </button>
                      <button
                        disabled={pageNumber >= numPages}
                        onClick={() => setPageNumber(pageNumber + 1)}
                        className={
                          pageNumber >= numPages
                            ? "admin_resumemodal_disablepaginationbutton"
                            : "admin_resumemodal_paginationbutton"
                        }
                      >
                        <MdArrowForwardIos
                          size={12}
                          style={{ marginTop: "2px" }}
                        />
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
            </React.Fragment>
          );
        })}
      </div>

      <Modal
        open={profileImageModal}
        className="admin_candidateview_profilemodal"
        onCancel={() => {
          {
            setProfileImageModal(false);
            setViewProfile("");
          }
        }}
        closeIcon={false}
        footer={false}
        width={300}
      >
        <div>
          <img src={viewProfile} className="admin_candidateviewprofileimage" />
        </div>
      </Modal>
    </div>
  );
}

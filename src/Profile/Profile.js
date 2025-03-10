import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Divider } from "antd";
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

export default function Profile() {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const location = useLocation();
  const [candidateData, setCandidateData] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    console.log(location, "locccc");
    getCandidateData();
  }, []);

  const getCandidateData = async () => {
    try {
      const response = await getCandidateById(location?.state?.candidateId);
      console.log("candidate response", response);
      setCandidateData(response?.data?.data);
    } catch (error) {
      console.log(error);
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
                        <img
                          src={profileBase64String}
                          className="profile_candidateprofileimage"
                        />
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
                          {item.companyStartdate === null &&
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
                              "Years" +
                              " " +
                              item.monthOfExperience +
                              " " +
                              "Months"}
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
                          {item.currentCTC}
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
                    <p className="contactinfocard_heading">Languages</p>
                    <p className="languagecard_text">Tamil, English</p>
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
                                {item.name.charAt(0).toUpperCase() +
                                  item.name.slice(1)}
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
                          {item.companyName} |{" "}
                          {item.companyStartdate === null &&
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
                              "Years" +
                              " " +
                              item.monthOfExperience +
                              " " +
                              "Months"}
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
                          Bachelor Of Technology (B.Tech/B.E), Computers
                        </p>
                        <p className="experiencecard_companyexp">
                          2023 - Canara Engineering College, Mangalore
                        </p>
                      </div>
                    </div>
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
                      <Document
                        file={pdfDataUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        <Page pageNumber={pageNumber} />
                      </Document>
                    </div>

                    <div className="admin_resumemodal_paginationdiv">
                      <button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(pageNumber - 1)}
                        className="admin_resumemodal_paginationbutton"
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
                        className="admin_resumemodal_paginationbutton"
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
    </div>
  );
}

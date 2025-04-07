import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./styles.css";
import { Row, Col, Modal } from "antd";
import CommonInputField from "../Common/CommonInputField";
import { useSelector } from "react-redux";
import { FaRegUser } from "react-icons/fa";
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
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import moment from "moment";
import { addToFavorite, getCandidates } from "../Common/action";
import { CommonToaster } from "../Common/CommonToaster";

export default function FolderProfiles() {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  const navigate = useNavigate();
  const candidates = useSelector((state) => state.folderprofiles);
  const folderFilters = useSelector((state) => state.folderfilters);

  const [candidatesList, setCandidatesList] = useState([]);
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [resumeBase64, setResumeBase64] = useState("");
  const [resumeViewerModal, setResumeViewerModal] = useState(false);
  const [conatactInfoModal, setConatactInfoModal] = useState(false);

  const [contactInfoFirstName, setContactInfoFirstName] = useState("");
  const [contactInfoLastName, setContactInfoLastName] = useState("");
  const [contactInfoMobile, setContactInfoMobile] = useState("");
  const [contactInfoEmail, setContactInfoEmail] = useState("");
  const [contactInfoLinkedin, setContactInfoLinkedin] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setCandidatesList(candidates);
  }, []);

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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleAddfavorite = async (Id, favoriteStatus) => {
    const payload = {
      id: Id,
      favoriteStatus: favoriteStatus === 0 ? true : false,
    };
    try {
      const response = await addToFavorite(payload);
      CommonToaster(
        favoriteStatus === 0 ? "Added to favorites" : "Removed from favorites"
      );
      getCandidatesData();
    } catch (error) {
      console.log("add to favorite error");
    }
  };

  const getCandidatesData = async () => {
    const payload = {
      yearsOfExperience: folderFilters[0].yearsOfExperience,
      monthOfExperience: folderFilters[0].monthOfExperience,
      noticePeriod: folderFilters[0].noticePeriod,
      currentCTC: folderFilters[0].currentCTC,
      mobile: folderFilters[0].mobile,
      city: folderFilters[0].city,
      qualification: folderFilters[0].qualification,
      graduateYear: folderFilters[0].graduateYear,
      gender: folderFilters[0].gender,
      companyName: folderFilters[0].companyName,
      designation: folderFilters[0].designation,
      skills: folderFilters[0].skills,
    };
    try {
      const response = await getCandidates(payload);
      console.log("candidates response", response?.data?.data?.data);
      setCandidatesList(response?.data?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="folder_mainContainer">
      <Header />

      <div className="folders_innercontainer">
        <p className="folders_heading">
          Test{" "}
          <span style={{ fontSize: "13px", color: "gray" }}>
            ({candidatesList.length} profiles found)
          </span>
        </p>

        {candidatesList.length >= 1 ? (
          <>
            {candidatesList.map((item, index) => {
              const profileBase64String = `data:image/jpeg;base64,${item.profileImage}`;
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
                            <p className="admin_candidate_lefttext">Skills:</p>
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
                          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            <p className="admin_candidate_lefttext">
                              Created At:{" "}
                              {moment(item.createdAt).format("DD/MM/YYYY")}
                            </p>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              {/* <button
                                className="admin_favoritesbutton"
                                onClick={() =>
                                  handleAddfavorite(item.id, item.favorites)
                                }
                              >
                                {item.favorites === 0 ? (
                                  <IoBookmarkOutline
                                    size={16}
                                    style={{ marginRight: "6px" }}
                                  />
                                ) : (
                                  <IoBookmark
                                    color="#FFC107"
                                    size={16}
                                    style={{ marginRight: "6px" }}
                                  />
                                )}
                                Favorite
                              </button> */}
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
                          <Row gutter={16} className="admin_profilesummaryrow">
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
                              <p className="admin_ctctext">{item.currentCTC}</p>
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
      </div>

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

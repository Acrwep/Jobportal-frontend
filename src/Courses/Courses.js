import React, { useState, useEffect } from "react";
import "./styles.css";
import { Button, Col, Modal, Row, Tabs, Spin } from "antd";
import Trainer from "../images/trainer.png";
import CourseVideos from "./CourseVideos";
import PortalInputField from "../Common/PortalInputField";
import { createTopic, getCourses } from "../Common/action";
import { addressValidator, selectValidator } from "../Common/Validation";
import { CommonToaster } from "../Common/CommonToaster";
import { LoadingOutlined } from "@ant-design/icons";
import { MdAssignmentAdd } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import PortalSelectField from "../Common/PortalSelectField";
import { IoArrowBack } from "react-icons/io5";

export default function Courses() {
  const trainersList = [
    { id: 1, name: "Alexa", exp: "6+", videos: "20" },
    { id: 2, name: "Alexa", exp: "6+", videos: "20" },
    { id: 3, name: "Alexa", exp: "6+", videos: "20" },
  ];
  const [courseTopicIndex, setCourseTopicIndex] = useState(0);
  const courseTopics = [
    { id: 1, name: "HTML" },
    { id: 2, name: "CSS" },
    { id: 3, name: "Javascript" },
    { id: 4, name: "React Js" },
    { id: 5, name: "Angular Js" },
    { id: 6, name: "Java" },
    { id: 7, name: "Spring Boot" },
  ];
  const tabItems = [
    {
      key: "1",
      label: "Videos",
      children: <CourseVideos />,
    },
    {
      key: "2",
      label: "Documents",
      children: <p>Document content here</p>,
    },
  ];
  const [courseId, setCourseId] = useState(null);
  const [addTopicModal, setAddTopicModal] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [topicNameError, setTopicNameError] = useState("");
  const [courseName, setCourseName] = useState("");
  const [topicSubmitLoader, setTopicSubmitLoader] = useState(false);
  const [formValidationTrigger, setFormValidationTrigger] = useState(false);

  const [mapModal, setMapModal] = useState(false);
  const [mapTrainers, setMapTrainers] = useState([]);
  const [mapTrainersError, setMapTrainersError] = useState("");
  const [showVideos, setShowVideos] = useState(false);

  useEffect(() => {
    const selectedCourseName = localStorage.getItem("selectedCourseName");
    const selectedCourseId = localStorage.getItem("selectedCourseId");
    setCourseName(selectedCourseName);
    setCourseId(selectedCourseId);
  }, []);

  const handleTopicCreate = async () => {
    setFormValidationTrigger(true);

    const topicNameValidate = addressValidator(topicName);

    setTopicNameError(topicNameValidate);
    if (topicNameValidate) return;

    const payload = {
      topic: topicName,
      course_id: courseId,
    };

    try {
      await createTopic(payload);
      CommonToaster("Topic created");

      setTimeout(() => {
        formReset();
      }, 300);
    } catch (error) {
      setTopicSubmitLoader(false);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  const handleMapTrainerSubmit = async () => {
    setFormValidationTrigger(true);
    const mapTrainersValidate = selectValidator(mapTrainers);

    setMapTrainersError(mapTrainersValidate);

    if (mapTrainersValidate) return;

    const payload = {
      trainers: mapTrainers,
    };
    console.log("map trainers payload", payload);
  };

  const formReset = () => {
    setAddTopicModal(false);
    setMapModal(false);
    setFormValidationTrigger(false);
    setTopicSubmitLoader(false);
    setTopicName("");
    setTopicNameError("");
    setMapTrainers([]);
    setMapTrainersError("");
  };

  return (
    <div>
      <div className="portal_headinContainer">
        <div className="courses_backbutton_mainContainer">
          {showVideos === true && (
            <div
              className="courses_backbutton_Container"
              onClick={() => setShowVideos(false)}
            >
              <IoArrowBack color="#0056b3" size={20} />
            </div>
          )}
          <p className="portal_mainheadings">{courseName}</p>
        </div>
        <div className="courses_maptrainerbutton_container">
          <button
            className="courses_addtopic_button"
            onClick={() => setMapModal(true)}
          >
            <MdAssignmentAdd
              size={16}
              color="#fff"
              style={{ marginRight: "6px" }}
            />{" "}
            Map Trainers
          </button>
          <button
            className="courses_addtopic_button"
            onClick={() => setAddTopicModal(true)}
          >
            <IoMdAdd size={18} color="#fff" style={{ marginRight: "6px" }} />{" "}
            Add Topics
          </button>
        </div>
      </div>

      {showVideos === false ? (
        <>
          <p className="courses_trainerheading">Trainers</p>
          <Row gutter={30}>
            {trainersList.map((item, index) => {
              return (
                <Col xs={24} sm={24} md={24} lg={8}>
                  <div
                    className="courses_trainercard"
                    style={{
                      backgroundColor:
                        index === 0
                          ? "#6068cd"
                          : index === 1
                          ? "#ac5ac7"
                          : "#5297a7",
                    }}
                    onClick={() => setShowVideos(true)}
                  >
                    <div className="courses_trainercard_imagesContainer">
                      <img
                        src={Trainer}
                        className="courses_trainercard_images"
                      />
                    </div>
                    <div className="courses_trainercard_contentContainer">
                      <p className="courses_trainercard_name">{item.name}</p>
                      <p className="courses_trainercard_exp">
                        Experience: {item.exp}
                      </p>
                      <p className="courses_trainercard_exp">
                        Videos: {item.videos}
                      </p>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </>
      ) : (
        <div className="courses_topicsmainContainer">
          <Row style={{ marginBottom: "20px" }}>
            <Col span={6} className="courses_topics_sidebarContainer">
              {courseTopics.map((item, index) => {
                return (
                  <div
                    className={
                      index === courseTopicIndex
                        ? "courses_topactivetab_div"
                        : "courses_topinactivetab_div"
                    }
                    onClick={() => setCourseTopicIndex(index)}
                  >
                    <p>{item.name}</p>
                  </div>
                );
              })}
            </Col>
            <Col span={18}>
              <div className="courses_videomainContainer">
                <Tabs defaultActiveKey="1" items={tabItems} />
              </div>
            </Col>
          </Row>
        </div>
      )}
      <Modal
        open={addTopicModal}
        onCancel={formReset}
        title="Add Topics"
        footer={[
          <div className="courses_addtopicmodal_footerContainer">
            {topicSubmitLoader ? (
              <Button className="courses_addtopicmodal_disablesubmitbutton">
                <>
                  <Spin
                    size="small"
                    className="courses_addtopicbutton_spin"
                    indicator={<LoadingOutlined spin color="#fff" />}
                  />{" "}
                </>
              </Button>
            ) : (
              <Button
                className="courses_addtopicmodal_submitbutton"
                onClick={handleTopicCreate}
              >
                Submit
              </Button>
            )}
          </div>,
        ]}
      >
        <div style={{ marginTop: "20px" }}>
          <PortalInputField
            label="Name"
            mandatory={true}
            value={topicName}
            onChange={(e) => {
              setTopicName(e.target.value);
              if (formValidationTrigger) {
                setTopicNameError(addressValidator(e.target.value));
              }
            }}
            error={topicNameError}
          />
        </div>
        <div style={{ marginTop: "22px" }}>
          <PortalInputField
            label="Course Name"
            mandatory={true}
            value={courseName}
            disabled={true}
          />
        </div>
      </Modal>

      <Modal
        open={mapModal}
        onCancel={formReset}
        title="Map Trainers"
        footer={[
          <div className="courses_addtopicmodal_footerContainer">
            {topicSubmitLoader ? (
              <Button className="courses_addtopicmodal_disablesubmitbutton">
                <>
                  <Spin
                    size="small"
                    className="courses_addtopicbutton_spin"
                    indicator={<LoadingOutlined spin color="#fff" />}
                  />{" "}
                </>
              </Button>
            ) : (
              <Button
                className="courses_addtopicmodal_submitbutton"
                onClick={handleMapTrainerSubmit}
              >
                Submit
              </Button>
            )}
          </div>,
        ]}
      >
        <div style={{ marginTop: "20px" }}>
          <PortalSelectField
            label="Trainers"
            mandatory={true}
            mode="tags"
            options={[]}
            value={mapTrainers}
            onChange={(value) => {
              setMapTrainers(value);
              if (formValidationTrigger) {
                setMapTrainersError(selectValidator(value));
              }
            }}
            error={mapTrainersError}
          />
        </div>
      </Modal>
    </div>
  );
}

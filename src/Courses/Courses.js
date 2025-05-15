import React, { useState, useEffect } from "react";
import "./styles.css";
import { Button, Col, Modal, Row, Tabs, Spin } from "antd";
import { useLocation } from "react-router-dom";
import Trainer from "../images/trainer.png";
import CourseVideos from "./CourseVideos";
import PortalInputField from "../Common/PortalInputField";
import {
  createTopic,
  getAllUsers,
  getCourses,
  getParticularCourseTrainers,
  getTopics,
  trainerMapping,
  updateTopic,
} from "../Common/action";
import { addressValidator, selectValidator } from "../Common/Validation";
import { CommonToaster } from "../Common/CommonToaster";
import { LoadingOutlined } from "@ant-design/icons";
import { MdAssignmentAdd } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import PortalSelectField from "../Common/PortalSelectField";
import { IoArrowBack } from "react-icons/io5";
import NodataImage from "../images/svgviewer-png-output.png";
import { AiTwotoneEdit } from "react-icons/ai";

export default function Courses() {
  const location = useLocation();
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
  const [topicEdit, setTopicEdit] = useState(false);
  const [topicId, setTopicId] = useState(null);
  const [topicName, setTopicName] = useState("");
  const [topicNameError, setTopicNameError] = useState("");
  const [courseName, setCourseName] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);
  const [formValidationTrigger, setFormValidationTrigger] = useState(false);

  const [mapModal, setMapModal] = useState(false);
  const [mapTrainers, setMapTrainers] = useState([]);
  const [mapTrainersError, setMapTrainersError] = useState("");
  const [showVideos, setShowVideos] = useState(false);
  const [trainersList, setTrainersList] = useState([]);
  const [courseTrainersList, setCourseTrainersList] = useState([]);
  const [courseTopicsData, setCourseTopicsData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      getTrainersData();
    }, 500);
  }, []);

  useEffect(() => {
    const selectedCourseName = localStorage.getItem("selectedCourseName");
    const selectedCourseId = localStorage.getItem("selectedCourseId");
    setCourseName(selectedCourseName);
    setCourseId(selectedCourseId);
    getParticularCourseTrainersData();
  }, [location.pathname]);

  const getTrainersData = async () => {
    try {
      const response = await getAllUsers();
      const allUsers = response?.data?.data || [];
      if (allUsers.length >= 1) {
        const allTrainers = allUsers.filter((f) => f.role === "Trainer");
        setTrainersList(allTrainers);
      } else {
        setTrainersList([]);
      }
    } catch (error) {
      setTrainersList([]);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  const getParticularCourseTrainersData = async () => {
    const selectedCourseId = localStorage.getItem("selectedCourseId");
    try {
      const response = await getParticularCourseTrainers(
        parseInt(selectedCourseId)
      );
      console.log("course trainers", response);
      const trainers = response?.data?.trainers;
      if (trainers.length >= 1) {
        setCourseTrainersList(trainers);
      } else {
        setCourseTrainersList([]);
      }
    } catch (error) {
      setCourseTrainersList([]);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      getTopicsData(selectedCourseId);
    }
  };

  const getTopicsData = async (courseid) => {
    try {
      const response = await getTopics(courseid);
      const coursetopics = response?.data?.topics || [];
      console.log("coursetopics", coursetopics);
      if (coursetopics.length >= 1) {
        const reverseData = coursetopics.reverse();
        console.log("revvv", reverseData);
        setCourseTopicsData(reverseData);
      } else {
        setCourseTopicsData([]);
      }
    } catch (error) {
      setCourseTopicsData([]);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  //onclick functions
  const handleMapTrainerSubmit = async () => {
    console.log(mapTrainers);
    setFormValidationTrigger(true);
    const mapTrainersValidate = selectValidator(mapTrainers);

    setMapTrainersError(mapTrainersValidate);

    if (mapTrainersValidate) return;

    const trainerIds = mapTrainers.map((item) => {
      return { trainer_id: item };
    });

    const payload = {
      course_id: courseId,
      trainers: trainerIds,
    };
    console.log("map trainers payload", payload);

    try {
      await trainerMapping(payload);
      CommonToaster("Trainer mapped");
      formReset();
      getParticularCourseTrainersData();
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  const handleTopicEdit = (item) => {
    setAddTopicModal(true);
    setTopicEdit(true);
    setTopicName(item.name);
    setTopicId(item.id);
  };

  const handleTopicCreate = async () => {
    setFormValidationTrigger(true);

    const topicNameValidate = addressValidator(topicName);

    setTopicNameError(topicNameValidate);
    if (topicNameValidate) return;
    setButtonLoader(true);

    const payload = {
      ...(topicEdit && { topic_id: topicId }),
      topic: topicName,
      ...(topicEdit === false && { course_id: courseId }),
    };

    if (topicEdit) {
      try {
        await updateTopic(payload);
        CommonToaster("Topic updated");
        getTopicsData(courseId);
        setTimeout(() => {
          formReset();
        }, 300);
      } catch (error) {
        setButtonLoader(false);
        CommonToaster(
          error?.response?.data?.message ||
            "Something went wrong. Try again later"
        );
      }
    } else {
      try {
        await createTopic(payload);
        CommonToaster("Topic created");
        getTopicsData(courseId);
        setTimeout(() => {
          formReset();
        }, 300);
      } catch (error) {
        setButtonLoader(false);
        CommonToaster(
          error?.response?.data?.message ||
            "Something went wrong. Try again later"
        );
      }
    }
  };

  const formReset = () => {
    setAddTopicModal(false);
    setMapModal(false);
    setTopicEdit(false);
    setFormValidationTrigger(false);
    setButtonLoader(false);
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
          {showVideos === false ? (
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
          ) : (
            <button
              className="courses_addtopic_button"
              onClick={() => setAddTopicModal(true)}
            >
              <IoMdAdd size={18} color="#fff" style={{ marginRight: "6px" }} />{" "}
              Add Topics
            </button>
          )}
        </div>
      </div>

      {showVideos === false ? (
        <>
          <p className="courses_trainerheading">
            {courseTrainersList.length >= 1 ? "Trainers" : ""}
          </p>
          <Row gutter={30}>
            {courseTrainersList.length >= 1 ? (
              <>
                {courseTrainersList.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
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
                            <p className="courses_trainercard_name">
                              {item.trainer_name}
                            </p>
                            <p className="courses_trainercard_exp">
                              Experience: {item.exp}
                            </p>
                            <p className="courses_trainercard_exp">
                              Videos: {item.videos}
                            </p>
                          </div>
                        </div>
                      </Col>
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              <div className="courses_nodataContainer">
                <img src={NodataImage} className="courses_nodataimage" />
                <p>No trainers are available for this course</p>
              </div>
            )}
          </Row>
        </>
      ) : (
        <div className="courses_topicsmainContainer">
          <Row style={{ marginBottom: "20px" }}>
            <Col span={6} className="courses_topics_sidebarContainer">
              {courseTopicsData.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <div
                      className={
                        index === courseTopicIndex
                          ? "courses_topactivetab_div"
                          : "courses_topinactivetab_div"
                      }
                      onClick={() => setCourseTopicIndex(index)}
                    >
                      <p>{item.name}</p>

                      <div className="courses_topics_editanddeleteiconContainer">
                        <AiTwotoneEdit
                          size={17}
                          className="courses_topics_editanddeleteicon"
                          onClick={() => handleTopicEdit(item)}
                        />
                      </div>
                    </div>
                  </React.Fragment>
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
            {buttonLoader ? (
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
            {buttonLoader ? (
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
            options={trainersList}
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

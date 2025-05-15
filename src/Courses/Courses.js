import React, { useState, useEffect } from "react";
import "./styles.css";
import { Button, Col, Modal, Row, Tabs, Spin, Drawer, Upload } from "antd";
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
  getVideoAndDocuments,
  trainerMapping,
  updateTopic,
  videoAndDocumentUpload,
} from "../Common/action";
import {
  addressValidator,
  selectValidator,
  youtubeLinkValidator,
} from "../Common/Validation";
import { CommonToaster } from "../Common/CommonToaster";
import { LoadingOutlined } from "@ant-design/icons";
import { MdAssignmentAdd } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import PortalSelectField from "../Common/PortalSelectField";
import { IoArrowBack } from "react-icons/io5";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiVideoAddLine } from "react-icons/ri";
import { IoCloudUploadOutline } from "react-icons/io5";
import Loader from "../Common/Loader";
import { useDispatch } from "react-redux";
import { storeCourseVideos } from "../Redux/slice";
import CommonNodataFound from "../Common/CommonNodataFound";
const { Dragger } = Upload;

export default function Courses() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [courseTopicIndex, setCourseTopicIndex] = useState(0);
  const [courseVideoLoader, setCourseVideoLoader] = useState(true);
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
      children: <CourseVideos loading={courseVideoLoader} />,
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
  const [activeTopicTabId, setActiveTopicTabId] = useState(null);
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
  const [trainerId, setTrainerId] = useState(null);
  const [courseTrainersList, setCourseTrainersList] = useState([]);
  const [courseTopicsData, setCourseTopicsData] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoTitleError, setVideoTitleError] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [youtubeLinkError, setYoutubeLinkError] = useState("");
  const [courseVideo, setCourseVideo] = useState(null);
  const [courseVideoArray, setCourseVideoArray] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setShowVideos(false);
    setCourseTopicIndex(0);
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
    setLoading(true);
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
      if (coursetopics.length >= 1) {
        const reverseData = coursetopics.reverse();
        console.log("course topics", reverseData);
        setActiveTopicTabId(reverseData[0].id);
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
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  const getVideosAndDocumentsData = async (topicid) => {
    setCourseVideoLoader(true);
    const payload = {
      course_id: courseId,
      topic_id: topicid,
    };
    try {
      const response = await getVideoAndDocuments(payload);
      console.log("videos response", response);
      const videos = response?.data?.videos || [];
      if (videos.length >= 1) {
        dispatch(storeCourseVideos(videos));
      } else {
        dispatch(storeCourseVideos([]));
      }
    } catch (error) {
      dispatch(storeCourseVideos([]));
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
        setCourseVideoLoader(false);
      }, 300);
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
    setTopicName("");
    setTopicNameError("");
    setMapTrainers([]);
    setMapTrainersError("");
    setIsDrawerOpen(false);
    setVideoTitle("");
    setVideoTitleError("");
    setYoutubeLink("");
    setYoutubeLinkError("");
    setCourseVideo(null);
    setButtonLoader(false);
  };

  const handleCourseVideo = ({ file }) => {
    console.log("fileeeeee", file);
    const ValidType = file.type === "video/mp4";

    if (file.status === "uploading" || file.status === "removed") {
      setCourseVideo(null);
      setCourseVideoArray([]);
      return;
    }

    if (ValidType) {
      setCourseVideo(file);
      setCourseVideoArray([file]);
      CommonToaster("Video uploaded");
    } else {
      CommonToaster("Only .mp4 files are accepted");
    }
  };

  const handleTopicTab = (index, Id) => {
    setCourseTopicIndex(index);
    setActiveTopicTabId(Id);
    getVideosAndDocumentsData(Id);
  };

  const handleVideoSubmit = async () => {
    const videoTitleValidate = addressValidator(videoTitle);
    let isFormError = false;
    if (youtubeLink && courseVideo) {
      isFormError = true;
      CommonToaster("Attach only a youtube link or video");
    }
    if (youtubeLink === "" && courseVideo === null) {
      isFormError = true;
      CommonToaster("Attach youtube link or video");
    }
    if (youtubeLink != "" && courseVideo === null) {
      const linkValidate = youtubeLinkValidator(youtubeLink);
      setYoutubeLinkError(linkValidate);

      if (linkValidate) {
        isFormError = true;
      } else {
        isFormError = false;
      }
    }

    if (youtubeLink === null && courseVideo != null) {
      isFormError = false;
    }

    setVideoTitleError(videoTitleValidate);
    if (videoTitleValidate || isFormError) {
      const container = document.getElementById(
        "courses_videotitle_fieldContainer"
      );
      container.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setButtonLoader(true);
    const formData = new FormData();

    formData.append("course_id", courseId);
    formData.append("topic_id", activeTopicTabId);
    formData.append("trainer_id", trainerId);
    formData.append("title", videoTitle);
    if (youtubeLink) {
      formData.append("content_type", "youtube");
      formData.append("content_url", youtubeLink);
    } else {
      formData.append("content_type", "video");
      formData.append("video", courseVideo);
    }
    console.log("successs", formData);
    try {
      const response = await videoAndDocumentUpload(formData);
      console.log(response, "reponse");
      CommonToaster("Video uploaded");
      setCourseVideoLoader(true);
      setTimeout(() => {
        formReset();
        getVideosAndDocumentsData(activeTopicTabId);
      }, 300);
    } catch (error) {
      setButtonLoader(false);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  return (
    <div>
      <div className="portal_headinContainer">
        <div className="courses_backbutton_mainContainer">
          {showVideos === true && (
            <div
              className="courses_backbutton_Container"
              onClick={() => {
                setShowVideos(false);
                setTrainerId(null);
                setCourseTopicIndex(0);
              }}
            >
              <IoArrowBack color="#0056b3" size={20} />
            </div>
          )}
          <p
            className="portal_mainheadings"
            onClick={() => console.log("eeeeee", trainerId, activeTopicTabId)}
          >
            {courseName}
          </p>
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
            <>
              <button
                className="courses_addtopic_button"
                onClick={() => setAddTopicModal(true)}
              >
                <IoMdAdd
                  size={18}
                  color="#fff"
                  style={{ marginRight: "6px" }}
                />{" "}
                Add Topics
              </button>

              <button
                className="courses_addtopic_button"
                onClick={() => setIsDrawerOpen(true)}
              >
                <RiVideoAddLine
                  size={18}
                  color="#fff"
                  style={{ marginRight: "6px" }}
                />{" "}
                Add Video
              </button>
            </>
          )}
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
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
                              onClick={() => {
                                setShowVideos(true);
                                setTrainerId(item.trainer_id);
                                getVideosAndDocumentsData(activeTopicTabId);
                              }}
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
                  <CommonNodataFound title="No trainers are available for this course" />
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
                          onClick={() => handleTopicTab(index, item.id)}
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
        </>
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
      <Drawer
        open={isDrawerOpen}
        onClose={formReset}
        width="36%"
        title="Add Video"
        closable
      >
        <div id="courses_videotitle_fieldContainer">
          <PortalInputField
            label="Title"
            mandatory={true}
            value={videoTitle}
            onChange={(e) => {
              setVideoTitle(e.target.value);
              setVideoTitleError(addressValidator(e.target.value));
            }}
            error={videoTitleError}
          />
        </div>
        <div style={{ marginTop: "22px" }}>
          <PortalInputField
            label="Youtube Video Link"
            value={youtubeLink}
            onChange={(e) => {
              setYoutubeLink(e.target.value);
              setYoutubeLinkError(youtubeLinkValidator(e.target.value));
            }}
            error={youtubeLinkError}
          />
        </div>
        <p className="courses_addvideodrawer_or_text">( Or )</p>
        <Dragger
          multiple={false}
          className="courses_addvideodrawer"
          beforeUpload={(file) => {
            console.log(file);
            return false; // Prevent auto-upload
          }}
          maxCount={1}
          onChange={handleCourseVideo}
          fileList={courseVideoArray}
        >
          <IoCloudUploadOutline
            size={45}
            color="#0056b3"
            style={{ marginBottom: "16px" }}
          />
          <p className="ant-upload-text">
            Click or drag video to this area to upload
          </p>
          <p className="ant-upload-hint">
            Strictly prohibited from uploading company data or other banned
            files.
          </p>
        </Dragger>
        <div className="courses_addvideo_submitbuttonContainer">
          {buttonLoader ? (
            <button className="courses_addvideo_disablesubmitbutton">
              <>
                <Spin
                  size="small"
                  className="courses_addtopicbutton_spin"
                  indicator={<LoadingOutlined spin color="#fff" />}
                />{" "}
              </>
            </button>
          ) : (
            <button
              className="courses_addvideo_submitbutton"
              onClick={handleVideoSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </Drawer>
    </div>
  );
}

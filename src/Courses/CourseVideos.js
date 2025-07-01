import React, { useState } from "react";
import { Col, Row, Modal, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import Loader from "../Common/Loader";
import CommonNodataFound from "../Common/CommonNodataFound";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { CommonToaster } from "../Common/CommonToaster";
import {
  getParticularCourseTrainers,
  getVideoAndDocuments,
  videoDelete,
} from "../Common/action";
import {
  storeCourseDocuments,
  storeCourseVideos,
  storeTrainersList,
} from "../Redux/slice";

export default function CourseVideos({ courseId, topicid, roleId, loading }) {
  const dispatch = useDispatch();
  const courseVideos = useSelector((state) => state.coursevideos);
  const trainerId = useSelector((state) => state.trainerid);
  const API_URL = process.env.REACT_APP_API_URL;
  const [deleteModal, setDeleteModal] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [videoName, setVideoName] = useState("");
  const [videoLoading, setVideoLoading] = useState(false);

  const getVideosAndDocumentsData = async () => {
    setVideoLoading(true);
    console.log(courseId, topicid, trainerId);
    const payload = {
      course_id: courseId,
      topic_id: topicid,
      trainer_id: trainerId,
    };
    try {
      const response = await getVideoAndDocuments(payload);
      console.log("videos response", response);
      const videos = response?.data?.videos || [];
      if (videos.length >= 1) {
        const filterCourseVideos = videos.filter(
          (f) => f.content_type != "document"
        );
        console.log("all videos", filterCourseVideos);

        const filterCourseDocuments = videos.filter(
          (f) => f.content_type === "document"
        );

        const reverseVideos = filterCourseVideos.reverse();
        const reverseDocs = filterCourseDocuments.reverse();

        dispatch(storeCourseVideos(reverseVideos));
        dispatch(storeCourseDocuments(reverseDocs));
      } else {
        dispatch(storeCourseVideos([]));
        dispatch(storeCourseDocuments([]));
      }
    } catch (error) {
      dispatch(storeCourseVideos([]));
      dispatch(storeCourseDocuments([]));
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        getParticularCourseTrainersData();
      }, 300);
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
        dispatch(storeTrainersList(trainers));
      } else {
        dispatch(storeTrainersList([]));
      }
    } catch (error) {
      dispatch(storeTrainersList([]));
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        setVideoLoading(false);
      }, 300);
    }
  };

  const handleDelete = async () => {
    const payload = {
      id: videoId,
      filename: videoName,
    };
    try {
      await videoDelete(payload);
      CommonToaster("Video deleted");
      setDeleteModal(false);
      getVideosAndDocumentsData();
    } catch (error) {
      const videoDeleteError = error?.response?.data;
      if (
        videoDeleteError.details.includes(
          "EBUSY: resource busy or locked, unlink"
        )
      ) {
        CommonToaster("Compression in progress. Please try again later.");
        return;
      }
      CommonToaster(
        videoDeleteError?.message || "Something went wrong. Try again later"
      );
    }
  };

  return (
    <div>
      {loading || videoLoading ? (
        <Loader />
      ) : (
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          {courseVideos.length >= 1 ? (
            <>
              {courseVideos.map((item, index) => {
                let embedLink;
                let isYoutubeLink = false;
                if (item.file_path) {
                  if (item.file_path.includes("youtube")) {
                    const url = new URL(item.file_path);
                    embedLink = url.searchParams.get("v"); // safely get video ID
                    isYoutubeLink = true;
                  } else {
                    isYoutubeLink = false;
                  }
                }
                return (
                  <React.Fragment key={index}>
                    {item.file_path && (
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={8}
                        className="courses_video_col_Container"
                      >
                        <div className="courses_videoContainer">
                          {isYoutubeLink ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${embedLink}`}
                              allowFullScreen
                              className="courses_iframevideos"
                            ></iframe>
                          ) : (
                            <video
                              controls
                              controlsList="nodownload"
                              className="courses_iframevideos"
                            >
                              <source
                                src={`${API_URL + item.file_path}`}
                                type="video/mp4"
                              />
                            </video>
                          )}
                        </div>
                        <div className="courses_videotitle_container">
                          <p className="courses_videotitle">{item.title}</p>
                          {roleId === 1 || roleId === 2 ? (
                            <RiDeleteBinLine
                              size={18}
                              className="courses_videodelete_icon"
                              onClick={() => {
                                setVideoId(item.id);
                                setVideoName(item.filename);
                                console.log("eeeeeeeeeeeeeeeeeeeee");

                                setDeleteModal(true);
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </Col>
                    )}
                  </React.Fragment>
                );
              })}
            </>
          ) : (
            <CommonNodataFound title="No videos are available for this topic" />
          )}
        </Row>
      )}

      <Modal
        open={deleteModal}
        onCancel={() => {
          setDeleteModal(false);
        }}
        footer={false}
        closable
        width={420}
      >
        <div className="questionupload_deletemodalContainer">
          <div className="questionupload_deletemodal_iconContainer">
            <MdDelete size={20} color="#db2728" />
          </div>

          <p className="question_deletemodal_confirmdeletetext">
            Confirm Delete
          </p>

          <p className="question_deletemodal_text">
            Are you sure want to delete the video?
          </p>

          <div className="question_deletemodal_footerContainer">
            <Button
              className="question_deletemodal_cancelbutton"
              onClick={() => {
                setDeleteModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="question_deletemodal_deletebutton"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

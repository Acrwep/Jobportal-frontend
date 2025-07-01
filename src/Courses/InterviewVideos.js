import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CommonToaster } from "../Common/CommonToaster";
import {
  deleteCompanyVideosAndDocuments,
  getCompanies,
  getCompanyVideosAndDocuments,
} from "../Common/action";
import CommonNodataFound from "../Common/CommonNodataFound";
import { RiDeleteBinLine } from "react-icons/ri";
import Loader from "../Common/Loader";
import { MdDelete } from "react-icons/md";
import { storeCompanyList, storeCompanyVideos } from "../Redux/slice";

export default function InterviewVideos({ roleId, companyLoading }) {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const companyVideos = useSelector((state) => state.companyvideos);
  const companyId = useSelector((state) => state.companyid);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [videoName, setVideoName] = useState("");

  useEffect(() => {
    getCompanyVideosData();
  }, []);

  const getCompanyVideosData = async () => {
    setLoading(true);
    const payload = {
      company_id: companyId,
    };
    try {
      const response = await getCompanyVideosAndDocuments(payload);
      const videos = response?.data?.videos || [];

      if (videos.length >= 1) {
        const filterCourseVideos = videos.filter(
          (f) => f.content_type != "document"
        );
        const reverseVideos = filterCourseVideos.reverse();

        dispatch(storeCompanyVideos(reverseVideos));
      } else {
        dispatch(storeCompanyVideos([]));
      }
    } catch (error) {
      dispatch(storeCompanyVideos([]));
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        getCompaniesData();
      }, 300);
    }
  };

  const getCompaniesData = async () => {
    const selectedCourseId = localStorage.getItem("selectedCourseId");
    try {
      const response = await getCompanies(selectedCourseId);
      console.log("companies response", response);
      const companies = response?.data?.companies || [];

      if (companies.length >= 1) {
        dispatch(storeCompanyList(companies));
      } else {
        dispatch(storeCompanyList([]));
      }
    } catch (error) {
      dispatch(storeCompanyList([]));
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

  const handleDelete = async () => {
    const payload = {
      id: videoId,
      filename: videoName,
    };
    try {
      await deleteCompanyVideosAndDocuments(payload);
      CommonToaster("Video deleted");
      setDeleteModal(false);
      getCompanyVideosData();
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
      {loading || companyLoading ? (
        <Loader />
      ) : (
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          {companyVideos.length >= 1 ? (
            <>
              {companyVideos.map((item, index) => {
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
                        style={{ marginBottom: "22px" }}
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
            <CommonNodataFound title="No videos are available for this company" />
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

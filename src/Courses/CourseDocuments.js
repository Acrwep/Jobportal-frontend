import React, { useState, useEffect, useRef } from "react";
import { Col, Row, Button, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import Loader from "../Common/Loader";
import CommonNodataFound from "../Common/CommonNodataFound";
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";
import { pdfjs, Document, Page } from "react-pdf";
import { AiOutlineEye } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
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
import { CommonToaster } from "../Common/CommonToaster";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function CourseDocuments({
  courseId,
  topicid,
  roleId,
  loading,
}) {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const courseDocuments = useSelector((state) => state.coursedocuments);
  const trainerId = useSelector((state) => state.trainerid);
  const API_URL = process.env.REACT_APP_API_URL;

  // Track page numbers and total pages for each PDF
  const [pageNumbers, setPageNumbers] = useState({});
  const [numPagesMap, setNumPagesMap] = useState({});
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [selectedDocument, setSelectedDocument] = useState("");
  const [selectedDocumentName, setSelectedDocumentName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [documentLoading, setDocumentLoading] = useState(false);

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [documentLoading]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const getVideosAndDocumentsData = async () => {
    setDocumentLoading(true);
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

        dispatch(storeCourseVideos(filterCourseVideos));
        dispatch(storeCourseDocuments(filterCourseDocuments));
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
        setDocumentLoading(false);
      }, 300);
    }
  };

  const handleDelete = async () => {
    const payload = {
      id: selectedDocumentId,
    };
    try {
      await videoDelete(payload);
      CommonToaster("Document deleted");
      setDeleteModal(false);
      getVideosAndDocumentsData();
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  useEffect(() => {
    const testPDF = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/uploads/course-videos/document-1748839628591-49715488.pdf"
        );

        if (!response.ok) throw new Error("Fetch failed");

        const contentType = response.headers.get("Content-Type");
        console.log("PDF content type:", contentType); // Should be 'application/pdf'

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
      } catch (error) {
        console.error("Fetch failed", error);
      }
    };

    testPDF();
  }, []);

  return (
    <div>
      {loading || documentLoading ? (
        <Loader />
      ) : (
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          {courseDocuments.length >= 1 ? (
            courseDocuments.map((item, index) => {
              console.log("documentss", item);
              const fileUrl = `${API_URL + item.file_path}`;
              return (
                <>
                  {item.content_type === "document" && (
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={8}
                      key={index}
                      style={{ marginBottom: "22px" }}
                    >
                      <div className="courses_documentcardContainer">
                        <p className="courses_documenttitle">{item.title}</p>
                        <div
                          ref={containerRef}
                          className="courses_documentcard"
                        >
                          <Document
                            file={fileUrl}
                            onLoadError={(error) =>
                              console.error("PDF load error:", error)
                            }
                          >
                            <Page
                              pageNumber={pageNumbers[index] || 1}
                              width={containerWidth}
                            />
                          </Document>
                        </div>

                        <div className="courses_documentViewbutton_container">
                          <AiOutlineEye
                            size={20}
                            style={{ cursor: "pointer", marginRight: "12px" }}
                            onClick={() => {
                              setSelectedDocument(
                                `${API_URL + item.file_path}`
                              );
                              setSelectedDocumentName(item.title);
                              setIsOpen(true);
                            }}
                          />
                          {roleId === 1 || roleId === 2 ? (
                            <RiDeleteBinLine
                              size={20}
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedDocumentId(item.id);
                                setDeleteModal(true);
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </Col>
                  )}
                </>
              );
            })
          ) : (
            <CommonNodataFound title="No documents are available for this topic" />
          )}
        </Row>
      )}

      <Modal
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
          setPageNumber(1);
        }}
        title={selectedDocumentName}
        footer={false}
        width="50%"
        centered
      >
        <div className="admin_resumemodal_resumeview">
          <Document
            file={selectedDocument}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document>
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
            <MdArrowBackIosNew size={12} style={{ marginTop: "2px" }} />
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
            <MdArrowForwardIos size={12} style={{ marginTop: "2px" }} />
          </button>
        </div>
      </Modal>

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
            Are you sure want to delete the document?
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

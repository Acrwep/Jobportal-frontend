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
import { getVideoAndDocuments, videoDelete } from "../Common/action";
import { storeCourseVideos } from "../Redux/slice";
import { CommonToaster } from "../Common/CommonToaster";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function CourseDocuments({ courseId, topicid, loading }) {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const courseDocuments = useSelector((state) => state.coursedocuments);
  const trainerId = useSelector((state) => state.trainerid);

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

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          {courseDocuments.length >= 1 ? (
            courseDocuments.map((item, index) => {
              const pdfDataUrl = `data:application/pdf;base64,${item.content_data}`;
              return (
                <>
                  {item.content_data && (
                    <Col xs={24} sm={24} md={12} lg={8} key={index}>
                      <div className="courses_documentcardContainer">
                        <p className="courses_documenttitle">{item.title}</p>
                        <div
                          ref={containerRef}
                          className="courses_documentcard"
                        >
                          <Document file={pdfDataUrl}>
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
                              setSelectedDocument(item.content_data);
                              setSelectedDocumentName(item.title);
                              setIsOpen(true);
                            }}
                          />
                          <RiDeleteBinLine
                            size={20}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedDocumentId(item.id);
                              setDeleteModal(true);
                            }}
                          />
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
        onCancel={() => setIsOpen(false)}
        title={selectedDocumentName}
        footer={false}
        width="50%"
        centered
      >
        <div className="admin_resumemodal_resumeview">
          <Document
            file={`data:application/pdf;base64,${selectedDocument}`}
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

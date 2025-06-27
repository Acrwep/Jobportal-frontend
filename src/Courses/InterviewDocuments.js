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
  deleteCompanyVideosAndDocuments,
  getCompanies,
  getCompanyVideosAndDocuments,
  videoDelete,
} from "../Common/action";
import { CommonToaster } from "../Common/CommonToaster";
import { storeCompanyDocuments, storeCompanyList } from "../Redux/slice";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function InterviewDocuments({ roleId, companyLoading }) {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const companyId = useSelector((state) => state.companyid);
  const companyDocuments = useSelector((state) => state.companydocuments);
  const API_URL = process.env.REACT_APP_API_URL;

  // Track page numbers and total pages for each PDF
  const [pageNumbers, setPageNumbers] = useState({});
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [selectedDocument, setSelectedDocument] = useState("");
  const [selectedDocumentName, setSelectedDocumentName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);

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
  }, [loading]);

  useEffect(() => {
    getCompanyDocumentsData();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const getCompanyDocumentsData = async () => {
    setLoading(true);
    const payload = {
      company_id: companyId,
    };
    try {
      const response = await getCompanyVideosAndDocuments(payload);
      console.log("company documents response", response);
      const videos = response?.data?.videos || [];
      const filterDocuments = videos.filter(
        (f) => f.content_type === "document"
      );
      if (filterDocuments.length >= 1) {
        const reverseDocs = filterDocuments.reverse();

        dispatch(storeCompanyDocuments(reverseDocs));
      } else {
        dispatch(storeCompanyDocuments([]));
      }
    } catch (error) {
      dispatch(storeCompanyDocuments([]));
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
      id: selectedDocumentId,
      filename: selectedDocumentName,
    };
    try {
      await deleteCompanyVideosAndDocuments(payload);
      CommonToaster("Document deleted");
      setDeleteModal(false);
      getCompanyDocumentsData();
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  return (
    <div>
      {loading || companyLoading ? (
        <Loader />
      ) : (
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          {companyDocuments.length >= 1 ? (
            companyDocuments.map((item, index) => {
              const fileUrl = `${API_URL + item.file_path}`;
              return (
                <>
                  {item.content_type === "document" && (
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={6}
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
                            onLoadSuccess={() => {
                              const canvases = document.querySelectorAll(
                                ".courses_documentcard canvas"
                              );
                              canvases.forEach((canvas) => {
                                canvas.removeAttribute("style"); // removes hardcoded width & height
                                canvas.style.height = "100%";
                                canvas.style.width = "auto";
                                canvas.style.display = "block";
                              });
                            }}
                          >
                            <Page
                              pageNumber={pageNumbers[index] || 1}
                              width={containerWidth}
                              height={300}
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
            <CommonNodataFound title="No documents are available for this company" />
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

import React, { useState, useEffect } from "react";
import "./styles.css";
import { Button, Col, Modal, Row, Tabs, Spin, Drawer, Upload } from "antd";
import { useLocation } from "react-router-dom";
import CourseVideos from "./CourseVideos";
import PortalInputField from "../Common/PortalInputField";
import {
  createTopic,
  getAllUsers,
  getParticularCourseTrainers,
  getTopics,
  getVideoAndDocuments,
  trainerMapping,
  updateTopic,
  createCompany,
  getCompanies,
  getCompanyVideosAndDocuments,
  updateCompany,
  deleteCompany,
  deleteTopic,
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
import { IoCloudUploadOutline } from "react-icons/io5";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import Loader from "../Common/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  storeCompanyDocuments,
  storeCompanyId,
  storeCompanyList,
  storeCompanyVideos,
  storeCourseDocuments,
  storeCourseVideos,
  storeTrainerId,
  storeTrainersList,
} from "../Redux/slice";
import CommonNodataFound from "../Common/CommonNodataFound";
import axios from "axios";
import CourseDocuments from "./CourseDocuments";
import { SlCloudUpload } from "react-icons/sl";
import { RiDeleteBinLine } from "react-icons/ri";
import InterviewVideos from "./InterviewVideos";
import InterviewDocuments from "./InterviewDocuments";
import { MdDelete } from "react-icons/md";

const { Dragger } = Upload;

export default function Courses() {
  const location = useLocation();
  const dispatch = useDispatch();
  const companyList = useSelector((state) => state.companylist);
  const courseTrainersList = useSelector((state) => state.trainerslist);
  const [courseTopicIndex, setCourseTopicIndex] = useState(0);
  const [courseVideoLoader, setCourseVideoLoader] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "multipart/form-data" },
  });

  api.interceptors.request.use(
    (config) => {
      const AccessToken = localStorage.getItem("Accesstoken");
      console.log("Accesstoken", AccessToken);
      if (AccessToken) {
        config.headers.Authorization = `Bearer ${AccessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const [pages, setPages] = useState("trainers");
  //topic usestates
  const [topicEdit, setTopicEdit] = useState(false);
  const [topicId, setTopicId] = useState(null);
  const [activeTopicTabId, setActiveTopicTabId] = useState(null);
  const [topicName, setTopicName] = useState("");
  const [topicNameError, setTopicNameError] = useState("");
  const [addTopicModal, setAddTopicModal] = useState(false);
  const [deleteTopicId, setDeleteTopicId] = useState(null);
  const [topicDeleteModal, setTopicDeleteModal] = useState(false);
  //course usestates
  const [courseId, setCourseId] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [courseTopicsData, setCourseTopicsData] = useState([]);
  //map trainers usestates
  const [mapModal, setMapModal] = useState(false);
  const [mapTrainers, setMapTrainers] = useState([]);
  const [mapTrainersError, setMapTrainersError] = useState("");
  const [trainersList, setTrainersList] = useState([]);
  const [trainerId, setTrainerId] = useState(null);
  //content usesates
  const [contentTitle, setContentTitle] = useState("");
  const [contentTitleError, setContentTitleError] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [youtubeLinkError, setYoutubeLinkError] = useState("");
  const [courseVideo, setCourseVideo] = useState(null);
  const [courseVideoArray, setCourseVideoArray] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfArray, setPdfArray] = useState([]);
  const [contentDrawer, setContentDrawer] = useState(false);
  const contentTypeOptions = [
    { id: 1, name: "Video" },
    { id: 2, name: "Document" },
  ];
  const [contentType, setContentType] = useState(null);
  const [contentTypeError, setContentTypeError] = useState("");
  //company usesates
  const [companyModal, setCompanyModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyLogoType, setCompanyLogoType] = useState("");
  const [clickedCardName, setClickedCardName] = useState("");
  const [clickedCompanyId, setClickedCompanyId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [companyEdit, setCompanyEdit] = useState(false);
  const [companyDeleteModal, setCompanyDeleteModal] = useState(false);
  //other usestates
  const [roleId, setRoleId] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [formValidationTrigger, setFormValidationTrigger] = useState(false);

  const tabItems = [
    {
      key: "1",
      label: "Videos",
      children: (
        <CourseVideos
          loading={courseVideoLoader}
          courseId={courseId}
          topicid={activeTopicTabId}
          trainer_id={trainerId}
          roleId={roleId}
        />
      ),
    },
    {
      key: "2",
      label: "Documents",
      children: (
        <CourseDocuments
          loading={courseVideoLoader}
          courseId={courseId}
          topicid={activeTopicTabId}
          trainer_id={trainerId}
          roleId={roleId}
        />
      ),
    },
  ];

  const companyTabItems = [
    {
      key: "1",
      label: "Videos",
      children: (
        <InterviewVideos companyLoading={companyLoading} roleId={roleId} />
      ),
    },
    {
      key: "2",
      label: "Documents",
      children: (
        <InterviewDocuments companyLoading={companyLoading} roleId={roleId} />
      ),
    },
  ];

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
    setPages("trainers");
    setCourseTopicIndex(0);
    setLoading(true);
    getParticularCourseTrainersData();
    setTimeout(() => {
      setLoading(true);
      getCompaniesData();
    }, 300);
  }, [location.pathname]);

  const getTrainersData = async () => {
    const roleid = parseInt(localStorage.getItem("loginUserRoleId"));
    setRoleId(roleid);
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
    const loginUserId = parseInt(localStorage.getItem("loginUserId"));
    const roleid = parseInt(localStorage.getItem("loginUserRoleId"));
    try {
      const response = await getParticularCourseTrainers(
        parseInt(selectedCourseId)
      );
      console.log("course trainers", response);
      const trainers = response?.data?.trainers;
      if (trainers.length >= 1) {
        if (roleid === 2) {
          const mappingTrainers = trainers.filter(
            (f) => f.trainer_id === loginUserId
          );
          dispatch(storeTrainersList(mappingTrainers));
        } else {
          dispatch(storeTrainersList(trainers));
        }
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
        if (clickedCompanyId) {
          getCompaniesData();
        } else {
          setLoading(false);
        }
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

  const getTopicsData = async (trainerid) => {
    setCourseVideoLoader(true);
    const selectedCourseId = localStorage.getItem("selectedCourseId");
    let topicid = null;
    try {
      const response = await getTopics(parseInt(selectedCourseId));
      const coursetopics = response?.data?.topics || [];
      if (coursetopics.length >= 1) {
        const reverseData = coursetopics.reverse();
        console.log("course topics", reverseData);
        setActiveTopicTabId(reverseData[0].id);
        topicid = reverseData[0].id;
        setCourseTopicsData(reverseData);
      } else {
        topicid = null;
        setActiveTopicTabId(null);
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
        getVideosAndDocumentsData(topicid, trainerid);
        setLoading(false);
      }, 300);
    }
  };

  const getVideosAndDocumentsData = async (topicid, trainerid) => {
    setCourseVideoLoader(true);
    const payload = {
      course_id: courseId,
      topic_id: topicid,
      trainer_id: trainerId ? trainerId : trainerid,
    };
    try {
      const response = await getVideoAndDocuments(payload);
      console.log("videos response", response);
      const videos = response?.data?.videos || [];
      if (videos.length >= 1) {
        const filterCourseVideos = videos.filter(
          (f) => f.content_data === null
        );
        const filterCourseDocuments = videos.filter(
          (f) => f.content_data != null
        );
        console.log("course documents", filterCourseDocuments);
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
        setLoading(false);
        setCourseVideoLoader(false);
        setCompanyLoading(false);
      }, 300);
    }
  };

  const getCompanyVideosAndDocumentsData = async () => {
    setCompanyLoading(true);
    const payload = {
      company_id: clickedCompanyId,
    };
    try {
      const response = await getCompanyVideosAndDocuments(payload);
      console.log("videos response", response);
      const videos = response?.data?.videos || [];
      if (videos.length >= 1) {
        const filterCourseVideos = videos.filter(
          (f) => f.content_data === null
        );
        const filterCourseDocuments = videos.filter(
          (f) => f.content_data != null
        );

        dispatch(storeCompanyVideos(filterCourseVideos));
        dispatch(storeCompanyDocuments(filterCourseDocuments));
      } else {
        dispatch(storeCompanyVideos([]));
        dispatch(storeCompanyDocuments([]));
      }
    } catch (error) {
      dispatch(storeCompanyVideos([]));
      dispatch(storeCompanyDocuments([]));
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
        setCourseVideoLoader(false);
        setCompanyLoading(false);
      }, 300);
    }
  };

  //trainer map function
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
      setLoading(true);
      getParticularCourseTrainersData();
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  //topics related functions
  const handleTopicTab = (index, Id) => {
    if (index === courseTopicIndex) return;
    setCourseTopicIndex(index);
    setActiveTopicTabId(Id);
    getVideosAndDocumentsData(Id);
  };

  const handleTopicEdit = (item) => {
    setAddTopicModal(true);
    setTopicEdit(true);
    setTopicName(item.name);
    setTopicId(item.id);
  };

  const handleTopicDelete = async () => {
    try {
      await deleteTopic(deleteTopicId);
      CommonToaster("Topic deleted");
      getTopicsData(trainerId);
      setTimeout(() => {
        formReset();
      }, 300);
    } catch (error) {
      const Error = error?.response?.data;
      if (
        Error.details ===
        "Error deleting topic: Unable to remove the topic because it contains content."
      ) {
        CommonToaster("Unable to delete because it contains content");
      } else {
        CommonToaster(
          error?.response?.data?.message ||
            "Something went wrong. Try again later"
        );
      }
    }
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
      course_id: courseId,
    };

    if (topicEdit) {
      try {
        await updateTopic(payload);
        CommonToaster("Topic updated");
        getTopicsData();
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
        getTopicsData();
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

  //upload files handling
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
      setCourseVideo(null);
      setCourseVideoArray([]);
      CommonToaster("Only .mp4 files are accepted");
    }
  };

  const handleDocuments = ({ file }) => {
    console.log("fileeeeee", file);
    const ValidType = file.type === "application/pdf";

    if (file.status === "uploading" || file.status === "removed") {
      setPdfFile(null);
      setPdfArray([]);
      return;
    }

    if (ValidType) {
      CommonToaster("Document uploaded");
      setPdfArray([file]);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setPdfFile(base64String);
      };
    } else {
      setPdfArray([]);
      setPdfFile("");
      CommonToaster("Only .pdf files are accepted");
    }
  };

  const videoAndDocumentUpload = async (payload) => {
    try {
      const response = await api.post("/api/uploadContent", payload);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const companyVideoAndDocumentUpload = async (payload) => {
    try {
      const response = await api.post("/api/uploadCompanyContent", payload);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleContentSubmit = async () => {
    const contentTitleValidate = addressValidator(contentTitle);
    const contentTypeValidate = selectValidator(contentType);

    let isFormError = false;
    if (contentType === 1) {
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
    }

    if (contentType === 2) {
      if (pdfArray.length <= 0) {
        isFormError = true;
        CommonToaster("Please upload document");
        return;
      } else {
        isFormError = false;
      }
    }
    setContentTitleError(contentTitleValidate);
    setContentTypeError(contentTypeValidate);

    if (contentTitleValidate || contentTypeValidate || isFormError) {
      const container = document.getElementById(
        "courses_videotitle_fieldContainer"
      );
      container.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (contentType === 1) {
      //video upload handling
      setButtonLoader(true);
      const formData = new FormData();

      formData.append("course_id", courseId);
      formData.append("topic_id", activeTopicTabId);
      if (clickedCompanyId) {
        formData.append("company_id", clickedCompanyId);
      } else {
        formData.append("trainer_id", trainerId);
      }
      formData.append("title", contentTitle);
      if (youtubeLink) {
        formData.append("content_type", "youtube");
        formData.append("content_url", youtubeLink);
      } else {
        formData.append("content_type", "video");
        formData.append("video", courseVideo);
      }
      console.log("successs", formData);
      let response;
      try {
        if (clickedCompanyId) {
          response = await companyVideoAndDocumentUpload(formData);
        } else {
          response = await videoAndDocumentUpload(formData);
        }
        console.log(response, "reponse");
        CommonToaster("Video uploaded");
        setCourseVideoLoader(true);
        setCompanyLoading(true);
        setTimeout(() => {
          formReset();
          getParticularCourseTrainersData();
          if (clickedCompanyId) {
            getCompanyVideosAndDocumentsData();
          } else {
            getVideosAndDocumentsData(activeTopicTabId);
          }
        }, 300);
      } catch (error) {
        setButtonLoader(false);
        CommonToaster(
          error?.response?.data?.message ||
            "Something went wrong. Try again later"
        );
      }
    } else {
      //document upload handling
      setButtonLoader(true);
      const formData = new FormData();

      formData.append("course_id", courseId);
      formData.append("topic_id", activeTopicTabId);
      if (clickedCompanyId) {
        formData.append("company_id", clickedCompanyId);
      } else {
        formData.append("trainer_id", trainerId);
      }
      formData.append("title", contentTitle);
      formData.append("content_type", "document");
      formData.append("document_content", pdfFile);
      let response;
      try {
        if (clickedCompanyId) {
          response = await companyVideoAndDocumentUpload(formData);
        } else {
          response = await videoAndDocumentUpload(formData);
        }
        console.log(response, "reponse");
        CommonToaster("Document uploaded");
        setCourseVideoLoader(true);
        setTimeout(() => {
          formReset();
          getParticularCourseTrainersData();
          if (clickedCompanyId) {
            getCompanyVideosAndDocumentsData();
          } else {
            getVideosAndDocumentsData(activeTopicTabId);
          }
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

  const getInitials = (name) => {
    const words = name.split(" ");
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else if (words.length > 1) {
      return (
        words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase()
      );
    } else {
      return "";
    }
  };

  //company related functions
  const handleCompanyLogoAttachment = ({ file }) => {
    console.log(file);

    const isValidType =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/svg" ||
      file.type === "image/svg+xml";

    if (file.status === "uploading" || file.status === "removed") {
      setCompanyLogo([]);
      return;
    }
    if (isValidType) {
      console.log("fileeeee", file);
      CommonToaster("Logo uploaded");
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Extract Base64 content
        setCompanyLogo(base64String); // Store in state
        setCompanyLogoType(file.type);
      };
    } else {
      CommonToaster("Accept only .png, .jpg, .jpeg and .svg");
      setCompanyLogo("");
    }
  };

  const handleCompanyCreate = async () => {
    const selectedCourseId = localStorage.getItem("selectedCourseId");

    const companyNameValidate = addressValidator(companyName);
    const companyLogoValidate = selectValidator(companyLogo);

    setCompanyNameError(companyNameValidate);
    if (companyLogoValidate) {
      CommonToaster("Company logo is required!");
    }

    if (companyNameValidate || companyLogoValidate) return;

    setButtonLoader(true);
    const payload = {
      ...(companyId && { company_id: companyId }),
      name: companyName,
      logo: companyLogo,
      course_id: selectedCourseId,
    };
    if (companyEdit) {
      try {
        await updateCompany(payload);
        CommonToaster("Company updated");
        setLoading(true);
        getCompaniesData();
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
        await createCompany(payload);
        CommonToaster("Company created");
        setLoading(true);
        getCompaniesData();
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

  function getMimeType(base64) {
    if (!base64) return "";
    const signature = base64.slice(0, 5).toUpperCase();
    switch (signature) {
      case "IVBOR":
        return "image/png";
      case "/9J/4":
        return "image/jpeg";
      case "R0LGO":
        return "image/gif";
      case "PD94B":
        return "image/svg+xml"; // usually SVG base64 starts with '<?xml' which is 'PD94B' when encoded
      default:
        return "image/*"; // fallback
    }
  }

  const handleCompanyEdit = (item) => {
    console.log("clicked company", item);
    setCompanyId(item.id);
    setCompanyName(item.company_name);
    setCompanyLogo(item.logo);
    setCompanyModal(true);
    setCompanyEdit(true);
  };

  const handleCompanyDelete = async () => {
    setCompanyDeleteModal(false);
    try {
      await deleteCompany(companyId);
      CommonToaster("Company deleted");
      setLoading(true);
      getCompaniesData();
      setTimeout(() => {
        formReset();
      }, 300);
    } catch (error) {
      setButtonLoader(false);
      const Error = error?.response?.data;

      if (
        Error.details ===
        "Error deleting company: Unable to remove the company because it contains content."
      ) {
        CommonToaster("Unable to delete because it contains content");
      } else {
        CommonToaster(
          error?.response?.data?.message ||
            "Something went wrong. Try again later"
        );
      }
    }
  };

  //reset fields function
  const formReset = () => {
    setAddTopicModal(false);
    setMapModal(false);
    setTopicEdit(false);
    setFormValidationTrigger(false);
    setTopicName("");
    setTopicNameError("");
    setTopicDeleteModal(false);
    setDeleteTopicId(null);
    setMapTrainers([]);
    setMapTrainersError("");
    setContentDrawer(false);
    setContentType(null);
    setContentTypeError("");
    setContentTitle("");
    setContentTitleError("");
    setYoutubeLink("");
    setYoutubeLinkError("");
    setCourseVideo(null);
    setCourseVideoArray([]);
    setPdfFile(null);
    setPdfArray([]);
    setCompanyModal(false);
    setCompanyName("");
    setCompanyNameError("");
    setCompanyLogo("");
    setCompanyLogoType("");
    setCompanyId(null);
    setCompanyDeleteModal(false);
    setCompanyEdit(false);
    setButtonLoader(false);
  };

  return (
    <div>
      <div className="portal_headinContainer">
        <div className="courses_backbutton_mainContainer">
          {pages === "videos" || pages === "interview" ? (
            <div
              className="courses_backbutton_Container"
              onClick={() => {
                setTrainerId(null);
                setCourseTopicIndex(0);
                setActiveTopicTabId(null);
                dispatch(storeTrainerId(null));
                setClickedCardName("");
                setClickedCompanyId(null);
                setPages("trainers");
              }}
            >
              <IoArrowBack color="#0056b3" size={20} />
            </div>
          ) : (
            ""
          )}
          <p className="portal_mainheadings">{`${courseName} ${
            clickedCardName ? ">" : ""
          } ${clickedCardName}`}</p>
        </div>
        <div className="courses_maptrainerbutton_container">
          {pages === "trainers" ? (
            <>
              {roleId === 1 && (
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
              )}
              {roleId === 1 || roleId === 2 ? (
                <button
                  className="courses_addtopic_button"
                  onClick={() => setCompanyModal(true)}
                >
                  <IoMdAdd
                    size={16}
                    color="#fff"
                    style={{ marginRight: "6px" }}
                  />{" "}
                  Add Company
                </button>
              ) : (
                ""
              )}
            </>
          ) : pages === "videos" ? (
            <>
              {roleId === 1 || roleId === 2 ? (
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
                    onClick={() => setContentDrawer(true)}
                  >
                    <HiOutlineDocumentAdd
                      size={18}
                      color="#fff"
                      style={{ marginRight: "6px" }}
                    />{" "}
                    Add Content
                  </button>
                </>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              {roleId === 1 ||
                (roleId === 2 && (
                  <button
                    className="courses_addtopic_button"
                    onClick={() => setContentDrawer(true)}
                  >
                    <HiOutlineDocumentAdd
                      size={18}
                      color="#fff"
                      style={{ marginRight: "6px" }}
                    />{" "}
                    Add Content
                  </button>
                ))}
            </>
          )}
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {pages === "trainers" ? (
            <>
              <p className="courses_trainerheading">
                {/* {courseTrainersList.length >= 1 ? "Trainers" : ""} */}
                Trainers
              </p>
              <Row gutter={30}>
                {courseTrainersList.length >= 1 ? (
                  <>
                    {courseTrainersList.map((item, index) => {
                      const profileBase64String = `data:image/jpeg;base64,${item.profile}`;
                      return (
                        <React.Fragment key={index}>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            style={{ marginBottom: "24px" }}
                          >
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
                                setPages("videos");
                                console.log("clicked trainer", item);
                                setClickedCardName(item.trainer_name);
                                setTrainerId(item.trainer_id);
                                dispatch(storeTrainerId(item.trainer_id));
                                getTopicsData(item.trainer_id);
                              }}
                            >
                              {item.profile ? (
                                <div className="courses_trainercard_imagesContainer">
                                  <img
                                    src={profileBase64String}
                                    className="courses_trainercard_images"
                                  />
                                </div>
                              ) : (
                                <div className="courses_trainercard_imagesContainer">
                                  <p
                                    style={{
                                      fontSize: "24px",
                                      fontWeight: 500,
                                      color:
                                        index === 0
                                          ? "#6068cd"
                                          : index === 1
                                          ? "#ac5ac7"
                                          : "#5297a7",
                                    }}
                                  >
                                    {getInitials(item.trainer_name)}
                                  </p>
                                </div>
                              )}
                              <div className="courses_trainercard_contentContainer">
                                <p className="courses_trainercard_name">
                                  {item.trainer_name}
                                </p>

                                <div style={{ display: "flex", gap: "6px" }}>
                                  <div>
                                    <p className="courses_trainercard_exp">
                                      Experience:{" "}
                                    </p>
                                    <p className="courses_trainercard_exp">
                                      Videos:
                                    </p>
                                    <p className="courses_trainercard_exp">
                                      Documents:
                                    </p>
                                  </div>

                                  <div>
                                    <p className="courses_trainercard_exp">
                                      {item.experience ? item.experience : "-"}
                                    </p>
                                    <p className="courses_trainercard_exp">
                                      {item.video_count}
                                    </p>
                                    <p className="courses_trainercard_exp">
                                      {item.document_count}
                                    </p>
                                  </div>
                                </div>
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

              <div className="courses_interprepration_container">
                <p className="courses_interprepration_heading">
                  Company Based Interview Preparation
                </p>

                <Row gutter={30}>
                  {companyList.length >= 1 ? (
                    <>
                      {companyList.map((item, index) => {
                        const logotype = getMimeType(item.logo);
                        const companylogo = `data:${logotype};base64,${item.logo}`;
                        return (
                          <React.Fragment key={index}>
                            <Col
                              xs={24}
                              sm={12}
                              md={24}
                              lg={8}
                              style={{ marginBottom: "24px" }}
                            >
                              <div className="courses_companyCards">
                                <div
                                  className="courses_interprepration_companyCards_innerContainer"
                                  onClick={() => {
                                    setPages("interview");
                                    setClickedCardName(item.company_name);
                                    setClickedCompanyId(item.id);
                                    dispatch(storeCompanyId(item.id));
                                  }}
                                >
                                  <img
                                    src={companylogo}
                                    className="courses_interprepration_companylogos"
                                  />

                                  <div>
                                    <p className="courses_interprepration_companyname">
                                      {item.company_name}
                                    </p>
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "6px",
                                        marginTop: "4px",
                                      }}
                                    >
                                      <div>
                                        <p className="courses_companycard_videotext">
                                          Videos:
                                        </p>
                                        <p className="courses_companycard_videotext">
                                          Documents:
                                        </p>
                                      </div>

                                      <div>
                                        <p className="courses_companycard_videotext">
                                          {item.video_count}
                                        </p>
                                        <p className="courses_companycard_videotext">
                                          {item.document_count}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {roleId === 1 || roleId === 2 ? (
                                  <div className="courses_companycard_editContainer">
                                    <AiTwotoneEdit
                                      size={18}
                                      onClick={() => handleCompanyEdit(item)}
                                    />
                                    <RiDeleteBinLine
                                      size={18}
                                      color="#d32215"
                                      onClick={() => {
                                        setCompanyId(item.id);
                                        setCompanyDeleteModal(true);
                                      }}
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </Col>
                          </React.Fragment>
                        );
                      })}
                    </>
                  ) : (
                    <CommonNodataFound
                      title="No companies are available for this course"
                      style={{ marginBottom: "40px" }}
                    />
                  )}
                </Row>
              </div>
            </>
          ) : pages === "videos" ? (
            <div className="courses_topicsmainContainer">
              <Row style={{ marginBottom: "20px" }}>
                <Col span={6} className="courses_topics_sidebarContainer">
                  {courseTopicsData.length >= 1 ? (
                    <>
                      {courseTopicsData.map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div
                              className={
                                index === courseTopicIndex
                                  ? "courses_topactivetab_div"
                                  : "courses_topinactivetab_div"
                              }
                            >
                              <div
                                className="courses_topics_innerContainer"
                                onClick={() => handleTopicTab(index, item.id)}
                              >
                                <p>{item.name}</p>
                              </div>

                              {roleId === 1 || roleId === 2 ? (
                                <div className="courses_topics_editanddeleteiconContainer">
                                  <AiTwotoneEdit
                                    size={18}
                                    className="courses_topics_editanddeleteicon"
                                    onClick={() => handleTopicEdit(item)}
                                  />
                                  <RiDeleteBinLine
                                    size={18}
                                    color="#d32215"
                                    className="courses_topics_editanddeleteicon"
                                    onClick={() => {
                                      setDeleteTopicId(item.id);
                                      setTopicDeleteModal(true);
                                    }}
                                  />
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </>
                  ) : (
                    <div className="courses_topics_nodataContainer">
                      <p>No topice found for this course</p>
                    </div>
                  )}
                </Col>
                <Col span={18}>
                  <div className="courses_videomainContainer">
                    <Tabs defaultActiveKey="1" items={tabItems} />
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <Tabs defaultActiveKey="1" items={companyTabItems} />
          )}
        </>
      )}
      {/* add topic modal */}
      <Modal
        open={addTopicModal}
        onCancel={formReset}
        title="Add Topics"
        footer={[
          <div className="courses_addtopicmodal_footerContainer">
            {buttonLoader ? (
              <Button className="courses_modal_disablesubmitbutton">
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
                className="courses_modal_submitbutton"
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

      {/* map trainers modal */}
      <Modal
        open={mapModal}
        onCancel={formReset}
        title="Map Trainers"
        footer={[
          <div className="courses_addtopicmodal_footerContainer">
            {buttonLoader ? (
              <Button className="courses_modal_disablesubmitbutton">
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
                className="courses_modal_submitbutton"
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

      {/* addcompany modal */}
      <Modal
        open={companyModal}
        onCancel={formReset}
        title="Add Company"
        footer={[
          <div className="courses_addtopicmodal_footerContainer">
            {buttonLoader ? (
              <Button className="courses_modal_disablesubmitbutton">
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
                className="courses_modal_submitbutton"
                onClick={handleCompanyCreate}
              >
                Submit
              </Button>
            )}
          </div>,
        ]}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="courses_companylogo_container"
            // style={{ backgroundColor: companyLogo === "" ? "#0056b3" : "" }}
          >
            {companyLogo ? (
              <>
                {companyLogoType === "image/png" ? (
                  <img
                    src={`data:image/png;base64,${companyLogo}`}
                    className="courses_companymodal_logo"
                  />
                ) : companyLogoType === "image/jpeg" ? (
                  <img
                    src={`data:image/jpeg;base64,${companyLogo}`}
                    className="courses_companymodal_logo"
                  />
                ) : companyLogoType === "image/jpg" ? (
                  <img
                    src={`data:image/jpg;base64,${companyLogo}`}
                    className="courses_companymodal_logo"
                  />
                ) : (
                  <img
                    src={`data:image/svg+xml;base64,${companyLogo}`}
                    className="courses_companymodal_logo"
                  />
                )}
              </>
            ) : (
              <SlCloudUpload size={60} color="#0056b3" />
            )}
          </div>

          <div className="courses_companylogo_uploadContainer">
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                return false; // Prevent auto-upload
              }}
              onChange={handleCompanyLogoAttachment}
              fileList={[]}
            >
              <Button className="courses_companylogo_uploadbutton">
                Upload Logo
              </Button>
            </Upload>
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <PortalInputField
            label="Company Name"
            mandatory={true}
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              setCompanyNameError(addressValidator(e.target.value));
            }}
            error={companyNameError}
          />
        </div>
      </Modal>

      {/*company delete modal */}
      <Modal
        open={companyDeleteModal}
        onCancel={formReset}
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
            Are you sure want to delete the company?
          </p>

          <div className="question_deletemodal_footerContainer">
            <Button
              className="question_deletemodal_cancelbutton"
              onClick={formReset}
            >
              Cancel
            </Button>
            <Button
              className="question_deletemodal_deletebutton"
              onClick={handleCompanyDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/*company delete modal */}
      <Modal
        open={topicDeleteModal}
        onCancel={formReset}
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
            Are you sure want to delete the topic?
          </p>

          <div className="question_deletemodal_footerContainer">
            <Button
              className="question_deletemodal_cancelbutton"
              onClick={formReset}
            >
              Cancel
            </Button>
            <Button
              className="question_deletemodal_deletebutton"
              onClick={handleTopicDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      {/* create content drawer */}
      <Drawer
        open={contentDrawer}
        onClose={formReset}
        width="36%"
        title="Add Content"
        closable
      >
        <div id="courses_videotitle_fieldContainer">
          <PortalInputField
            label="Title"
            mandatory={true}
            value={contentTitle}
            onChange={(e) => {
              setContentTitle(e.target.value);
              setContentTitleError(addressValidator(e.target.value));
            }}
            error={contentTitleError}
          />
        </div>

        <div style={{ marginTop: "22px", marginBottom: "22px" }}>
          <PortalSelectField
            label="Content-Type"
            options={contentTypeOptions}
            value={contentType}
            allowClear={true}
            onChange={(value) => {
              setContentType(value);
              setContentTypeError(selectValidator(value));
            }}
            mandatory={true}
            error={contentTypeError}
          />
        </div>
        {contentType === 1 ? (
          <>
            <div>
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
          </>
        ) : contentType === 2 ? (
          <Dragger
            multiple={false}
            className="courses_addvideodrawer"
            beforeUpload={(file) => {
              console.log(file);
              return false; // Prevent auto-upload
            }}
            maxCount={1}
            onChange={handleDocuments}
            fileList={pdfArray}
          >
            <IoCloudUploadOutline
              size={45}
              color="#0056b3"
              style={{ marginBottom: "16px" }}
            />
            <p className="ant-upload-text">
              Click or drag files to this area to upload
            </p>
            <p className="ant-upload-hint">
              Strictly prohibited from uploading company data or other banned
              files.
            </p>
          </Dragger>
        ) : (
          ""
        )}
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
              onClick={handleContentSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </Drawer>
    </div>
  );
}

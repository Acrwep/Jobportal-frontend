import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Spin,
  Drawer,
  Collapse,
  Divider,
  Modal,
  Button,
  Radio,
  Space,
  Dropdown,
} from "antd";
import { useNavigate } from "react-router-dom";
import CommonTable from "../Common/CommonTable";
import { IoIosSend } from "react-icons/io";
import { CommonToaster } from "../Common/CommonToaster";
import {
  downloadResult,
  getAllUsers,
  getAssessmentAnswers,
  getCandidates,
  getCourses,
  getQuestionTypes,
  scheduleAssessment,
  sendInterviewRequest,
} from "../Common/action";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import PortalSelectField from "../Common/PortalSelectField";
import PortalDoubleDatePicker from "../Common/PortalDoubleDatePicker";
import { AiOutlineEye } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { PiCheckFatFill } from "react-icons/pi";
import CommonNodataFound from "../Common/CommonNodataFound";
import { CgSoftwareDownload } from "react-icons/cg";
import { IoIosClose } from "react-icons/io";
import { addressValidator, selectValidator } from "../Common/Validation";
import PortalInputField from "../Common/PortalInputField";
import { MdDelete } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import DownloadTableAsCSV from "../Common/DownloadTableAsCSV";
import { LuListFilter } from "react-icons/lu";
import { HiDotsVertical } from "react-icons/hi";
import CommonTimePicker from "../Common/CommonTimePicker";
import CommonInputField from "../Common/CommonInputField";
import CommonDatePicker from "../Common/CommonDatePicker";
import PortalDatePicker from "../Common/PortalDatePicker";
const { Search } = Input;

export default function Candidates() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [data, setData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const branchOptions = [
    { id: "Online", name: "Online" },
    { id: "Anna nagar", name: "Anna nagar" },
    { id: "Velachery", name: "Velachery" },
    { id: "OMR", name: "OMR" },
    { id: "Porur", name: "Porur" },
    { id: "Electronic City", name: "Electronic City" },
    { id: "BTM Layout", name: "BTM Layout" },
  ];
  const [branchId, setBranchId] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [resultDrawer, setResultDrawer] = useState(false);
  const [collapseDefaultKey, setCollapseDefaultKey] = useState(["1"]);
  const [answersData, setAnswersData] = useState([]);
  const [questionTypeModal, setQuestionTypeModal] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [questionTypeError, setQuestionTypeError] = useState("");
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [typeData, setTypeData] = useState([]);
  const [callTypeApi, setCallTypeApi] = useState(true);
  const [mailConfirmModal, setMailConfirmModal] = useState(false);
  const [placementRegisteredCandidates, setPlacementRegisteredCandidates] =
    useState([]);
  const [
    nonPlacementRegisteredCandidates,
    setNonPlacementRegisteredCandidates,
  ] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [candidateCourse, setCandidateCourse] = useState("");
  const [candidateBranch, setCandidateBranch] = useState("");
  const [filterModal, setFilterModal] = useState(false);
  const [filterValue, setFilterValue] = useState(1);
  const [schedulerModal, setSchedulerModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventNameError, setEventNameError] = useState("");
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleDateError, setScheduleDateError] = useState("");
  const [scheduleTime, setScheduleTime] = useState(null);
  const [scheduleTimeError, setScheduleTimeError] = useState("");
  const [requestKey, setRequestKey] = useState("");

  const items = [
    {
      key: "1",
      label: (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <p>Send Assessment Request</p>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <p>Schedule Assessment</p>
        </div>
      ),
    },
  ];

  const columns = [
    { title: "Name", key: "name", dataIndex: "name", width: 200 },
    { title: "Email", key: "email", dataIndex: "email", width: 260 },
    {
      title: "Mobile",
      key: "mobile",
      dataIndex: "mobile",
      width: 140,
      render: (text) => {
        return <p>{text ? text : "-"}</p>;
      },
    },
    {
      title: "Branch",
      key: "course_location",
      dataIndex: "course_location",
      width: 180,
    },
    {
      title: "Course",
      key: "course_name",
      dataIndex: "course_name",
      width: 220,
    },
    {
      title: "Course Joining Date",
      key: "course_join_date",
      dataIndex: "course_join_date",
      width: 200,
      render: (text, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>{text ? moment(text).format("DD/MM/YYYY") : "-"}</p>
          </div>
        );
      },
    },
    {
      title: "Register In Placement",
      key: "is_placement_registered",
      dataIndex: "is_placement_registered",
      width: 200,
      render: (text, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>{text === 1 ? "Yes" : "No"}</p>
          </div>
        );
      },
    },
    {
      title: "Test Attempt",
      key: "attempt_number",
      dataIndex: "attempt_number",
      width: 150,
      render: (text, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>{text}</p>
          </div>
        );
      },
    },
    {
      title: "Last Interview Request",
      key: "last_email_sent_date",
      dataIndex: "last_email_sent_date",
      render: (text, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>{text ? moment(text).format("DD/MM/YYYY") : "-"}</p>
          </div>
        );
      },
    },
    {
      title: "Result",
      width: 140,
      fixed: "right",
      render: (text, record) => {
        return (
          <div
            className="assesmntresult_viewContainer"
            onClick={() =>
              getAnswersData(
                text.id,
                record.name,
                record.course_location,
                record.course_name
              )
            }
          >
            <AiOutlineEye size={20} />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getCourseData();
  }, []);

  const getCourseData = async () => {
    try {
      const response = await getCourses();
      console.log("course response", response);
      if (response?.data?.data) {
        setCourseOptions(response?.data?.data);
      } else {
        setCourseOptions([]);
      }
    } catch (error) {
      setCourseOptions([]);
      console.log("course error", error);
    } finally {
      setTimeout(() => {
        getCandidatesData(null, null, null, null, null);
      }, 300);
    }
  };

  const getCandidatesData = async (
    nameSearch,
    branchid,
    courseid,
    fromDate,
    toDate
  ) => {
    setTableLoading(true);
    console.log("filtervaa", filterValue);
    const payload = {
      ...(nameSearch && filterValue === 1
        ? { name: nameSearch }
        : nameSearch && filterValue === 2
        ? { email: nameSearch }
        : nameSearch && filterValue === 3
        ? { mobile: nameSearch }
        : {}),
      course_location: branchid,
      course_id: courseid,
      from_date: fromDate,
      to_date: toDate,
    };
    try {
      const response = await getAllUsers(payload);
      const users = response?.data?.data || [];
      if (users.length >= 1) {
        const onlyStudents = users.filter((f) => f.role === "Student");
        setData(onlyStudents);
      } else {
        setData([]);
      }
    } catch (error) {
      setData([]);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        if (callTypeApi) {
          getQuestionTypesData();
        } else {
          setTableLoading(false);
        }
      }, 500);
    }
  };

  const getQuestionTypesData = async () => {
    try {
      const response = await getQuestionTypes();
      console.log("type response", response);
      const questionTypes = response?.data?.data || [];
      setTypeData(questionTypes);
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        setCallTypeApi(false);
        setTableLoading(false);
      }, 300);
    }
  };

  const getAnswersData = async (
    userId,
    candidateName,
    courseLocation,
    courseName
  ) => {
    console.log(userId, candidateName, courseLocation, courseName);
    setResultDrawer(true);
    setCandidateName(candidateName);
    setCandidateCourse(courseName);
    setCandidateBranch(courseLocation);
    const payload = {
      user_id: userId,
    };
    try {
      const response = await getAssessmentAnswers(payload);
      const answers = response?.data?.data || [];
      if (answers.length <= 0) {
        setAnswersData([]);
        return;
      }
      console.log("answers response", response);
      const reverseData = answers.reverse();

      if (reverseData.length >= 1) {
        const addChildren = reverseData.map((item, index) => {
          return {
            ...item,
            key: index + 1,
            // label: `${lastQuestionType}`,
            label: (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>
                  {item.question_type
                    ? item.question_type
                    : `Attempt ${index + 1}`}
                </span>
                <p style={{ color: "gray" }}>
                  Date:{" "}
                  <span>{moment(item.attempt_date).format("DD-MM-YYYY")}</span>
                </p>{" "}
              </div>
            ),
            children: (
              <div>
                <Row style={{ marginBottom: "12px" }}>
                  <Col span={8}>
                    <p>
                      Date:{" "}
                      <span>
                        {moment(item.attempt_date).format("DD-MM-YYYY")}
                      </span>
                    </p>
                  </Col>
                  <Col span={8}>
                    <p>Total Questions: 50</p>
                  </Col>
                  <Col span={8}>
                    <p>Attemted Questions: {item.total_questions}</p>
                  </Col>
                </Row>

                <Row style={{ marginBottom: "20px" }}>
                  <Col span={8}>
                    <p>
                      Correct Answer: <span>{item.correct_answers}</span>
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      Precentage :{" "}
                      <span style={{ fontWeight: 700, color: "#0056b3" }}>
                        {item.percentage + "%"}
                      </span>
                    </p>
                  </Col>
                </Row>
                {item.answers.map((answer, i) => {
                  let lastIndex = item.answers.length - 1;
                  return (
                    <div key={i}>
                      <div className="assesmntresult_questionContainer">
                        <p className="assesmntresult_questionheading">
                          Question {i + 1}:
                        </p>
                        <p className="assesmntresult_question">
                          {answer.question}
                        </p>

                        <div className="assesmntresult_selectedanswer_container">
                          {answer.options.map((optin) => (
                            <div
                              className={
                                optin.value === answer.correct_answer &&
                                answer.correct_answer === answer.selected_option
                                  ? "assesmntresult_correctselectoptionContainer"
                                  : optin.value === answer.correct_answer
                                  ? "assesmntresult_correctoptionContainer"
                                  : optin.value === answer.selected_option
                                  ? "assesmntresult_wrongoptionContainer"
                                  : "assesmntresult_optionContainer"
                              }
                            >
                              {optin.value === answer.correct_answer &&
                              answer.correct_answer ===
                                answer.selected_option ? (
                                <PiCheckFatFill size={18} color="#4CAF50" />
                              ) : optin.value === answer.correct_answer ? (
                                ""
                              ) : optin.value === answer.selected_option ? (
                                <ImCross size={14} color="#dc3545" />
                              ) : (
                                ""
                              )}
                              <p style={{ width: "60%" }}>{optin.value}</p>

                              {optin.value === answer.correct_answer &&
                              answer.correct_answer ===
                                answer.selected_option ? (
                                <div className="assesmntresult_youranswerContainer">
                                  <p>Candidate answer</p>
                                </div>
                              ) : optin.value === answer.selected_option ? (
                                <div className="assesmntresult_youranswerContainer">
                                  <p>Candidate answer</p>
                                </div>
                              ) : optin.value === answer.correct_answer ? (
                                <div className="assesmntresult_youranswerContainer">
                                  <p>Correct answer</p>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                          <p className="assesmntresult_mark">
                            Mark:{" "}
                            <span
                              style={{
                                fontWeight: 600,
                                color: answer.mark === 1 ? "green" : "red",
                              }}
                            >
                              {answer.mark}
                            </span>
                          </p>
                        </div>
                      </div>
                      {/* Optional: render answer.question or similar here */}

                      {i === lastIndex ? (
                        ""
                      ) : (
                        <Divider className="assesmntresult_divider" />
                      )}
                    </div>
                  );
                })}
              </div>
            ),
          };
        });
        console.log("update answerItem", addChildren);
        setAnswersData(addChildren);
      } else {
        setAnswersData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedRow = (row) => {
    console.log("selected rowwww", row);
    const keys = row.map((item) => item.id); // or your unique row key
    setSelectedRowKeys(keys);
    setSelectedRows(row);
  };

  const checkCandidateRegisterInPlacement = (key) => {
    console.log("selected rowssss", selectedRows);
    if (selectedRows.length >= 1) {
      const filterPlacementCandidates = selectedRows.filter(
        (f) => f.is_placement_registered === 1
      );
      setPlacementRegisteredCandidates(filterPlacementCandidates);
      const filterNonPlacementCandidates = selectedRows.filter(
        (f) => f.is_placement_registered === 0
      );

      setNonPlacementRegisteredCandidates(filterNonPlacementCandidates);

      if (filterNonPlacementCandidates.length >= 1) {
        setMailConfirmModal(true);
        // CommonToaster("Select Only Placement Registered Candidates");
      } else {
        if (key === "1") {
          setQuestionTypeModal(true);
        } else {
          setSchedulerModal(true);
        }
      }
    } else {
      setSelectedRows([]);
      CommonToaster("Please select candidate");
    }
  };

  const handleDownloadResult = async () => {
    const columns = [
      { title: "Name", dataIndex: "name" },
      { title: "Branch", dataIndex: "branch" },
      { title: "Course Name", dataIndex: "course_name" },
      { title: "Test Attempt Date", dataIndex: "attempt_date" },
      { title: "Test Attempt Number", dataIndex: "attempt_number" },
      { title: "Question Type", dataIndex: "question_type" },
      { title: "Total Questions", dataIndex: "totalnumberof_questions" },
      { title: "Attempted Questions", dataIndex: "total_questions" },
      { title: "Percentage", dataIndex: "percentage" },
    ];
    if (selectedRows.length >= 1) {
      console.log("sell", selectedRows);
      let userIds = [];
      selectedRows.map((item) => {
        userIds.push(item.id);
      });

      const payload = {
        ids: userIds,
      };
      try {
        const response = await downloadResult(payload);
        const result = response?.data?.data || [];
        console.log("result response", result);
        DownloadTableAsCSV(result, columns, "Assessment Result.csv");
        setSelectedRows([]);
        setSelectedRowKeys([]);
      } catch (error) {
        console.log("error", error);
      }
    } else {
      CommonToaster("Please select candidate");
    }
  };

  const handleSendInterviewRequest = async () => {
    const today = new Date();
    setValidationTrigger(true);
    const typeValidate = selectValidator(questionType);

    setQuestionTypeError(typeValidate);

    if (typeValidate) return;

    setRequestLoading(true);
    const filterData = placementRegisteredCandidates.map((item) => {
      return {
        id: item.id,
        course_id: item.course_id,
        question_type_id: questionType,
        created_date: moment(today).format("YYYY-MM-DD HH:mm:ss"),
      };
    });
    const payload = {
      users: filterData,
    };
    console.log("payloaddd", payload);
    try {
      await sendInterviewRequest(payload);
      setSelectedRows([]);
      setSelectedRowKeys([]);
      setPlacementRegisteredCandidates([]);
      setNonPlacementRegisteredCandidates([]);
      CommonToaster("Request sent to email successfully!");
    } catch (error) {
      formReset();
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        formReset();
        getCandidatesData(
          branchId,
          courseId,
          selectedDates.length >= 1 ? selectedDates[0] : null,
          selectedDates.length >= 1 ? selectedDates[1] : null
        );
      }, 500);
    }
  };

  const formReset = () => {
    setRequestLoading(false);
    setQuestionTypeModal(false);
    setQuestionType("");
    setQuestionTypeError("");
    setValidationTrigger(false);
    setMailConfirmModal(false);
    setSchedulerModal(false);
    setEventName("");
    setEventNameError("");
    setScheduleDate(null);
    setScheduleDateError("");
    setScheduleTime(null);
    setScheduleTimeError("");
  };

  // onchange functions
  const handleSearch = (e) => {
    console.log("search", e.target.value);
    setNameSearch(e.target.value);
    getCandidatesData(
      e.target.value,
      branchId,
      courseId,
      selectedDates.length >= 1 ? selectedDates[0] : null,
      selectedDates.length >= 1 ? selectedDates[1] : null
    );
  };

  const handleBranchFilter = (value) => {
    setBranchId(value);
    getCandidatesData(
      nameSearch,
      value,
      courseId,
      selectedDates.length >= 1 ? selectedDates[0] : null,
      selectedDates.length >= 1 ? selectedDates[1] : null
    );
  };

  const handleCourseFilter = (value) => {
    setCourseId(value);
    getCandidatesData(
      nameSearch,
      branchId,
      value,
      selectedDates.length >= 1 ? selectedDates[0] : null,
      selectedDates.length >= 1 ? selectedDates[1] : null
    );
  };

  const handleDateChange = (dates, dateStrings) => {
    setSelectedDates(dateStrings);
    const startDate = dateStrings[0];
    const endDate = dateStrings[1];
    if (dateStrings[0] != "" && dateStrings[1] != "") {
      getCandidatesData(nameSearch, branchId, courseId, startDate, endDate);
    } else {
      getCandidatesData(nameSearch, branchId, courseId, null, null);
    }
  };

  const handleMenuClick = (info) => {
    console.log("Clicked item:", info.key);
    setRequestKey(info.key);

    checkCandidateRegisterInPlacement(info.key);
  };

  const formatDateTimeIST = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 24-hour format
      timeZone: "Asia/Kolkata", // IST timezone
    })
      .format(date)
      .replace(",", ""); // Remove comma
  };

  const convertToBackendFormat = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/");
    return `${year}-${month}-${day} ${timePart}`;
  };

  const handleLinkScheduleTime = (time) => {
    setScheduleTime(time);
    if (validationTrigger) {
      setScheduleTimeError(selectValidator(time));
    }
  };

  const handleScheduleAssessment = async () => {
    setValidationTrigger(true);
    const scheduleNameValidate = addressValidator(eventName);
    const scheduleDateValidate = selectValidator(scheduleDate);
    const scheduleTimeValidate = selectValidator(scheduleTime);
    const questionTypeValidate = selectValidator(questionType);

    setEventNameError(scheduleNameValidate);
    setScheduleDateError(scheduleDateValidate);
    setScheduleTimeError(scheduleTimeValidate);
    setQuestionTypeError(questionTypeValidate);

    if (
      scheduleNameValidate ||
      scheduleTimeValidate ||
      questionTypeValidate ||
      scheduleDateValidate
    )
      return;

    const formatTime = formatDateTimeIST(scheduleTime);
    const sendTimeFormat = convertToBackendFormat(formatTime);
    console.log(sendTimeFormat, "sendFormat");

    const filterData = placementRegisteredCandidates.map((item) => {
      return {
        user_id: item.id,
        course_id: item.course_id,
      };
    });
    const payload = {
      users: filterData,
      schedule_date: moment(scheduleDate).format("YYYY-MM-DD"),
      schedule_time: moment(sendTimeFormat).format("HH:mm:ss"),
      question_type_id: questionType,
      name: eventName,
      total_users: filterData.length,
    };

    try {
      const response = await scheduleAssessment(payload);
      console.log(response);
      CommonToaster("Assessment Scheduled");
      setSelectedRows([]);
      setSelectedRowKeys([]);
      setPlacementRegisteredCandidates([]);
      setNonPlacementRegisteredCandidates([]);
      formReset();
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  return (
    <div>
      <Row>
        <Col xs={24} sm={24} md={24} lg={12}>
          <p className="portal_mainheadings">
            Candidates{" "}
            <span style={{ fontSize: "22px" }}>{`( ${data.length} )`}</span>
          </p>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: "4px",
            gap: "12px",
          }}
        >
          {/* <button
            className="candidate_sendrequestbutton"
            onClick={checkCandidateRegisterInPlacement}
          >
            <IoIosSend size={19} style={{ marginRight: "4px" }} />
            Send Interview Request
          </button> */}

          <button
            className="candidate_downloadresultbutton"
            onClick={handleDownloadResult}
          >
            <CgSoftwareDownload size={19} style={{ marginRight: "4px" }} />
            Download Result
          </button>

          <Space direction="vertical">
            <Space wrap>
              <Dropdown
                menu={{ items: items, onClick: handleMenuClick }}
                placement="bottomLeft"
                arrow={{ pointAtCenter: true }}
                // popupRender={() => <CustomDropdownContent />}
                trigger={["click"]}
              >
                <div className="candidate_assmnt_request_container">
                  <HiDotsVertical size={17} />
                </div>
              </Dropdown>
            </Space>
          </Space>
        </Col>
      </Row>

      <Row style={{ marginTop: "22px" }}>
        <Col xs={24} sm={24} md={24} lg={20}>
          <div className="questionupload_filterContainer">
            <div style={{ position: "relative", width: "36%" }}>
              <PortalInputField
                placeholder={
                  filterValue === 1
                    ? "Search by name"
                    : filterValue === 2
                    ? "Search by email"
                    : "Search by mobile"
                }
                value={nameSearch}
                prefix={false}
                suffix={false}
                className="candidates_searchinput"
                onChange={handleSearch}
                hideError={true}
              />{" "}
              {nameSearch === "" || nameSearch === null ? (
                ""
              ) : (
                <div
                  className="candidates_filter_closeIconContainer"
                  onClick={() => {
                    setNameSearch(null);
                    getCandidatesData(
                      null,
                      branchId,
                      courseId,
                      selectedDates.length >= 1 ? selectedDates[0] : null,
                      selectedDates.length >= 1 ? selectedDates[1] : null
                    );
                  }}
                >
                  <IoIosClose size={11} />
                </div>
              )}
              <div
                className="candidates_filterIconContainer"
                onClick={() => setFilterModal(true)}
              >
                <LuListFilter size={18} />
              </div>
            </div>
            <PortalSelectField
              options={branchOptions}
              style={{ width: "28%" }}
              placeholder="Select Branch"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              onChange={handleBranchFilter}
              value={branchId}
              hideError={true}
            />
            <PortalSelectField
              options={courseOptions}
              style={{ width: "30%" }}
              placeholder="Select Course"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              onChange={handleCourseFilter}
              value={courseId}
              hideError={true}
            />
            {/* <CommonDoubleDatePicker /> */}
            <PortalDoubleDatePicker
              style={{ width: "40%" }}
              value={selectedDates}
              onChange={handleDateChange}
            />
          </div>
        </Col>
      </Row>

      <div style={{ marginTop: "22px" }}>
        <CommonTable
          scroll={{ x: 1950 }}
          columns={columns}
          dataSource={data}
          dataPerPage={10}
          loading={tableLoading}
          checkBox="true"
          size="small"
          className="questionupload_table"
          selectedDatas={handleSelectedRow}
          selectedRowKeys={selectedRowKeys}
        />
      </div>

      <Drawer
        title="Result"
        open={resultDrawer}
        onClose={() => {
          setResultDrawer(false);
          setCandidateName("");
          setCandidateCourse("");
          setCandidateBranch("");
          setCollapseDefaultKey(["1"]);
        }}
        width="45%"
        closable
      >
        <Row style={{ padding: "0px 16px" }}>
          <Col span={12}>
            <p>
              Name: <span style={{ fontWeight: 600 }}>{candidateName}</span>
            </p>
          </Col>
          <Col span={12}>
            <p>
              Branch: <span style={{ fontWeight: 600 }}>{candidateBranch}</span>
            </p>
          </Col>
        </Row>

        <Row style={{ marginTop: "12px", padding: "0px 16px" }}>
          <Col span={12}>
            <p>
              Course: <span style={{ fontWeight: 600 }}>{candidateCourse}</span>
            </p>
          </Col>
        </Row>
        {answersData.length >= 1 ? (
          <Collapse
            className="assesmntresult_collapse"
            items={answersData}
            activeKey={collapseDefaultKey}
            onChange={(keys) => {
              setCollapseDefaultKey(keys);
              console.log("keyyyy", keys);
            }}
          ></Collapse>
        ) : (
          <CommonNodataFound title="No result found" />
        )}
      </Drawer>

      {/* question type modal */}
      <Modal
        open={questionTypeModal}
        onCancel={formReset}
        title="Select Question Type"
        width={500}
        footer={[
          <div className="courses_addtopicmodal_footerContainer">
            {requestLoading ? (
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
                onClick={handleSendInterviewRequest}
              >
                Submit
              </Button>
            )}
          </div>,
        ]}
      >
        <div style={{ marginTop: "20px" }}>
          <PortalSelectField
            label="Type"
            options={typeData}
            mandatory={true}
            value={questionType}
            onChange={(value) => {
              setQuestionType(value);
              if (validationTrigger) {
                setQuestionTypeError(selectValidator(value));
              }
            }}
            error={questionTypeError}
          />
        </div>
      </Modal>

      {/* mail confirm modal */}
      <Modal
        open={mailConfirmModal}
        onCancel={formReset}
        title="Confirm Mail Sending"
        footer={false}
        width={500}
      >
        <div className="questionupload_deletemodalContainer">
          <div className="interview_confirmmodal_iconContainer">
            <PiWarningCircleFill size={20} color="#fabb00" />
          </div>

          <p className="question_deletemodal_confirmdeletetext">
            Confirm Mail Sending
          </p>

          <p className="interview_confirmmail_text">
            You have selected{" "}
            <span style={{ fontWeight: 600, color: "#0056b3" }}>
              {placementRegisteredCandidates.length} placement-registered
            </span>{" "}
            candidates and{" "}
            <span style={{ fontWeight: 600, color: "rgb(227 47 47)" }}>
              {nonPlacementRegisteredCandidates.length} non-placement-registered
            </span>{" "}
            candidates.
          </p>

          <p className="interview_suremail_text">
            Are you sure you want to send the mail only to the{" "}
            <span style={{ fontWeight: 600, color: "#0056b3" }}>
              {placementRegisteredCandidates.length} placement-registered
            </span>{" "}
            candidates?
          </p>

          <div className="question_deletemodal_footerContainer">
            <Button
              className="question_deletemodal_cancelbutton"
              onClick={() => {
                setMailConfirmModal(false);
              }}
            >
              No
            </Button>
            <Button
              className="interview_confirmmodal_sendbutton"
              onClick={() => {
                setMailConfirmModal(false);
                if (requestKey === "1") {
                  setQuestionTypeModal(true);
                } else {
                  setSchedulerModal(true);
                }
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>

      {/* filter modal */}
      <Modal
        open={filterModal}
        onCancel={() => setFilterModal(false)}
        title="Filter"
        footer={false}
        width={440}
      >
        <Radio.Group
          onChange={(e) => {
            setFilterValue(e.target.value);
            setFilterModal(false);
            setNameSearch(null);
            if (nameSearch === "" || nameSearch === null) {
              return;
            }
            getCandidatesData(
              null,
              branchId,
              courseId,
              selectedDates.length >= 1 ? selectedDates[0] : null,
              selectedDates.length >= 1 ? selectedDates[1] : null
            );
          }}
          value={filterValue}
        >
          <Row className="candidates_filter_radioContainer">
            <Col span={12}>
              <Radio value={1}>Search by name</Radio>
            </Col>
            <Col span={12}>
              <Radio value={2}>Search by email</Radio>
            </Col>
            <Col span={12} style={{ marginTop: "18px" }}>
              <Radio value={3}>Search by mobile</Radio>
            </Col>
          </Row>
        </Radio.Group>
      </Modal>

      {/* scheduler modal */}
      <Modal
        open={schedulerModal}
        onCancel={formReset}
        title="Schedule"
        width={500}
        footer={[
          <div className="courses_addtopicmodal_footerContainer">
            {tableLoading ? (
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
                onClick={handleScheduleAssessment}
              >
                Submit
              </Button>
            )}
          </div>,
        ]}
      >
        <PortalInputField
          label="Name"
          mandatory={true}
          onChange={(e) => {
            setEventName(e.target.value);
            if (validationTrigger) {
              setEventNameError(addressValidator(e.target.value));
            }
          }}
          value={eventName}
          error={eventNameError}
        />

        <div style={{ marginTop: "22px" }}>
          <PortalDatePicker
            label="Link Send Date"
            mandatory={true}
            value={scheduleDate}
            onChange={(value) => {
              setScheduleDate(value);
              if (validationTrigger) {
                setScheduleDateError(selectValidator(value));
              }
            }}
            error={scheduleDateError}
          />
        </div>

        <div style={{ marginTop: "22px" }}>
          <CommonTimePicker
            label="Link Send Time"
            onChange={handleLinkScheduleTime}
            value={scheduleTime}
            error={scheduleTimeError}
            mandatory
          />
        </div>
        <div style={{ marginTop: "22px", marginBottom: "20px" }}>
          <PortalSelectField
            label="Type"
            options={typeData}
            mandatory={true}
            value={questionType}
            onChange={(value) => {
              setQuestionType(value);
              if (validationTrigger) {
                setQuestionTypeError(selectValidator(value));
              }
            }}
            error={questionTypeError}
          />
        </div>
      </Modal>
    </div>
  );
}

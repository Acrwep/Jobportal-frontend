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
import { addressValidator, selectValidator } from "../Common/Validation";
import PortalInputField from "../Common/PortalInputField";
import { MdDelete } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import DownloadTableAsCSV from "../Common/DownloadTableAsCSV";
const { Search } = Input;

export default function Candidates() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
        getCandidatesData(null, null);
      }, 300);
    }
  };

  const getCandidatesData = async (branchid, courseid, fromDate, toDate) => {
    setTableLoading(true);
    const payload = {
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
                              <p>{optin.value}</p>

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

  const checkCandidateRegisterInPlacement = () => {
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
        setQuestionTypeModal(true);
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
  };

  // onchange functions
  const handleBranchFilter = (value) => {
    setBranchId(value);
    getCandidatesData(
      value,
      courseId,
      selectedDates.length >= 1 ? selectedDates[0] : null,
      selectedDates.length >= 1 ? selectedDates[1] : null
    );
  };

  const handleCourseFilter = (value) => {
    setCourseId(value);
    getCandidatesData(
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
      getCandidatesData(branchId, courseId, startDate, endDate);
    } else {
      getCandidatesData(branchId, courseId, null, null);
    }
  };

  return (
    <div>
      <p className="portal_mainheadings">
        Candidates{" "}
        <span style={{ fontSize: "22px" }}>{`( ${data.length} )`}</span>
      </p>
      <Row style={{ marginTop: "22px" }}>
        <Col xs={24} sm={24} md={24} lg={14}>
          <div className="questionupload_filterContainer">
            <PortalSelectField
              options={branchOptions}
              style={{ width: "34%" }}
              placeholder="Select Branch"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              onChange={handleBranchFilter}
              value={branchId}
              hideError={true}
            />
            <PortalSelectField
              options={courseOptions}
              style={{ width: "34%" }}
              placeholder="Select Course"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              onChange={handleCourseFilter}
              value={courseId}
              hideError={true}
            />
            {/* <CommonDoubleDatePicker /> */}
            <PortalDoubleDatePicker
              value={selectedDates}
              onChange={handleDateChange}
            />
          </div>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={10}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            className="candidate_sendrequestbutton"
            onClick={checkCandidateRegisterInPlacement}
          >
            <IoIosSend size={19} style={{ marginRight: "4px" }} />
            Send Interview Request
          </button>

          <button
            className="candidate_downloadresultbutton"
            onClick={handleDownloadResult}
          >
            <IoIosSend size={19} style={{ marginRight: "4px" }} />
            Download Result
          </button>
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
                setQuestionTypeModal(true);
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  getAssessmentLogs,
  getCourses,
  getCoursesLocations,
  getFilterResults,
  getUserAnswers,
} from "../Common/action";
import moment from "moment";
import CommonTable from "../Common/CommonTable";
import { Row, Col, Divider, Tooltip, Drawer, Collapse } from "antd";
import { PiCheckFatFill } from "react-icons/pi";
import { ImCross } from "react-icons/im";
import { DownloadOutlined } from "@ant-design/icons";
import "./styles.css";
import { AiOutlineEye } from "react-icons/ai";
import { CgSoftwareDownload } from "react-icons/cg";
import PortalSelectField from "../Common/PortalSelectField";
import PortalDatePicker from "../Common/PortalDatePicker";
import DownloadTableAsCSV from "../Common/DownloadTableAsCSV";
import { CommonToaster } from "../Common/CommonToaster";
import CommonNodataFound from "../Common/CommonNodataFound";

export default function AssessmentsLogs() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [logData, setLogData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [date, setDate] = useState(null);
  const statusOptions = [
    { id: "Completed", name: "Completed" },
    { id: "Not Completed", name: "Not Completed" },
  ];
  const [status, setStatus] = useState(null);
  const [branchOptions, setBranchOptions] = useState([]);
  const [branchId, setBranchId] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [resultDrawer, setResultDrawer] = useState(false);
  const [collapseDefaultKey, setCollapseDefaultKey] = useState(["1"]);
  const [answersData, setAnswersData] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [candidateCourse, setCandidateCourse] = useState("");
  const [candidateBranch, setCandidateBranch] = useState("");

  const columns = [
    { title: "Name", key: "name", dataIndex: "name", width: 160 },
    { title: "Email", key: "email", dataIndex: "email", width: 240 },
    { title: "Branch", key: "branch", dataIndex: "branch", width: 130 },
    {
      title: "Course",
      key: "course_name",
      dataIndex: "course_name",
      width: 200,
    },
    {
      title: "Status",
      key: "is_completed",
      dataIndex: "is_completed",
      width: 160,
      render: (text, record) => {
        return (
          <div>
            <p>{text === 1 ? "Completed" : "Not Completed"}</p>
          </div>
        );
      },
    },
    {
      title: "Result",
      width: 100,
      fixed: "right",
      render: (text, record) => {
        return (
          <div
            className="assesmntresult_viewContainer"
            onClick={() =>
              getAnswersData(
                text.id,
                record.name,
                record.branch,
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
    const today = new Date();
    setDate(today);
    getBranchData();
  }, []);

  const getBranchData = async () => {
    try {
      const response = await getCoursesLocations();
      console.log("course response", response);
      if (response?.data?.data) {
        setBranchOptions(response?.data?.data);
      } else {
        setBranchOptions([]);
      }
    } catch (error) {
      setBranchOptions([]);
      console.log("branch error", error);
    } finally {
      setTimeout(() => {
        getCourseData();
      }, 300);
    }
  };

  const getCourseData = async () => {
    const today = new Date();
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
        getLogsData(today, null, null, null);
      }, 300);
    }
  };

  const getLogsData = async (
    requestDate,
    requestStatus,
    branchid,
    courseid
  ) => {
    setTableLoading(true);
    const payload = {
      date: moment(requestDate).format("YYYY-MM-DD"),
      ...(requestStatus && {
        is_completed: requestStatus === "Completed" ? 1 : 0,
      }),
      ...(branchid && { branch_id: branchid }),
      ...(courseid && { course_id: courseid }),
    };
    try {
      const response = await getAssessmentLogs(payload);
      console.log("logs response", response);
      const data = response?.data?.data || [];
      setLogData(data);
    } catch (error) {
      console.log("logs error", error);
    } finally {
      setTimeout(() => {
        setTableLoading(false);
      }, 300);
    }
  };

  const handleRequestDate = (value) => {
    setDate(value);
    getLogsData(value, status, branchId, courseId);
  };

  const handleStatus = (value) => {
    setStatus(value);
    getLogsData(date, value, branchId, courseId);
  };

  const handleBranchFilter = (value) => {
    setBranchId(value);
    getLogsData(date, status, value, courseId);
  };

  const handleCourseFilter = (value) => {
    setCourseId(value);
    getLogsData(date, status, branchId, value);
  };

  const handleSelectedRow = (row) => {
    console.log("selected rowwww", row);
    const keys = row.map((item) => item.id); // or your unique row key
    setSelectedRowKeys(keys);
    setSelectedRows(row);
  };

  const handleDownloadResult = async () => {
    const resultcolumns = [
      { title: "Name", dataIndex: "name" },
      { title: "Branch", dataIndex: "branch" },
      { title: "Course Name", dataIndex: "course_name" },
      { title: "Test Attempt Date", dataIndex: "attempt_date" },
      { title: "Test Attempt Number", dataIndex: "attempt_number" },
      { title: "Question Type", dataIndex: "question_type" },
      { title: "Total Questions", dataIndex: "totalnumberof_questions" },
      { title: "Attempted Questions", dataIndex: "total_questions" },
      { title: "Percentage", dataIndex: "percentage" },
      { title: "Status", dataIndex: "status" },
    ];

    if (selectedRows.length <= 0) {
      CommonToaster("Please select candidate");
      return;
    }
    let ids = [];
    selectedRows.map((item) => {
      ids.push(item.id);
    });
    console.log("idssss", ids);

    const payload = {
      ids: ids,
      date: moment(date).format("YYYY-MM-DD"),
    };

    try {
      const response = await getFilterResults(payload);
      const result = response?.data?.data || [];
      console.log("result response", result);
      DownloadTableAsCSV(
        result,
        resultcolumns,
        `Assessment Result ${moment(date).format("DD-MM-YYYY")}.csv`
      );
      setSelectedRows([]);
      setSelectedRowKeys([]);
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
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
      date: moment(date).format("YYYY-MM-DD"),
      user_id: userId,
    };
    try {
      const response = await getUserAnswers(payload);
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

  return (
    <div>
      <Row>
        <Col xs={24} sm={24} md={24} lg={12}>
          <p className="portal_mainheadings">
            Assessment Logs{" "}
            <span style={{ fontSize: "22px" }}>{`( ${logData.length} )`}</span>
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
          <button
            className="candidate_downloadresultbutton"
            onClick={handleDownloadResult}
          >
            <CgSoftwareDownload size={19} style={{ marginRight: "4px" }} />
            Download Result
          </button>
        </Col>
      </Row>

      <Row style={{ marginTop: "22px", alignItems: "center" }}>
        <Col xs={24} sm={24} md={24} lg={13}>
          <div className="questionupload_filterContainer">
            <PortalSelectField
              placeholder="Select status"
              selectClassName="questionupload_filterselectfield"
              options={statusOptions}
              value={status}
              onChange={handleStatus}
              allowClear={true}
              hideError={true}
              style={{ width: "35%" }}
            />
            <PortalSelectField
              options={branchOptions}
              style={{ width: "35%" }}
              placeholder="Select Branch"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              onChange={handleBranchFilter}
              value={branchId}
              hideError={true}
            />
            <PortalSelectField
              options={courseOptions}
              style={{ width: "36%" }}
              placeholder="Select Course"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              onChange={handleCourseFilter}
              value={courseId}
              hideError={true}
            />
          </div>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={11}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div style={{ width: "35%", height: "34px" }}>
            <PortalDatePicker value={date} onChange={handleRequestDate} />
          </div>
          <Tooltip placement="bottomLeft" title="Download Logs">
            <button
              className="logs_downloadbutton"
              onClick={() =>
                DownloadTableAsCSV(
                  logData,
                  columns,
                  `Assessment Logs ${moment(date).format("DD-MM-YYYY")}.csv`
                )
              }
            >
              <DownloadOutlined size={22} />
            </button>{" "}
          </Tooltip>
        </Col>
      </Row>
      <div style={{ marginTop: "22px" }}>
        <CommonTable
          scroll={{ x: 900 }}
          columns={columns}
          dataSource={logData}
          dataPerPage={10}
          loading={tableLoading}
          checkBox="true"
          size="small"
          className="questionupload_table"
          selectedDatas={handleSelectedRow}
          selectedRowKeys={selectedRowKeys}
        />
      </div>

      {/* result drawer */}
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
          <Col span={12}>
            {answersData.length <= 0 && (
              <p>
                Date:{" "}
                <span style={{ fontWeight: 600 }}>
                  {moment(date).format("DD-MM-YYYY")}
                </span>
              </p>
            )}
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
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Row, Col, Input, Spin, Drawer, Collapse, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import CommonTable from "../Common/CommonTable";
import { IoIosSend } from "react-icons/io";
import { CommonToaster } from "../Common/CommonToaster";
import {
  getAllUsers,
  getAssessmentAnswers,
  getCandidates,
  getCourses,
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
const { Search } = Input;

export default function Candidates() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
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
  const [answersData, setAnswersData] = useState([]);

  const columns = [
    { title: "Name", key: "name", dataIndex: "name", width: 200 },
    { title: "Email", key: "email", dataIndex: "email", width: 260 },
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
      render: (text, record) => {
        return (
          <div
            className="assesmntresult_viewContainer"
            onClick={() => getAnswersData(text.id)}
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
        setTableLoading(false);
      }, 500);
    }
  };

  const getAnswersData = async (userId) => {
    setResultDrawer(true);
    const payload = {
      user_id: userId,
    };
    try {
      const response = await getAssessmentAnswers(payload);
      const answers = response?.data?.data || [];
      console.log("answers response", response);
      if (answers.length >= 1) {
        const addChildren = answers.map((item, index) => {
          return {
            ...item,
            key: index + 1,
            label: `Attempt ${item.attempt_number}`,
            children: (
              <div>
                <Row style={{ marginBottom: "12px" }}>
                  <Col span={12}>
                    <p>
                      Date:{" "}
                      <span>
                        {moment(item.attempt_date).format("DD-MM-YYYY")}
                      </span>
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>Total Questions: {item.total_questions}</p>
                  </Col>
                </Row>

                <Row style={{ marginBottom: "20px" }}>
                  <Col span={12}>
                    <p>
                      Correct Answer: <span>{item.correct_answers}</span>
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      Percentage:{" "}
                      <span style={{ fontWeight: 600, color: "#0056b3" }}>
                        {item.percentage}%
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedRow = (row) => {
    console.log("selected rowwww", row);
    setSelectedRows(row);
  };

  const handleSendRequest = async () => {
    if (selectedRows.length >= 1) {
      setRequestLoading(true);
      const filterData = selectedRows.map((item) => {
        return { id: item.id, course_id: item.course_id };
      });
      const payload = {
        users: filterData,
      };
      console.log("payloaddd", payload);

      try {
        await sendInterviewRequest(payload);
        CommonToaster("Request sent to email successfully!");
      } catch (error) {
        CommonToaster(
          error?.response?.data?.message ||
            "Something went wrong. Try again later"
        );
      } finally {
        setTimeout(() => {
          setRequestLoading(false);
          getCandidatesData();
        }, 500);
      }
    } else {
      CommonToaster("Please select candidate");
    }
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
      <p className="portal_mainheadings">Candidates</p>

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
            />
            <PortalSelectField
              options={courseOptions}
              style={{ width: "34%" }}
              placeholder="Select Course"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              onChange={handleCourseFilter}
              value={courseId}
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
          }}
        >
          {requestLoading ? (
            <button className="candidate_disablesendrequestbutton">
              <>
                <Spin
                  size="small"
                  indicator={
                    <LoadingOutlined
                      style={{ color: "#ffffff", marginRight: "6px" }}
                      spin
                    />
                  }
                />{" "}
              </>
            </button>
          ) : (
            <button
              className="candidate_sendrequestbutton"
              onClick={handleSendRequest}
            >
              <IoIosSend size={19} style={{ marginRight: "4px" }} />
              Send Interview Request
            </button>
          )}
        </Col>
      </Row>

      <div style={{ marginTop: "22px" }}>
        <CommonTable
          scroll={{ x: 1600 }}
          columns={columns}
          dataSource={data}
          dataPerPage={10}
          loading={tableLoading}
          checkBox="true"
          size="small"
          className="questionupload_table"
          selectedDatas={handleSelectedRow}
        />
      </div>

      <Drawer
        title="Result"
        open={resultDrawer}
        onClose={() => setResultDrawer(false)}
        width="45%"
        closable
      >
        {answersData.length >= 1 ? (
          <Collapse
            className="assesmntresult_collapse"
            items={answersData}
            defaultActiveKey={["1"]}
          ></Collapse>
        ) : (
          <CommonNodataFound title="No result found" />
        )}
      </Drawer>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "./styles.css";
import { Col, Drawer, Row, Spin } from "antd";
import CommonInputField from "../Common/CommonInputField";
import PortalInputField from "../Common/PortalInputField";
import { MdFileUpload } from "react-icons/md";
import {
  createOptionsForQuestion,
  createQuestion,
  getCourses,
  getQuestions,
  getSections,
  updateQuestion,
} from "../Common/action";
import PortalSelectField from "../Common/PortalSelectField";
import { addressValidator, selectValidator } from "../Common/Validation";
import { CommonToaster } from "../Common/CommonToaster";
import { LoadingOutlined } from "@ant-design/icons";
import { AiTwotoneEdit } from "react-icons/ai";
import CommonTable from "../Common/CommonTable";
import { RiDeleteBinLine } from "react-icons/ri";

export default function QuestionUpload() {
  const [open, setOpen] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState(null);
  const [questionError, setQuestionError] = useState("");
  const [optionOne, setOptionOne] = useState("");
  const [optionOneError, setOptionOneError] = useState("");
  const [optionTwo, setOptionTwo] = useState("");
  const [optionTwoError, setOptionTwoError] = useState("");
  const [optionThree, setOptionThree] = useState("");
  const [optionThreeError, setOptionThreeError] = useState("");
  const [optionFour, setOptionFour] = useState("");
  const [optionFourError, setOptionFourError] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [correctAnswerError, setCorrectAnswerError] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const [sectionId, setSectionId] = useState(null);
  const [sectionIdError, setSectionIdError] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [courseIdError, setCourseIdError] = useState(null);
  const [disableCourse, setDisableCourse] = useState(false);
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  const columns = [
    { title: "Question", key: "question", dataIndex: "question", width: 280 },
    { title: "Option A", key: "option_a", dataIndex: "option_a", width: 190 },
    { title: "Option B", key: "option_b", dataIndex: "option_b", width: 190 },
    { title: "Option C", key: "option_c", dataIndex: "option_c", width: 190 },
    { title: "Option C", key: "option_d", dataIndex: "option_d", width: 190 },
    {
      title: "Correct Answer",
      key: "correct_answer",
      dataIndex: "correct_answer",
      width: 190,
    },
    {
      title: "Section",
      key: "section_name",
      dataIndex: "section_name",
      width: 180,
    },
    {
      title: "Course",
      key: "course_name",
      dataIndex: "course_name",
      width: 200,
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      width: 120,
      fixed: "right",
      render: (item, record) => {
        return (
          <div className="questionupload_table_actionContainer">
            <div>
              <AiTwotoneEdit
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => handleEdit(record)}
              />
            </div>
            <RiDeleteBinLine
              size={20}
              color="#d32215"
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getSectionsData();
  }, []);

  const getSectionsData = async () => {
    try {
      const response = await getSections();
      console.log("sections response", response);
      if (response?.data?.data) {
        setSectionData(response?.data?.data);
      } else {
        setSectionData([]);
      }
    } catch (error) {
      setSectionData([]);
      console.log("section error", error);
    } finally {
      setTimeout(() => {
        getCourseData();
      }, 300);
    }
  };

  const getCourseData = async () => {
    try {
      const response = await getCourses();
      console.log("course response", response);
      if (response?.data?.data) {
        setCourseData(response?.data?.data);
      } else {
        setCourseData([]);
      }
    } catch (error) {
      setCourseData([]);
      console.log("course error", error);
    } finally {
      setTimeout(() => {
        getQuestionsData();
      }, 300);
    }
  };

  const getQuestionsData = async () => {
    setTableLoading(true);
    try {
      const response = await getQuestions();
      console.log("questions", response);
      const questionsdata = response?.data?.data || [];
      setQuestionsData(questionsdata);
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        setTableLoading(false);
      }, 300);
    }
  };

  //onchange functions
  const handleCorrectAnswer = (event) => {
    const value = event.target.value;
    setCorrectAnswer(value);

    if (validationTrigger) {
      if (value === "") {
        setCorrectAnswerError(" is required");
      } else if (
        value != optionOne &&
        value != optionTwo &&
        value != optionThree &&
        value != optionFour
      ) {
        setCorrectAnswerError(" must be with in options");
      } else {
        setCorrectAnswerError("");
      }
    }
  };

  const handleEdit = (record) => {
    setOpen(true);
    setEdit(true);
    setQuestionId(record.question_id);
    setQuestion(record.question);
    setOptionOne(record.option_a);
    setOptionTwo(record.option_b);
    setOptionThree(record.option_c);
    setOptionFour(record.option_d);
    setCorrectAnswer(record.correct_answer);
    setSectionId(record.section_id);
    setCourseId(record.course_id);
    if (record.section_id) {
      setDisableCourse(true);
    }
  };

  //form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationTrigger(true);
    const questionvalidate = addressValidator(question);
    const optionOneValidate = addressValidator(optionOne);
    const optionTwoValidate = addressValidator(optionTwo);
    const optionThreeValidate = addressValidator(optionThree);
    const optionFourValidate = addressValidator(optionFour);
    const sectionValidate = selectValidator(sectionId);
    let courseValidate = "";
    let correctAnswerValidate = "";

    if (correctAnswer === "") {
      correctAnswerValidate = " is required";
    } else if (
      correctAnswer != optionOne &&
      correctAnswer != optionTwo &&
      correctAnswer != optionThree &&
      correctAnswer != optionFour
    ) {
      correctAnswerValidate = " must be with in options";
    } else {
      correctAnswerValidate = "";
    }

    if (sectionId === 1) {
      setDisableCourse(true);
      courseValidate = "";
    } else {
      setDisableCourse(false);
      courseValidate = selectValidator(courseId);
    }

    setQuestionError(questionvalidate);
    setOptionOneError(optionOneValidate);
    setOptionTwoError(optionTwoValidate);
    setOptionThreeError(optionThreeValidate);
    setOptionFourError(optionFourValidate);
    setCorrectAnswerError(correctAnswerValidate);
    setSectionIdError(sectionValidate);
    setCourseIdError(courseValidate);

    if (
      questionvalidate ||
      optionOneValidate ||
      optionTwoValidate ||
      optionThreeValidate ||
      optionFourValidate ||
      correctAnswerValidate ||
      sectionValidate ||
      courseValidate
    )
      return;

    setButtonLoading(true);
    const payload = {
      ...(edit && { id: questionId }),
      question: question,
      option_a: optionOne,
      option_b: optionTwo,
      option_c: optionThree,
      option_d: optionFour,
      correct_answer: correctAnswer,
      section_id: sectionId,
      course_id: courseId,
    };

    if (edit) {
      try {
        await updateQuestion(payload);
        CommonToaster("Question updated");
        setTableLoading(true);
        setTimeout(() => {
          getQuestionsData();
          formReset();
        }, 300);
      } catch (error) {
        setButtonLoading(false);
        CommonToaster(
          error?.response?.data?.message ||
            "Something went wrong. Try again later"
        );
      }
    } else {
      try {
        await createQuestion(payload);
        CommonToaster("Question created");
        setTableLoading(true);

        setTimeout(() => {
          getQuestionsData();
          formReset();
        }, 300);
      } catch (error) {
        setButtonLoading(false);
        CommonToaster(
          error?.response?.data?.message ||
            "Something went wrong. Try again later"
        );
      }
    }
  };

  const createOptions = async (questionId) => {
    let optionsData = [];
    optionsData.push(optionOne, optionTwo, optionThree, optionFour);
    console.log(optionsData);

    const payload = {
      question_id: questionId,
      options: optionsData,
    };

    try {
      const response = await createOptionsForQuestion(payload);
      console.log("options upload response", response);
      CommonToaster("Question uploaded");
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      formReset();
    }
  };

  const formReset = () => {
    setButtonLoading(false);
    setOpen(false);
    setEdit(false);
    setValidationTrigger(false);
    setQuestion("");
    setQuestionId(null);
    setQuestionError("");
    setOptionOne("");
    setOptionOneError("");
    setOptionTwo("");
    setOptionTwoError("");
    setOptionThree("");
    setOptionThreeError("");
    setOptionFour("");
    setOptionFourError("");
    setCorrectAnswer("");
    setCorrectAnswerError("");
    setSectionId(null);
    setSectionIdError("");
    setCourseId(null);
    setCourseIdError("");
    setDisableCourse(false);
  };

  return (
    <div>
      <div className="portal_headinContainer">
        <p className="portal_mainheadings">Questions</p>
        <button className="questionupload_button" onClick={() => setOpen(true)}>
          <MdFileUpload size={19} style={{ marginRight: "4px" }} />
          Upload
        </button>
      </div>
      <div style={{ marginTop: "22px" }}>
        <CommonTable
          scroll={{ x: 1200 }}
          columns={columns}
          dataSource={questionsData}
          dataPerPage={10}
          loading={tableLoading}
          checkBox="false"
          size="small"
          className="questionupload_table"
        />
      </div>

      <Drawer
        open={open}
        onClose={formReset}
        width="45%"
        title={edit ? "Update Question" : "Create Question"}
        closable
      >
        <form>
          <Row>
            <Col span={24}>
              <PortalInputField
                label="Question"
                value={question}
                onChange={(event) => {
                  setQuestion(event.target.value);
                  if (validationTrigger) {
                    setQuestionError(addressValidator(event.target.value));
                  }
                }}
                error={questionError}
              />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: "22px" }}>
            <Col span={12}>
              <PortalInputField
                label="Option 1"
                value={optionOne}
                onChange={(event) => {
                  setOptionOne(event.target.value);
                  if (validationTrigger) {
                    setOptionOneError(addressValidator(event.target.value));
                  }
                }}
                error={optionOneError}
              />
            </Col>
            <Col span={12}>
              <PortalInputField
                label="Option 2"
                value={optionTwo}
                onChange={(event) => {
                  setOptionTwo(event.target.value);
                  if (validationTrigger) {
                    setOptionTwoError(addressValidator(event.target.value));
                  }
                }}
                error={optionTwoError}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: "22px" }}>
            <Col span={12}>
              <PortalInputField
                label="Option 3"
                value={optionThree}
                onChange={(event) => {
                  setOptionThree(event.target.value);
                  if (validationTrigger) {
                    setOptionThreeError(addressValidator(event.target.value));
                  }
                }}
                error={optionThreeError}
              />
            </Col>
            <Col span={12}>
              <PortalInputField
                label="Option 4"
                value={optionFour}
                onChange={(event) => {
                  setOptionFour(event.target.value);
                  if (validationTrigger) {
                    setOptionFourError(addressValidator(event.target.value));
                  }
                }}
                error={optionFourError}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: "22px" }}>
            <Col span={12}>
              <PortalInputField
                label="Correct Answer"
                value={correctAnswer}
                onChange={handleCorrectAnswer}
                error={correctAnswerError}
              />
            </Col>
            <Col span={12}>
              <PortalSelectField
                label="Section"
                options={sectionData}
                value={sectionId}
                onChange={(value) => {
                  setSectionId(value);

                  if (validationTrigger) {
                    setSectionIdError(selectValidator(value));
                  }

                  if (value === 1) {
                    setCourseId(null);
                    setDisableCourse(true);
                    setCourseIdError("");
                  } else {
                    setDisableCourse(false);
                  }
                }}
                error={sectionIdError}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: "22px" }}>
            <Col span={12}>
              <PortalSelectField
                label="Course"
                labelClassName={
                  disableCourse
                    ? "questionupload_coursefieldlabel_inactive"
                    : "questionupload_coursefieldlabel_active"
                }
                options={courseData}
                value={courseId}
                onChange={(value) => {
                  setCourseId(value);
                  if (validationTrigger) {
                    setCourseIdError(selectValidator(value));
                  }
                }}
                error={courseIdError}
                disabled={disableCourse}
              />
            </Col>
            <Col span={12}></Col>
          </Row>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {buttonLoading ? (
              <button
                className="questionupload_disablesubmitbutton"
                onClick={(e) => e.preventDefault()}
              >
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
                  Loading...
                </>
              </button>
            ) : (
              <button
                className="questionupload_submitbutton"
                onClick={handleSubmit}
                type="submit"
              >
                Submit
              </button>
            )}
          </div>

          {/* <button onClick={createOptions}>Check</button> */}
        </form>
      </Drawer>
    </div>
  );
}

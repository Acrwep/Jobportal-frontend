import React, { useEffect, useState } from "react";
import "./styles.css";
import CommonMuiTable from "../Common/CommonMuiTable";
import { Button } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Col, Drawer, Row } from "antd";
import CommonInputField from "../Common/CommonInputField";
import PortalInputField from "../Common/PortalInputField";
import { MdFileUpload } from "react-icons/md";
import { getCourses, getSections } from "../Common/action";
import PortalSelectField from "../Common/PortalSelectField";
import { addressValidator, selectValidator } from "../Common/Validation";

export default function QuestionUpload() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
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

  const columns = [
    { key: "question", label: "Question", width: 280 },
    { key: "option1", label: "Option 1", width: 190 },
    { key: "option2", label: "Option 2", width: 190 },
    { key: "option3", label: "Option 3", width: 190 },
    { key: "correctAnswer", label: "Correct Answer", width: 190 },
    { key: "category", label: "Category", width: 120 },
  ];

  const rows = [
    {
      question: "What is React",
      option1: "A Backend Framework",
      option2: "A Database Management System",
      option3: "A JavaScript Library",
      correctAnswer: "A JavaScript Library",
      category: "Set 1",
    },
    {
      question: "What is React",
      option1: "A Backend Framework",
      option2: "A Database Management System",
      option3: "A JavaScript Library",
      correctAnswer: "A JavaScript Library",
      category: "Set 2",
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
      setTimeout(() => {}, 300);
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

  //form submit
  const handleSubmit = (e) => {
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

    alert("success");
  };

  const formReset = () => {
    setOpen(false);
    setValidationTrigger(false);
    setQuestion("");
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
        <CommonMuiTable tableWidth={1400} columns={columns} rows={rows} />
      </div>

      <Drawer
        open={open}
        onClose={formReset}
        width="45%"
        title="Create Question"
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
            <button
              variant="contained"
              className="questionupload_submitbutton"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

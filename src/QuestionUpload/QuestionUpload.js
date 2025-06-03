import React, { useEffect, useState } from "react";
import "./styles.css";
import { Button, Col, Drawer, Modal, Row, Spin, Upload } from "antd";
import CommonInputField from "../Common/CommonInputField";
import PortalInputField from "../Common/PortalInputField";
import { MdFileUpload } from "react-icons/md";
import {
  createOptionsForQuestion,
  createQuestion,
  deleteQuestion,
  getCourseByTrainers,
  getCourses,
  getQuestions,
  getSections,
  questionsBulkUpload,
  updateQuestion,
} from "../Common/action";
import PortalSelectField from "../Common/PortalSelectField";
import {
  addressValidator,
  mobileValidator,
  selectValidator,
} from "../Common/Validation";
import { CommonToaster } from "../Common/CommonToaster";
import { LoadingOutlined } from "@ant-design/icons";
import { AiTwotoneEdit } from "react-icons/ai";
import CommonTable from "../Common/CommonTable";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import ExcelLogo from "../images/excel_logo.png";
import { IoCloseCircleOutline } from "react-icons/io5";
import * as XLSX from "xlsx";

const { Dragger } = Upload;

export default function QuestionUpload() {
  const [open, setOpen] = useState(false);
  const [bulkUploadModal, setBulkUploadModal] = useState(false);
  const [bulkUploadErrorModal, setBulkUploadErrorModal] = useState(false);
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
  const [sectionFilterId, setSectionFilterId] = useState(null);
  const [sectionIdError, setSectionIdError] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [courseFilterId, setCourseFilterId] = useState(null);
  const [courseIdError, setCourseIdError] = useState(null);
  const [disableCourse, setDisableCourse] = useState(false);
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [xlsxArray, setXlsxArray] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [excelErrors, setExcelErrors] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

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
                onClick={() => handleEdit(record)}
                className="questionupload_actionicons"
              />
            </div>
            <RiDeleteBinLine
              size={20}
              color="#d32215"
              className="questionupload_actionicons"
              onClick={() => {
                setDeleteModal(true);
                setQuestionId(record.question_id);
              }}
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
    const roleId = parseInt(localStorage.getItem("loginUserRoleId"));
    const loginUserId = parseInt(localStorage.getItem("loginUserId"));
    let courseArray;

    if (roleId === 1) {
      try {
        const response = await getCourses();
        console.log("course response", response);
        if (response?.data?.data) {
          courseArray = response?.data?.data;
          setCourseData(response?.data?.data);
        } else {
          courseArray = [];
          setCourseData([]);
        }
      } catch (error) {
        courseArray = [];
        setCourseData([]);
        console.log("course error", error);
      } finally {
        setTimeout(() => {
          getQuestionsData(null, null, courseArray);
        }, 300);
      }
    } else {
      try {
        const response = await getCourseByTrainers(loginUserId);
        console.log("course response", response);
        if (response?.data?.courses) {
          courseArray = response?.data?.courses;
          setCourseData(response?.data?.courses);
        } else {
          courseArray = [];
          setCourseData([]);
        }
      } catch (error) {
        courseArray = [];
        setCourseData([]);
        console.log("course error", error);
      } finally {
        setTimeout(() => {
          getQuestionsData(null, null, courseArray);
        }, 300);
      }
    }
  };

  const getQuestionsData = async (sectionid, courseid, courseArray) => {
    setTableLoading(true);
    let courses = [];
    if (courseid) {
      courses.push(courseid);
    } else {
      courses = courseArray.map((c) => {
        return c.id;
      });
    }
    console.log("coursesssssss", courses);

    const payload = {
      section_id: sectionid === undefined ? null : sectionid,
      courses: courses,
    };
    try {
      const response = await getQuestions(payload);
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

  const handleSectionFilter = (value) => {
    console.log("session", value);
    const sec = value === undefined ? null : value;
    setSectionFilterId(sec);
    getQuestionsData(sec, courseFilterId, courseData);
  };

  const handleCourseFilter = (value) => {
    console.log("course", value);
    const cour = value === undefined ? null : value;
    setCourseFilterId(cour);
    getQuestionsData(sectionFilterId, cour, courseData);
  };

  //handle edit
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
          getQuestionsData(sectionFilterId, courseFilterId, courseData);
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
          getQuestionsData(sectionFilterId, courseFilterId, courseData);
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

  const handleXlsx = ({ file }) => {
    console.log("fileee", file);
    const allowedTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "text/csv", // .csv
    ];

    const isValidExcel =
      allowedTypes.includes(file.type) || /\.(xls|xlsx|csv)$/i.test(file.name);

    if (file.status === "uploading" || file.status === "removed") {
      setXlsxArray([]);
      return;
    }

    if (isValidExcel) {
      CommonToaster("File uploaded");
      const reader = new FileReader();

      reader.onload = (evt) => {
        const arrayBuffer = evt.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const data = rawData.filter(
          (row) =>
            Array.isArray(row) &&
            row.some(
              (cell) => cell !== undefined && cell !== null && cell !== ""
            )
        );
        console.log("shetttt", data);
        setExcelData(data);
      };
      reader.readAsArrayBuffer(file);
      setXlsxArray([file]);
    } else {
      setXlsxArray([]);
      CommonToaster("Only .xls, .xlsx, or .csv files are accepted");
    }
  };

  const handleBulkUploadSubmit = async () => {
    const header = excelData[0];
    let updateExcelData = [...excelData];
    let error = [];
    const questionIndex = header.indexOf("Question");
    const option1Index = header.indexOf("Option 1");
    const option2Index = header.indexOf("Option 2");
    const option3Index = header.indexOf("Option 3");
    const option4Index = header.indexOf("Option 4");
    const correctAnswerIndex = header.indexOf("Correct Answer");
    const sectionIndex = header.indexOf("Section");
    const courseIndex = header.indexOf("Course");

    if (questionIndex === -1) {
      error.push({ error: "Question column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const qustion = row[questionIndex];

        if (qustion) {
          let firstNameValidate = addressValidator(qustion);
          updateExcelData[rowIndex + 1].question = qustion;
          if (firstNameValidate) {
            error.push({ error: firstNameValidate, column: rowIndex + 2 });
          }
        }
      });
    }

    if (option1Index === -1) {
      error.push({ error: "Option 1 column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const option1 = row[option1Index];

        if (option1) {
          let option1Validate = addressValidator(option1);
          updateExcelData[rowIndex + 1].option_a = option1;
          if (option1Validate) {
            error.push({
              error: `Option 1${option1Validate}`,
              column: rowIndex + 2,
            });
          }
        }
      });
    }

    if (option2Index === -1) {
      error.push({ error: "Option 2 column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const option2 = row[option2Index];

        if (option2) {
          let option2Validate = addressValidator(option2);
          updateExcelData[rowIndex + 1].option_b = option2;
          if (option2Validate) {
            error.push({
              error: `Option 2${option2Validate}`,
              column: rowIndex + 2,
            });
          }
        }
      });
    }

    if (option3Index === -1) {
      error.push({ error: "Option 3 column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const option3 = row[option3Index];

        if (option3) {
          let option3Validate = addressValidator(option3);
          updateExcelData[rowIndex + 1].option_c = option3;
          if (option3Validate) {
            error.push({
              error: `Option 3${option3Validate}`,
              column: rowIndex + 2,
            });
          }
        }
      });
    }

    if (option4Index === -1) {
      error.push({ error: "Option 4 column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const option4 = row[option4Index];

        if (option4) {
          let option4Validate = addressValidator(option4);
          updateExcelData[rowIndex + 1].option_d = option4;
          if (option4Validate) {
            error.push({
              error: `Option 4${option4Validate}`,
              column: rowIndex + 2,
            });
          }
        }
      });
    }

    if (correctAnswerIndex === -1) {
      error.push({ error: "Correct Answer column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        updateExcelData[rowIndex + 1].correct_answer = row[correctAnswerIndex];
        if (
          row[correctAnswerIndex] !== row[option1Index] &&
          row[correctAnswerIndex] !== row[option2Index] &&
          row[correctAnswerIndex] !== row[option3Index] &&
          row[correctAnswerIndex] !== row[option4Index]
        ) {
          error.push({
            error: "Correct answer must be within the options",
            column: rowIndex + 2,
          });
        }
      });
    }

    if (sectionIndex === -1) {
      error.push({ error: "Section column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const sec = row[sectionIndex];
        let validateSection;
        if (sec) {
          validateSection = sectionData.filter((f) => f.name.includes(sec));
          console.log("secc validate", validateSection);
          if (validateSection.length <= 0) {
            error.push({
              error: `Section is not valid`,
              column: rowIndex + 2,
            });
          } else {
            updateExcelData[rowIndex + 1].section_id = validateSection[0].id;
          }
        }
      });
    }

    if (courseIndex === -1) {
      error.push({ error: "Course column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const corse = row[courseIndex];
        let validateCourse;

        if (corse) {
          validateCourse = courseData.filter((f) =>
            f.name.toLowerCase().includes(corse.toLowerCase())
          );
          console.log("course validate", validateCourse);
          if (validateCourse.length <= 0) {
            error.push({
              error: `Course is not valid`,
              column: rowIndex + 2,
            });
          } else {
            updateExcelData[rowIndex + 1].course_id = validateCourse[0].id;
          }
        }
      });
    }

    console.log("errrrrr", error);
    console.log("resultttt", updateExcelData);
    setExcelErrors(error);

    if (error.length >= 1) {
      setBulkUploadErrorModal(true);
    } else {
      setBulkUploadErrorModal(false);
      const payload = convertExcelToQuestions(updateExcelData);

      console.log("bulk upload payloadd", payload);
      try {
        await questionsBulkUpload(payload);
        CommonToaster("Questions uploaded");
        formReset();
        getQuestionsData(sectionFilterId, courseFilterId, courseData);
      } catch (error) {
        CommonToaster(
          error?.response?.data?.message ||
            "Something went wrong. Try again later"
        );
      }
    }
  };

  const convertExcelToQuestions = (excelData) => {
    const rows = excelData.slice(1);

    const questions = rows.map((row) => {
      return {
        question: row[0] || row.question,
        option_a: row[1] || row.option_a,
        option_b: row[2] || row.option_b,
        option_c: row[3] || row.option_c,
        option_d: row[4] || row.option_d,
        correct_answer: row[5] || row.correct_answer,
        section_id: row.section_id,
        course_id: row.course_id,
      };
    });

    return { questions };
  };

  const downloadCSV = () => {
    // Step 1: Define data
    const data = [
      [
        "Question",
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4",
        "Correct Answer",
        "Section",
        "Course",
      ],
      [
        "xxx",
        "xxx",
        "xxx",
        "xxx",
        "xxx",
        "xxx",
        "Section A",
        "Fullstack Development",
      ],
    ];

    // Step 2: Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Step 3: Apply bold style to header row
    const headerCells = ["A1", "B1"];
    headerCells.forEach((cell) => {
      if (!worksheet[cell]) return;
      worksheet[cell].s = {
        font: { bold: true },
      };
    });

    // Step 4: Create workbook and append the styled sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Step 5: Write file with styles
    XLSX.writeFile(workbook, "Questions.xlsx", {
      bookType: "xlsx",
      cellStyles: true,
    });
  };

  //handle delete
  const handleDelete = async () => {
    try {
      const response = await deleteQuestion(questionId);
      console.log("question delete response", response);

      CommonToaster("Question deleted");
      setDeleteModal(false);
      setTableLoading(true);
      setQuestionId(null);
      setTimeout(() => {
        getQuestionsData(sectionFilterId, courseFilterId, courseData);
      }, 300);
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  const formReset = () => {
    setButtonLoading(false);
    setOpen(false);
    setBulkUploadModal(false);
    setDeleteModal(false);
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
    setXlsxArray([]);
    setExcelData([]);
  };

  return (
    <div>
      <div className="portal_headinContainer">
        <p className="portal_mainheadings">Questions</p>
      </div>

      <Row style={{ marginTop: "22px" }}>
        <Col xs={24} sm={24} md={24} lg={12}>
          <div className="questionupload_filterContainer">
            <PortalSelectField
              options={sectionData}
              style={{ width: "35%" }}
              placeholder="Select Section"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              onChange={handleSectionFilter}
            />
            <PortalSelectField
              options={courseData}
              style={{ width: "35%" }}
              placeholder="Select Course"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              onChange={handleCourseFilter}
            />
          </div>
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
            gap: "16px",
          }}
        >
          <button
            className="questionupload_button"
            onClick={() => setOpen(true)}
          >
            <MdFileUpload size={19} style={{ marginRight: "5px" }} />
            Upload
          </button>
          <button
            className="questionupload_button"
            onClick={() => setBulkUploadModal(true)}
          >
            <MdFileUpload size={19} style={{ marginRight: "5px" }} />
            Bulk Upload
          </button>
        </Col>
      </Row>
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

      {/* bulk upload modal */}
      <Modal
        title="Upload file"
        open={bulkUploadModal}
        onCancel={formReset}
        footer={[
          <div className="questionupload_bulkmodal_footerContainer">
            <Button
              className="questionupload_bulkmodal_footercancel_button"
              onClick={formReset}
            >
              Cancel
            </Button>
            <Button
              className="questionupload_bulkmodal_footerimport_button"
              onClick={handleBulkUploadSubmit}
            >
              Import
            </Button>
          </div>,
        ]}
      >
        <Dragger
          multiple={false}
          className="questionupload_bulkmodal_upload"
          beforeUpload={(file) => {
            console.log(file);
            return false; // Prevent auto-upload
          }}
          maxCount={1}
          onChange={handleXlsx}
          fileList={xlsxArray}
        >
          <img src={ExcelLogo} className="questionupload_excelicon" />
          <p className="questionupload_bulkmodal_dragtext">
            Drag&Drop file here or{" "}
            <span className="questionupload_bulkmodal_choosefile">
              Choose file
            </span>
          </p>
        </Dragger>
        <div className="questionupload_excelsupportContainer">
          <p>Supported format: XLS,XLSX,CSV</p>
          <p>Maximum size: 25MB</p>
        </div>
        <div className="questionupload_bulkupload_templateContainer">
          <img src={ExcelLogo} style={{ width: "30px" }} />
          <p className="questionupload_templateheading">Template</p>
          <p className="questionupload_templatetext">
            you can download template as starting point for your own file.
          </p>
          <button
            className="questionupload_templatedownload_button"
            onClick={downloadCSV}
          >
            Download
          </button>
        </div>
      </Modal>

      {/* delete modal */}
      <Modal
        open={deleteModal}
        onCancel={() => {
          setDeleteModal(false);
          setQuestionId(null);
        }}
        footer={false}
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
            Are you sure want to delete the question?
          </p>

          <div className="question_deletemodal_footerContainer">
            <Button
              className="question_deletemodal_cancelbutton"
              onClick={() => {
                setDeleteModal(false);
                setQuestionId(null);
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

      {/* bulk upload error modal */}
      <Modal
        open={bulkUploadErrorModal}
        onCancel={() => {
          setBulkUploadErrorModal(false);
        }}
        footer={false}
        title="Error"
      >
        {excelErrors.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <div className="questionupload_bulkerrorContainer">
                <IoCloseCircleOutline size={20} color="red" />
                <p>
                  {item.error}{" "}
                  <span
                    style={{ color: "#0056b3", fontWeight: 600 }}
                  >{`[column: ${item.column}]`}</span>
                </p>
              </div>
            </React.Fragment>
          );
        })}
      </Modal>
    </div>
  );
}

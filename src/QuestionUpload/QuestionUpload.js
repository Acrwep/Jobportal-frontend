import React, { useEffect, useState, useCallback } from "react";
import "./styles.css";
import { Button, Col, Drawer, Modal, Row, Spin, Upload } from "antd";
import CommonInputField from "../Common/CommonInputField";
import PortalInputField from "../Common/PortalInputField";
import { MdFileUpload } from "react-icons/md";
import {
  createOptionsForQuestion,
  createQuestion,
  createQuestionType,
  deleteQuestion,
  getCourseByTrainers,
  getCourses,
  getQuestions,
  getQuestionTypes,
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
import { IoMdAdd } from "react-icons/io";
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
  const [correctAnswerOptions, setCorrectAnswerOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [correctAnswerError, setCorrectAnswerError] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const [sectionId, setSectionId] = useState(null);
  const [sectionFilterId, setSectionFilterId] = useState(1);
  const [sectionIdError, setSectionIdError] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [courseFilterId, setCourseFilterId] = useState(null);
  const [courseIdError, setCourseIdError] = useState(null);
  const [disableCourse, setDisableCourse] = useState(false);
  const [questionTypeId, setQuestionTypeId] = useState(null);
  const [questionTypeIdError, setQuestionTypeIdError] = useState("");
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [xlsxArray, setXlsxArray] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [excelErrors, setExcelErrors] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addTypeModal, setAddTypeModal] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [questionTypeError, setQuestionTypeError] = useState("");
  const [typeData, setTypeData] = useState([]);
  const [typeFilterId, setTypeFilterId] = useState(null);
  const [callTypeApi, setCallTypeApi] = useState(true);

  const columns = [
    { title: "Question", key: "question", dataIndex: "question", width: 300 },
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
      width: 160,
    },
    {
      title: "Course",
      key: "course_name",
      dataIndex: "course_name",
      width: 200,
      render: (item, record) => {
        return record.course_name === "" || record.course_name === null ? (
          <p className="questionupload_table_emptycourse">-</p>
        ) : (
          <p>{record.course_name}</p>
        );
      },
    },
    {
      title: "Question Type",
      key: "question_type",
      dataIndex: "question_type",
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
          getQuestionsData(1, null, courseArray, null);
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
          getQuestionsData(1, null, courseArray);
        }, 300);
      }
    }
  };

  const getQuestionsData = async (sectionid, courseid, courseArray, typeid) => {
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
      ...(sectionid
        ? sectionid === 1
          ? {}
          : { courses: courses }
        : { courses: courses }),
      question_type_id: typeid,
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
        if (callTypeApi) {
          getQuestionTypesData();
        } else {
          setTableLoading(false);
        }
      }, 300);
    }
  };

  const getQuestionTypesData = async () => {
    setTableLoading(true);
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

  //onchange functions
  const handleCorrectAnswer = (value) => {
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
    if (sec === 1) {
      setCourseFilterId(null);
      setTypeFilterId(null);
      getQuestionsData(sec, courseFilterId, courseData);
    } else {
      getQuestionsData(sec, courseFilterId, courseData, typeFilterId);
    }
  };

  const handleCourseFilter = useCallback((value) => {
    console.log("course", value);
    const cour = value === undefined ? null : value;
    setCourseFilterId(cour);
    getQuestionsData(sectionFilterId, cour, courseData, typeFilterId);
  });

  const handleTypeFilter = useCallback((value) => {
    const typeid = value === undefined ? null : value;
    setTypeFilterId(typeid);
    getQuestionsData(sectionFilterId, courseFilterId, courseData, typeid);
  });

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
    let updateCorrectAnswer = [...correctAnswerOptions];
    updateCorrectAnswer[0] = { id: record.option_a, name: record.option_a };
    updateCorrectAnswer[1] = { id: record.option_b, name: record.option_b };
    updateCorrectAnswer[2] = { id: record.option_c, name: record.option_c };
    updateCorrectAnswer[3] = { id: record.option_d, name: record.option_d };

    setCorrectAnswerOptions(updateCorrectAnswer);
    setCorrectAnswer(record.correct_answer);
    setSectionId(record.section_id);
    setCourseId(record.course_id);
    setQuestionTypeId(record.question_type_id);
    if (record.section_id === 1) {
      setDisableCourse(true);
      setQuestionTypeId(null);
      setCourseId(null);
    } else {
      setDisableCourse(false);
    }
  };

  //form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationTrigger(true);
    const questionvalidate = addressValidator(question);
    const optionOneValidate = selectValidator(optionOne);
    const optionTwoValidate = selectValidator(optionTwo);
    const optionThreeValidate = selectValidator(optionThree);
    const optionFourValidate = selectValidator(optionFour);
    const sectionValidate = selectValidator(sectionId);
    // const questionTypeIdValidate = selectValidator(questionTypeId);

    let courseValidate = "";
    let correctAnswerValidate = "";
    let questionTypeIdValidate = "";

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
      questionTypeIdValidate = "";
    } else {
      setDisableCourse(false);
      courseValidate = selectValidator(courseId);
      questionTypeIdValidate = selectValidator(questionTypeId);
    }

    setQuestionError(questionvalidate);
    setOptionOneError(optionOneValidate);
    setOptionTwoError(optionTwoValidate);
    setOptionThreeError(optionThreeValidate);
    setOptionFourError(optionFourValidate);
    setCorrectAnswerError(correctAnswerValidate);
    setSectionIdError(sectionValidate);
    setCourseIdError(courseValidate);
    setQuestionTypeIdError(questionTypeIdValidate);

    if (
      questionvalidate ||
      optionOneValidate ||
      optionTwoValidate ||
      optionThreeValidate ||
      optionFourValidate ||
      correctAnswerValidate ||
      sectionValidate ||
      courseValidate ||
      questionTypeIdValidate
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
      question_type_id: questionTypeId,
    };

    if (edit) {
      try {
        await updateQuestion(payload);
        CommonToaster("Question updated");
        setTableLoading(true);
        setTimeout(() => {
          getQuestionsData(
            sectionFilterId,
            courseFilterId,
            courseData,
            typeFilterId
          );
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
          getQuestionsData(
            sectionFilterId,
            courseFilterId,
            courseData,
            typeFilterId
          );
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
              (cell) =>
                cell !== undefined &&
                cell !== null &&
                cell !== "" &&
                cell !== " "
            )
        );
        console.log("shetttt", data);
        setExcelData(data);
      };
      reader.readAsArrayBuffer(file);
      setXlsxArray([file]);
    } else {
      setXlsxArray([]);
      setExcelData([]);
      CommonToaster("Only .xls, .xlsx, or .csv files are accepted");
    }
  };

  const handleBulkUploadSubmit = async () => {
    if (xlsxArray.length <= 0) {
      CommonToaster("Please upload .xls or .xlsx or .csv");
      return;
    }
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
    const questionTypeIndex = header.indexOf("Question Type");

    if (questionIndex === -1) {
      error.push({ error: "Question column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const qustion = row[questionIndex].toString();

        if (qustion) {
          let firstNameValidate = addressValidator(qustion);
          updateExcelData[rowIndex + 1].question = qustion;
          if (firstNameValidate) {
            error.push({ error: firstNameValidate, row: rowIndex + 2 });
          }
        }
      });
    }

    if (option1Index === -1) {
      error.push({ error: "Option 1 column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const option1 = row[option1Index].toString();

        if (option1) {
          let option1Validate = selectValidator(option1);
          updateExcelData[rowIndex + 1].option_a = option1;
          if (option1Validate) {
            error.push({
              error: `Option 1${option1Validate}`,
              row: rowIndex + 2,
            });
          }
        }
      });
    }

    if (option2Index === -1) {
      error.push({ error: "Option 2 column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const option2 = row[option2Index].toString();

        if (option2) {
          let option2Validate = selectValidator(option2);
          updateExcelData[rowIndex + 1].option_b = option2;
          if (option2Validate) {
            error.push({
              error: `Option 2${option2Validate}`,
              row: rowIndex + 2,
            });
          }
        }
      });
    }

    if (option3Index === -1) {
      error.push({ error: "Option 3 column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const option3 = row[option3Index].toString();

        if (option3) {
          let option3Validate = selectValidator(option3);
          updateExcelData[rowIndex + 1].option_c = option3;
          if (option3Validate) {
            error.push({
              error: `Option 3${option3Validate}`,
              row: rowIndex + 2,
            });
          }
        }
      });
    }

    if (option4Index === -1) {
      error.push({ error: "Option 4 column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const option4 = row[option4Index].toString();

        if (option4) {
          let option4Validate = selectValidator(option4);
          updateExcelData[rowIndex + 1].option_d = option4;
          if (option4Validate) {
            error.push({
              error: `Option 4${option4Validate}`,
              row: rowIndex + 2,
            });
          }
        }
      });
    }

    if (correctAnswerIndex === -1) {
      error.push({ error: "Correct Answer column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        updateExcelData[rowIndex + 1].correct_answer =
          row[correctAnswerIndex].toString();
        if (
          row[correctAnswerIndex] !== row[option1Index] &&
          row[correctAnswerIndex] !== row[option2Index] &&
          row[correctAnswerIndex] !== row[option3Index] &&
          row[correctAnswerIndex] !== row[option4Index]
        ) {
          error.push({
            error: "Correct answer must be within the options",
            row: rowIndex + 2,
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
          validateSection = sectionData.filter((f) =>
            f.name.trim().toLowerCase().includes(sec.toLowerCase())
          );
          console.log("secc validate", validateSection);
          if (validateSection.length <= 0) {
            error.push({
              error: `Section is not valid`,
              row: rowIndex + 2,
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
            f.name.trim().toLowerCase().includes(corse.toLowerCase())
          );
          console.log("course validate", validateCourse);
          if (validateCourse.length <= 0) {
            error.push({
              error: `Course is not valid`,
              row: rowIndex + 2,
            });
          } else {
            updateExcelData[rowIndex + 1].course_id = validateCourse[0].id;
          }
        }
      });
    }

    if (questionTypeIndex === -1) {
      error.push({ error: "Question Type column is required" });
    } else {
      excelData.slice(1).map((row, rowIndex) => {
        const qstionType = row[questionTypeIndex];
        let validateQuestionType;
        console.log("type dataaaa", typeData, qstionType);
        if (qstionType) {
          validateQuestionType = typeData.filter((f) =>
            f.name
              .trim()
              .toLowerCase()
              .includes(qstionType.trim().toLowerCase())
          );
          console.log("qstion type validate", validateQuestionType);
          if (validateQuestionType.length <= 0) {
            error.push({
              error: `Question Type is not valid`,
              row: rowIndex + 2,
            });
          } else {
            updateExcelData[rowIndex + 1].question_type_id =
              validateQuestionType[0].id;
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
        getQuestionsData(
          sectionFilterId,
          courseFilterId,
          courseData,
          typeFilterId
        );
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
        question: row.question,
        option_a: row.option_a,
        option_b: row.option_b,
        option_c: row.option_c,
        option_d: row.option_d,
        correct_answer: row.correct_answer,
        section_id: row.section_id,
        course_id: row.course_id,
        question_type_id: row.question_type_id,
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
        "Question Type",
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
        getQuestionsData(
          sectionFilterId,
          courseFilterId,
          courseData,
          typeFilterId
        );
      }, 300);
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  const handleCreateQuestionType = async () => {
    setValidationTrigger(true);
    const typeValidate = addressValidator(questionType);

    setQuestionTypeError(typeValidate);

    if (typeValidate) return;

    const payload = {
      name: questionType,
    };
    setButtonLoading(true);
    try {
      await createQuestionType(payload);
      CommonToaster("Type created");
      setTimeout(() => {
        setButtonLoading(false);
        getQuestionTypesData();
        formReset();
      }, 500);
    } catch (error) {
      setButtonLoading(false);
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
    setAddTypeModal(false);
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
    setCorrectAnswerOptions([]);
    setCorrectAnswer("");
    setCorrectAnswerError("");
    setSectionId(null);
    setSectionIdError("");
    setCourseId(null);
    setCourseIdError("");
    setDisableCourse(false);
    setQuestionTypeId(null);
    setQuestionTypeIdError("");
    setXlsxArray([]);
    setExcelData([]);
    setQuestionType("");
    setQuestionTypeError("");
  };

  return (
    <div>
      <div className="portal_headinContainer">
        <p className="portal_mainheadings">
          Questions{" "}
          <span
            style={{ fontSize: "22px" }}
          >{`( ${questionsData.length} )`}</span>
        </p>
      </div>

      <Row style={{ marginTop: "22px" }}>
        <Col xs={24} sm={24} md={24} lg={12}>
          <div className="questionupload_filterContainer">
            <PortalSelectField
              options={sectionData}
              style={{ width: "35%" }}
              placeholder="Select Section"
              selectClassName="questionupload_filterselectfield"
              allowClear={false}
              onChange={handleSectionFilter}
              value={sectionFilterId}
              hideError={true}
            />
            <PortalSelectField
              options={courseData}
              style={{ width: "35%" }}
              placeholder="Select Course"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              value={courseFilterId}
              disabled={sectionFilterId === 1 ? true : false}
              onChange={handleCourseFilter}
              hideError={true}
            />
            <PortalSelectField
              options={typeData}
              style={{ width: "35%" }}
              placeholder="Select Type"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              value={typeFilterId}
              disabled={sectionFilterId === 1 ? true : false}
              onChange={handleTypeFilter}
              hideError={true}
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
            onClick={() => setAddTypeModal(true)}
          >
            <IoMdAdd size={19} style={{ marginRight: "5px" }} />
            Add Type
          </button>
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
          scroll={{ x: 1300 }}
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
                mandatory={true}
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
                mandatory={true}
                value={optionOne}
                onChange={(event) => {
                  setOptionOne(event.target.value);
                  let data = [...correctAnswerOptions];
                  data[0] = {
                    name: event.target.value,
                  };
                  setCorrectAnswerOptions(data);
                  if (validationTrigger) {
                    setOptionOneError(selectValidator(event.target.value));
                  }
                }}
                error={optionOneError}
              />
            </Col>
            <Col span={12}>
              <PortalInputField
                label="Option 2"
                mandatory={true}
                value={optionTwo}
                onChange={(event) => {
                  setOptionTwo(event.target.value);
                  let data = [...correctAnswerOptions];
                  data[1] = {
                    name: event.target.value,
                  };
                  setCorrectAnswerOptions(data);
                  if (validationTrigger) {
                    setOptionTwoError(selectValidator(event.target.value));
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
                mandatory={true}
                value={optionThree}
                onChange={(event) => {
                  setOptionThree(event.target.value);
                  let data = [...correctAnswerOptions];
                  data[2] = {
                    name: event.target.value,
                  };
                  setCorrectAnswerOptions(data);
                  if (validationTrigger) {
                    setOptionThreeError(selectValidator(event.target.value));
                  }
                }}
                error={optionThreeError}
              />
            </Col>
            <Col span={12}>
              <PortalInputField
                label="Option 4"
                mandatory={true}
                value={optionFour}
                onChange={(event) => {
                  setOptionFour(event.target.value);
                  let data = [...correctAnswerOptions];
                  data[3] = {
                    name: event.target.value,
                  };
                  setCorrectAnswerOptions(data);
                  if (validationTrigger) {
                    setOptionFourError(selectValidator(event.target.value));
                  }
                }}
                error={optionFourError}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: "22px" }}>
            <Col span={12}>
              <PortalSelectField
                options={correctAnswerOptions}
                label="Correct Answer"
                mandatory={true}
                value={correctAnswer}
                onChange={handleCorrectAnswer}
                error={correctAnswerError}
              />
            </Col>
            <Col span={12}>
              <PortalSelectField
                label="Section"
                mandatory={true}
                options={sectionData}
                value={sectionId}
                onChange={(value) => {
                  setSectionId(value);

                  if (validationTrigger) {
                    setSectionIdError(selectValidator(value));
                  }

                  if (value === 1) {
                    setCourseId(null);
                    setQuestionTypeId(null);
                    setDisableCourse(true);
                    setCourseIdError("");
                    setQuestionTypeIdError("");
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
            <Col span={12}>
              <PortalSelectField
                label="Question Type"
                mandatory={true}
                options={typeData}
                value={questionTypeId}
                disabled={disableCourse}
                onChange={(value) => {
                  setQuestionTypeId(value);
                  if (validationTrigger) {
                    setQuestionTypeIdError(selectValidator(value));
                  }
                }}
                error={questionTypeIdError}
              />
            </Col>
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
                  >{`[row: ${item.row}]`}</span>
                </p>
              </div>
            </React.Fragment>
          );
        })}
      </Modal>

      {/* addtype modal */}
      <Modal
        open={addTypeModal}
        onCancel={formReset}
        title="Add Question Type"
        footer={[
          <div className="courses_addtopicmodal_footerContainer">
            {buttonLoading ? (
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
                onClick={handleCreateQuestionType}
              >
                Submit
              </Button>
            )}
          </div>,
        ]}
      >
        <div style={{ marginTop: "20px" }}>
          <PortalInputField
            label="Type"
            mandatory={true}
            value={questionType}
            onChange={(e) => {
              setQuestionType(e.target.value);
              if (validationTrigger) {
                setQuestionTypeError(addressValidator(e.target.value));
              }
            }}
            error={questionTypeError}
          />
        </div>
      </Modal>
    </div>
  );
}

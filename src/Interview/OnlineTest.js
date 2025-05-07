import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles.css";
import { Button, Col, Row } from "antd";
import Actelogo from "../images/acte-logo.png";
import { Input, Radio } from "antd";
import { MdKeyboardBackspace } from "react-icons/md";
import { getQuestions, insertAnswers } from "../Common/action";
import { CommonToaster } from "../Common/CommonToaster";

export default function OnlineTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2 * 60); // 30 minutes in seconds
  const [warningCount, setWarningCount] = useState(0);
  const [sectionAQuetions, setSectionAQuetions] = useState([]);
  const [sectionBQuetions, setSectionBQuetions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sectionALastIndex, setSectionALastIndex] = useState(null);
  const [visibleSectionA, setVisibleSectionA] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleFullscreenStart = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }

    setStarted(true); // start quiz
  };

  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "hidden") {
  //       setWarningCount((prev) => {
  //         const updated = prev + 1;
  //         if (updated >= 3) {
  //           alert("You switched tabs too many times. Quiz ended.");
  //           // setShowResult(true);
  //         } else {
  //           alert(`Warning ${updated}: Don't switch tabs during the quiz!`);
  //         }
  //         return updated;
  //       });
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  // Timer logic
  useEffect(() => {
    console.log(location.state, "locationnnn");
    const user_id = location?.state?.userId || null;
    setUserId(user_id);

    const course_id = location?.state?.courseId || null;
    setCourseId(course_id);

    if (course_id === null || user_id === null) {
      navigate("/test-invite");
    }
    if (!started || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, started]);

  const formatTime = (secs) => {
    const hours = String(Math.floor(secs / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const seconds = String(secs % 60).padStart(2, "0");
    return `${hours} : ${minutes} : ${seconds}`;
  };

  useEffect(() => {
    getSectionAQuestionsData();
  }, []);

  const getSectionAQuestionsData = async () => {
    const payload = {
      section_id: 1,
    };
    try {
      const response = await getQuestions(payload);
      console.log("questions", response);
      const questionsdata = response?.data?.data || [];
      setSectionAQuetions(questionsdata);
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        // setTableLoading(false);
        getSectionBQuestionsData();
      }, 300);
    }
  };

  const getSectionBQuestionsData = async () => {
    const payload = {
      section_id: 2,
      course_id: 1,
    };
    try {
      const response = await getQuestions(payload);
      console.log("questions", response);
      const questionsdata = response?.data?.data || [];
      setSectionBQuetions(questionsdata);
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        // setTableLoading(false);
      }, 300);
    }
  };

  //options handling
  const handleSectionAOptions = (e, index) => {
    console.log(e.target.value);
    const answerArray = [...sectionAQuetions];
    answerArray[index].selectedOption = e.target.value;
    setSectionAQuetions(answerArray);
  };

  const handleSectionBOptions = (e, index) => {
    console.log(e.target.value);
    const answerArray = [...sectionBQuetions];
    answerArray[index].selectedOption = e.target.value;
    setSectionBQuetions(answerArray);
  };

  //next question handling
  const handleSectionANext = (index) => {
    const lastIndex = sectionAQuetions.length - 1;
    if (index === lastIndex) {
      setQuestionIndex(0);
      setVisibleSectionA(false);
      setSectionALastIndex(index);
    } else {
      setQuestionIndex(index + 1);
    }
  };

  const handleSectionBNext = (index) => {
    setQuestionIndex(index + 1);
  };

  const handleSubmitAnswers = async () => {
    setButtonLoading(true);
    let mergeSections = [];

    sectionAQuetions.map((item) => {
      mergeSections.push(item);
    });

    sectionBQuetions.map((item) => {
      mergeSections.push(item);
    });
    console.log(mergeSections);

    const answers = mergeSections.map((item) => {
      return {
        question_id: item.question_id,
        selected_option: item.selectedOption ? item.selectedOption : "",
      };
    });

    const payload = {
      user_id: userId,
      course_id: courseId,
      answers: answers,
    };
    console.log("final payload", payload);

    try {
      const response = await insertAnswers(payload);
      console.log("answer submit response", response);
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        setButtonLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="onlinetest_mainContainer">
      <Row style={{ alignItems: "center" }}>
        <Col span={8}>
          <img
            src={Actelogo}
            className="onlinetest_logo"
            onClick={handleFullscreenStart}
          />
        </Col>
        <Col
          span={8}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            className="onlinetest_sectionhaeding"
            onClick={() => {
              setQuestionIndex(0);
              console.log("sectopn A", sectionAQuetions);
            }}
          >
            {visibleSectionA ? "Section A" : "Section B"}
          </p>
        </Col>
        <Col
          span={8}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <p className="onlinetest_timer" onClick={handleSubmitAnswers}>
            <span style={{ color: "#000000" }}>Time Left:</span>{" "}
            {formatTime(timeLeft)}
          </p>
        </Col>
      </Row>

      <Row style={{ height: "79vh" }}>
        {visibleSectionA && (
          <>
            {sectionAQuetions.map((item, index) => {
              let selectedOption = "";
              let lastindex = sectionAQuetions.length - 1;
              return (
                <>
                  {index === questionIndex ? (
                    <>
                      <Col span={12} className="questionColContainer">
                        <div style={{ marginTop: "20px" }}>
                          <p className="onlinetest_questionnumber">
                            {`Question ${index + 1} of ${
                              sectionAQuetions.length
                            }`}
                          </p>
                          <p className="onlinetest_question">{item.question}</p>
                        </div>

                        <div className="onlinetest_skipbuttonContainer">
                          <Button
                            className="onlinetest_backbutton"
                            onClick={() =>
                              handleSectionANext(index, selectedOption)
                            }
                          >
                            Skip
                          </Button>
                        </div>
                      </Col>
                      <Col span={12} style={{ position: "relative" }}>
                        <div className="onlinetest_optionsContainer">
                          <Radio.Group
                            style={{ width: "100%" }}
                            onChange={(e) => handleSectionAOptions(e, index)}
                            value={
                              item.selectedOption ? item.selectedOption : ""
                            }
                          >
                            <Radio
                              className="onlinetest_optiondiv"
                              value={item.option_a}
                            >
                              {item.option_a}
                            </Radio>
                            <Radio
                              className="onlinetest_optiondiv"
                              value={item.option_b}
                            >
                              {item.option_b}
                            </Radio>
                            <Radio
                              className="onlinetest_optiondiv"
                              value={item.option_c}
                            >
                              {item.option_c}
                            </Radio>
                            <Radio
                              className="onlinetest_optiondiv"
                              value={item.option_d}
                            >
                              {item.option_d}
                            </Radio>
                          </Radio.Group>
                        </div>

                        <div className="onlinetest_nxtbuttonContainer">
                          {index === 0 ? (
                            ""
                          ) : (
                            <Button
                              className="onlinetest_backbutton"
                              onClick={() => {
                                setQuestionIndex(questionIndex - 1);
                              }}
                            >
                              <MdKeyboardBackspace
                                size={16}
                                style={{ marginRight: "0px" }}
                              />
                              Back
                            </Button>
                          )}
                          <button
                            className="onlinetest_nxtbutton"
                            onClick={() =>
                              handleSectionANext(index, selectedOption)
                            }
                          >
                            {lastindex === index
                              ? "Next Section"
                              : "Next Question"}
                          </button>
                        </div>
                      </Col>
                    </>
                  ) : (
                    ""
                  )}
                </>
              );
            })}
          </>
        )}

        {visibleSectionA === false && (
          <>
            {sectionBQuetions.map((item, index) => {
              let selectedOption = "";
              let lastindex = sectionBQuetions.length - 1;
              return (
                <>
                  {index === questionIndex ? (
                    <>
                      <Col span={12} className="questionColContainer">
                        <div style={{ marginTop: "20px" }}>
                          <p className="onlinetest_questionnumber">
                            {`Question ${index + 1} of ${
                              sectionBQuetions.length
                            }`}
                          </p>
                          <p className="onlinetest_question">{item.question}</p>
                        </div>

                        <div className="onlinetest_skipbuttonContainer">
                          <Button
                            className="onlinetest_backbutton"
                            onClick={() =>
                              handleSectionBNext(index, selectedOption)
                            }
                          >
                            Skip
                          </Button>
                        </div>
                      </Col>
                      <Col span={12} style={{ position: "relative" }}>
                        <div className="onlinetest_optionsContainer">
                          <Radio.Group
                            style={{ width: "100%" }}
                            onChange={(e) => handleSectionBOptions(e, index)}
                            value={
                              item.selectedOption ? item.selectedOption : ""
                            }
                          >
                            <Radio
                              className="onlinetest_optiondiv"
                              value={item.option_a}
                            >
                              {item.option_a}
                            </Radio>
                            <Radio
                              className="onlinetest_optiondiv"
                              value={item.option_b}
                            >
                              {item.option_b}
                            </Radio>
                            <Radio
                              className="onlinetest_optiondiv"
                              value={item.option_c}
                            >
                              {item.option_c}
                            </Radio>
                            <Radio
                              className="onlinetest_optiondiv"
                              value={item.option_d}
                            >
                              {item.option_d}
                            </Radio>
                          </Radio.Group>
                        </div>

                        <div className="onlinetest_nxtbuttonContainer">
                          {index === 0 ? (
                            <Button
                              className="onlinetest_backbutton"
                              onClick={() => {
                                setQuestionIndex(sectionALastIndex);
                                setVisibleSectionA(true);
                              }}
                            >
                              <MdKeyboardBackspace
                                size={16}
                                style={{ marginRight: "0px" }}
                              />
                              Back to Section A
                            </Button>
                          ) : (
                            <Button
                              className="onlinetest_backbutton"
                              onClick={() => {
                                setQuestionIndex(questionIndex - 1);
                              }}
                            >
                              <MdKeyboardBackspace
                                size={16}
                                style={{ marginRight: "0px" }}
                              />
                              Back
                            </Button>
                          )}
                          {index === lastindex ? (
                            <button
                              className="onlinetest_nxtbutton"
                              onClick={handleSubmitAnswers}
                            >
                              {lastindex === index ? "Submit" : "Next Question"}
                            </button>
                          ) : (
                            <button
                              className="onlinetest_nxtbutton"
                              onClick={() =>
                                handleSectionBNext(index, selectedOption)
                              }
                            >
                              {lastindex === index ? "Submit" : "Next Question"}
                            </button>
                          )}
                        </div>
                      </Col>
                    </>
                  ) : (
                    ""
                  )}
                </>
              );
            })}
          </>
        )}
      </Row>
    </div>
  );
}
// https://chatgpt.com/c/6804de8c-c1a8-8004-904c-8778dac47bcd

import React, { useState, useEffect } from "react";
import { Row, Col, Collapse, Divider } from "antd";
import "./styles.css";
import { getAssessmentAnswers } from "../Common/action";
import { ImCross } from "react-icons/im";
import { PiCheckFatFill } from "react-icons/pi";
import moment from "moment";
import Loader from "../Common/Loader";
import CommonNodataFound from "../Common/CommonNodataFound";

export default function StudentResult() {
  const [answersData, setAnswersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAnswersData();
  }, []);

  const getAnswersData = async (userId) => {
    const loginUserId = localStorage.getItem("loginUserId");
    const payload = {
      user_id: loginUserId,
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
                                  <p>Your answer</p>
                                </div>
                              ) : optin.value === answer.selected_option ? (
                                <div className="assesmntresult_youranswerContainer">
                                  <p>Your answer</p>
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
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {answersData.length >= 1 ? (
            <Collapse
              className="assesmntresult_collapse"
              items={answersData}
              defaultActiveKey={["1"]}
            ></Collapse>
          ) : (
            <CommonNodataFound title="No result found" />
          )}
        </>
      )}
    </div>
  );
}

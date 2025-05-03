import React, { useState, useEffect } from "react";
import "./styles.css";
import { Button, Col, Row } from "antd";
import Actelogo from "../images/acte-logo.png";
import { Input, Radio } from "antd";
import { MdKeyboardBackspace } from "react-icons/md";

export default function OnlineTest() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [value, setValue] = useState(1);
  const [warningCount, setWarningCount] = useState(0);

  const onChange = (e) => {
    setValue(e.target.value);
  };

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
          <p className="onlinetest_sectionhaeding">Section A</p>
        </Col>
        <Col
          span={8}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <p className="onlinetest_timer">
            <span style={{ color: "#000000" }}>Time Left:</span>{" "}
            {formatTime(timeLeft)}
          </p>
        </Col>
      </Row>

      <Row style={{ height: "79vh" }}>
        <Col span={12} className="questionColContainer">
          <div style={{ marginTop: "20px" }}>
            <p className="onlinetest_questionnumber">Question 1 of 10</p>
            <p className="onlinetest_question">
              Which of the following is correct about JavaScript?
            </p>
          </div>

          <div className="onlinetest_skipbuttonContainer">
            <Button className="onlinetest_backbutton">Skip</Button>
          </div>
        </Col>
        <Col span={12} style={{ position: "relative" }}>
          <div className="onlinetest_optionsContainer">
            <Radio.Group style={{ width: "100%" }}>
              <div className="onlinetest_optiondiv">
                <Radio value="A">Option A</Radio>
              </div>
              <div className="onlinetest_optiondiv">
                <Radio value="B">Option B</Radio>
              </div>
              <div className="onlinetest_optiondiv">
                <Radio value="C">Option C</Radio>
              </div>
              <div className="onlinetest_optiondiv">
                <Radio value="D">Option D</Radio>
              </div>
            </Radio.Group>
          </div>

          <div className="onlinetest_nxtbuttonContainer">
            <Button className="onlinetest_backbutton">
              <MdKeyboardBackspace size={16} style={{ marginRight: "0px" }} />
              Back
            </Button>
            <button className="onlinetest_nxtbutton">Next Question</button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
// https://chatgpt.com/c/6804de8c-c1a8-8004-904c-8778dac47bcd

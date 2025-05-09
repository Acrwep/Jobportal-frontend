import React, { useState, useEffect } from "react";
import Actelogo from "../images/acte-logo.png";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [totalMark, setTotalMark] = useState(null);

  useEffect(() => {
    console.log(location.state, "locationnnn");
    setTotalQuestions(location?.state?.totalQuestions);
    setPercentage(location?.state?.percentage);
    setTotalMark(location?.state?.totalMark);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      navigate(1); // Push user forward again if they try to go back
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div className="result_mainContainer">
      <img src={Actelogo} className="result_logo" />

      <div className="result_contentContainer">
        <p className="result_heading">Result</p>

        <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
          <div className="result_subheadingContainer">
            <p className="result_subheading">Attempted Questions:</p>
            <p className="result_subheading">Correct Answer:</p>
            <p className="result_subheading">Percentage:</p>
          </div>

          <div className="result_subheadingContainer">
            <p>
              {totalQuestions === null || totalQuestions === undefined
                ? "-"
                : totalQuestions}
            </p>
            <p>
              {totalMark === null || totalMark === undefined ? "-" : totalMark}
            </p>
            <p style={{ fontWeight: 600 }}>
              {percentage === "NaN"
                ? 0 + " %"
                : percentage != "NaN"
                ? percentage + " %"
                : "-"}
            </p>
          </div>
        </div>

        <button
          className="result_backtologinbutton"
          onClick={() => {
            navigate("/login");
            localStorage.clear();
          }}
        >
          <MdKeyboardBackspace
            color="#fff"
            size={20}
            style={{ marginRight: "8px" }}
          />{" "}
          Back to Login
        </button>
      </div>
    </div>
  );
}

import React from "react";
import Actelogo from "../images/acte-logo.png";
import { MdKeyboardBackspace } from "react-icons/md";

export default function Result() {
  return (
    <div className="result_mainContainer">
      <img src={Actelogo} className="result_logo" />

      <div className="result_contentContainer">
        <p className="result_heading">Result</p>

        <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
          <div className="result_subheadingContainer">
            <p className="result_subheading">Total Questions:</p>
            <p className="result_subheading">Correct Answer:</p>
            <p className="result_subheading">Percentage:</p>
          </div>

          <div className="result_subheadingContainer">
            <p>20</p>
            <p>5</p>
            <p style={{ fontWeight: 600 }}>5%</p>
          </div>
        </div>

        <button className="result_backtologinbutton">
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

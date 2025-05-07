import React from "react";
import { Col, Row } from "antd";
import ExpireImage from "../images/invitation-expired.svg";
import "./styles.css";

export default function TestExpired() {
  return (
    <div className="testexpired_mainContainer">
      <div>
        <img src={ExpireImage} className="testexpired_image" />
      </div>

      <div className="testexpired_contentContainer">
        <p className="testexpired_heading">Unavailable access</p>
        <p className="testexpired_content">
          Unfortunately, the assessment you are attempting to access is
          currently unavailable or has been archived. Consider contacting test
          administrator to express your desire to still apply.
        </p>
      </div>
    </div>
  );
}

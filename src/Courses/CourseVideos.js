import React from "react";
import { Col, Row } from "antd";
import "./styles.css";

export default function CourseVideos() {
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={24} md={24} lg={8}>
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/FYErehuSuuw"
            allowFullScreen
            className="courses_iframevideos"
          ></iframe>
          <p className="courses_videotitle">
            Mastering HTML Basics and Beyond | Your Ultimate Guide to Begin Web
            Development
          </p>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/HBqWsrqK89U"
            className="courses_iframevideos"
            allowFullScreen
          ></iframe>
          <p className="courses_videotitle">
            HTML & CSS Full Course: Beginners to Pro 2024
          </p>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/HBqWsrqK89U"
            className="courses_iframevideos"
            allowFullScreen
          ></iframe>
          <p className="courses_videotitle">
            HTML & CSS Full Course: Beginners to Pro 2024
          </p>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={24} md={24} lg={8}>
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/FYErehuSuuw"
            allowFullScreen
            className="courses_iframevideos"
          ></iframe>
          <p className="courses_videotitle">
            Mastering HTML Basics and Beyond | Your Ultimate Guide to Begin Web
            Development
          </p>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/HBqWsrqK89U"
            className="courses_iframevideos"
            allowFullScreen
          ></iframe>
          <p className="courses_videotitle">
            HTML & CSS Full Course: Beginners to Pro 2024
          </p>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/HBqWsrqK89U"
            className="courses_iframevideos"
            allowFullScreen
          ></iframe>
          <p className="courses_videotitle">
            HTML & CSS Full Course: Beginners to Pro 2024
          </p>
        </Col>
      </Row>
    </div>
  );
}

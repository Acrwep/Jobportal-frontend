import React, { useState } from "react";
import "./styles.css";
import { Col, Row, Tabs } from "antd";
import Trainer from "../images/trainer.png";
import CourseVideos from "./CourseVideos";

export default function Courses() {
  const trainersList = [
    { id: 1, name: "Alexa", exp: "6+", videos: "20" },
    { id: 2, name: "Alexa", exp: "6+", videos: "20" },
    { id: 3, name: "Alexa", exp: "6+", videos: "20" },
  ];
  const [courseTopicIndex, setCourseTopicIndex] = useState(0);
  const courseTopics = [
    { id: 1, name: "HTML" },
    { id: 2, name: "CSS" },
    { id: 3, name: "Javascript" },
    { id: 4, name: "React Js" },
    { id: 5, name: "Angular Js" },
    { id: 6, name: "Java" },
    { id: 7, name: "Spring Boot" },
  ];
  const tabItems = [
    {
      key: "1",
      label: "Videos",
      children: <CourseVideos />,
    },
    {
      key: "2",
      label: "Documents",
      children: <p>Document content here</p>,
    },
  ];
  return (
    <div>
      <div className="portal_headinContainer">
        <p className="portal_mainheadings">Fullstack Development</p>
      </div>

      {/* <p className="courses_trainerheading">Trainers</p>
      <Row gutter={30}>
        {trainersList.map((item, index) => {
          return (
            <Col xs={24} sm={24} md={24} lg={8}>
              <div
                className="courses_trainercard"
                style={{
                  backgroundColor:
                    index === 0
                      ? "#6068cd"
                      : index === 1
                      ? "#ac5ac7"
                      : "#5297a7",
                }}
              >
                <div className="courses_trainercard_imagesContainer">
                  <img src={Trainer} className="courses_trainercard_images" />
                </div>
                <div className="courses_trainercard_contentContainer">
                  <p className="courses_trainercard_name">{item.name}</p>
                  <p className="courses_trainercard_exp">
                    Experience: {item.exp}
                  </p>
                  <p className="courses_trainercard_exp">
                    Videos: {item.videos}
                  </p>
                </div>
              </div>
            </Col>
          );
        })}
      </Row> */}

      <div className="courses_topicsmainContainer">
        <Row style={{ marginBottom: "20px" }}>
          <Col span={6} className="courses_topics_sidebarContainer">
            {courseTopics.map((item, index) => {
              return (
                <div
                  className={
                    index === courseTopicIndex
                      ? "courses_topactivetab_div"
                      : "courses_topinactivetab_div"
                  }
                  onClick={() => setCourseTopicIndex(index)}
                >
                  <p>{item.name}</p>
                </div>
              );
            })}
          </Col>
          <Col span={18}>
            <div className="courses_videomainContainer">
              <Tabs defaultActiveKey="1" items={tabItems} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

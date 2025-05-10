import React from "react";
import "./styles.css";
import { Col, Row } from "antd";
import Trainer from "../images/trainer.png";

export default function Courses() {
  const trainersList = [
    { id: 1, name: "Alexa", exp: "6+", videos: "20" },
    { id: 2, name: "Alexa", exp: "6+", videos: "20" },
    { id: 3, name: "Alexa", exp: "6+", videos: "20" },
  ];

  return (
    <div>
      <div className="portal_headinContainer">
        <p className="portal_mainheadings">Fullstack Development</p>
      </div>

      <p className="courses_trainerheading">Trainers</p>
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
                {/* <p className="courses_trainercard_name">Sowmiya</p> */}
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

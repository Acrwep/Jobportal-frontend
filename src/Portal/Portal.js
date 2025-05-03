import React from "react";
import { MdOutlineMenuBook } from "react-icons/md";
import Learning from "../images/learn.png";
import Placement from "../images/hiring.png";
import Interview from "../images/interview.png";
import "./styles.css";
import { Row, Col } from "antd";

export default function Portal() {
  return (
    <div className="poratl_mainContainer">
      <p className="portal_cardheading">Choose Portal</p>
      <div className="poratl_cardsContainer">
        <div className="portal_cards">
          {/* <div className="portal_blurBackground"></div> */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <Row style={{ alignItems: "center" }} gutter={12}>
              <Col span={17}>
                <div>
                  <p className="portal_cardnames">
                    2.5 Million Students Engaging in the Education
                  </p>
                  <p className="portal_carddescription">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s,
                  </p>
                </div>
              </Col>
              <Col span={7}>
                <MdOutlineMenuBook
                  style={{ width: "100%", height: "100px" }}
                  // size={100}
                  color="#ddd"
                />
              </Col>
            </Row>
          </div>
        </div>

        <div className="portal_cards">
          {/* <div className="portal_blurBackground"></div> */}
          <Row style={{ alignItems: "center" }} gutter={12}>
            <Col span={17}>
              <div>
                <p className="portal_cardnames">
                  2.5 Million Students Engaging in the Education
                </p>
                <p className="portal_carddescription">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s,
                </p>
              </div>
            </Col>
            <Col span={7}>
              <img src={Placement} style={{ width: "100px" }} />
            </Col>
          </Row>
        </div>

        <div className="portal_cards">
          {/* <div className="portal_blurBackground"></div> */}
          <Row style={{ alignItems: "center" }} gutter={12}>
            <Col span={17}>
              <div>
                <p className="portal_cardnames">
                  2.5 Million Students Engaging in the Education
                </p>
                <p className="portal_carddescription">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s,
                </p>
              </div>
            </Col>
            <Col span={7}>
              <img src={Interview} style={{ width: "100px" }} />
            </Col>
          </Row>
        </div>

        {/* <div className="portal_cards">
          <Row style={{ alignItems: "center" }} gutter={12}>
            <Col span={17}>
              <div>
                <p className="portal_cardnames">
                  2.5 Million Students Engaging in the Education
                </p>
                <p className="portal_carddescription">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s,
                </p>
              </div>
            </Col>
            <Col span={7}>
              <img src={Placement} style={{ width: "100px" }} />
            </Col>
          </Row>
        </div> */}

        {/* <div className="portal_cards">
          <Row style={{ alignItems: "center" }} gutter={12}>
            <Col span={17}>
              <div>
                <p className="portal_cardnames">
                  2.5 Million Students Engaging in the Education
                </p>
                <p className="portal_carddescription">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s,
                </p>
              </div>
            </Col>
            <Col span={7}>
              <img src={Interview} style={{ width: "100px" }} />
            </Col>
          </Row>
        </div> */}
      </div>
    </div>
  );
}

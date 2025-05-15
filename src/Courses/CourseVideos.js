import React from "react";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import "./styles.css";
import Loader from "../Common/Loader";
import CommonNodataFound from "../Common/CommonNodataFound";

export default function CourseVideos({ loading }) {
  const courseVideos = useSelector((state) => state.coursevideos);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Row gutter={16} style={{ marginBottom: "20px" }}>
            {courseVideos.length >= 1 ? (
              <>
                {courseVideos.map((item, index) => {
                  let embedLink;
                  if (item.file_path.includes("youtube")) {
                    const url = new URL(item.file_path);
                    embedLink = url.searchParams.get("v"); // safely get video ID
                  }
                  return (
                    <React.Fragment key={index}>
                      <Col xs={24} sm={24} md={24} lg={8}>
                        <iframe
                          width="100%"
                          height="200"
                          src={`https://www.youtube.com/embed/${embedLink}`}
                          allowFullScreen
                          className="courses_iframevideos"
                        ></iframe>
                        <p className="courses_videotitle">
                          Mastering HTML Basics and Beyond | Your Ultimate Guide
                          to Begin Web Development
                        </p>
                      </Col>
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              <CommonNodataFound title="No videos are available for this topic" />
            )}
          </Row>
        </div>
      )}
    </>
  );
}

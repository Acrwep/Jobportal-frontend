import React, { useState, useEffect } from "react";
import "./styles.css";
import { getAssessmentLinks, readTestLink } from "../Common/action";
import { useDispatch } from "react-redux";
import { storeNotificationCount } from "../Redux/slice";
import { Row, Col, Divider } from "antd";
import { timeAgo } from "../Common/Validation";
import Loader from "../Common/Loader";

export default function Assessments() {
  const dispatch = useDispatch();
  const [linkData, setLinkData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssessmentLinkData();
  }, []);

  const getAssessmentLinkData = async () => {
    setLoading(true);
    const loginuserId = localStorage.getItem("loginUserId");
    try {
      const response = await getAssessmentLinks(loginuserId);
      console.log("link response", response);
      const data = response?.data?.data || null;
      if (data) {
        setLinkData(data?.links || []);
        dispatch(storeNotificationCount(data?.unread_count));
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  const handleSeeMore = (index) => {
    let data = [...linkData];
    data[index].seemore = true;
    setLinkData(data);
  };

  const handleTextLink = async (id) => {
    try {
      const response = await readTestLink(id);
      getAssessmentLinkData();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <p className="portal_mainheadings">Assessment Links</p>
      {loading ? (
        <Loader />
      ) : (
        <div className="assessments_mainContainer">
          <div className="assessments_linkContainer">
            {linkData.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <Row
                    style={{
                      padding: "20px 16px 12px 16px",
                      backgroundColor:
                        item.status === "New" ? "rgba(55,143,233,0.2)" : "#fff",
                    }}
                  >
                    <Col xs={16} sm={16} md={20} lg={22}>
                      <a
                        className="assessments_testlinks"
                        style={{
                          width: item.seemore != true ? "86%" : "100%",
                        }}
                        href={item.test_link}
                        target="_blank"
                        onClick={() => handleTextLink(item.id)}
                      >
                        {item.seemore === true
                          ? item.test_link
                          : item.test_link.slice(0, 120)}{" "}
                        {item.seemore === false || !item.seemore ? (
                          <span
                            onClick={() => handleSeeMore(index)}
                            className="assessments_testlinks_seemore"
                            style={{
                              color: "rgba(0,0,0,0.6)",
                              cursor: "pointer",
                            }}
                          >
                            ...see more
                          </span>
                        ) : (
                          ""
                        )}
                      </a>
                    </Col>
                    <Col
                      xs={8}
                      sm={8}
                      md={4}
                      lg={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p className="assessments_timeagotext">
                        {timeAgo(item.created_date)}
                      </p>
                    </Col>
                  </Row>
                  <Divider className="assessments_linkdivider" />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

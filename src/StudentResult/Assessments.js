import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  getAssessmentLinks,
  getQuestionTypes,
  readTestLink,
} from "../Common/action";
import { useDispatch } from "react-redux";
import { storeNotificationCount } from "../Redux/slice";
import { Row, Col, Divider } from "antd";
import { timeAgo } from "../Common/Validation";
import Loader from "../Common/Loader";
import CommonNodataFound from "../Common/CommonNodataFound";
import { CommonToaster } from "../Common/CommonToaster";
import { jwtDecode } from "jwt-decode";

export default function Assessments() {
  const dispatch = useDispatch();
  const [linkData, setLinkData] = useState([]);
  const [typeData, setTypeData] = useState([]);
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
        const reverseData = data.links.reverse();
        setLinkData(reverseData);
        dispatch(storeNotificationCount(data?.unread_count));
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setTimeout(() => {
        getQuestionTypesData();
      }, 300);
    }
  };

  const getQuestionTypesData = async () => {
    try {
      const response = await getQuestionTypes();
      console.log("type response", response);
      const questionTypes = response?.data?.data || [];
      setTypeData(questionTypes);
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
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

  const handleSeeLess = (index) => {
    let data = [...linkData];
    data[index].seemore = false;
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

  const getQuestionTypeName = (link) => {
    const parts = link.split("/test-invite/")[1].split("/");
    const id = parts[0];
    let name = "";
    const filterData = typeData.find((f) => f.id === parseInt(id));

    if (filterData) {
      name = filterData.name;
    } else {
      name = "";
    }
    return name;
  };

  const extractToken = (url) => {
    const parts = url.split("/test-invite/");
    if (parts.length < 2) return null;

    const tokenPart = parts[1].split("/");
    return tokenPart.length === 1 ? tokenPart[0] : tokenPart[1];
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return true;

      const currentTime = Date.now() / 1000; // in seconds
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Invalid token:", error);
      return true; // treat invalid tokens as expired
    }
  };

  return (
    <div>
      <p className="portal_mainheadings">Assessment Links</p>
      {loading ? (
        <Loader />
      ) : (
        <div className="assessments_mainContainer">
          {linkData.length >= 1 ? (
            <div className="assessments_linkContainer">
              {linkData.map((item, index) => {
                const questionTypeName = getQuestionTypeName(item.test_link);
                const token = extractToken(item.test_link);
                const tokenExpireStatus = isTokenExpired(token);
                return (
                  <React.Fragment key={index}>
                    <Row
                      style={{
                        padding: "20px 16px 12px 16px",
                        backgroundColor:
                          item.status === "New"
                            ? "rgba(55,143,233,0.2)"
                            : "#fff",
                      }}
                    >
                      <Col xs={12} sm={12} md={14} lg={17}>
                        <a
                          className="assessments_testlinks"
                          href={item.test_link}
                          target="_blank"
                          onClick={() => handleTextLink(item.id)}
                        >
                          {/* {item.seemore === true
                            ? item.test_link
                            : item.test_link.slice(0, 120)}{" "} */}
                          Click here to begin your{" "}
                          <span style={{ fontWeight: 600 }}>
                            {questionTypeName}{" "}
                          </span>
                          assessment and demonstrate your skills by completing
                          the assigned test.{" "}
                        </a>

                        {/* {item.seemore === false || !item.seemore ? (
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
                          <span
                            onClick={() => handleSeeLess(index)}
                            className="assessments_testlinks_seemore"
                            style={{
                              color: "rgba(0,0,0,0.6)",
                              cursor: "pointer",
                            }}
                          >
                            ...see less
                          </span>
                        )} */}
                      </Col>
                      <Col
                        xs={8}
                        sm={8}
                        md={6}
                        lg={5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {item.is_completed === 1 ? (
                          <div className="assessmentlink_completedContainer">
                            Completed
                          </div>
                        ) : item.is_completed === 0 &&
                          tokenExpireStatus === true ? (
                          <div className="assessmentlink_expiredContainer">
                            Expired
                          </div>
                        ) : item.is_completed === 0 &&
                          tokenExpireStatus === false ? (
                          <div className="assessmentlink_pendingContainer">
                            Pending
                          </div>
                        ) : (
                          ""
                        )}
                      </Col>
                      <Col
                        xs={4}
                        sm={4}
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
          ) : (
            <CommonNodataFound title="No data found" />
          )}
        </div>
      )}
    </div>
  );
}

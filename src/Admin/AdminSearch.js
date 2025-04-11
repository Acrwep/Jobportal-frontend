import React, { useState, useEffect } from "react";
import { Row, Col, Select, Divider, Button, Spin } from "antd";
import Actelogo from "../images/acte-logo.png";
import { IoMdSearch } from "react-icons/io";
import "./styles.css";
import CommonSelectField from "../Common/CommonSelectField";
import CommonDoubleDatePicker from "../Common/CommonDoubleDatePicker";
import { searchByKeyword } from "../Common/action";
import { LoadingOutlined } from "@ant-design/icons";
import { CommonToaster } from "../Common/CommonToaster";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

export default function AdminSearch() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState([]);
  const courseNameOptions = [
    { id: "Java fullstack development", name: "Java fullstack development" },
    {
      id: "Python fullstack development",
      name: "Python fullstack development",
    },
  ];
  const [courseName, setCourseName] = useState("");
  const courseLocationOptions = [
    { id: "Anna nagar", name: "Anna nagar" },
    { id: "Velachery", name: "Velachery" },
  ];
  const [courseLocation, setCourseLocation] = useState("");
  const [courseJoiningDate, setCourseJoiningDate] = useState([]);
  const courseModeOptions = [
    { id: "Offline", name: "Offline" },
    { id: "Online", name: "Online" },
  ];
  const [courseMode, setCourseMode] = useState(null);

  const courseStatusOptions = [
    { id: "Inprogress", name: "Inprogress" },
    { id: "Completed", name: "Completed" },
  ];
  const [courseStatus, setCourseStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("searchKeyword");
  }, []);

  const handleDateChange = (dates, dateStrings) => {
    setCourseJoiningDate(dateStrings);
    const startDate = dateStrings[0];
    const endDate = dateStrings[1];
    if (dateStrings[0] != "" && dateStrings[1] != "") {
    }
  };

  const handleSearchSubmit = async () => {
    console.log("keyworddd", keyword, courseJoiningDate);
    if (keyword.length <= 0) {
      CommonToaster("Keyword is required");
      return;
    }
    localStorage.setItem("searchKeyword", JSON.stringify(keyword));
    const splitBySpace = keyword.join(" ");
    console.log(splitBySpace);

    setLoading(true);
    const payload = {
      q: splitBySpace,
      ...(courseName && { courseName: courseName }),
      ...(courseLocation && { courseLocation: courseLocation }),
      ...(courseMode && { courseMode: courseMode }),
      ...(courseStatus && { courseStatus: courseStatus }),
      ...(courseJoiningDate.length >= 1 &&
        courseJoiningDate[0] != "" && {
          startJoingingDate: courseJoiningDate[0],
        }),
      ...(courseJoiningDate.length >= 1 &&
        courseJoiningDate[1] != "" && {
          endJoiningDate: courseJoiningDate[1],
        }),
    };
    try {
      const response = await searchByKeyword(payload);
      console.log("search response", response);
      navigate("/profiles");
    } catch (error) {
      console.log(error);
      CommonToaster(error?.response?.data?.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* <div className="candidate_headerContainer">
        <Row align="middle">
          <Col span={12} className="candidate_headerlogoContainer">
            <img src={Actelogo} className="candidateregister_actelogo" />
          </Col>
          <Col span={12} className="candidate_headertextContainer"></Col>
        </Row>
      </div> */}
      <Header />

      <div className="adminsearch_mainContainer">
        <p className="adminsearch_heading">Search</p>
        <p className="adminsearch_label">Keywords</p>
        <div style={{ position: "relative" }}>
          <Select
            className="adminsearch_inputfield"
            suffixIcon={false}
            mode="tags"
            open={false}
            value={keyword}
            onChange={(value) => setKeyword(value)}
          />
          <IoMdSearch
            color="#0056b3"
            size={20}
            className="adminsearch_searchicon"
          />
        </div>
      </div>

      <div className="adminsearch_footer">
        <Divider className="registration_sectiondivider" />
        <div className="adminsearch_filterContainer">
          <p style={{ fontWeight: 600 }}>Filters</p>
          <div className="adminsearch_filter_searchContainer">
            <CommonSelectField
              options={courseLocationOptions}
              label="Branch location"
              style={{ width: "18%" }}
              allowClear={true}
              labelClassName="adminsearch_filterselectlabel"
              selectClassName="adminsearch_filterselectinput"
              onChange={(value) => {
                setCourseLocation(value);
              }}
            />
            <CommonSelectField
              options={courseNameOptions}
              label="Course name"
              style={{ width: "18%" }}
              allowClear={true}
              labelClassName="adminsearch_filterselectlabel"
              selectClassName="adminsearch_filterselectinput"
              onChange={(value) => {
                setCourseName(value);
              }}
            />
            <CommonSelectField
              options={courseModeOptions}
              label="Course mode"
              style={{ width: "18%" }}
              allowClear={true}
              labelClassName="adminsearch_filterselectlabel"
              selectClassName="adminsearch_filterselectinput"
              onChange={(value) => {
                setCourseMode(value);
              }}
            />
          </div>
          <div className="adminsearch_filter_searchContainer">
            <CommonSelectField
              options={courseStatusOptions}
              label="Course status"
              style={{ width: "18%" }}
              allowClear={true}
              labelClassName="adminsearch_filterselectlabel"
              selectClassName="adminsearch_filterselectinput"
              onChange={(value) => {
                setCourseStatus(value);
              }}
            />
            <CommonDoubleDatePicker
              label="joing date"
              value={courseJoiningDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="adminsearch_buttonContainer">
            {loading === true ? (
              <Button className="adminsearch_loadingbutton">
                <Spin
                  indicator={
                    <LoadingOutlined
                      spin
                      style={{ marginRight: "4px", color: "#ffffff" }}
                    />
                  }
                  size="small"
                />{" "}
                Loading...
              </Button>
            ) : (
              <Button
                className="adminsearch_button"
                onClick={handleSearchSubmit}
              >
                Search
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

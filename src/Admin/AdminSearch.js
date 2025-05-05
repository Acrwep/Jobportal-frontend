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
import { storePortalMenuStatus, storeLogoutMenuStatus } from "../Redux/slice";
import Header from "../Header/Header";
import CommonMultiSelect from "../Common/CommonMultiSelect";

export default function AdminSearch() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState([]);
  const courseNameOptions = [
    { id: "Fullstack Development", name: "Fullstack Development" },
    { id: "Software Testing", name: "Software Testing" },
    { id: "Data Science", name: "Data Science" },
    { id: "Data Analytics", name: "Data Analytics" },
    { id: "Cloud Computing", name: "Cloud Computing" },
    { id: "UI/UX", name: "UI/UX" },
    { id: "Digital Marketing", name: "Digital Marketing" },
  ];

  const [courseName, setCourseName] = useState("");

  const courseLocationOptions = [
    { id: "Online", name: "Online" },
    { id: "Anna nagar", name: "Anna nagar" },
    { id: "Velachery", name: "Velachery" },
    { id: "OMR", name: "OMR" },
    { id: "Porur", name: "Porur" },
    { id: "Electronic City", name: "Electronic City" },
    { id: "BTM Layout", name: "BTM Layout" },
  ];
  const [courseLocation, setCourseLocation] = useState([]);
  const eligibleStatusOptions = [
    { id: 1, name: "Eligible" },
    { id: 2, name: "Not Eligible" },
  ];
  const [eligibleStatus, setEligibleStatus] = useState(null);
  const [courseJoiningDate, setCourseJoiningDate] = useState([]);

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
    console.log(
      "keyworddd",
      keyword,
      "loca",
      courseLocation,
      "name",
      courseName,
      "status",
      courseStatus,
      "eli",
      eligibleStatus,
      courseJoiningDate,
      courseJoiningDate[0],
      courseJoiningDate[1]
    );
    if (
      keyword.length <= 0 &&
      courseLocation.length <= 0 &&
      (courseName === "" || courseName === undefined) &&
      (courseStatus === "" || courseStatus === undefined) &&
      (eligibleStatus === null || eligibleStatus === undefined) &&
      (courseJoiningDate[0] === undefined || courseJoiningDate[0] === "") &&
      (courseJoiningDate[1] === undefined || courseJoiningDate[1] === "")
    ) {
      CommonToaster("Atleast one filter is required");
      return;
    }
    localStorage.setItem("searchKeyword", JSON.stringify(keyword));
    localStorage.setItem("courseLocation", JSON.stringify(courseLocation));
    localStorage.setItem("courseName", courseName);
    localStorage.setItem("courseStatus", courseStatus);
    if (eligibleStatus === null) {
      localStorage.removeItem("eligibleStatus");
    } else {
      localStorage.setItem(
        "eligibleStatus",
        eligibleStatus === 1 ? true : false
      );
    }
    localStorage.setItem("courseJoiningStartDate", courseJoiningDate[0]);
    localStorage.setItem("courseJoiningEndDate", courseJoiningDate[1]);

    const splitBySpace = keyword.join(" ");
    console.log(splitBySpace);

    setLoading(true);
    const payload = {
      q: splitBySpace,
      ...(courseName && { courseName: courseName }),
      ...(courseLocation.length >= 1 && { courseLocation: courseLocation }),
      ...(courseStatus && { courseStatus: courseStatus }),
      ...(courseJoiningDate.length >= 1 &&
        courseJoiningDate[0] != "" && {
          startJoingingDate: courseJoiningDate[0],
        }),
      ...(courseJoiningDate.length >= 1 &&
        courseJoiningDate[1] != "" && {
          endJoiningDate: courseJoiningDate[1],
        }),
      ...(eligibleStatus && {
        eligibleStatus: eligibleStatus === 1 ? 1 : 0,
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

      <div
        className="adminsearch_mainContainer"
        onClick={() => {
          dispatch(storePortalMenuStatus(false));
          dispatch(storeLogoutMenuStatus(false));
        }}
      >
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "20%",
              }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  marginBottom: "4px",
                }}
              >
                Branches / Online
              </label>
              <Select
                options={courseLocationOptions.map((item) => ({
                  value: item.id ? item.id : item.name,
                  label: item.full_Name ? item.full_Name : item.name,
                }))}
                label="Branch location"
                style={{ width: "100%", minHeight: "35px" }}
                allowClear={true}
                onChange={(value) => {
                  setCourseLocation(value);
                }}
                mode="tags"
              />
            </div>
            <CommonSelectField
              options={courseNameOptions}
              label="Course name"
              style={{ width: "20%" }}
              allowClear={true}
              labelClassName="adminsearch_filterselectlabel"
              selectClassName="adminsearch_filterselectinput"
              onChange={(value) => {
                setCourseName(value);
              }}
            />
            <CommonSelectField
              options={courseStatusOptions}
              label="Course status"
              style={{ width: "20%" }}
              allowClear={true}
              labelClassName="adminsearch_filterselectlabel"
              selectClassName="adminsearch_filterselectinput"
              onChange={(value) => {
                setCourseStatus(value);
              }}
            />
          </div>
          <div className="adminsearch_filter_searchContainer">
            <CommonSelectField
              options={eligibleStatusOptions}
              label="Eligible status"
              style={{ width: "20%" }}
              allowClear={true}
              labelClassName="adminsearch_filterselectlabel"
              selectClassName="adminsearch_filterselectinput"
              onChange={(value) => {
                setEligibleStatus(value);
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

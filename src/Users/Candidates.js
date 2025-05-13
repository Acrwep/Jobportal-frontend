import React, { useEffect, useState } from "react";
import { Row, Col, Input, Spin, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import CommonTable from "../Common/CommonTable";
import { IoIosSend } from "react-icons/io";
import { CommonToaster } from "../Common/CommonToaster";
import {
  getCandidates,
  getCourses,
  sendInterviewRequest,
} from "../Common/action";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import PortalSelectField from "../Common/PortalSelectField";
import PortalDoubleDatePicker from "../Common/PortalDoubleDatePicker";
import CommonDoubleDatePicker from "../Common/CommonDoubleDatePicker";
const { Search } = Input;

export default function Candidates() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const branchOptions = [
    { id: "Online", name: "Online" },
    { id: "Anna nagar", name: "Anna nagar" },
    { id: "Velachery", name: "Velachery" },
    { id: "OMR", name: "OMR" },
    { id: "Porur", name: "Porur" },
    { id: "Electronic City", name: "Electronic City" },
    { id: "BTM Layout", name: "BTM Layout" },
  ];
  const [branchId, setBranchId] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  const columns = [
    { title: "Name", key: "name", dataIndex: "name", width: 200 },
    { title: "Email", key: "email", dataIndex: "email", width: 260 },
    {
      title: "Branch",
      key: "course_location",
      dataIndex: "course_location",
      width: 200,
    },
    {
      title: "Course",
      key: "course_name",
      dataIndex: "course_name",
      width: 260,
    },
    {
      title: "Course Joining Date",
      key: "course_join_date",
      dataIndex: "course_join_date",
      width: 200,
      render: (text, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>{text ? moment(text).format("DD/MM/YYYY") : "-"}</p>
          </div>
        );
      },
    },
    {
      title: "Test Attempt",
      key: "attempt_number",
      dataIndex: "attempt_number",
      width: 180,
      render: (text, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>{text}</p>
          </div>
        );
      },
    },
    {
      title: "Last Interview Request",
      key: "last_email_sent_date",
      dataIndex: "last_email_sent_date",
      render: (text, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>{text ? moment(text).format("DD/MM/YYYY") : "-"}</p>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getCourseData();
  }, []);

  const getCourseData = async () => {
    try {
      const response = await getCourses();
      console.log("course response", response);
      if (response?.data?.data) {
        setCourseOptions(response?.data?.data);
      } else {
        setCourseOptions([]);
      }
    } catch (error) {
      setCourseOptions([]);
      console.log("course error", error);
    } finally {
      setTimeout(() => {
        getCandidatesData(null, null);
      }, 300);
    }
  };

  const getCandidatesData = async (branchid, courseid, fromDate, toDate) => {
    setTableLoading(true);
    const payload = {
      course_location: branchid,
      course_id: courseid,
      from_date: fromDate,
      to_date: toDate,
    };
    try {
      const response = await getCandidates(payload);
      setData(response?.data?.data || []);
    } catch (error) {
      setData([]);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        setTableLoading(false);
      }, 500);
    }
  };

  const handleSelectedRow = (row) => {
    console.log("selected rowwww", row);
    setSelectedRows(row);
  };

  const handleSendRequest = async () => {
    if (selectedRows.length >= 1) {
      setRequestLoading(true);
      const filterData = selectedRows.map((item) => {
        return { id: item.id, course_id: item.course_id };
      });
      const payload = {
        users: filterData,
      };
      console.log("payloaddd", payload);

      try {
        await sendInterviewRequest(payload);
        CommonToaster("Request sent to email successfully!");
      } catch (error) {
        CommonToaster(
          error?.response?.data?.message ||
            "Something went wrong. Try again later"
        );
      } finally {
        setTimeout(() => {
          setRequestLoading(false);
          getCandidatesData();
        }, 500);
      }
    } else {
      CommonToaster("Please select candidate");
    }
  };

  // onchange functions
  const handleBranchFilter = (value) => {
    setBranchId(value);
    getCandidatesData(
      value,
      courseId,
      selectedDates.length >= 1 ? selectedDates[0] : null,
      selectedDates.length >= 1 ? selectedDates[1] : null
    );
  };

  const handleCourseFilter = (value) => {
    setCourseId(value);
    getCandidatesData(
      branchId,
      value,
      selectedDates.length >= 1 ? selectedDates[0] : null,
      selectedDates.length >= 1 ? selectedDates[1] : null
    );
  };

  const handleDateChange = (dates, dateStrings) => {
    setSelectedDates(dateStrings);
    const startDate = dateStrings[0];
    const endDate = dateStrings[1];
    if (dateStrings[0] != "" && dateStrings[1] != "") {
      getCandidatesData(branchId, courseId, startDate, endDate);
    } else {
      getCandidatesData(branchId, courseId, null, null);
    }
  };

  return (
    <div>
      <p className="portal_mainheadings">Candidates</p>

      <Row style={{ marginTop: "22px" }}>
        <Col xs={24} sm={24} md={24} lg={14}>
          <div className="questionupload_filterContainer">
            <PortalSelectField
              options={branchOptions}
              style={{ width: "34%" }}
              placeholder="Select Branch"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              onChange={handleBranchFilter}
              value={branchId}
            />
            <PortalSelectField
              options={courseOptions}
              style={{ width: "34%" }}
              placeholder="Select Course"
              selectClassName="questionupload_filterselectfield"
              allowClear={true}
              onChange={handleCourseFilter}
              value={courseId}
            />
            {/* <CommonDoubleDatePicker /> */}
            <PortalDoubleDatePicker
              value={selectedDates}
              onChange={handleDateChange}
            />
          </div>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={10}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {requestLoading ? (
            <button className="candidate_disablesendrequestbutton">
              <>
                <Spin
                  size="small"
                  indicator={
                    <LoadingOutlined
                      style={{ color: "#ffffff", marginRight: "6px" }}
                      spin
                    />
                  }
                />{" "}
              </>
            </button>
          ) : (
            <button
              className="candidate_sendrequestbutton"
              onClick={handleSendRequest}
            >
              <IoIosSend size={19} style={{ marginRight: "4px" }} />
              Send Interview Request
            </button>
          )}
        </Col>
      </Row>

      <div style={{ marginTop: "22px" }}>
        <CommonTable
          scroll={{ x: 1600 }}
          columns={columns}
          dataSource={data}
          dataPerPage={10}
          loading={tableLoading}
          checkBox="true"
          size="small"
          className="questionupload_table"
          selectedDatas={handleSelectedRow}
        />
      </div>
    </div>
  );
}

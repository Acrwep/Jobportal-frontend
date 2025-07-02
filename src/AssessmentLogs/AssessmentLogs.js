import React, { useEffect, useState } from "react";
import { getAssessmentLogs } from "../Common/action";
import moment from "moment";
import CommonTable from "../Common/CommonTable";
import { Button, Col, Row } from "antd";
import CommonDatePicker from "../Common/CommonDatePicker";
import { MdOutlineFileDownload } from "react-icons/md";
import { DownloadOutlined } from "@ant-design/icons";
import "./styles.css";
import CommonSelectField from "../Common/CommonSelectField";
import PortalSelectField from "../Common/PortalSelectField";
import PortalDatePicker from "../Common/PortalDatePicker";
import DownloadTableAsCSV from "../Common/DownloadTableAsCSV";

export default function AssessmentsLogs() {
  const [logData, setLogData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [date, setDate] = useState(null);
  const statusOptions = [
    { id: "Completed", name: "Completed" },
    { id: "Not Completed", name: "Not Completed" },
  ];
  const [status, setStatus] = useState(null);

  const columns = [
    { title: "Name", key: "name", dataIndex: "name", width: 170 },
    { title: "Email", key: "email", dataIndex: "email", width: 220 },
    { title: "Branch", key: "branch", dataIndex: "branch", width: 140 },
    {
      title: "Course",
      key: "course_name",
      dataIndex: "course_name",
      width: 200,
    },
    {
      title: "Status",
      key: "is_completed",
      dataIndex: "is_completed",
      width: 160,
      render: (text, record) => {
        return (
          <div>
            <p>{text === 1 ? "Completed" : "Not Completed"}</p>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    const today = new Date();
    setDate(today);
    getLogsData(today, null);
  }, []);

  const getLogsData = async (requestDate, requestStatus) => {
    setTableLoading(true);
    const payload = {
      date: moment(requestDate).format("YYYY-MM-DD"),
      ...(requestStatus && {
        is_completed: requestStatus === "Completed" ? 1 : 0,
      }),
    };
    try {
      const response = await getAssessmentLogs(payload);
      console.log("logs response", response);
      const data = response?.data?.data || [];
      setLogData(data);
    } catch (error) {
      console.log("logs error", error);
    } finally {
      setTimeout(() => {
        setTableLoading(false);
      }, 300);
    }
  };

  const handleRequestDate = (value) => {
    setDate(value);
    getLogsData(value, status);
  };

  const handleStatus = (value) => {
    setStatus(value);
    getLogsData(date, value);
  };

  return (
    <div>
      <p className="portal_mainheadings">
        Assessment Logs{" "}
        <span style={{ fontSize: "22px" }}>{`( ${logData.length} )`}</span>
      </p>

      <Row style={{ marginTop: "12px", alignItems: "center" }}>
        <Col xs={24} sm={24} md={24} lg={12}>
          <PortalSelectField
            placeholder="Select status"
            selectClassName="questionupload_filterselectfield"
            options={statusOptions}
            value={status}
            onChange={handleStatus}
            allowClear={true}
            hideError={true}
            style={{ width: "35%" }}
          />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <div style={{ width: "35%", height: "34px" }}>
            <PortalDatePicker value={date} onChange={handleRequestDate} />
          </div>
          <button
            className="logs_downloadbutton"
            onClick={() =>
              DownloadTableAsCSV(
                logData,
                columns,
                `Assessment Logs ${moment(date).format("DD-MM-YYYY")}.csv`
              )
            }
          >
            <DownloadOutlined size={22} />
          </button>
        </Col>
      </Row>
      <div style={{ marginTop: "22px" }}>
        <CommonTable
          scroll={{ x: 900 }}
          columns={columns}
          dataSource={logData}
          dataPerPage={10}
          loading={tableLoading}
          checkBox="false"
          size="small"
          className="questionupload_table"
        />
      </div>
    </div>
  );
}

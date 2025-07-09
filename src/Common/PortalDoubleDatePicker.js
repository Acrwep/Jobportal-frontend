import React from "react";
import dayjs from "dayjs";
import moment from "moment";
import { DatePicker, Space } from "antd";
import "./commonstyles.css";
import { CommonToaster } from "./CommonToaster";
const { RangePicker } = DatePicker;

export default function PortalDoubleDatePicker({
  onChange,
  value,
  label,
  style,
}) {
  const handleRangePickerChange = (dates, dateStrings) => {
    // If dates are selected
    if (dates && dates.length === 2) {
      const startDate = dates[0];
      const endDate = dates[1];
      const diffDays = endDate.diff(startDate, "days");

      // if (diffDays > 15) {
      //   CommonToaster("Please select a date range of 15 days or less", "error");
      //   return;
      // }
    }
    // Pass the onChange event to parent component if provided
    if (onChange) {
      onChange(dates, dateStrings);
    }
  };
  const disabledDate = (current) => {
    // Disable dates that are after today
    return current && current > moment().endOf("day");
  };
  return (
    <div className="commonInputfield_container" style={style}>
      <div style={{ display: "flex" }}>
        {label && (
          <label
            style={{ marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}
          >
            {label}
          </label>
        )}
      </div>
      <Space direction="vertical" size={12}>
        <RangePicker
          className="portalInputfield"
          value={
            value && value.length === 2 && value[0] && value[1]
              ? [dayjs(value[0]), dayjs(value[1])]
              : null
          }
          onChange={handleRangePickerChange}
          disabledDate={disabledDate}
          // allowClear={true}
        />
      </Space>
    </div>
  );
}

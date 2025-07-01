import React from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import "./commonstyles.css";
export default function PortalDatePicker({
  onChange,
  value,
  defaultValue,
  month,
  placeholder,
  label,
  error,
  mandatory,
  style,
  disabled,
}) {
  const handleChange = (date) => {
    const dates = new Date(date.$d);

    // Format the date using toString method
    const formattedDate = dates.toString();
    onChange(formattedDate);
  };

  // Disable future dates
  const disableFutureDates = (current) => {
    return current && current > dayjs().endOf("day"); // Disable dates greater than today
  };

  return (
    <div style={style}>
      <div style={{ display: "flex" }}>
        {label && <label className="commonfield_label">{label}</label>}
        {mandatory === true ? <p className="commonfield_asterisk">*</p> : ""}
      </div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <DatePicker
          className={
            error === "" || error === null || error === undefined
              ? "portalInputfield"
              : "portalInputfield_error"
          }
          picker={month === "true" ? "month" : "date"}
          onChange={handleChange}
          value={value ? dayjs(value) : null}
          defaultValue={defaultValue}
          format="DD-MM-YYYY"
          placeholder={placeholder}
          status={error ? "error" : ""}
          style={{ width: "100%" }}
          allowClear={false}
          disabledDate={disableFutureDates}
          disabled={disabled}
        />
      </Space>
      <div
        className={
          error
            ? "commoninput_errormessage_activediv"
            : "commoninput_errormessagediv"
        }
      >
        <p className="commonfield_errortext">{label + error}</p>
      </div>
    </div>
  );
}

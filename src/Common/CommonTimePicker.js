import React from "react";
import { Space, TimePicker } from "antd";
import "./commonstyles.css";

const CommonTimePicker = ({
  onChange,
  value,
  label,
  error,
  mandatory,
  style,
}) => {
  //   const onChange = (time, timeString) => {
  //     console.log(time, timeString);
  //   };
  return (
    <div style={style}>
      <div style={{ display: "flex" }}>
        <label className="commonfield_label">{label}</label>
        {mandatory ? (
          <p className="commontimepicker_ashtetik" style={{ color: "red" }}>
            *
          </p>
        ) : (
          ""
        )}
      </div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <TimePicker
          use12Hours
          format="h A"
          value={value}
          onChange={onChange}
          placeholder="Select time"
          style={{ width: "100%" }}
          status={error ? "error" : ""}
        />
      </Space>
      <div
        className={
          error
            ? "commoninput_errormessage_activediv"
            : "commoninput_errormessagediv"
        }
      >
        <p style={{ color: "#ff4d4f", marginTop: "2px" }}>{label + error}</p>
      </div>
    </div>
  );
};
export default CommonTimePicker;

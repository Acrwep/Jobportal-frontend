import React from "react";
import { Input } from "antd";
import "./commonstyles.css";

const CommonInputField = ({
  label,
  placeholder,
  onChange,
  name,
  value,
  error,
  maxLength,
  mandatory,
  style,
  addonAfter,
  prefix,
  className,
  type,
  suffix,
}) => {
  return (
    <div style={style} className="commonInputfield_container">
      {label && (
        <div style={{ display: "flex" }}>
          <label className="commonfield_label">{label}</label>
          {mandatory === true ? <p className="commonfield_asterisk">*</p> : ""}
        </div>
      )}
      <Input
        // className={`commonInputfield ${className}`}
        className={`${
          error === "" || error === null || error === undefined
            ? "commonInputfield"
            : "commonInputfield_error"
        } ${className}`}
        label={label}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        error={error}
        status={error ? "error" : ""}
        maxLength={maxLength}
        addonAfter={addonAfter}
        prefix={prefix}
        type={type}
        suffix={suffix}
      />
      <div
        className={
          error
            ? "commoninput_errormessage_activediv"
            : "commoninput_errormessagediv"
        }
      >
        <p className="commonfield_errortext">
          {label === "College Department"
            ? "Department" + error
            : label + error}
        </p>
      </div>
    </div>
  );
};
export default CommonInputField;

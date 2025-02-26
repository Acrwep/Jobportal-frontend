import React from "react";
import { Select } from "antd";
import "./commonstyles.css";

export default function CommonMultiSelect({
  label,
  mandatory,
  onChange,
  value,
  error,
  disabled,
  loading,
  placeholder,
  defaultValue,
}) {
  return (
    <div>
      {label ? (
        <div style={{ display: "flex" }}>
          <label className="commonfield_label">{label}</label>
          {mandatory === true ? <p className="commonfield_asterisk">*</p> : ""}
        </div>
      ) : (
        ""
      )}
      <Select
        className={
          error === "" || error === null || error === undefined
            ? "commonMultiselectfield"
            : "commonSelectfield_error"
        }
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
        open={false}
        suffixIcon={false}
        onChange={onChange}
        value={value}
        error={error}
        status={error ? "error" : ""}
        mode="tags"
        placeholder={placeholder}
        showSearch={true}
        disabled={disabled}
        allowClear={false}
        filterOption={(input, option) =>
          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        defaultValue={defaultValue}
        loading={loading}
      />

      <div
        className={
          error
            ? "commoninput_errormessage_activediv"
            : "commoninput_errormessagediv"
        }
      >
        <p className="commonfield_errortext">
          {label ? label + error : "" + error}
        </p>
      </div>
    </div>
  );
}

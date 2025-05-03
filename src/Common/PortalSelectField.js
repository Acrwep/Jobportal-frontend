import React from "react";
import { Select } from "antd";
import "./commonstyles.css";

/**
 * @typedef {Object} CommonSelectFieldProps
 * @property {string} [label]
 * @property {string} [placeholder]
 * @property {any} [onChange]
 * @property {any} [value]
 * @property {string} [error]
 * @property {any[]} [options]
 * @property {boolean} [mandatory]
 * @property {React.CSSProperties} [style]
 * @property {string} [defaultValue]
 * @property {string} [className]
 * @property {string} [mode]
 * @property {boolean} [disabled]
 */
/**
 * * @param {CommonSelectFieldProps} props
 */

export default function PortalSelectField({
  label,
  options,
  onChange,
  value,
  error,
  mandatory,
  mode,
  placeholder,
  className,
  labelClassName,
  selectClassName,
  style,
  defaultValue,
  allowClear,
  disabled,
  loading,
}) {
  return (
    <div style={style} className={className}>
      {label ? (
        <div style={{ display: "flex" }}>
          <label
            className={labelClassName ? labelClassName : "commonfield_label"}
          >
            {label}
          </label>
          {mandatory === true ? <p className="commonfield_asterisk">*</p> : ""}
        </div>
      ) : (
        ""
      )}
      <Select
        className={
          error === "" || error === null || error === undefined
            ? selectClassName
              ? selectClassName
              : "portalSelectfield"
            : "commonSelectfield_error"
        }
        style={{ width: "100%" }}
        onChange={onChange}
        options={options.map((item) => ({
          value: item.id ? item.id : item.name,
          label: item.full_Name ? item.full_Name : item.name,
        }))}
        value={value}
        error={error}
        status={error ? "error" : ""}
        mode={mode}
        placeholder={placeholder}
        showSearch={true}
        disabled={disabled}
        allowClear={allowClear ? allowClear : false}
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

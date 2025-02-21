import React from "react";
import { Input, Space } from "antd";
import "./commonstyles.css";
const { Search } = Input;

export default function CommonSearchField({
  onSearch,
  placeholder,
  value,
  style,
  className,
  onChange,
}) {
  return (
    <div style={style}>
      <Space direction="vertical">
        <Search
          className={`commonsearchbar ${className}`}
          placeholder={placeholder}
          allowClear
          onSearch={onSearch}
          onChange={onChange}
          style={{
            width: 240,
          }}
          value={value}
        />
      </Space>
    </div>
  );
}

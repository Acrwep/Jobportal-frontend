import React, { useState, useEffect } from "react";
import { Table } from "antd";

const CommonTable = ({
  columns,
  dataSource,
  dataPerPage,
  scroll,
  bordered,
  selectedDatas,
  checkBox,
  loading,
  paginationStatus,
  size,
  className,
}) => {
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: dataPerPage || 10,
      showSizeChanger: true, // Enable the dropdown for changing page size
      pageSizeOptions: ["10", "20", "50", "100"], // Options for page size
    },
  });

  useEffect(() => {
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        total: dataSource.length,
      },
    }));
  }, [dataSource]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination: {
        ...pagination,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"], // Keep the page size options
      },
      filters,
      sortOrder: sorter.order,
      sortField: sorter.field,
    });
  };

  const rowSelection =
    checkBox === "false"
      ? null
      : {
          onChange: (selectedRowKeys, selectedRows) => {
            if (selectedDatas) {
              selectedDatas(selectedRows);
            }
          },
        };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataSource}
      scroll={scroll}
      pagination={paginationStatus === false ? false : tableParams.pagination}
      onChange={handleTableChange}
      tableLayout="fixed"
      bordered={bordered === "true"}
      loading={loading}
      size={size}
      className={className}
      rowKey={(record) => record.id}
    />
  );
};

export default CommonTable;

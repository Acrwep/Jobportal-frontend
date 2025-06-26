import * as XLSX from "xlsx";
import moment from "moment";

const DownloadTableAsCSV = (data, columns, fileName) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Map columns and data to create a worksheet
  const worksheetData = [
    columns.map((column) => column.title), // headers
    ...data.map((row) =>
      columns.map((column) => {
        // Format time fields using moment
        if (
          column.dataIndex === "date" ||
          column.dataIndex === "attempt_date"
        ) {
          return row[column.dataIndex]
            ? moment(row[column.dataIndex]).format("DD/MM/YYYY")
            : null;
        }
        if (column.dataIndex === "totalnumberof_questions") {
          return "50";
        }
        if (column.dataIndex === "percentage") {
          return row[column.dataIndex] + "%";
        }
        return row[column.dataIndex]; // other fields
      })
    ), // data rows
  ];

  // Create worksheet from array of arrays
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to file
  XLSX.writeFile(workbook, fileName);
};

export default DownloadTableAsCSV;

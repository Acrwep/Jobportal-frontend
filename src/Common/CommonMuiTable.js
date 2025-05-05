import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled TableCell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    color: "gray",
    fontWeight: 600,
    fontFamily: '"Lexend", serif',
    borderRight: "1px solid #e0e0e0",
    paddingTop: 4,
    paddingBottom: 4,
    height: 48,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    fontWeight: 350,
    fontFamily: '"Lexend", serif',
    borderRight: "1px solid #e0e0e0",
    paddingTop: 4,
    paddingBottom: 4,
    height: 46,
  },
}));

// Styled TableRow
const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    // backgroundColor: "#fafafa",
  },
}));

const CommonMuiTable = ({ columns = [], data = [], tableWidth }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      sx={{
        borderRadius: "6px",
        boxShadow: "0 4px 12px #00000014",
        width: "100%",
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 400,
          overflowX: "auto",
          width: "100%",
          borderRadius: "6px",
        }}
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            minWidth: tableWidth,
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <StyledTableCell
                  key={idx}
                  align={col.align || "start"}
                  sx={{
                    minWidth: col.width || "150px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, rowIdx) => (
              <StyledTableRow key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <StyledTableCell key={colIdx} align={col.align || "start"}>
                    {row[col.key]}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 20, 50, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default CommonMuiTable;

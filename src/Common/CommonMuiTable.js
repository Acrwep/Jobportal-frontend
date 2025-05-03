import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  Box,
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
    paddingBottom: 4, // reduce vertical padding
    height: 48, // optional fixed height
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
    paddingBottom: 4, // reduce vertical padding
    height: 46, // optional fixed height
  },
}));

// Styled TableRow
const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#fafafa",
  },
}));

const CommonMuiTable = ({ columns = [], rows = [], tableWidth }) => {
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
          overflowX: "auto", // horizontal scroll
          width: "100%",
          borderRadius: "6px", // to make it look nicer
        }}
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            minWidth: tableWidth, // Ensure there's enough width for horizontal scrolling
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <StyledTableCell
                  key={idx}
                  align={col.align || "start"}
                  sx={{ minWidth: col.width || "150px", whiteSpace: "nowrap" }}
                >
                  {col.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIdx) => (
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
    </Box>
  );
};

export default CommonMuiTable;

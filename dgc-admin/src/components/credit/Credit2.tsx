import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(
  portef: string,
  program: string,
  sprogram: string,
  t1_credit: number,
  t1_depense: number,
  t1_solde: number,
  t2_credit: number,
  t2_depense: number,
  t2_solde: number
) {
  return {
    portef,
    program,
    sprogram,
    t1_credit,
    t1_depense,
    t1_solde,
    t2_credit,
    t2_depense,
    t2_solde,
  };
}

const rows = [
  createData(
    "01",
    "",
    "",
    123243.45,
    123243.45,
    123243.45,
    123243.45,
    123243.45,
    123243.45
  ),
  createData(
    "",
    "15",
    "",
    123243.45,
    123243.45,
    123243.45,
    123243.45,
    123243.45,
    123243.45
  ),
  createData(
    "",
    "",
    "94",
    123243.45,
    123243.45,
    123243.45,
    123243.45,
    123243.45,
    123243.45
  ),
];

export default function DenseTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Portef</TableCell>
            <TableCell align="right">Program</TableCell>
            <TableCell align="right">SProgram</TableCell>
            <TableCell align="right">Credit (T1)</TableCell>
            <TableCell align="right">Depense (T1)</TableCell>
            <TableCell align="right">Solde (T1)</TableCell>
            <TableCell align="right">Credit (T2)</TableCell>
            <TableCell align="right">Depense (T2)</TableCell>
            <TableCell align="right">Solde (T2)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.portef + row.program + row.sprogram}
              sx={{ "&:last-chil td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right" component="th" scope="row">
                {row.portef}
              </TableCell>
              <TableCell align="right">{row.program}</TableCell>
              <TableCell align="right">{row.sprogram}</TableCell>
              <TableCell align="right">{row.t1_credit}</TableCell>
              <TableCell align="right">{row.t1_depense}</TableCell>
              <TableCell align="right">{row.t1_solde}</TableCell>
              <TableCell align="right">{row.t2_credit}</TableCell>
              <TableCell align="right">{row.t2_depense}</TableCell>
              <TableCell align="right">{row.t2_solde}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

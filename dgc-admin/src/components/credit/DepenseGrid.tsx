import * as React from "react";

import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/material-ui";
import { useTree } from "@table-library/react-table-library/tree";
import {
  FaChevronRight,
  FaChevronDown,
  FaCaretRight,
  FaCaretDown,
} from "react-icons/fa";

import { VscTriangleRight, VscTriangleDown } from "react-icons/vsc";
import { useListContext } from "react-admin";

import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import Credit2 from "./Credit2";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { size } from "lodash";

export const DepenseGrid = () => {
  const { data, isLoading } = useListContext();
  const data2 = isLoading ? { nodes: [] } : { nodes: data };
  const materialTheme = getTheme({
    horizontalSpacing: 5,
    verticalSpacing: 5,
    striped: true,
    highlightOnHover: true,
  });
  const theme = useTheme([
    materialTheme,
    {
      BaseCell: `
        &:nth-of-type(3n+2){
          color:#004d40;
        }
        &:nth-of-type(3n+3){
          color:#b71c1c;
        }
        &:nth-of-type(3n+4){
          color:#1a237e;
        }
        text-align: right;

        &:first-of-type {
          text-align: left;
        }

        &:last-of-type {
          text-align: right;
        }
      `,
      Cell: `
        &{
          // font-weight:bold;
          font-family: monospace;
        }
      `,
    },
  ]);

  // const tree2 = useTree(
  //   data2,
  //   {
  //     onChange: onTreeChange,
  //   },
  //   {
  //     treeIcon: {
  //       margin: "4px",
  //       iconDefault: null,
  //       iconRight: <FaCaretRight />,
  //       iconDown: <FaCaretDown />,
  //     },
  //   }
  // );

  const tree = useTree(
    data2,
    {
      onChange: onTreeChange,
    },
    {
      treeIcon: {
        margin: "4px",
        iconDefault: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ height: "20px", width: "20px" }} />
            {/* <DescriptionOutlinedIcon fontSize="small" /> */}
            <DescriptionOutlinedIcon fontSize="small" />
          </div>
        ),
        iconRight: (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <KeyboardArrowRightIcon fontSize="small" /> */}
            {/* <AddBoxOutlinedIcon sx={{ fontSize: 15 }} /> */}
            <FaCaretRight fontSize={10} />
            <FolderIcon fontSize="small" />
          </div>
        ),
        iconDown: (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <ExpandMoreIcon fontSize="small" /> */}
            {/* <IndeterminateCheckBoxOutlinedIcon sx={{ fontSize: 15 }} /> */}
            <FaCaretDown fontSize={10} />
            <FolderOpenIcon fontSize="small" />
          </div>
        ),
      },
    }
  );

  function onTreeChange(action: any, state: any) {
    // console.log(action, state);
  }
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const COLUMNS = [
    {
      label: "PRTF/ORDN/PROG/SPROG",
      renderCell: (item: any) => item.code,
      tree: true,
    },
    {
      label: "Crédit",
      renderCell: (item: any) => formatter.format(item.credit),
      pinRight: true,
    },
    {
      label: "Dépense",
      renderCell: (item: any) => formatter.format(item.depense),
    },
    {
      label: "Solde",
      renderCell: (item: any) => formatter.format(item.solde),
    },
    {
      label: "%",
      renderCell: (item: any) => item.percent + "%",
    },
  ];
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <CompactTable
      // select={true}
      // layout={{ fixedHeader: true }}
      columns={COLUMNS}
      data={data2}
      theme={theme}
      tree={tree}
    />
    // <table>
    //   <tr>
    //     <th colspan="2">Name</th>
    //     <th>Age</th>
    //   </tr>
    //   <tr>
    //     <td>Jill</td>
    //     <td>Smith</td>
    //     <td>43</td>
    //   </tr>
    //   <tr>
    //     <td>Eve</td>
    //     <td>Jackson</td>
    //     <td>57</td>
    //   </tr>
    // </table>
    // <Credit2 />
  );
};

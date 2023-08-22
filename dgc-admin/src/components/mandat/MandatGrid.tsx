import * as React from "react";

import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/material-ui";
import { useTree } from "@table-library/react-table-library/tree";
import { FaCaretRight, FaCaretDown } from "react-icons/fa";

import { useListContext } from "react-admin";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

export const MandatGrid = () => {
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
            <DescriptionOutlinedIcon fontSize="small" />
          </div>
        ),
        iconRight: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaCaretRight fontSize={10} />
            <FolderIcon fontSize="small" />
          </div>
        ),
        iconDown: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaCaretDown fontSize={10} />
            <FolderOpenIcon fontSize="small" />
          </div>
        ),
      },
    }
  );

  function onTreeChange(action: any, state: any) {}
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const COLUMNS = [
    {
      label: "PRTF/ORDN/PROG/SPROG/MNDT",
      renderCell: (item: any) => item.code,
      tree: true,
      resize: { minWidth: 2000 },
    },
    {
      label: "Titre",
      renderCell: (item: any) => item.titre,
      pinRight: true,
    },
    {
      label: "Montant Brut",
      renderCell: (item: any) =>
        item.mt_brut == null ? "" : formatter.format(item.mt_brut),
    },
    {
      label: "Montant Net",
      renderCell: (item: any) =>
        item.mt_net == null ? "" : formatter.format(item.mt_net),
    },
    {
      label: "Mois",
      renderCell: (item: any) => item.mois,
    },
    {
      label: "Gestion",
      renderCell: (item: any) => item.gestion,
    },
  ];

  return (
    <CompactTable columns={COLUMNS} data={data2} theme={theme} tree={tree} />
  );
};

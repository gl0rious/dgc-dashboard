import { useState } from "react";
import {
  Datagrid,
  FilterButton,
  List,
  SelectInput,
  TextField,
  TextInput,
  TopToolbar,
  Button,
  useListContext,
  LinearProgress,
  Loading,
  useNotify,
  useTranslate,
} from "react-admin";
import IconClose from "@mui/icons-material/Close";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";

const personFilters = [
  <SelectInput
    sx={{ width: 200 }}
    source="type"
    choices={[
      { id: "tous", name: "Tous" },
      { id: "fonct", name: "Fonctionnaire" },
      { id: "fourn", name: "Fournisseur" },
      { id: "autre", name: "Autre" },
    ]}
  />,
  <TextInput source="nom__icontains" label="Nom" />,
  <TextInput source="idt_fiscal__icontains" label="Identifiant" />,
  <TextInput source="num_compte__icontains" label="N° Compte" />,
  <TextInput source="num_reg_comm__icontains" label="N° Registre Commerce" />,
  <TextInput source="code_ord__icontains" label="Ordonnateur" />,
];

const ListActions = ({ onClose }: any) => (
  <TopToolbar>
    <FilterButton />
    <ExportTXTButton />
    <ExportPDFButton />
    <Button onClick={onClose} label="Fermer" variant="contained">
      <IconClose />
    </Button>
  </TopToolbar>
);

const ExportTXTButton = () => {
  const { filterValues, sort } = useListContext();
  const onExportTXTClicked = () => {
    downloadFile(filterValues, sort, "personnes", "txt");
  };
  return (
    <Button onClick={onExportTXTClicked} label="Export TXT" variant="outlined">
      <ArticleOutlinedIcon />
    </Button>
  );
};

const ExportPDFButton = () => {
  const notify = useNotify();
  const { filterValues, sort } = useListContext();
  const [loading, setLoading] = useState(false);
  const onExportPDFClicked = () => {
    setLoading(true);
    downloadFile(filterValues, sort, "personnes", "pdf")
      .catch((error) => {
        notify(error, { type: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Button
      onClick={onExportPDFClicked}
      label="Export PDF"
      variant="outlined"
      disabled={loading}
    >
      {loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
    </Button>
  );
};

export const PersonneList = () => {
  return (
    <List filters={personFilters} actions={<ListActions />}>
      <Datagrid rowClick="show" optimized bulkActionButtons={false}>
        <TextField source="nom" label="Nom" />
        <TextField source="idt_fiscal" label="ID Benef" />
        <TextField source="num_compte" label="N° Compte" />
        <TextField source="num_reg_comm" label="N° Registre Commerce" />
        <TextField source="code_ord" label="Ordonnateur" />
        <TextField source="adr" label="Adresse" sortable={false} />
      </Datagrid>
    </List>
  );
};

const downloadFile = async (
  filterValues: any,
  sort: any,
  filename: string,
  format: string
): Promise<void> => {
  if (format !== "txt" && format !== "pdf")
    return Promise.reject("export.wrong_format");
  const { field, order } = sort;
  const sortby = (order === "DESC" ? "-" : "") + field;
  const url =
    `http://localhost:8000/api/personnes/?frm=${format}&ordering=${sortby}&` +
    new URLSearchParams(filterValues).toString();
  return await fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const fakeLink = document.createElement("a");
      fakeLink.style.display = "none";
      document.body.appendChild(fakeLink);
      // @ts-ignore
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // Manage IE11+ & Edge
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        const date = dayjs().format("YYYY-MM-DD~HH-mm-ss");
        fakeLink.setAttribute("href", URL.createObjectURL(blob));
        fakeLink.setAttribute("download", `${filename}_${date}.${format}`);
        fakeLink.click();
        fakeLink.remove();
      }
    });
};

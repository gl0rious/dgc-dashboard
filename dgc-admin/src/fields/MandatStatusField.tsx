import { useRecordContext } from "react-admin";
import { Chip } from "@mui/material";
import { red, orange, green, grey } from "@mui/material/colors";

export const MandatStatusField = (_props: { label?: string }) => {
  const record = useRecordContext();
  if (!record) return null;
  const dateProps = [
    {
      name: "dt_reglement",
      label: "Reglement",
      color: green[900],
      bgColor: green[100],
    },
    {
      name: "dt_dispo",
      label: "Disponibilite",
      color: orange[900],
      bgColor: orange[100],
    },
    {
      name: "dt_emission",
      label: "Emission",
      color: red[900],
      bgColor: red[100],
    },
  ];
  const dtProp = dateProps.find((prop) => record[prop.name] !== null);
  return (
    <Chip
      label={dtProp?.label || "Inconnu"}
      size="small"
      sx={{
        backgroundColor: dtProp?.bgColor || grey[500],
        color: dtProp?.color || "white",
        fontWeight: "500",
      }}
    />
  );
};

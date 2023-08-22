import {
  Datagrid,
  Form,
  List,
  Loading,
  Error,
  SelectInput,
  TextField,
  ResourceContextProvider,
  Title,
} from "react-admin";
import { TextInput } from "../../inputs/TextInput";
import { useQuery } from "react-query";
import {
  Grid,
  Box,
  Typography,
  Paper,
  Card,
  Stack,
  Divider,
} from "@mui/material";
import { MoneyField } from "../../fields/MoneyField";
import { CountField } from "../../fields/CountField";
import { MonthField } from "../../fields/MonthField";
import { DateField } from "../../fields/DateField";
import { MandatStatusField } from "../../fields/MandatStatusField";
import { DateInput } from "../../fields/DateInput";
import { green, lime, lightBlue, teal } from "@mui/material/colors";
import { MandatGrid } from "./MandatGrid";

// const etat_choices = [
//   { id: "Reglement", name: "Reglement" },
//   { id: "Disponibilite", name: "Disponibilite" },
//   { id: "Admission", name: "Admission" },
//   { id: "Emission", name: "Emission" },
// ];

const titre_choices = [
  { id: "1", name: "T1 : Dépenses de Personnel" },
  { id: "2", name: "T2 : Dépenses de Fonctionnement des services" },
  { id: "3", name: "T3 : Dépenses d’Investissement" },
  { id: "4", name: "T4 : Dépenses de Transfert" },
];

// const montant_choices = [
//   { id: "<1M", name: "< 1M Dinars" },
//   { id: ">1M", name: "> 1M Dinars" },
// ];

const mandatFilters = [
  <SelectInput
    source="cs_titre"
    choices={titre_choices}
    label="Titre"
    emptyText="Tous"
    // alwaysOn
  />,
  <TextInput source="code_ord__icontains" label="Ordonnateur" />,
  // <SelectInput
  //   source="mntcat"
  //   choices={montant_choices}
  //   label="Montant"
  //   emptyText="Tous"
  //   // alwaysOn
  // />,
  // <SelectInput
  //   source="etat"
  //   choices={etat_choices}
  //   label="Etat"
  //   emptyText="Tous"
  //   // alwaysOn
  // />,
  <TextInput source="code_mandat__icontains" label="N° Mandat" />,
  // <DateInput source="dt_ref" label="Date Reference" />,
];
export const MandatTree = ({ montant = "<1M", title = "Mandats" }) => {
  return (
    <>
      <ResourceContextProvider value="mandats_tree">
        <List
          title={title}
          // filterDefaultValues={{ etat: "Emission", titre: "T1", montant: ">1M" }}
          // filters={mandatFilters}
          filter={{ mntcat: montant }}
          // filterDefaultValues={{ etat: "Admission", titre: "1", montant: ">1M" }}
          filters={mandatFilters}
          exporter={false}
        >
          <MandatGrid />
        </List>
      </ResourceContextProvider>
      <Divider />
      {/* <MandatInfo etat={etat} montant={montant} /> */}
    </>
  );
};

const MandatInfo = ({ etat = "Admission", montant = "<1M" }) => {
  const { data, isLoading, error } = useQuery(["mandat_info"], () => {
    return fetch(
      `http://localhost:8000/api/mandats/info?etat=${etat}&mntcat=${montant}`
    ).then((response) => response.json());
  });
  return (
    <>
      <Typography fontWeight={700} variant="h5" sx={{ m: 2 }}>
        Mandats par titre:
      </Typography>
      <Stack direction={"row"} justifyContent={"space-evenly"}>
        <Card
          variant="outlined"
          sx={{
            p: 2,

            backgroundColor: green[50],
            color: green[900],
          }}
        >
          <Stack>
            <Typography fontWeight={700} variant="body1" gutterBottom>
              Dépenses de Personnel (T1)
            </Typography>
            <Typography variant="h6">{isLoading ? 0 : data.T1}</Typography>
          </Stack>
        </Card>
        <Card
          variant="outlined"
          sx={{
            p: 2,

            backgroundColor: lightBlue[50],
            color: lightBlue[900],
          }}
        >
          <Stack>
            <Typography fontWeight={700} variant="body1" gutterBottom>
              Dépenses de Fonctionnement des services (T2)
            </Typography>
            <Typography variant="h6">{isLoading ? 0 : data.T2}</Typography>
          </Stack>
        </Card>
        <Card
          variant="outlined"
          sx={{
            p: 2,

            backgroundColor: lime[50],
            color: lime[900],
          }}
        >
          <Stack>
            <Typography fontWeight={700} variant="body1" gutterBottom>
              Dépenses d’Investissement (T3)
            </Typography>
            <Typography variant="h6">{isLoading ? 0 : data.T3}</Typography>
          </Stack>
        </Card>
        <Card
          variant="outlined"
          sx={{
            p: 2,

            backgroundColor: teal[50],
            color: teal[900],
          }}
        >
          <Stack>
            <Typography fontWeight={700} variant="body1" gutterBottom>
              Dépenses de Transfert (T4)
            </Typography>
            <Typography variant="h6">{isLoading ? 0 : data.T4}</Typography>
          </Stack>
        </Card>
      </Stack>
    </>
  );
};

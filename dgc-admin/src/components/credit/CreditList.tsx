import {
  List,
  ResourceContextProvider,
  SelectInput,
  TextInput,
  Title,
} from "react-admin";
import { DepenseGrid } from "./DepenseGrid";

const creditFilters = [
  <SelectInput
    sx={{ width: 100 }}
    source="titre"
    choices={[
      { id: "1", name: "T1 : Dépenses de Personnel" },
      { id: "2", name: "T2 : Dépenses de Fonctionnement des services" },
      { id: "3", name: "T3 : Dépenses d’Investissement" },
      { id: "4", name: "T4 : Dépenses de Transfert" },
    ]}
  />,
  <TextInput source="portef" label="Portef" />,
  <TextInput source="prog" label="Program" />,
  <TextInput source="sprog" label="S/Program" />,
  // <TextInput source="action__icontains" label="Action" />,
  // <TextInput source="saction__icontains" label="S/Action" />,
];

export const CreditList = () => (
  <ResourceContextProvider value="depenses">
    <List
      filters={creditFilters}
      exporter={false}
      title="Situation des Crédits"
    >
      <DepenseGrid />
    </List>
  </ResourceContextProvider>
);

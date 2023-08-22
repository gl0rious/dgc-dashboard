import {
  Datagrid,
  List,
  NumberField,
  SelectInput,
  TextField,
  TextInput,
} from "react-admin";
import { CountField } from "../../fields/CountField";

const ordFilters = [
  <SelectInput
    sx={{ width: 100 }}
    source="type_service"
    choices={[
      // { id: "tous", name: "Tous" },
      { id: "BF", name: "BF" },
      { id: "EQ", name: "EQ" },
      { id: "CS", name: "CS" },
      { id: "LF", name: "LF" },
      { id: "RC", name: "RC" },
      { id: "EP", name: "EP" },
      { id: "WL", name: "WL" },
    ]}
  />,
  <TextInput source="code_ord__icontains" label="Code" />,
  <TextInput source="libelle_ord__icontains" label="Libelle" />,
];

export const OrdonnateurList = () => (
  <List filters={ordFilters} exporter={false}>
    <Datagrid rowClick="show" optimized bulkActionButtons={false}>
      {/* <TextField source="id" /> */}
      <CountField source="code_ord" label="Code" />
      <TextField source="libelle_ord" label="Libelle" />
      <TextField source="type_service" label="Service" />
      <NumberField
        source="code_pst"
        label="Post"
        options={{ minimumIntegerDigits: 2 }}
      />
    </Datagrid>
  </List>
);

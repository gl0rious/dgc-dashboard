import { Show, Form, ReferenceField } from "react-admin";
import { Grid, Box, Typography } from "@mui/material";
import { TextInput } from "../../inputs/TextInput";
import { DateInput } from "../../fields/DateInput";
import { MandatStatusField } from "../../fields/MandatStatusField";
export const MandatShow = () => (
  <Show emptyWhileLoading>
    <Box m={4}>
      <Form>
        <Typography variant="h5" gutterBottom>
          Mandat
        </Typography>
        <MandatStatusField label="Statut" />
        <Grid container width={{ xs: "100%", xl: 1200 }} spacing={2}>
          <Grid item xs={12} sm={2}>
            <ReferenceField
              source="ord"
              resource="mandats"
              reference="ordonnateurs"
            >
              <TextInput label="Ordonnateur" source="code_ord" />
            </ReferenceField>
          </Grid>
          <Grid item xs={12} sm={1}>
            <TextInput label="N° Mandat" source="code_mandat" />
          </Grid>
          <Grid item xs={12} sm={1}>
            <TextInput label="Mois" source="mois" readOnly />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextInput label="Gestion" source="gestion" readOnly />
          </Grid>
          <Grid item xs={12} sm={2}>
            <DateInput label="Date Reference" source="dt_ref" readOnly />
          </Grid>
          <Grid item xs={12} sm={4}></Grid>
          <Grid item xs={12} sm={3}>
            <TextInput label="Montant Brut" source="mt_brut" />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextInput label="Montant Net" source="mt_net" />
          </Grid>

          <Grid item xs={12} sm={2}>
            <DateInput label="Date Emission" source="dt_emission" readOnly />
          </Grid>
          <Grid item xs={12} sm={2}>
            <DateInput label="Date Disponibilite" source="dt_dispo" readOnly />
          </Grid>
          <Grid item xs={12} sm={2}>
            <DateInput label="Date Reglement" source="dt_reglement" readOnly />
          </Grid>
        </Grid>
      </Form>
    </Box>
  </Show>
);

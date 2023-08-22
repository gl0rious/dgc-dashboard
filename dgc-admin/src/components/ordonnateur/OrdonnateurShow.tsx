import { Show, Form } from "react-admin";
import { Grid, Box, Typography } from "@mui/material";
import { TextInput } from "../../inputs/TextInput";
import { MonthField } from "../../fields/MonthField";
import { TextInput as RaTextInput } from "react-admin";
export const OrdonnateurShow = () => (
  <Show emptyWhileLoading>
    <Box m={4}>
      <Form>
        <Typography variant="h5" gutterBottom>
          Ordonnateur
        </Typography>
        <Grid container width={{ xs: "100%", xl: 1200 }} spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextInput source="code_ord" label="Code" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="libelle_ord" label="Libelle" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="type_service" label="Service" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="code_pst" label="Code Pst" />
          </Grid>
        </Grid>
      </Form>
    </Box>
  </Show>
);

import { Show, Form } from "react-admin";
import { Grid, Box, Typography } from "@mui/material";
import { TextInput } from "../../inputs/TextInput";
export const PersonneShow = () => (
  <Show emptyWhileLoading>
    <Box m={4}>
      <Form>
        <Typography variant="h5" gutterBottom>
          Personne
        </Typography>
        <Grid container width={{ xs: "100%", xl: 1200 }} spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextInput source="idt_fiscal" label="IDT Fiscal" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="nom" label="Nom" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="num_compte" label="N° Compte" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="num_reg_comm" label="N° Registre Commerce" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="code_ord" label="Ordonnateur" />{" "}
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextInput source="adr" label="Adresse" />
          </Grid>
        </Grid>
      </Form>
    </Box>
  </Show>
);

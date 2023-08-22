import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, Title } from "react-admin";
import { Grid, Box, Typography, Stack } from "@mui/material";

import { PersonChart } from "./personne/PersonChart";
import { PersonPie } from "./personne/PersonPie";
import { DashboardMenu } from "./DashboardMenu";
const wilayas = [
  { code: "01", label: "Adrar" },
  { code: "02", label: "Chlef" },
  { code: "03", label: "Laghouat" },
  { code: "04", label: "Oum El Bouaghi" },
  { code: "05", label: "Batna" },
  { code: "06", label: "Béjaïa" },
  { code: "07", label: "Biskra" },
  { code: "08", label: "Béchar" },
  { code: "09", label: "Blida" },
  { code: "10", label: "Bouira" },
  { code: "11", label: "Tamanrasset" },
  { code: "12", label: "Tébessa" },
  { code: "13", label: "Tlemcen" },
  { code: "14", label: "Tiaret" },
  { code: "15", label: "Tizi Ouzou" },
  { code: "16", label: "Alger" },
  { code: "17", label: "Djelfa" },
  { code: "18", label: "Jijel" },
  { code: "19", label: "Sétif" },
  { code: "20", label: "Saïda" },
  { code: "21", label: "Skikda" },
  { code: "22", label: "Sidi Bel Abbès" },
  { code: "23", label: "Annaba" },
  { code: "24", label: "Guelma" },
  { code: "25", label: "Constantine" },
  { code: "26", label: "Médéa" },
  { code: "27", label: "Mostaganem" },
  { code: "28", label: "M'Sila" },
  { code: "29", label: "Mascara" },
  { code: "30", label: "Ouargla" },
  { code: "31", label: "Oran" },
  { code: "32", label: "El Bayadh" },
  { code: "33", label: "Illizi" },
  { code: "34", label: "Bordj Bou Arreridj" },
  { code: "35", label: "Boumerdès" },
  { code: "36", label: "El Tarf" },
  { code: "37", label: "Tindouf" },
  { code: "38", label: "Tissemsilt" },
  { code: "39", label: "El Oued" },
  { code: "40", label: "Khenchela" },
  { code: "41", label: "Souk Ahras" },
  { code: "42", label: "Tipaza" },
  { code: "43", label: "Mila" },
  { code: "44", label: "Aïn Defla" },
  { code: "45", label: "Naâma" },
  { code: "46", label: "Aïn Témouchent" },
  { code: "47", label: "Ghardaïa" },
  { code: "48", label: "Relizane" },
  { code: "49", label: "El M'Ghair" },
  { code: "50", label: "El Meniaa" },
  { code: "51", label: "Ouled Djellal" },
  { code: "52", label: "Bordj Badji Mokhtar" },
  { code: "53", label: "Béni Abbès" },
  { code: "54", label: "Timimoun" },
  { code: "55", label: "Touggourt" },
  { code: "57", label: "In Salah" },
  { code: "56", label: "Djanet" },
  { code: "58", label: "In Guezzam" },
];

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const data = Array.from(Array(58).keys()).map((i) => {
  return {
    code: String(i + 1).padStart(2, "0"),
    fonctionnaire: getRandomInt(1000, 20000),
    fournisseur: getRandomInt(1000, 20000),
    autre: getRandomInt(1000, 20000),
  };
});

const PersonStats = () => {
  return (
    <Box m={4}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography variant="h5" gutterBottom>
          Personnes
        </Typography>
      </Stack>
      <Grid container>
        <Grid item xs={12} lg={9}>
          <PersonChart data={data} />
        </Grid>
        <Grid item xs={12} lg={3}>
          <PersonPie data={data} wilayas={wilayas} />
        </Grid>
      </Grid>
    </Box>
  );
};
export const Dashboard = () => (
  <Card>
    <Title title="Tableau de bord" />
    <CardContent>
      <PersonStats />;
    </CardContent>
  </Card>
);

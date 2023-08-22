import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, Title } from "react-admin";
import { Grid, Box, Typography, Stack } from "@mui/material";
import { CardActionArea } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import calc from "../images/calc.jpg";
import mandat from "../images/mandat.jpg";
import big from "../images/proof-of-funds-1.png.webp";
import Chip from "@mui/material/Chip";
import { Link as RouterLink } from "react-router-dom";

export const DepenseNav = () => {
  return (
    <Box m={4}>
      <Title title="Depenses" />
      <Grid container spacing={5} alignItems="stretch">
        <Grid item lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea
              component={RouterLink}
              to="/situations"
              sx={{ height: "100%" }}
            >
              <CardMedia component="img" height="140" image={calc} />
              <CardContent sx={{ height: "100%" }}>
                <Typography gutterBottom variant="h5" component="div">
                  Situation des Crédits
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  La situation des crédits budgétaires alloués et consommés par
                  portefeuille, prdonnateur, programme et Sous programme.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea
              sx={{ height: "100%" }}
              component={RouterLink}
              to="/mandats1"
            >
              <CardMedia component="img" height="140" image={mandat} />
              <CardContent sx={{ height: "100%" }}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography gutterBottom variant="h5">
                    Mandats Admis
                  </Typography>
                  <Chip label="-1 Million" color={"success"} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  La liste des mandats admis d'un montant inférieur à un million
                  de dinars.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea
              sx={{ height: "100%" }}
              component={RouterLink}
              to="/mandats2"
            >
              <CardMedia component="img" height="140" image={big} />
              <CardContent sx={{ height: "100%" }}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography gutterBottom variant="h5">
                    Mandats Admis
                  </Typography>
                  <Chip label="+1 Million" color={"error"} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  La liste des mandats admis d'un montant supérieur à un million
                  de dinars.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item lg={4}>
          <Card>
            <CardActionArea>
              <CardMedia component="img" height="140" image={calc} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Opérations d'investissement
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Les opérations d'investissement.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

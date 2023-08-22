import {
  Box,
  Select,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { useEffect, useState } from "react";

export const PersonPie = (props: any) => {
  const [code, setCode] = useState("01");
  const [name, setName] = useState("");
  const [stat, setStat] = useState([{}]);
  const wilayas = props.wilayas;
  const data = props.data;
  const handleChange = (event: SelectChangeEvent) => {
    const code = event.target.value as string;
    setCode(code);
  };

  useEffect(() => {
    const wilaya = wilayas.find((w: any) => w.code === code);
    setName(wilaya.label);
    const wilayaData = data.find((w: any) => w.code === code);
    const stats = [
      {
        id: "Fonctionnaires",
        label: "Fonctionnaires",
        value: wilayaData.fonctionnaire,
        color: "hsl(39, 100%, 50%)",
      },
      {
        id: "Fournisseurs",
        label: "Fournisseurs",
        value: wilayaData.fournisseur,
        color: "hsl(0, 100%, 50%)",
      },
      {
        id: "Autres",
        label: "Autres",
        value: wilayaData.autre,
        color: "hsl(147, 50%, 47%)",
      },
    ];
    setStat(stats);
  }, [code, data, wilayas]);
  return (
    <Box>
      <Stack spacing={2} direction={"column"}>
        <Box>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel>Wilaya</InputLabel>
            <Select
              label="Wilaya"
              variant="filled"
              value={code}
              autoWidth
              onChange={handleChange}
            >
              {wilayas.map((w: any) => {
                return (
                  <MenuItem value={w.code}>{w.code + " - " + w.label}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box height={500}>
          <ResponsivePie
            data={stat}
            colors={{ datum: "data.color" }}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsDiagonalLength={5}
            arcLinkLabelsStraightLength={5}
            arcLinkLabelsTextOffset={4}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={3}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor="#000"
            valueFormat={(value) => `${Number(value).toLocaleString("en")}`}
            arcLinkLabel={(d) => `${d.label}`}
          />
          <Typography align="center" variant="h6">
            Wilaya de {name} ({code})
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

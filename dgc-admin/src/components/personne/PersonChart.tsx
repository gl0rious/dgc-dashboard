import { ResponsiveBar } from "@nivo/bar";
import { Box, Typography } from "@mui/material";

const labels = {
  fonctionnaire: "Fonctionnaires",
  fournisseur: "Fournisseurs",
  autre: "Autres",
};
export const PersonChart = (props: any) => {
  const data = props.data;
  return (
    <Box height={500}>
      <ResponsiveBar
        data={data}
        keys={["fonctionnaire", "fournisseur", "autre"]}
        // tooltip={({ id, value, color }) => (
        //   <div
        //     style={{
        //       padding: 12,
        //       color,
        //       background: "#222222",
        //     }}
        //   >
        //     <span>Look</span>
        //     <br />
        //     <strong>
        //       {Object.entries(labels).find((a) => a[0] === "autre")[1]}: {value}
        //     </strong>
        //   </div>
        // )}
        indexBy="code"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.4}
        valueScale={{ type: "linear" }}
        colors={{ scheme: "set2" }}
        animate={true}
        enableLabel={false}
        axisTop={null}
        axisRight={null}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
      />
      <Typography align="center" variant="h6">
        Toutes les Wilayas
      </Typography>
    </Box>
  );
};

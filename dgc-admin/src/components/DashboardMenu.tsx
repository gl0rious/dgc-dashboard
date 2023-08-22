import { Menu } from "react-admin";
// import LabelIcon from "@mui/icons-material/Label";
import AssessmentIcon from "@mui/icons-material/Assessment";

export const DashboardMenu = () => (
  <Menu>
    <Menu.DashboardItem />
    <Menu.ResourceItem name="personnes" />
    <Menu.ResourceItem name="ordonnateurs" />
    <Menu.Item
      to="/depenses"
      primaryText="Depenses"
      leftIcon={<AssessmentIcon />}
    />
  </Menu>
);

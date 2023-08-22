import {
  Admin,
  Resource,
  ListGuesser,
  ShowGuesser,
  Layout,
  CustomRoutes,
} from "react-admin";
// import jsonServerProvider from "ra-data-json-server";
import drfProvider from "ra-data-django-rest-framework";
import { MandatList } from "./components/mandat/MandatList";
import { PersonneList } from "./components/personne/PersonneList";
import { OrdonnateurList } from "./components/ordonnateur/OrdonnateurList";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupIcon from "@mui/icons-material/Group";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";
import { i18nProvider } from "./i18nProvider";
import { PersonneShow } from "./components/personne/PersonneShow";
import { MandatShow } from "./components/mandat/MandatShow";
import { OrdonnateurShow } from "./components/ordonnateur/OrdonnateurShow";
import { CreditList } from "./components/credit/CreditList";
import { DashboardMenu } from "./components/DashboardMenu";
import { Dashboard } from "./components/Dashboard";
import { Route } from "react-router-dom";
import { DepenseNav } from "./components/DepenseNav";
import { MandatTree } from "./components/mandat/MandatTree";

const DashboardLayout = (props: any) => (
  <Layout {...props} menu={DashboardMenu} />
);

const App = () => {
  const dataProvider = drfProvider("http://localhost:8000/api");
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <Admin
        dashboard={Dashboard}
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        layout={DashboardLayout}
      >
        {/* <Resource
          name="mandats"
          list={MandatList}
          icon={ReceiptLongIcon}
          show={MandatShow}
        /> */}
        <Resource
          name="personnes"
          list={PersonneList}
          icon={GroupIcon}
          show={PersonneShow}
        />
        <Resource
          name="ordonnateurs"
          list={OrdonnateurList}
          recordRepresentation="code"
          icon={ApartmentIcon}
          show={OrdonnateurShow}
        />
        <Resource
          name="credits"
          list={CreditList}
          icon={AssessmentIcon}
          options={{ label: "Depenses" }}
        />
        <CustomRoutes>
          <Route path="/depenses" element={<DepenseNav />} />
          <Route path="/situations" element={<CreditList />} />
          <Route
            path="/mandats1"
            element={
              // <MandatList etat="" montant="<1M" title="Mandats admis < 1M" />
              <MandatTree montant="<1M" title="Mandats admis < 1M" />
            }
          />
          <Route
            path="/mandats2"
            element={<MandatTree montant=">1M" title="Mandats admis > 1M" />}
          />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </CustomRoutes>
      </Admin>
    </LocalizationProvider>
  );
};

export default App;

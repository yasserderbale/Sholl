import React from "react";
import { Link } from "react-router-dom";
import Styles from "../Styles/Sidebar.module.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import PaymentIcon from "@mui/icons-material/Payment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PersonAddDisabledSharpIcon from '@mui/icons-material/PersonAddDisabledSharp';

export const Sidebar: React.FC = () => {
  const [openRapports, setOpenRapports] = React.useState(false);

  const toggleRapports = () => {
    setOpenRapports(!openRapports);
  };

  return (
    <aside className={Styles.sidebar}>
      <div className={Styles.logo}>🎓 Mon Logiciel</div>

      <List className={Styles.navLinks}>
        <ListItem component={Link} to="/TBoard" className={Styles.link} button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
 <ListItem component={Link} to="/TBoard" className={Styles.link} button>
          <ListItemIcon>
            <PersonAddDisabledSharpIcon />
          </ListItemIcon>
          <ListItemText primary="Gestion des Abcenses" />
        </ListItem>
        <ListItem
          component={Link}
          to="/Etudiantes"
          className={Styles.link}
          button
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Gestion des élèves" />
        </ListItem>

        <ListItem component={Link} to="/Matires" className={Styles.link} button>
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Gestion des matières" />
        </ListItem>

        <ListItem
          component={Link}
          to="/Paimentes"
          className={Styles.link}
          button
        >
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Paiements" />
        </ListItem>

        <ListItem onClick={toggleRapports} className={Styles.link} button>
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Rapports" />
          {openRapports ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openRapports} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              component={Link}
              to="/RapportPaiements"
              className={Styles.link}
              button
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary="Rapport Paiements" />
            </ListItem>

            <ListItem
              component={Link}
              to="/RapportEleves"
              className={Styles.link}
              button
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary="Rapport Élèves" />
            </ListItem>

            <ListItem
              component={Link}
              to="/RapportAbsences"
              className={Styles.link}
              button
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary="Rapport Absences" />
            </ListItem>

            <ListItem
              component={Link}
              to="/RapportGeneral"
              className={Styles.link}
              button
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary="Rapport Général" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          component={Link}
          to="/parametres"
          className={Styles.link}
          button
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
      </List>

      <button className={Styles.logout}>
        <LogoutIcon style={{ marginRight: "8px" }} />
        Logout
      </button>

      <div className={Styles.footer}>© 2025 Yasser Dev</div>
    </aside>
  );
};

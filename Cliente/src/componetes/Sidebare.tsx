import React from "react";
import { Link } from "react-router-dom";
import Styles from "../Styles/Sidebar.module.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddDisabledSharpIcon from '@mui/icons-material/PersonAddDisabledSharp';
import { usAuth } from "../Context/AuthContext";
import { CalendarIcon } from "@mui/x-date-pickers";

export const Sidebar: React.FC = () => {
  const { logoute } = usAuth()
  return (
    <aside className={Styles.sidebar}>
      <div className={Styles.logo}>🎓 Mon Logiciel</div>

      <List className={Styles.navLinks}>
        <ListItem component={Link} to="/TBoard" className={Styles.link} >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} to="/Abcenses" className={Styles.link} >
          <ListItemIcon>
            <PersonAddDisabledSharpIcon />
          </ListItemIcon>
          <ListItemText primary="Gestion des Abcenses" />
        </ListItem>
        <ListItem
          component={Link}
          to="/Etudiantes"
          className={Styles.link}

        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Gestion des élèves" />
        </ListItem>

        <ListItem
          component={Link}
          to="/Profes"
          className={Styles.link}

        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Gestion des Profs" />
        </ListItem>

        <ListItem component={Link} to="/Matires" className={Styles.link} >
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Gestion des matières" />
        </ListItem>
        <ListItem component={Link} to="/Paimentes" className={Styles.link} >
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Paimentes" />
        </ListItem>

        <ListItem
          component={Link}
          to="/Groupe"
          className={Styles.link}

        >
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary="Groupe" />
        </ListItem>

        <ListItem
          component={Link}
          to="/Classes"
          className={Styles.link}

        >
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Classes" />
        </ListItem>


        <ListItem
          component={Link}
          to="/Temps"
          className={Styles.link}

        >
          <ListItemIcon>
            <CalendarIcon />
          </ListItemIcon>
          <ListItemText primary="Emploi de temps" />
        </ListItem>


        <ListItem
          component={Link}
          to="/parametres"
          className={Styles.link}

        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
      </List>

      <button onClick={logoute} className={Styles.logout}>
        <LogoutIcon style={{ marginRight: "8px" }} />
        Logout
      </button>

      <div className={Styles.footer}>© 2025 Yasser Dev</div>
    </aside>
  );
};

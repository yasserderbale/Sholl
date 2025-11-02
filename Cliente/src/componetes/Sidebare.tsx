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
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddDisabledSharpIcon from '@mui/icons-material/PersonAddDisabledSharp';
import { usAuth } from "../Context/AuthContext";
import { useLanguage } from "../Context/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import { useSchool } from "../Context/SchoolContext";
import { CalendarIcon } from "@mui/x-date-pickers";

export const Sidebar: React.FC = () => {
  const { logoute } = usAuth();
  const { t, language } = useLanguage();
  const { settings } = useSchool();
  return (
    <aside className={`${Styles.sidebar} sidebar`} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className={Styles.logo}>🎓 {language === 'ar' ? settings.schoolNameAr : settings.schoolNameFr}</div>

      <List className={Styles.navLinks} sx={{ flex: 1, overflow: 'auto' }}>
        <ListItem component={Link} to="/TBoard" className={Styles.link} >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={t('dashboard')} />
        </ListItem>
        <ListItem component={Link} to="/Abcenses" className={Styles.link} >
          <ListItemIcon>
            <PersonAddDisabledSharpIcon />
          </ListItemIcon>
          <ListItemText primary={t('absences')} />
        </ListItem>
        <ListItem
          component={Link}
          to="/Etudiantes"
          className={Styles.link}

        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary={t('students')} />
        </ListItem>

      
        <ListItem component={Link} to="/Matires" className={Styles.link} >
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary={t('subjects')} />
        </ListItem>
        <ListItem component={Link} to="/Paimentes" className={Styles.link} >
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary={t('payments')} />
        </ListItem>
        
        <ListItem component={Link} to="/PaymentReport" className={Styles.link} >
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary={t('paymentReports')} />
        </ListItem>

        <ListItem
          component={Link}
          to="/Groupe"
          className={Styles.link}

        >
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary={t('groups')} />
        </ListItem>

        <ListItem
          component={Link}
          to="/Classes"
          className={Styles.link}

        >
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary={t('classes')} />
        </ListItem>


        <ListItem
          component={Link}
          to="/Temps"
          className={Styles.link}

        >
          <ListItemIcon>
            <CalendarIcon />
          </ListItemIcon>
          <ListItemText primary={t('schedule')} />
        </ListItem>

        <ListItem
          component={Link}
          to="/Settings"
          className={Styles.link}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('settings')} />
        </ListItem>

     
      </List>

      <LanguageToggle />

      <button onClick={logoute} className={Styles.logout}>
        <LogoutIcon style={{ marginRight: "8px" }} />
        {t('logout')}
      </button>

      <div className={Styles.footer}>© 2025 Yasser Dev</div>
    </aside>
  );
};

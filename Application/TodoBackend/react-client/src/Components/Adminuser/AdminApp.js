import { Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { AppContentBar } from "./AppBar";
import { OverViewTab } from "./Contents/OverView";
import PatientData from "./Contents/Patients";
import { AppNavSideBar } from "./SideBar";
import { History, MedicalServices, PeopleAlt, QueryStats } from "@mui/icons-material";
import RegisterPatient from "./DialogContent/RegisterPatientOrDoctor";
import DoctorData from "./Contents/Doctors";
import ActivityLogs from "../Superuser/activity_logs";

export function HospitalAdminContent({ mode, newMode, logout, user, setNotis }) {
  const [optSelected, setOptSelected] = useState(0);
  const baseURL = "/admin/hospital";
  const adminItems = [
    {
      id: 0,
      name: "Overview",
      icon: <QueryStats />,
      url: `${baseURL}/overview`
    },
    {
      id: 1,
      name: "Patients",
      icon: <PeopleAlt />,
      url: `${baseURL}/patients`
    },
    {
      id: 2,
      name: "Doctors",
      icon: <MedicalServices />,
      url: `${baseURL}/doctors`
    },
    {
      id: 3,
      name: "Activity History",
      icon: <History />,
      url: `${baseURL}/act_history`
    }
  ];
  const nav = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname === `/admin/hospital` ? pathname + "/overview" : pathname;
    for (const { id, url } of adminItems)
      if (path === url) {
        setOptSelected(id);
        break;
      }
  }, [pathname]);
  //@INFO: JUST TO PASS DATA BETWEEN TABS
  const navigate = (id, ...extra) => {
    // 0: overview, 1: patients, 2: doctor, 3:activity history
    try {
      setOptSelected(parseInt(id));
      nav(adminItems[parseInt(id)].url, { state: { extra } });
    } catch (e) {
      nav(`${baseURL}${id}`, { state: { extra } });
    }
  };
  return (
    <Box sx={{ display: "flex" }}>
      <AppContentBar mode={mode} newMode={newMode} logout={logout} user={user} />
      <AppNavSideBar
        user={user}
        optSelected={optSelected}
        changeTabTo={navigate}
        navItems={adminItems}
      />
      <Box sx={{ flexGrow: 1, p: 3 }} component="main">
        <Toolbar />
        <Routes>
          <Route
            path="/registerPatient"
            element={<RegisterPatient broadcastAlert={setNotis} user={user} />}
          />
          <Route path="/patients" element={<PatientData broadcastAlert={setNotis} />} />
          <Route path="/overview" element={<OverViewTab changeTabTo={navigate} />} />
          <Route path="/doctors" element={<DoctorData broadcastAlert={setNotis} />} />
          <Route path="/act_history" element={<ActivityLogs />} />
          <Route
            path="/"
            element={<OverViewTab changeTabTo={navigate} broadcastAlert={setNotis} />}
          />
        </Routes>
      </Box>
    </Box>
  );
}

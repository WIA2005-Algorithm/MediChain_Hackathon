import { Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { AppContentBar } from "./AppBar";
import { OverViewTab } from "./Contents/OverView";
import PatientData from "./Contents/Patients";
import { AppNavSideBar } from "./SideBar";
import {
    AssignmentTurnedIn,
    ExitToApp,
    History,
    MedicalServices,
    PeopleAlt,
    QueryStats,
    ReceiptLong,
} from "@mui/icons-material";
import RegisterPatient from "./DialogContent/RegisterPatient";

export function HospitalAdminContent({
    mode,
    newMode,
    logout,
    user,
    setNotis,
}) {
    const [optSelected, setOptSelected] = useState(0);
    const adminItems = [
        //TODO: ADD URL INSIDE BELOW ICON ATTRIBUTE
        {
            id: 0,
            name: "Overview",
            icon: <QueryStats />,
            url: `/admin/${user.org}/overview`,
        },
        {
            id: 1,
            name: "Patients",
            icon: <PeopleAlt />,
            url: `/admin/${user.org}/patients`,
        },
        {
            id: 2,
            name: "Doctors",
            icon: <MedicalServices />,
            url: `/admin/${user.org}/doctors`,
        },
        {
            id: 3,
            name: "Activity History",
            icon: <History />,
            url: `/admin/${user.org}/act_history`,
        },
        //TODO: ADD URL INSIDE BELOW ICON ATTRIBUTE
        {
            id: 4,
            name: "Enroll Patient",
            icon: <ReceiptLong />,
            url: "/",
        },
        {
            id: 5,
            name: "Assign Patient",
            icon: <AssignmentTurnedIn />,
            url: "/",
        },
        {
            id: 6,
            name: "Discharge Patients",
            icon: <ExitToApp />,
            url: "/",
        },
    ];
    const nav = useNavigate();
    const { pathname } = useLocation();
    useEffect(() => {
        const path =
            pathname === `/admin/${user.org}`
                ? pathname + "/overview"
                : pathname;
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
            console.log(`Called me - ID: ${id} to go to ${adminItems[id].url}`);
            setOptSelected(parseInt(id));
            nav(adminItems[parseInt(id)].url, { state: { extra } });
        } catch (e) {
            nav(`/admin/${user.org}${id}`, { state: { extra } });
        }
    };
    return (
        <Box sx={{ display: "flex" }}>
            <AppContentBar
                mode={mode}
                newMode={newMode}
                logout={logout}
                user={user}
            />
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
                        element={<RegisterPatient broadcastAlert={setNotis} user={user}/>}
                    />
                    <Route path="/patients" element={<PatientData />} />
                    <Route
                        path="/overview"
                        element={<OverViewTab changeTabTo={navigate} />}
                    />
                    <Route
                        path="/"
                        element={<OverViewTab changeTabTo={navigate} />}
                    />
                </Routes>
            </Box>
        </Box>
    );
}

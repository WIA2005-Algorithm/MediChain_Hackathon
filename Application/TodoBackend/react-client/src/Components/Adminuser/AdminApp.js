import { Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { AppContentBar } from "./AppBar";
import { OverViewTab } from "./Contents/OverView";
import PatientData from "./Contents/Patients";
import { AppNavSideBar } from "./SideBar";

export function HospitalAdminContent({ mode, newMode, logout, user }) {
    return (
        <Box sx={{ display: "flex" }}>
            <AppContentBar
                mode={mode}
                newMode={newMode}
                logout={logout}
                user={user}
            />
            <AppNavSideBar />
            <Box sx={{ flexGrow: 1, p: 3 }} component="main">
                <Toolbar />
                <Routes>
                <Route path="/patients" element={<PatientData /> } />
                <Route
                    path="/overview"
                    element={
                        <OverViewTab />
                    }
                />  
                <Route
                    path="/"
                    element={
                        <OverViewTab />
                    }
                />
                </Routes>
            </Box>
        </Box>
    );
}

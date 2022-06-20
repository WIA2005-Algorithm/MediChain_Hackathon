import { CircularProgress, Container, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { getDoctorInfo } from "../../APIs/doctor/doctor.api";
import { getAlertValues } from "../StyledComponents";
import DoctorDashBoard from "./Contents/DoctorDashBoard";
import PatientProfile from "./Contents/PatientProfile";
import AppHeader from "./DoctorAppBar";

export default function DoctorApp({
  newMode,
  mode,
  logout,
  moreUserDetails,
  broadcastAlert
}) {
  const [doctor, setDoctor] = useState();
  const [loading, setLoading] = useState(false);
  // TRUE MEANS INSTRUCTION TO REFRESH IT
  const [refresh, setRefresh] = useState(true);
  const getTheDoctorInformation = useCallback(async () => {
    try {
      const result = await getDoctorInfo();
      setDoctor(result.data);
      setLoading(true);
      // INSTRUCTION DONE RESET TO FALSE
      setRefresh(false);
    } catch (error) {
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          error.response?.data?.MESSAGE || "Error Loading the doctor data",
          error.response?.data?.DETAILS ||
            "An unexpected error occured. Please make sure blockchain is running. Contact SuperAdmin for this."
        )
      ]);
      logout();
    }
  }, []);
  useEffect(() => {
    getTheDoctorInformation();
  }, [getTheDoctorInformation, refresh]);
  return (
    <>
      {!loading && (
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh"
          }}>
          <CircularProgress size={"55px"} />
        </Container>
      )}

      {loading && (
        <>
          <AppHeader
            mode={mode}
            newMode={newMode}
            logout={logout}
            user={doctor}
            moreUserDetails={moreUserDetails}
            broadcastAlert={broadcastAlert}
          />
          <Toolbar sx={{ mt: 4.5 }} />
          <Container maxWidth="xl">
            <Routes>
              <Route
                path={"/my_patients/detailedView"}
                element={
                  <PatientProfile
                    user={doctor}
                    moreUserDetails={moreUserDetails}
                    broadcastAlert={broadcastAlert}
                  />
                }
              />
              <Route
                path="/my_patients"
                element={
                  <DoctorDashBoard
                    user={doctor}
                    moreUserDetails={moreUserDetails}
                    broadcastAlert={broadcastAlert}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                }
              />

              <Route
                path="/"
                element={
                  <DoctorDashBoard
                    user={doctor}
                    moreUserDetails={moreUserDetails}
                    broadcastAlert={broadcastAlert}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                }
              />
            </Routes>
          </Container>
        </>
      )}
    </>
  );
}

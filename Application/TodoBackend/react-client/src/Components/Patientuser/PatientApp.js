import { CircularProgress, Container, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getPatientInfo } from "../../APIs/Patient/api";
import { getAlertValues } from "../StyledComponents";
import Profile from "./Content/Patient";
import PatientAppBar from "./PatientAppBar";

export default function PatientApp({
  newMode,
  mode,
  logout,
  moreUserDetails,
  broadcastAlert
}) {
  const [patient, setPatient] = useState();
  const [loading, setLoading] = useState(false);
  // TRUE MEANS INSTRUCTION TO REFRESH IT
  const [refresh, setRefresh] = useState(true);
  const getThePatientInformation = useCallback(async () => {
    try {
      const result = await getPatientInfo();
      setPatient(result.data);
      setLoading(true);
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
    getThePatientInformation();
  }, [getThePatientInformation, refresh]);
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
          <PatientAppBar
            mode={mode}
            newMode={newMode}
            logout={logout}
            user={patient}
            moreUserDetails={moreUserDetails}
            broadcastAlert={broadcastAlert}
          />
          <Toolbar sx={{ mt: 4.5 }} />
          <Container maxWidth="xl">
            <Routes>
              <Route
                path={"/overview"}
                element={
                  <Profile
                    item={patient}
                    moreUserDetails={moreUserDetails}
                    broadcastAlert={broadcastAlert}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                }
              />
              <Route path="/" element={<Navigate to="/overview" replace />} />
            </Routes>
          </Container>
        </>
      )}
    </>
  );
}

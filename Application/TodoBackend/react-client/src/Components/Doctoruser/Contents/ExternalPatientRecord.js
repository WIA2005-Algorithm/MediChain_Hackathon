import {
  CallMissedOutgoing,
  CheckCircle,
  Contacts,
  ExpandLess,
  ExpandMore,
  LocationCity,
  LocationOn,
  Loop,
  Male,
  Person
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  getAgeString,
  getAlertValues,
  getDoctorDeparmentString,
  getFormattedDate,
  SectionContainer
} from "../../StyledComponents";
import no_patient from "../../../static/images/no_patient.jpg";
import { getDataForExternal } from "../../../APIs/doctor/doctor.api";

//TODO
function GetEMRRecord({}) {
  return <></>;
}
// TODO
function GetPatientPHR({}) {
  return <></>;
}

function DoctorItem({ data }) {
  return (
    <Box component="div" sx={{ display: "flex", width: "100%", mb: 1 }}>
      <Box component="div" sx={{ flexGrow: 1, display: "flex", alignItems: "top" }}>
        <CallMissedOutgoing sx={{ transform: "rotate(45deg)" }} />
        <Typography sx={{ flexGrow: 1 }} component="div">
          Dr. {data.name}{" "}
          <Typography className="secondary">
            Assigned to patient on {getFormattedDate(data.assignedOn)}
          </Typography>
          <Typography className="secondary">Department - {data.department}</Typography>
        </Typography>
      </Box>
      <Box
        component="div"
        sx={{ minWidth: "50%", maxWidth: "50%", display: "flex", alignItems: "center" }}>
        <Divider orientation="vertical" sx={{ height: "40px", mr: 2, ml: 1 }} />
        <Typography sx={{ flexGrow: 1 }} component="div">
          <Box component="div" sx={{ display: "flex" }}>
            <span style={{ marginRight: "4px" }}>
              Status - {data.deAssigned === "null" ? "Active" : "Discharged Patient"}
            </span>
            {data.deAssigned === "null" ? (
              <CheckCircle sx={{ color: "success.main" }} fontSize="small" />
            ) : (
              <Loop sx={{ color: "error.main" }} />
            )}
          </Box>
          <Typography className="secondary">
            The doctor note will not be visible to you
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}

export default function ExternalPatient({ broadcastAlert }) {
  const [Promise, setPromise] = useState(false);
  const [item, setItem] = useState(null);
  const [collapse, setCollapse] = useState(true);
  const { state } = useLocation();
  const nav = useNavigate();
  useEffect(() => {
    const getData = async () => {
      setPromise(false);
      try {
        const r = await getDataForExternal(JSON.parse(state.Data));
        setItem(r.data);
      } catch (error) {
        console.log(error);
        broadcastAlert((prev) => [
          ...prev,
          getAlertValues(
            "error",
            error.response?.data?.MESSAGE || "Error Loading the doctor data",
            error.response?.data?.DETAILS ||
              "An unexpected error occured. Please make sure blockchain is running. Contact SuperAdmin for this."
          )
        ]);
        nav("/doctor/my_patients");
      } finally {
        setPromise(true);
      }
    };
    if (state?.Data) {
      getData();
    }
  }, []);
  if (!state?.Data) return <Navigate to={`/doctor/my_patients`} />;
  else {
    return Promise ? (
      <Box component={"div"}>
        <Typography
          component="div"
          variant="h5"
          sx={{
            color: "primary.main",
            fontWeight: "bold",
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
          <div>
            Patient Profile
            <Typography variant="h6" sx={{ color: "text.primary", mt: -1 }}>
              <small>
                {item.details.firstName}{" "}
                {item.details.middleName !== "UNDEFINED" ? item.details.middleName : ""}{" "}
                {item.details.lastName} - {item.details.passport}
              </small>
            </Typography>
          </div>
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography
          component="div"
          variant="h6"
          sx={{ color: "primary.main", fontWeight: "bold", ml: 2, mb: 2 }}>
          Patient Details
          <Typography
            variant="h6"
            sx={{ color: "text.primary", mt: -1, fontSize: "14px" }}>
            Below are the complete patient details along with other associated doctors
          </Typography>
        </Typography>
        <SectionContainer
          component="div"
          sx={{
            m: 2,
            mb: 3,
            position: "relative",
            padding: "8px 16px",
            borderRadius: "4px",
            "& .MuiTypography-root": {
              color: "text.primary",
              fontWeight: "bold"
            },
            "& .MuiTypography-root .secondary": {
              color: "text.secondary",
              fontWeight: "normal",
              fontSize: "14px"
            },
            "& .MuiSvgIcon-root": {
              fontSize: "1.5rem",
              color: "primary.main",
              mr: 1
            }
          }}>
          <Box component="div" sx={{ width: "100%" }}>
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", width: "100%", mb: 1 }}>
              <Box sx={{ flexGrow: "1.5" }} component="div">
                <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
                  <Person />
                  <Typography component="div">
                    {`${item.details.firstName} ${
                      item.details.middleName !== "UNDEFINED"
                        ? item.details.middleName
                        : ""
                    } ${item.details.lastName}`}{" "}
                    - {item.details.passport}
                    <Typography className="secondary">
                      {item.checkIn.length === 0
                        ? "This patient has never been admitted to this hospital before"
                        : `Last admitted as patient on ${getFormattedDate(
                            item.checkIn[item.checkIn.length - 1]
                          )}`}
                    </Typography>
                  </Typography>
                </Box>
                <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
                  <Male />
                  <Typography>{getAgeString(item)}</Typography>
                </Box>
              </Box>
              <Box
                sx={{ minWidth: "50%", maxWidth: "50%", display: "flex" }}
                component="div">
                <Divider orientation="vertical" sx={{ height: "40px", mr: 2, ml: 1 }} />
                <Typography sx={{ flexGrow: "1" }} component="div">
                  Status - {item.active}
                </Typography>
              </Box>
            </Box>
            <Box
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                mt: 2,
                mb: 1,
                "& .MuiTypography-root": {
                  fontWeight: "normal !important",
                  fontSize: "14px !important",
                  color: "text.secondary !important"
                }
              }}>
              <Box
                component="div"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1
                }}>
                <Contacts />
                <Typography component="div">
                  Main : {item.details.contact.mobile}
                  <Typography className="secondary">
                    Whatsapp: {item.details.contact.whatsapp}
                  </Typography>
                  <Typography className="secondary">
                    Other: {item.details.contact.otherNumber}
                  </Typography>
                </Typography>
              </Box>
              <Box
                component="div"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexGrow: 1
                }}>
                <LocationOn />
                <Typography>
                  {item.details.address.street1}
                  <br />
                  {item.details.address.street2}
                </Typography>
              </Box>
              <Box
                component="div"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                  justifyContent: "end"
                }}>
                <LocationCity />
                <Typography>
                  {item.details.address.city}
                  <br />
                  {item.details.address.state}, {item.details.address.country}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              sx={{
                textTransform: "capitalize",
                mt: 2,
                mb: 1,
                backgroundColor: "primary.background100",
                "& .MuiSvgIcon-root, .MuiSvgIcon-root:hover": {
                  color: "primary.main"
                },
                fontWeight: "bolder"
              }}
              onClick={(e) => {
                window.location.href = `mailto:${item.details.email}`;
                e.preventDefault();
              }}>
              <b>Email Patient</b>
            </Button>
          </Box>
          <Chip
            label={`See ${collapse ? "Less" : "More"}`}
            onClick={() => setCollapse(!collapse)}
            onDelete={() => setCollapse(!collapse)}
            variant="outlined"
            size="small"
            deleteIcon={
              collapse ? (
                <ExpandLess sx={{ color: "primary.main" }} />
              ) : (
                <ExpandMore sx={{ color: "primary.main" }} />
              )
            }
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              "& .MuiChip-label": {
                fontSize: "14px",
                fontWeight: "bold"
              },
              color: "primary.main",
              borderColor: "primary.main",
              "& .MuiSvgIcon-root, .MuiSvgIcon-root:hover": {
                color: "primary.main"
              }
            }}
          />
          <Collapse in={collapse} timeout="auto" sx={{ mt: 2 }}>
            {Object.keys(item.associatedDoctors).map((key) => (
              <DoctorItem key={key} data={item.associatedDoctors[key]} />
            ))}
          </Collapse>
        </SectionContainer>
        <Typography
          component="div"
          variant="h6"
          sx={{ color: "primary.main", fontWeight: "bold", ml: 2, mb: 2 }}>
          Patient EMR (Electronic Medical Record) Details
          <Typography
            variant="h6"
            sx={{ color: "text.primary", mt: -1, fontSize: "14px" }}>
            Below are the complete EMR details provided by the associated doctors
          </Typography>
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {Object.keys(item.associatedDoctors).map((key, i) => {
          const ele = item.associatedDoctors[key];
          return (
            <div key={i} style={{ marginLeft: "24px" }}>
              <Typography
                component="div"
                variant="h6"
                sx={{ color: "primary.main", fontWeight: "bold", ml: 2, mb: 2 }}>
                Patient EMR By Dr. {ele.name}
                <Typography
                  variant="h6"
                  sx={{ color: "text.primary", mt: -1, fontSize: "14px" }}>
                  Below are the complete EMR details provided by this associated doctor
                </Typography>
              </Typography>
              <SectionContainer
                component="div"
                sx={{
                  margin: 2,
                  padding: "8px 16px",
                  borderRadius: "4px",
                  "& .MuiTypography-root": {
                    color: "text.primary",
                    fontWeight: "bold"
                  },
                  "& .MuiTypography-root .secondary": {
                    color: "text.secondary",
                    fontWeight: "normal",
                    fontSize: "14px"
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.5rem",
                    color: "primary.main",
                    mr: 1
                  }
                }}>
                {ele.EMRID === -500 ? (
                  <Box component={"div"} sx={{ minHeight: "450px" }}>
                    <Box
                      component="div"
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 2,
                        mb: 2
                      }}>
                      <Avatar
                        alt="No Results"
                        src={no_patient}
                        sx={{
                          width: "250px",
                          height: "250px",
                          mt: 1.8,
                          alignSelf: "center"
                        }}
                      />
                      <Typography
                        component="div"
                        variant="h6"
                        sx={{ mt: 1.2, textAlign: "center" }}>
                        <b>No EMR record associated to this patient was found</b>
                        <Typography className="secondary">
                          Try refreshing the page or just create a EMR record for your
                          preferance.
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <GetEMRRecord />
                )}
              </SectionContainer>
            </div>
          );
        })}
        <Divider sx={{ mb: 2 }} />
        <Typography
          component="div"
          variant="h6"
          sx={{ color: "primary.main", fontWeight: "bold", ml: 2, mb: 2 }}>
          Patient PHR (Personal Health Record) Details
          <Typography
            variant="h6"
            sx={{ color: "text.primary", mt: -1, fontSize: "14px" }}>
            Below are the complete your PHR details provided by the patient
          </Typography>
        </Typography>
        <SectionContainer
          component="div"
          sx={{
            margin: 2,
            padding: "8px 16px",
            borderRadius: "4px",
            "& .MuiTypography-root": {
              color: "text.primary",
              fontWeight: "bold"
            },
            "& .MuiTypography-root .secondary": {
              color: "text.secondary",
              fontWeight: "normal",
              fontSize: "14px"
            },
            "& .MuiSvgIcon-root": {
              fontSize: "1.5rem",
              color: "primary.main",
              mr: 1
            }
          }}>
          {item.PHRID === null ? (
            <Box
              component="div"
              sx={{
                width: "100%",
                minHeight: "450px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 2
              }}>
              <Avatar
                alt="No Results"
                src={no_patient}
                sx={{ width: "250px", height: "250px", mt: 1.8, alignSelf: "center" }}
              />
              <Typography
                component="div"
                variant="h6"
                sx={{ mt: 1.2, textAlign: "center" }}>
                <b>No PHR record associated to this patient was found</b>
                <Typography className="secondary">
                  Try refreshing the page or let the patient know that they haven't
                  created the PHR yet
                </Typography>
              </Typography>
            </Box>
          ) : (
            <GetPatientPHR />
          )}
        </SectionContainer>
      </Box>
    ) : (
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "500px"
        }}>
        <CircularProgress size={"55px"} />
      </Container>
    );
  }
}

import {
  ArrowDropDownCircle,
  CallMissedOutgoing,
  CheckCircle,
  CloudUpload,
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
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAgeString,
  getAlertValues,
  getDoctorDeparmentString,
  getFormattedDate,
  SectionContainer,
  Transition
} from "../../StyledComponents";
import no_patient from "../../../static/images/no_patient.jpg";
import { dischargePTForDoctor, uploadFile } from "../../../APIs/doctor/doctor.api";

function DoctorItem({ data, currentDoc }) {
  return (
    <Box component="div" sx={{ display: "flex", width: "100%", mb: 1 }}>
      <Box component="div" sx={{ flexGrow: 1, display: "flex", alignItems: "top" }}>
        <CallMissedOutgoing sx={{ transform: "rotate(45deg)" }} />
        <Typography sx={{ flexGrow: 1 }} component="div">
          Dr. {data.name}{" "}
          {data.name ===
            `${currentDoc.details.firstName} ${currentDoc.details.middleName} ${currentDoc.details.lastName}` && (
            <Box component={"span"} sx={{ color: "primary.main" }}>
              (YOU)
            </Box>
          )}
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
              Status - {data.active[0]} and {data.active[1]}
            </span>
            {data.active[1] === "In-progress" ? (
              <Loop sx={{ color: "error.main" }} />
            ) : (
              <CheckCircle sx={{ color: "success.main" }} fontSize="small" />
            )}
          </Box>
          <Typography className="secondary">{data.note}</Typography>
        </Typography>
      </Box>
    </Box>
  );
}

function GetDialog({ isOpen, setDialog, patient, doctor, nav, broadcastAlert }) {
  const [LoadingDialogSubmit, setLoadingDialogSubmit] = useState(false);
  const [value, setValue] = useState("");
  const SubmitForm = async () => {
    if (value.trim() === "") return;
    setLoadingDialogSubmit(true);
    try {
      await dischargePTForDoctor(
        patient.details.passport,
        doctor.details.passport,
        value
      );
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "success",
          "Successfully Discharged Patient",
          `Please note that patient with ID : ${patient.details.passport} has been successfully discharged from your side (doctor's side)`
        )
      ]);
      nav("../");
      setDialog();
    } catch (error) {
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          error.response?.data?.MESSAGE || "Error Discharging the patient",
          error.response?.data?.DETAILS ||
            "An unexpected error occured. Please make sure blockchain is running or try refreshing page before trying again."
        )
      ]);
      setLoadingDialogSubmit(false);
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={setDialog}
      aria-labelledby="dialog-title"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          bgcolor: "primary.sectionContainer"
        }
      }}>
      <DialogTitle id="dialog-title">Discharge Patient</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          The following below button will discharge the patient{" "}
          {`${patient.details.firstName} ${patient.details.middleName} ${patient.details.lastName}`}{" "}
          with ID: {patient.details.passport} associated with you [
          {`Dr. ${doctor.details.firstName} ${doctor.details.middleName} ${doctor.details.lastName}`}
          ]
        </DialogContentText>
        <TextField
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          margin="dense"
          id="note"
          label="Note while discharging (From you)"
          type="text"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions sx={{ "& .MuiButton-root": { fontWeight: "bolder" } }}>
        {!LoadingDialogSubmit && (
          <>
            <Button onClick={setDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={SubmitForm} color="primary">
              Discharge Patient
            </Button>
          </>
        )}
        {LoadingDialogSubmit && (
          <CircularProgress size="24px" sx={{ mr: 2.5, mb: 1.5 }} />
        )}
      </DialogActions>
    </Dialog>
  );
}
function FileUploadComponent({ doctor, patient, broadcastAlert }) {
  const inputFile = useRef(null);
  const [dragFileOver, setDragOverFile] = useState(false);
  const [file, setFile] = useState(null);
  const [submit, setSubmit] = useState(false);
  const handleFile = (e, fromWhere) => {
    e.preventDefault();
    e.stopPropagation();
    const f = fromWhere === "input" ? e.target.files[0] : e.dataTransfer.files[0];
    console.log(f.size);
    console.log(f.size < 38000000);
    let fileSize = f.size;
    if (fileSize < 38000000) setFile(f);
    else {
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          "File is too big",
          "Please Make sure the file size is optimised under 38 MB only"
        )
      ]);
    }
    setDragOverFile(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    inputFile.current.click();
  };

  const handleSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    setSubmit(true);
    uploadFile(file, patient.details.passport, doctor.details.passport)
      .then((r) => {
        // TODO IN THE BACKEND
      })
      .catch((error) => {
        broadcastAlert((prev) => [
          ...prev,
          getAlertValues(
            "error",
            error.response?.data?.MESSAGE || "Error Uploading the file",
            error.response?.data?.DETAILS ||
              "An unexpected error occured. Please make sure blockchain is running or try refreshing page before trying again."
          )
        ]);
      })
      .finally(() => setSubmit(false));
  };
  return (
    <Container
      maxWidth="xl"
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "250px",
        border: "2px dashed",
        borderRadius: "4px",
        mt: 2,
        mb: 1
      }}
      onClick={handleClick}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOverFile(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragOverFile(false);
      }}
      onDrop={(e) => handleFile(e, "drop")}>
      <input
        type="file"
        id="file"
        ref={inputFile}
        hidden
        accept="*"
        onChange={(e) => handleFile(e, "input")}
      />
      {submit && <CircularProgress size="30px" sx={{ mr: 2.5, mb: 1.5 }} />}
      {!submit && (
        <>
          {dragFileOver || file !== null ? (
            file !== null ? (
              <>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Selected File: {file.name}
                </Typography>
                <Box component={"div"} sx={{ display: "flex" }}>
                  <Button variant="contained" sx={{ mr: 1 }} onClick={handleSubmit}>
                    <b>Upload File</b>
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ ml: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}>
                    <b>Cancel</b>
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <ArrowDropDownCircle sx={{ height: "40px", width: "40px" }} />{" "}
                <Typography variant="h6">Release to upload</Typography>
              </>
            )
          ) : (
            <>
              <CloudUpload sx={{ height: "40px", width: "40px" }} />{" "}
              <Typography variant="h6">Drag and Drop to Upload File</Typography>
              <small
                style={{
                  fontSize: "14px",
                  display: "block",
                  marginTop: "8px",
                  marginBottom: "8px"
                }}>
                OR
              </small>
              <Button variant="contained" id="browseFiles" onClick={handleClick}>
                <b>Browse Files</b>
              </Button>
            </>
          )}
        </>
      )}
    </Container>
  );
}
//TODO
function GetEMRRecord({}) {
  return <></>;
}
// TODO
function GetPatientPHR({}) {
  return <></>;
}
export default function PatientProfile({ user, moreUserDetails, broadcastAlert }) {
  const nav = useNavigate();
  const [collapse, setCollapse] = useState(true);
  const { state } = useLocation();
  const item = state;
  const doctors = Object.keys(item?.associatedDoctors || {}).length;
  const [openDialog, setOpenDialog] = useState(false);
  const setDialogEnterExit = () => setOpenDialog(!openDialog);
  if (item?.details)
    return (
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
                {item.details.firstName} {item.details.middleName} {item.details.lastName}{" "}
                - {item.details.passport}
              </small>
            </Typography>
          </div>
          <Button variant="contained" onClick={setDialogEnterExit}>
            <b>Discharge Patient</b>
          </Button>
        </Typography>
        <GetDialog
          isOpen={openDialog}
          setDialog={setDialogEnterExit}
          patient={item}
          doctor={user}
          nav={nav}
          broadcastAlert={broadcastAlert}
        />
        <Divider sx={{ mb: 2 }} />
        <Typography
          component="div"
          variant="h6"
          sx={{ color: "primary.main", fontWeight: "bold", ml: 2, mb: 2 }}>
          Patient Details
          <Typography
            variant="h6"
            sx={{ color: "text.primary", mt: -1, fontSize: "14px" }}>
            Below are the complete patient details and other associated doctors
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
                    {`${item.details.firstName} ${item.details.middleName} ${item.details.lastName}`}{" "}
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
                  <Typography className="secondary">
                    Other Doctors : Patient is associated with{" "}
                    <b>
                      {doctors !== 0
                        ? `${getDoctorDeparmentString(item, doctors)}`
                        : `No doctors have been made available`}
                    </b>{" "}
                    department doctors
                  </Typography>
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
              <DoctorItem
                key={key}
                data={item.associatedDoctors[key]}
                currentDoc={user}
              />
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
            Below are the complete your EMR details provided by you
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
          {item.associatedDoctors[user.details.passport].EMRID === -500 ? (
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
                  sx={{ width: "250px", height: "250px", mt: 1.8, alignSelf: "center" }}
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
              <FileUploadComponent
                patient={item}
                doctor={user}
                broadcastAlert={broadcastAlert}
              />
            </Box>
          ) : (
            <GetEMRRecord />
          )}
        </SectionContainer>
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
    );
  else {
    nav("../");
    return <></>;
  }
}

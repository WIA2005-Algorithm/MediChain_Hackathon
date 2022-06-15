import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { LoadingButton } from "@mui/lab";
import { useCallback, useEffect, useState } from "react";
import {
  AddCircle,
  AddTask,
  CallMissedOutgoing,
  CheckCircle,
  Contacts,
  ExpandLess,
  ExpandMore,
  Face,
  HourglassBottom,
  LocationCity,
  LocationOn,
  Logout,
  Loop,
  Male,
  Person,
  Refresh,
  Search,
  Visibility
} from "@mui/icons-material";
import {
  AppBar,
  Autocomplete,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  Paper,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { getAlertValues, SectionContainer, Transition } from "../../StyledComponents";
import {
  AssignDoctor,
  CheckInPatient,
  Discharge,
  getAllDoctorData,
  getAllPatientData
} from "../../../APIs/Admin/main.api";
import no_patient from "../../../static/images/no_patient.jpg";
const getFormattedDate = (d) => {
  const date = new Date(d);
  return `${date.toLocaleString("default", {
    month: "long"
  })} ${date.getDate()}, ${date.getFullYear()}`;
};
function DoctorItem({ data }) {
  return (
    <Box component="div" sx={{ display: "flex", width: "100%", mb: 1 }}>
      <Box component="div" sx={{ flexGrow: 1, display: "flex", alignItems: "top" }}>
        <CallMissedOutgoing sx={{ transform: "rotate(45deg)" }} />
        <Typography sx={{ flexGrow: 1 }} component="div">
          Dr. {data.name}
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

const DoctorData = ({ item, checkIN, setDialogOpen, loadingCheckIn }) => {
  return (
    <>
      <Typography sx={{ mt: 1, mb: 2 }} component="div">
        <u style={{ fontSize: "1rem" }}>Associated Doctors</u>
        <Typography className="secondary">
          The doctors have yet not been assigned to this patient
        </Typography>
      </Typography>
      <LoadingButton
        loading={loadingCheckIn}
        onClick={async () => {
          if (item.active === "Not Patients") await checkIN(item.details.passport);
          else setDialogOpen({ status: true, id: item.details.passport });
        }}
        variant="outlined"
        endIcon={
          !loadingCheckIn &&
          (item.active === "Not Patients" ? (
            <AddCircle sx={{ color: "primary.main" }} />
          ) : (
            <AddTask sx={{ color: "primary.main" }} />
          ))
        }
        sx={{
          textTransform: "capitalize",
          position: "absolute",
          top: 10,
          right: 10,
          "& .MuiSvgIcon-root, .MuiSvgIcon-root:hover": {
            color: "primary.main"
          }
        }}>
        <b>{item.active === "Not Patients" ? "Check In" : "Assign"}</b>
      </LoadingButton>
    </>
  );
};
function ItemForTab({
  item,
  collapse,
  setCollapse,
  setDialogOpen,
  checkIN,
  onClickEventDischarge,
  loadingCheckIn
}) {
  const handleCollapseOuterClick = () => setCollapse.outer(item.ID);
  const handleCollapseInnerClick = () => setCollapse.inner(item.ID);
  const isPatient =
    item.active === "Actively Watched" || item.active === "Waiting For Discharge";
  const doctors = Object.keys(item.associatedDoctors).length;

  const getAgeString = () => {
    let string = "";
    var ageDifMs = Date.now() - new Date(item.details.DOB).getTime();
    var ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    string += age > 18 ? "Adult " : "Young ";
    if (item.details.gender !== "Male" && item.details.gender !== "Female")
      string += `[Gender ${item.details.gender}]`;
    else string += item.details.gender;
    string += ` - ${age} years old`;
    return string;
  };

  const getDoctorDeparmentString = () => {
    let departmentStr = "";
    const array = Object.keys(item.associatedDoctors);
    array.forEach((itm, i) => {
      const doc = item.associatedDoctors[itm];
      console.log(doc.department);
      if (array.length > 1 && i === doctors - 1) departmentStr += " and ";
      departmentStr += doc.department + (i === doctors - 1 ? "" : ", ");
    });

    return departmentStr;
  };

  const DischargePatient = () => {
    const [promiseForDischarge, setPromiseForDischarge] = useState(false);
    if (item.active !== "Waiting For Discharge" && item.active !== "Actively Watched")
      return "";
    if (item.active === "Actively Watched")
      return (
        <Button
          fullWidth
          onClick={() => setDialogOpen({ status: true, id: item.details.passport })}
          sx={{
            textTransform: "capitalize",
            mt: 2,
            mb: 1,
            backgroundColor: "primary.background100",
            "& .MuiSvgIcon-root, .MuiSvgIcon-root:hover": {
              color: "primary.main"
            },
            fontWeight: "bolder"
          }}>
          <b>Assign More Doctors</b>
        </Button>
      );

    let dischargeTrue = true;
    Object.keys(item.associatedDoctors).every((ele) => {
      if (ele.active[1] === "In-progress") {
        dischargeTrue = false;
        return false;
      }

      return true;
    });

    return (
      <>
        <LoadingButton
          fullWidth
          onClick={async () => {
            setPromiseForDischarge(true);
            await onClickEventDischarge();
            setPromiseForDischarge(false);
          }}
          loading={promiseForDischarge}
          disabled={!dischargeTrue}
          sx={{
            m: 1,
            mt: 2,
            mb: 2,
            border: "1px solid",
            borderColor: "primary.main",
            textTransform: "capitalize",
            "& .MuiSvgIcon-root, .MuiSvgIcon-root:hover": {
              color: "primary.main"
            }
          }}>
          <b>Discharge Patient</b>
        </LoadingButton>
        {!dischargeTrue && (
          <Typography fontSize="small">
            Patient is still in observation by some of the doctors associated with them.
            Please check the doctor notes for more information.
          </Typography>
        )}
      </>
    );
  };
  return (
    <SectionContainer
      component="div"
      sx={{
        position: "relative",
        margin: 2,
        padding: "8px 16px",
        borderRadius: "6px",
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
                {`${item.details.firstName} ${item.details.middleName} ${item.details.lastName}`}
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
              <Typography>{getAgeString()}</Typography>
            </Box>
          </Box>
          <Box sx={{ minWidth: "50%", maxWidth: "50%", display: "flex" }} component="div">
            <Divider orientation="vertical" sx={{ height: "40px", mr: 2, ml: 1 }} />
            <Typography sx={{ flexGrow: "1" }} component="div">
              Status - {item.active}
              <Typography className="secondary">
                {doctors !== 0
                  ? `Associated with ${getDoctorDeparmentString()} department doctors`
                  : `No doctors have been made available`}
              </Typography>
            </Typography>
          </Box>
        </Box>
        {/* CONDITIONAL BUTTON */}
        <DischargePatient />
      </Box>
      <Chip
        label={`See ${collapse.outer ? "Less" : "More"}`}
        onClick={handleCollapseOuterClick}
        onDelete={handleCollapseOuterClick}
        variant="outlined"
        size="small"
        deleteIcon={
          collapse.outer ? (
            <ExpandLess sx={{ color: "primary.main" }} />
          ) : (
            <ExpandMore sx={{ color: "primary.main" }} />
          )
        }
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          color: "primary.main",
          borderColor: "primary.main",
          "& .MuiSvgIcon-root, .MuiSvgIcon-root:hover": {
            color: "primary.main"
          }
        }}
      />
      <Collapse in={collapse.outer} timeout="auto">
        <Box
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            mt: 2,
            mb: 2,
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
        <Divider sx={{ mt: 0.5, mb: 2 }} />
        <Box component="div" sx={{ position: "relative", width: "100%" }}>
          {!isPatient && (
            <DoctorData
              item={item}
              checkIN={checkIN}
              setDialogOpen={setDialogOpen}
              loadingCheckIn={loadingCheckIn}
            />
          )}
          {isPatient && (
            <>
              {doctors === 0 && (
                <Typography sx={{ mt: 1, mb: 2 }} component="div">
                  No Patients have been assigned
                </Typography>
              )}
              {doctors !== 0 && (
                <>
                  <Typography sx={{ mt: 1, mb: 2 }} component="div">
                    <u style={{ fontSize: "1rem" }}>Associated Doctors</u>
                    <Typography className="secondary">
                      Has been assigned to {doctors} different doctors
                    </Typography>
                  </Typography>
                  <Chip
                    label={collapse.inner ? "Collapse" : "Expand"}
                    onClick={handleCollapseInnerClick}
                    onDelete={handleCollapseInnerClick}
                    variant="outlined"
                    size="small"
                    deleteIcon={
                      collapse.inner ? (
                        <ExpandLess sx={{ color: "primary.main" }} />
                      ) : (
                        <ExpandMore sx={{ color: "primary.main" }} />
                      )
                    }
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      color: "primary.main",
                      borderColor: "primary.main",
                      fontWeight: "bold",
                      "& .MuiSvgIcon-root, .MuiSvgIcon-root:hover": {
                        color: "primary.main"
                      }
                    }}
                  />
                  <Collapse in={collapse.inner} timeout="auto">
                    {Object.keys(item.associatedDoctors).map((key) => (
                      <DoctorItem key={key} data={item.associatedDoctors[key]} />
                    ))}
                  </Collapse>
                </>
              )}
            </>
          )}
        </Box>
      </Collapse>
    </SectionContainer>
  );
}

function PatientList({
  data,
  setDialogOpen,
  checkIN,
  onClickEventDischarge,
  loadingCheckIn
}) {
  const [collapse, setCollapse] = useState({
    ...data.map(() => ({ outer: false, inner: true }))
  });
  const handleCollapse = {
    outer: (index) => {
      const current = collapse[index].outer;
      setCollapse({
        ...collapse,
        [index]: { ...collapse[index], outer: !current }
      });
    },
    inner: (index) => {
      const current = collapse[index].inner;
      setCollapse({
        ...collapse,
        [index]: { ...collapse[index], inner: !current }
      });
    }
  };
  return (
    <>
      {data.map((ele, i) => (
        <ItemForTab
          key={i}
          item={{ ID: i, ...ele }}
          collapse={collapse[i]}
          setCollapse={handleCollapse}
          setDialogOpen={setDialogOpen}
          checkIN={checkIN}
          onClickEventDischarge={onClickEventDischarge}
          loadingCheckIn={loadingCheckIn}
        />
      ))}
      {data.length === 0 && (
        <Box
          component="div"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4
          }}>
          <Avatar
            alt="No Results"
            src={no_patient}
            sx={{ width: "250px", height: "250px", mt: 1.8, alignSelf: "center" }}
          />
          <Typography component="div" variant="h6" sx={{ mt: 1.2, textAlign: "center" }}>
            <b>No Results Were Obtained</b>
            <Typography sx={{ color: "text.secondary" }}>
              Try refreshing or add adding more patients to this section
            </Typography>
          </Typography>
        </Box>
      )}
    </>
  );
}

export default function PatientData({ broadcastAlert }) {
  const [selectedTab, setSelectedTab] = useState("Actively Watched");
  const [mainCallBackPromise, setMainCallBackPromise] = useState(false);
  const [openDialog, setOpenDialog] = useState({ status: false, id: null });
  const [dialogInputOptions, setDialogInputOptions] = useState([]);
  const [tabChangePromise, setTabChangePromise] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [LoadedData, setLoadedData] = useState({ "Actively Watched": [] });
  const [LoadingDialogSubmit, setLoadingDialogSubmit] = useState(false);
  const [dialogInputOptionPromise, setDialogInputOptionsPromise] = useState(false);
  const [doctor, setDoctor] = useState({});
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [searchString, setSearchString] = useState("");
  // Store the original data when search is used then load later...
  const [temporaryData, setTemporaryData] = useState({
    "Actively Watched": [],
    "Waiting For Discharge": [],
    "Waiting To Be Assigned": [],
    "Not Patients": []
  });

  const loadAllPatientsForThisOrg = useCallback(async () => {
    try {
      const data = {
        "Actively Watched": [],
        "Waiting For Discharge": [],
        "Waiting To Be Assigned": [],
        "Not Patients": []
      };
      const results = await getAllPatientData();
      results.data.forEach((patient) => data[patient.active].push(patient));
      setLoadedData(data);
      setTemporaryData(data);
    } catch (error) {
      console.log(JSON.stringify(error));
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          error.response?.data?.MESSAGE || "Error Loading the data",
          error.response?.data?.DETAILS ||
            "An unexpected error occured. Please make sure blockchain is running. Contact SuperAdmin for this."
        )
      ]);
    } finally {
      setRefresh(true);
      setMainCallBackPromise(true);
      setTabChangePromise(true);
    }
  }, []);

  const loadAllDoctorsForThisOrg = useCallback(async () => {
    try {
      const results = await getAllDoctorData();
      const data = [];
      results.data.forEach((doc) =>
        data.push({
          id: doc.details.passport,
          name: `${doc.details.firstName} ${doc.details.middleName} ${doc.details.lastName}`,
          department: doc.details.department
        })
      );
      setDialogInputOptions(data);
    } catch (error) {
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          "Failed Loading the Input Box",
          "An unexpected error occured. Please make sure blockchain is running or all Doctors are enrolled before assigning. Contact SuperAdmin for further tips."
        )
      ]);
    } finally {
      setDialogInputOptionsPromise(true);
    }
  });

  const handleChange = (_, newValue) => {
    setTabChangePromise(false);
    setTimeout(() => {
      setTabChangePromise(true);
    }, 300);
    setSelectedTab(newValue);
  };

  const handleClose = () => {
    if (LoadingDialogSubmit) return;
    setDialogInputOptionsPromise(true);
    setOpenDialog((prev) => ({ ...prev, status: !prev.status }));
  };

  const refreshData = () => {
    setMainCallBackPromise(false);
    setTabChangePromise(false);
    setRefresh(false);
  };

  const checkIN = async (ID) => {
    setLoadingCheckIn(true);
    try {
      console.log("HELLLOOO");
      await CheckInPatient(ID);
      console.log(" NOOO");
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "success",
          "Patient CheckIn",
          `Patient with ID : ${ID} was successfully Enrolled into the hospitals. Please see waiting to assign section for the patient name.`
        )
      ]);
      refreshData();
    } catch (error) {
      console.log(error);
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          "Patient CheckIn",
          error?.response?.data
            ? error.response.data.DETAILS
            : `An unexpected error occurrecd checking in. Either the patient is already check in or there is a multiple button press issue. Please try refreshing.`
        )
      ]);
    } finally {
      setLoadingCheckIn(false);
    }
  };

  const assignPatient = async () => {
    if (!openDialog.id || !doctor || !doctor.id) return;
    setLoadingDialogSubmit(true);
    try {
      await AssignDoctor(openDialog.id, doctor.id);
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "success",
          "Patient Assignment to Doctor",
          `Patient with ID : ${openDialog.id} was successfully assigned to doctor in the ${doctor.department} department. Please see actively watched section for the patient name`
        )
      ]);
      handleClose();
      refreshData();
    } catch (error) {
      console.log(error.response.data);
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          "Patient Assignment to Doctor",
          error?.response?.data
            ? error.response.data.DETAILS
            : `An unexpected error occurrecd assigning the patient. Either the patient is already assigned or there is a multiple button press issue. Please try refreshing.`
        )
      ]);
    } finally {
      setLoadingDialogSubmit(false);
    }
  };

  const onClickEventDischarge = async () => {
    try {
      await Discharge(openDialog.id);
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "success",
          "Patient Check Out",
          `Patient with ID : ${openDialog.id} was successfully checked out of the hospitals. Please see not patients section for the former patient name.`
        )
      ]);
      refreshData();
    } catch (error) {
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          "Patient CheckIn",
          error?.response?.data
            ? error.response.data.DETAILS
            : `An unexpected error occurrecd checking out. Either the patient is already check out or there is a multiple button press issue. Please try refreshing.`
        )
      ]);
    }
  };

  const handleSearchSubmit = (e) => {
    let filterString;
    // Submit when onchange by input
    if (e.target.id === "search") filterString = e.target.value.trim().toUpperCase();
    else {
      // Submit when submitted by clicking button
      e.preventDefault();
      filterString = new FormData(e.currentTarget).get("search").trim().toUpperCase();
    }
    setSearchString(filterString);
    if (filterString.length === 0 || LoadedData[selectedTab].length === 0) return;
    searchHelper(filterString);
  };

  const searchHelper = (filter) => {
    const dataFilter = LoadedData[selectedTab];
    const newData = [];
    dataFilter.forEach((ele) => {
      const name = `${ele.details.firstName} ${ele.details.middleName} ${ele.details.lastName}`;
      const passport = ele.details.passport;
      if (
        name.toUpperCase().indexOf(filter) > -1 ||
        passport.toUpperCase().indexOf(filter) > -1
      )
        newData.push(ele);
    });
    setLoadedData((prev) => ({ ...prev, [selectedTab]: newData }));
  };
  useEffect(() => {
    if (!refresh) loadAllPatientsForThisOrg();
  }, [loadAllPatientsForThisOrg, refresh]);

  useEffect(() => {
    if (openDialog.status && !dialogInputOptionPromise) loadAllDoctorsForThisOrg();
    return;
  }, [loadAllDoctorsForThisOrg, dialogInputOptionPromise, openDialog]);

  useEffect(() => {
    if (searchString.trim() === "" && temporaryData) setLoadedData(temporaryData);
  }, [searchString, temporaryData]);
  return (
    <Box component="div" sx={{ position: "relative", width: "inherit" }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: "transparent",
          backgroundImage: "none",
          boxShadow: "none"
        }}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            mb: 1,
            mr: 2,
            ml: 2,
            display: "flex",
            alignItems: "center",
            backgroundImage: "none",
            boxShadow: "none",
            bgcolor: "primary.sectionContainer",
            border: "1px solid",
            borderColor: "primary.sectionBorder"
          }}
          onSubmit={handleSearchSubmit}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            disabled={!mainCallBackPromise || !refresh}
            placeholder="Search Patients By Name or ID"
            inputProps={{
              "aria-label": "search patients by name or ID"
            }}
            onChange={handleSearchSubmit}
            id="search"
            name="search"
          />
          <Tooltip title="Search">
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <Search sx={{ color: "text.primary" }} />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" sx={{ height: "25px", borderWidth: "1px" }} />
          {!mainCallBackPromise ? (
            <CircularProgress size="24px" sx={{ mr: "10px", ml: "10px" }} />
          ) : (
            <Tooltip title="Refresh the patient data">
              <IconButton type="button" onClick={refreshData}>
                <Refresh sx={{ color: "text.primary" }} />
              </IconButton>
            </Tooltip>
          )}
        </Paper>

        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="patient types data">
          <Tab
            value="Actively Watched"
            icon={<Visibility />}
            label={<b>Active - Actively Watched</b>}
            iconPosition="start"
          />
          <Tab
            value="Waiting For Discharge"
            label={<b>Active - Waiting For Discharge</b>}
            icon={<Logout />}
            iconPosition="start"
          />
          <Tab
            value="Waiting To Be Assigned"
            label={<b>Active - Waiting To Be Assigned</b>}
            icon={<HourglassBottom />}
            iconPosition="start"
          />
          <Tab
            value="Not Patients"
            label={<b>Members - Not Patients</b>}
            icon={<Face />}
            iconPosition="start"
          />
        </Tabs>
      </AppBar>
      <Dialog
        open={openDialog.status}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            bgcolor: "primary.sectionContainer"
          }
        }}>
        <DialogTitle id="form-dialog-title">Assign To Doctor</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            You may now assign the current patient to the following doctor. Please make
            sure patient is aware of this before proceeding.
          </DialogContentText>
          <Autocomplete
            disabled={!dialogInputOptionPromise}
            autoHighlight
            fullWidth
            options={dialogInputOptions}
            getOptionLabel={(option) => `${option.name} - ${option.department}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, val) => setDoctor({ ...val })}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ bgcolor: "primary.sectionContainer" }}>
                <Typography component="h6">
                  <b>{option.name}</b>
                  <Typography sx={{ color: "text.secondary" }}>
                    <small>{option.department}</small>
                  </Typography>
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Doctor Name" fullWidth />
            )}
          />
        </DialogContent>
        <DialogActions>
          {!LoadingDialogSubmit && (
            <>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={assignPatient} color="primary">
                Assign Patient
              </Button>
            </>
          )}
          {LoadingDialogSubmit && (
            <CircularProgress size="24px" sx={{ mr: 2.5, mb: 1.5 }} />
          )}
        </DialogActions>
      </Dialog>
      <Box component="div">
        {!mainCallBackPromise && (
          <Box
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "300px"
            }}>
            <CircularProgress sx={{ alignSelf: "center" }} />
          </Box>
        )}
        {mainCallBackPromise && tabChangePromise && LoadedData[selectedTab] && (
          <PatientList
            data={LoadedData[selectedTab]}
            setDialogOpen={setOpenDialog}
            checkIN={checkIN}
            onClickEventDischarge={onClickEventDischarge}
            loadingCheckIn={loadingCheckIn}
          />
        )}
      </Box>
    </Box>
  );
}

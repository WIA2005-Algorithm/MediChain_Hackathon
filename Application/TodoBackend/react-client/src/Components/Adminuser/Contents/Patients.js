import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useCallback, useEffect, useState } from "react";
import {
  Add,
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
  Search,
  Visibility
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { getAlertValues, SectionContainer } from "../../StyledComponents";
import { getAllPatientData } from "../../../APIs/Admin/main.api";
const getFormattedDate = (d) => {
  const date = new Date(d);
  return `${date.toLocaleString("default", {
    month: "long"
  })} ${date.getDate()}, ${date.getFullYear()}`;
};
function DoctorItem({ data }) {
  return (
    <Box component="div" sx={{ display: "flex", width: "100%", mb: 1 }}>
      <CallMissedOutgoing sx={{ transform: "rotate(45deg)" }} />
      <Box
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          mt: 0.7
        }}>
        <Typography sx={{ flexGrow: 1 }} component="div">
          Dr. {data.name}
          <Typography className="secondary">
            Assigned to patient on {getFormattedDate(data.assignedOn)}
          </Typography>
          <Typography className="secondary">Department - data.department</Typography>
        </Typography>
        <Divider orientation="vertical" sx={{ height: "40px", mr: 1, ml: 1 }} />
        <Typography sx={{ flexGrow: 1 }} component="div">
          Status - {data.active[0]} and {data.active[1]}
          {data.active[1] === "In-progress" ? (
            <Loop sx={{ color: "error.main" }} />
          ) : (
            <CheckCircle sx={{ color: "success.main" }} />
          )}
          <Typography className="secondary">{data.note}</Typography>
        </Typography>
      </Box>
    </Box>
  );
}
export function ItemForTab({ item, collapse, setCollapse }) {
  const handleCollapseOuterClick = () => setCollapse.outer(item.ID);
  const handleCollapseInnerClick = () => setCollapse.inner(item.ID);
  const isPatient =
    item.active === "Actively Watched" || item.active === "Waiting For Discharge";
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

  const DoctorData = () => {
    return (
      <>
        <Typography sx={{ mt: 1, mb: 2 }} component="div">
          <u style={{ fontSize: "1rem" }}>Associated Doctors</u>
          <Typography className="secondary">
            The doctors have yet not been assigned to this patient
          </Typography>
        </Typography>
        <Button
          variant="outlined"
          endIcon={
            item.active === "Not Patients" ? (
              <AddTask sx={{ color: "primary.main" }} />
            ) : (
              <Add sx={{ color: "primary.main" }} />
            )
          }
          sx={{
            textTransform: "capitalize",
            width: "100%",
            position: "absolute",
            top: 10,
            right: 10,
            "& .MuiSvgIcon-root, .MuiSvgIcon-root:hover": {
              color: "primary.main"
            }
          }}>
          <b>{item.active === "Not Patients" ? "Check In" : "Assign"}</b>
        </Button>
        {/* <Chip
          label={item.active === "Not Patients" ? "Check In" : "Assign"}
          onClick={handleCollapseInnerClick}
          onDelete={handleCollapseInnerClick}
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
        /> */}
      </>
    );
  };

  const getDoctorDeparmentString = () => {
    let departmentStr = "";
    for (let i = 0; i < item.associatedDoctors.length; i++) {
      const doc = item.associatedDoctors[i];
      if (i === item.associatedDoctors.length - 1) departmentStr += " and ";
      departmentStr +=
        doc.department + i === item.associatedDoctors.length - 1 ? "" : ", ";
    }

    return departmentStr;
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
      <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ flexGrow: "1" }} component="div">
          <Box component="div" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
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
        <Divider orientation="vertical" sx={{ height: "40px", mr: 1, ml: 1 }} />
        <Typography sx={{ flexGrow: "1" }} component="div">
          Status - {item.active}
          <Typography className="secondary">
            Associated with {getDoctorDeparmentString()}department doctors
          </Typography>
        </Typography>
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
          fontWeight: "bold",
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
            mt: 2.5,
            mb: 1
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
              flexGrow: 1
            }}>
            <LocationOn />
            <Typography>
              {item.details.address.street1}
              <br />
              {item.details.address.street2}
              <br />
              {item.details.address.city}
            </Typography>
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1
            }}>
            <LocationCity />
            <Typography>
              {item.details.address.state}
              <br />
              {item.details.address.country}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box component="div" sx={{ position: "relative" }}>
          {!isPatient && <DoctorData />}
          {isPatient && (
            <>
              {item.associatedDoctors.length === 0 && (
                <Typography sx={{ mt: 1, mb: 2 }} component="div">
                  No Patients have been assigned
                </Typography>
              )}
              {item.associatedDoctors.length !== 0 && (
                <>
                  <Typography sx={{ mt: 1, mb: 2 }} component="div">
                    <u style={{ fontSize: "1rem" }}>Associated Doctors</u>
                    <Typography className="secondary">
                      Has been assigned to {item.associatedDoctors.length} different
                      doctors
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

function PatientList({ data }) {
  const [collapse, setCollapse] = useState({
    ...data.map((ele) => ({ outer: false, inner: true }))
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
        />
      ))}
    </>
  );
}

export default function PatientData({ broadcastAlert }) {
  const [selectedTab, setSelectedTab] = useState("Actively Watched");
  const [mainCallBackPromise, setMainCallBackPromise] = useState(false);
  const [promiseResolved, setPromiseResolved] = useState(mainCallBackPromise);
  const [LoadedData, setLoadedData] = useState({
    "Actively Watched": [],
    "Waiting For Discharge": [],
    "Waiting To Be Assigned": [],
    "Not Patients": []
  });

  const loadAllPatientsForThisOrg = useCallback(async () => {
    try {
      const results = await getAllPatientData();
      const data = LoadedData;
      results.data.forEach((patient) => data[patient.active].push(patient));
      setLoadedData(data);
      setMainCallBackPromise(true);
      setPromiseResolved(true);
    } catch (error) {
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          error.response?.data?.MESSAGE || "Error Loading the data",
          error.response?.data?.DETAILS ||
            "An unexpected error occured. Please make sure blockchain is running. Contact SuperAdmin for this."
        )
      ]);
      setMainCallBackPromise(true);
      setPromiseResolved(true);
    }
  }, []);

  useEffect(() => {
    loadAllPatientsForThisOrg();
  }, [loadAllPatientsForThisOrg]);

  const handleChange = (_, newValue) => {
    setPromiseResolved(false);
    setSelectedTab(newValue);
    setTimeout(() => {
      setPromiseResolved(true);
    }, 600);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchString = new FormData(e.currentTarget).get("search");
  };
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
            placeholder="Search Patients By Name or ID"
            inputProps={{
              "aria-label": "search patients by name or ID"
            }}
            id="search"
            name="search"
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <Search sx={{ color: "text.primary" }} />
          </IconButton>
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
      <Box component="div">
        {!mainCallBackPromise && !promiseResolved && (
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
        {promiseResolved && <PatientList data={LoadedData[selectedTab]} />}
      </Box>
    </Box>
  );
}

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useCallback, useEffect, useState } from "react";
import {
  CallMissedOutgoing,
  CheckCircle,
  Contacts,
  EventAvailable,
  ExpandLess,
  ExpandMore,
  HourglassBottom,
  LocationCity,
  LocationOn,
  Loop,
  Male,
  Person,
  Refresh,
  Search
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Tooltip,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import {
  getAgeString,
  getAlertValues,
  getFormattedDate,
  SectionContainer
} from "../../StyledComponents";
import { getAllDoctorData } from "../../../APIs/Admin/main.api";
import no_patient from "../../../static/images/no_patient.jpg";
function PatientItem({ data }) {
  return (
    <Box component="div" sx={{ display: "flex", width: "100%", mb: 2 }}>
      <Box component="div" sx={{ flexGrow: 1, display: "flex", alignItems: "top" }}>
        <CallMissedOutgoing sx={{ transform: "rotate(45deg)" }} />
        <Typography sx={{ flexGrow: 1 }} component="div">
          {data.name}
          <Typography className="secondary">
            Assigned to patient on {getFormattedDate(data.assignedOn)}
          </Typography>
        </Typography>
      </Box>
      <Box
        component="div"
        sx={{ minWidth: "50%", maxWidth: "50%", display: "flex", alignItems: "center" }}>
        <Divider orientation="vertical" sx={{ height: "40px", mr: 2, ml: 1 }} />
        <Typography sx={{ flexGrow: 1 }} component="div">
          <Box component="div" sx={{ display: "flex" }}>
            <span style={{ marginRight: "4px" }}>Status - {data.active}</span>
            {data.active === "Actively Watched" ? (
              <Loop sx={{ color: "error.main" }} />
            ) : (
              <CheckCircle sx={{ color: "success.main" }} fontSize="small" />
            )}
          </Box>
          <Typography className="secondary">
            {data.active === "Actively Watched"
              ? "Discharge not issued yet"
              : "Discharge instruction has been issued"}
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}

function ItemForTab({ item, collapse, setCollapse }) {
  const handleCollapseOuterClick = () => setCollapse.outer(item.ID);
  const handleCollapseInnerClick = () => setCollapse.inner(item.ID);
  const patientLength = Object.keys(item.associatedPatients).length;

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
      <Box
        component="div"
        sx={{ display: "flex", alignItems: "center", width: "100%", mb: 1 }}>
        <Box sx={{ flexGrow: "1.5" }} component="div">
          <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
            <Person />
            <Typography component="div">
              Dr.{" "}
              {`${item.details.firstName} ${
                item.details.middleName !== "UNDEFINED" ? item.details.middleName : ""
              } ${item.details.lastName}`}
              <Typography className="secondary">
                {patientLength === 0
                  ? "This doctor has no active patients"
                  : "This doctor has active patients. Please expand for more details"}
              </Typography>
            </Typography>
          </Box>
          <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
            <Male />
            <Typography>{getAgeString(item)}</Typography>
          </Box>
        </Box>
        <Box sx={{ minWidth: "50%", maxWidth: "50%", display: "flex" }} component="div">
          <Divider orientation="vertical" sx={{ height: "40px", mr: 2, ml: 1 }} />
          <Typography sx={{ flexGrow: "1" }} component="div">
            Status - {item.active[0]} and {item.active[1]}
            <Typography className="secondary">
              Department - {item.details.department}
            </Typography>
          </Typography>
        </Box>
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
          <Typography sx={{ mt: 1, mb: 2 }} component="div">
            <u style={{ fontSize: "1rem" }}>Associated Patients</u>
            <Typography className="secondary">
              {patientLength === 0
                ? "The patients have not yet been assigned to this doctor"
                : `This doctor is associated to ${patientLength} patient (s)`}
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
            {Object.keys(item.associatedPatients).map((key) => (
              <PatientItem key={key} data={item.associatedPatients[key]} />
            ))}
          </Collapse>
        </Box>
      </Collapse>
    </SectionContainer>
  );
}

function DoctorList({ data }) {
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

export default function DoctorData({ broadcastAlert }) {
  const [selectedTab, setSelectedTab] = useState("Active - Occupied");
  const [mainCallBackPromise, setMainCallBackPromise] = useState(false);
  const [tabChangePromise, setTabChangePromise] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [LoadedData, setLoadedData] = useState();
  const [searchString, setSearchString] = useState("");
  // Store the original data when search is used then load later...
  const [temporaryData, setTemporaryData] = useState();

  const loadAllDoctorsForThisOrg = useCallback(async () => {
    let data;
    try {
      data = {
        "Active - Occupied": [],
        "Active - Unoccupied": []
      };
      const results = await getAllDoctorData();
      results.data.forEach((doc) =>
        data[`${doc.active[0]} - ${doc.active[1]}`].push(doc)
      );
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
    } finally {
      setLoadedData(data);
      setTemporaryData(data);
      setRefresh(true);
      setMainCallBackPromise(true);
      setTabChangePromise(true);
    }
  }, []);

  const handleChange = (_, newValue) => {
    setTabChangePromise(false);
    setTimeout(() => {
      setTabChangePromise(true);
    }, 300);
    setSelectedTab(newValue);
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

  const refreshData = () => {
    setMainCallBackPromise(false);
    setTabChangePromise(false);
    setRefresh(false);
  };

  useEffect(() => {
    if (!refresh) loadAllDoctorsForThisOrg();
  }, [loadAllDoctorsForThisOrg, refresh]);

  useEffect(() => {
    if (searchString.trim() === "" && temporaryData) {
      setLoadedData(temporaryData);
    }
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
            disabled={!mainCallBackPromise}
            placeholder={`Search Patients By Name or ID (Omit keyword Dr.)`}
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
            value="Active - Occupied"
            icon={<HourglassBottom />}
            label={<b>Active - Occupied Doctors</b>}
            iconPosition="start"
          />
          <Tab
            value="Active - Unoccupied"
            label={<b>Active - Unoccupied Doctors</b>}
            icon={<EventAvailable />}
            iconPosition="start"
          />
        </Tabs>
      </AppBar>
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
          <DoctorList data={LoadedData[selectedTab]} />
        )}
      </Box>
    </Box>
  );
}

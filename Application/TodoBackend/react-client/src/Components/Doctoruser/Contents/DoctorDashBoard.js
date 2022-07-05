import {
  Contacts,
  LocationCity,
  LocationOn,
  Male,
  Person,
  Refresh,
  Search
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Tooltip,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientInfo } from "../../../APIs/doctor/doctor.api";
import no_patient from "../../../static/images/no_patient.jpg";
import {
  getAgeString,
  getDoctorDeparmentString,
  getFormattedDate,
  SectionContainer
} from "../../StyledComponents";

function Patient({ item, nav }) {
  const [doctors, _] = useState(Object.keys(item.associatedDoctors).length);
  return (
    <SectionContainer
      component="div"
      sx={{
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
                {`${item.details.firstName} ${
                  item.details.middleName !== "UNDEFINED" ? item.details.middleName : ""
                } ${item.details.lastName}`}
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
          <Box sx={{ minWidth: "50%", maxWidth: "50%", display: "flex" }} component="div">
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
        <Button
          fullWidth
          onClick={() => nav("/doctor/my_patients/detailedView", { state: item })}
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
          <b>See Patient Record</b>
        </Button>
      </Box>
    </SectionContainer>
  );
}

export default function DoctorDashBoard({
  user,
  moreUserDetails,
  setBiscuits,
  broadcastAlert,
  refresh,
  setRefresh
}) {
  const [temporaryData, setTemporaryData] = useState([]);
  const [items, setItems] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const nav = useNavigate();
  const getPatientDatas = useCallback(() => {
    console.log("hello");
    setLoading(true);
    const IDS = Object.entries(user.associatedPatients).map(([key, _]) => key);
    Promise.all(IDS.map((ID) => getPatientInfo(ID)))
      .then((results) => {
        const datas = results.map((r) => r.data);
        setItems(datas);
        setLoading(false);
        setTemporaryData(datas);
      })
      .catch((err) => {});
  }, [user]);
  const refreshData = () => setRefresh(true);
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
    if (filterString.length === 0 || items.length === 0) return;
    searchHelper(filterString);
  };

  const searchHelper = (filter) => {
    const dataFilter = items;
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
    setItems(newData);
  };
  useEffect(() => {
    if (refresh) getPatientDatas();
  }, [getPatientDatas, refresh]);

  useEffect(() => {
    if (searchString.trim() === "" && temporaryData) setItems(temporaryData);
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
        <Typography
          component="div"
          variant="h5"
          sx={{ color: "primary.main", fontWeight: "bold", ml: 2, mb: 2 }}>
          Patient Dashboard
          <Typography variant="h6" sx={{ color: "text.primary", mt: -1 }}>
            <small>
              <b>
                Below are the patients associated to you. Click on any patient to open
                detailed version
              </b>
            </small>
          </Typography>
        </Typography>
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
            disabled={refresh}
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
          {refresh ? (
            <CircularProgress size="24px" sx={{ mr: "10px", ml: "8px" }} />
          ) : (
            <Tooltip title="Refresh the patient data">
              <IconButton type="button" onClick={refreshData}>
                <Refresh sx={{ color: "text.primary" }} />
              </IconButton>
            </Tooltip>
          )}
        </Paper>
      </AppBar>

      {!refresh && !Loading && (
        <Box component={"div"}>
          {items.length !== 0 && (
            <>
              {items.map((ele, i) => (
                <Patient item={ele} nav={nav} key={i} />
              ))}
            </>
          )}
          {items.length === 0 && (
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
              <Typography
                component="div"
                variant="h6"
                sx={{ mt: 1.2, textAlign: "center" }}>
                <b>No Patients Were Found</b>
                <Typography sx={{ color: "text.secondary" }}>
                  Finally, you can just chill and relax, still have a doubt about it? Try
                  refreshing or searching something else
                </Typography>
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {refresh && (
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
      )}
    </Box>
  );
}

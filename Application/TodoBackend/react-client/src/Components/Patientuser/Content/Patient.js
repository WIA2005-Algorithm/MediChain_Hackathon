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
import { Avatar, Box, Button, Chip, Collapse, Divider, Typography } from "@mui/material";
import { useState } from "react";
import {
  getAgeString,
  getDoctorDeparmentString,
  getFormattedDate,
  SectionContainer
} from "../../StyledComponents";
import no_patient from "../../../static/images/no_patient.jpg";
function DoctorItem({ data }) {
  return (
    <Box component={"div"} sx={{ width: "100%" }}>
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
          sx={{
            minWidth: "50%",
            maxWidth: "50%",
            display: "flex",
            alignItems: "center"
          }}>
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
          window.location.href = `mailto:${data.email}`;
          e.preventDefault();
        }}>
        <b>Email Doctor</b>
      </Button>
    </Box>
  );
}

function GetPatientPHR({}) {
  return <></>;
}
export default function Profile({
  item,
  moreUserDetails,
  broadcastAlert,
  setRefresh,
  refresh
}) {
  const [collapse, setCollapse] = useState(true);
  const doctors = Object.keys(item?.associatedDoctors || {}).length;
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
          Profile Overview
          <Typography
            variant="h6"
            sx={{
              color: "text.primary",
              mt: -0.5,
              lineHeight: "19px",
              fontWeight: "bold"
            }}>
            <small style={{ display: "block" }}>
              Associated to {moreUserDetails.fullOrg}
            </small>
            <small style={{ display: "block" }}>
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
        Personal Details
        <Typography variant="h6" sx={{ color: "text.primary", mt: -1, fontSize: "14px" }}>
          Below is your complete EHR details along with other associated doctors
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
                    item.details.middleName !== "UNDEFINED" ? item.details.middleName : ""
                  } ${item.details.lastName}`}{" "}
                  - {item.details.passport}
                  <Typography className="secondary">
                    {item.checkIn.length === 0
                      ? "You have never been admitted to this hospital before"
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
                    {doctors !== 0 ? `${getDoctorDeparmentString(item, doctors)}` : `no `}
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
        <Collapse in={collapse} timeout="auto" sx={{ mt: 2, ml: "26px" }}>
          <Divider sx={{ mb: 2 }} />
          {Object.keys(item.associatedDoctors).map((key) => (
            <DoctorItem key={key} data={item.associatedDoctors[key]} />
          ))}
        </Collapse>
      </SectionContainer>
      <Typography
        component="div"
        variant="h6"
        sx={{ color: "primary.main", fontWeight: "bold", ml: 2, mb: 2 }}>
        Patient PHR (Personal Health Record) Details
        <Typography variant="h6" sx={{ color: "text.primary", mt: -1, fontSize: "14px" }}>
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
              <b>No PHR record associated to you was found</b>
              <Typography className="secondary">
                Try refreshing the page or editing your profile
              </Typography>
            </Typography>
          </Box>
        ) : (
          <GetPatientPHR />
        )}
      </SectionContainer>
    </Box>
  );
}

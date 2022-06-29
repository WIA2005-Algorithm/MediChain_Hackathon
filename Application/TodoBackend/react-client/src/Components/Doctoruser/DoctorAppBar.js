import {
  DarkMode,
  DarkModeOutlined,
  Description,
  KeyboardArrowDown,
  Logout,
  ManageSearch,
  MarkEmailUnread,
  Notifications
} from "@mui/icons-material";
import {
  AppBar,
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
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import {
  AlertNotifications,
  AppIconHead,
  getAlertValues,
  RequestNotifications,
  StyledBadge,
  Transition
} from "../StyledComponents";
import adminImg from "../../static/images/admin.png";
import { useCallback, useEffect, useState } from "react";
import { getHospitalsEnrolled, getPatientDetails } from "../../APIs/Admin/main.api";
import {
  acceptRequestToFromAdmin,
  denyRequestToFromAdmin,
  requestExternalPatient
} from "../../APIs/doctor/doctor.api";
import { useNavigate } from "react-router-dom";

function GetDiolog({
  anchorEl,
  user,
  moreUserDetails,
  isOpen,
  setOpenDialog,
  broadcastAlert
}) {
  const [options, setOptions] = useState([]);
  const [promise, setPromise] = useState(false);
  const [org, setOrg] = useState("");
  const [ID, setID] = useState("");
  const [LoadingDialogSubmit, setLoadingDialogSubmit] = useState(false);
  if (isOpen) anchorEl(null);
  const setDialog = () => {
    if (!promise) setOpenDialog(!isOpen);
  };
  let fetchHospitalOptions = useCallback(async () => {
    let res = await getHospitalsEnrolled(moreUserDetails.org);
    if (res) setOptions(res.data);
    setPromise(() => false);
  }, []);

  useEffect(() => {
    if (isOpen) fetchHospitalOptions();
  }, [fetchHospitalOptions, isOpen]);

  const submit = async (e) => {
    e.preventDefault();
    if (String(org).trim() === "") return;
    if (String(ID).trim() === "") return;
    setLoadingDialogSubmit(true);
    try {
      const r = await requestExternalPatient(
        `${user.details.firstName} ${user.details.middleName} ${user.details.lastName}`,
        ID,
        org
      );
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues("success", "External Patient Request", String(r.data))
      ]);
      setDialog();
    } catch (error) {
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          "External Patient Request",
          error?.response?.data || "An unexpected Error Occurred"
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
      {promise && (
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "500px",
            minWidth: "500px"
          }}>
          <CircularProgress size={"55px"} />
        </Container>
      )}
      {!promise && (
        <>
          <DialogTitle id="dialog-title">Request Patient Data</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2, textAlign: "justify" }}>
              The following form will send a broadcast to hospital admin of the patient to
              request EMR record(s). On acceptance, the data will be available via
              notification channel. On denial, a polite note will be delivered to you
              stating the obvious reasons via the notification channel The following below
              button will discharge the patient <br /> <br />
              {moreUserDetails.org} will not be included in this list
            </DialogContentText>
            <FormControl
              sx={{
                mt: 1,
                mb: 2,
                width: "100%"
              }}>
              <InputLabel id="hospital-select-helper">Hospital Organization *</InputLabel>
              <Select
                labelId="hospital-select-helper"
                id="org"
                required
                autoFocus
                value={org}
                name="org"
                label="Hospital Organization"
                onChange={(newM) => setOrg(newM.target.value)}>
                <MenuItem value="">
                  <em>Please Select</em>
                </MenuItem>
                {options.map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ ml: 0 }}>
                Please key in the hospital you want to request the record from. If you are
                unable to find the hospital, please contact the hospital as soon as
                possible.
              </FormHelperText>
            </FormControl>
            <TextField
              onChange={(e) => setID(e.target.value)}
              margin="dense"
              id="ID"
              label="Patient ID/Passport"
              type="text"
              fullWidth
              variant="filled"
            />
            <FormHelperText>
              Please key in patient's ID to request their record. A valid ID/Passport is
              always contained in a number format with some letters occassionally.
            </FormHelperText>
          </DialogContent>
          <DialogActions sx={{ "& .MuiButton-root": { fontWeight: "bolder" } }}>
            {!LoadingDialogSubmit && (
              <>
                <Button onClick={setDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={submit} color="primary">
                  Request Record
                </Button>
              </>
            )}
            {LoadingDialogSubmit && (
              <CircularProgress size="24px" sx={{ mr: 2.5, mb: 1.5 }} />
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

function GetDialogForRequesting({
  anchorEl,
  open,
  handleClose,
  item,
  moreuser,
  broadcastAlert
}) {
  const [valueAccept, setValueAccep] = useState("");
  const [promise, setPromise] = useState(false);
  // const [associatedDoctors, setAssociatedDoctors] = useState([]);
  const [note, setNote] = useState("");
  const [promiseForProcess, setPromiseForProcess] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const Data = JSON.parse(item.Data);
  if (open) anchorEl(null);
  const getData = useCallback(async () => {
    setPromise(false);
    try {
      const r = await getPatientDetails(Data.PatientID);
      const doc = r.data.associatedDoctors[moreuser.username];
      setDoctor({
        ID: moreuser.username,
        EMRID: doc.EMRID,
        name: doc.name
      });
      setPromise(true);
    } catch (err) {
      console.log(err);
      handleClose();
    }
  }, []);
  useEffect(() => {
    getData();
  }, [getData]);

  const handleProcess = async () => {
    if (valueAccept === "deny" && note.trim() === "") return;
    setPromiseForProcess(true);
    if (valueAccept === "accept") {
      try {
        await acceptRequestToFromAdmin(Data, doctor, item);
        broadcastAlert((prev) => [
          ...prev,
          getAlertValues(
            "success",
            "Request Processing Was Successfull",
            "The request to share EMR record of patient was successfull. An automatic reply will be sent back to Admin"
          )
        ]);
        setPromiseForProcess(false);
        handleClose();
      } catch (err) {
        broadcastAlert((prev) => [
          ...prev,
          getAlertValues(
            "error",
            "Error Processing Request",
            "An unexpected error occured"
          )
        ]);
        setPromiseForProcess(false);
      }
    } else {
      const text = note.trim();
      try {
        await denyRequestToFromAdmin(Data, text, doctor, item);
        broadcastAlert((prev) => [
          ...prev,
          getAlertValues(
            "success",
            "Request Processing Was Successfull",
            "The denied request alert was successfully sent back to hospital admin."
          )
        ]);
        setPromiseForProcess(false);
        handleClose();
      } catch (err) {
        console.log(err.message);
        broadcastAlert((prev) => [
          ...prev,
          getAlertValues(
            "error",
            "Error Processing Request",
            "An unexpected error occured"
          )
        ]);
        setPromiseForProcess(false);
      }
    }
  };
  return (
    <Dialog
      PaperProps={{
        sx: {
          bgcolor: "background.default",
          backgroundImage: "none"
        }
      }}
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description">
      {!promise && (
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "500px",
            minWidth: "500px"
          }}>
          <CircularProgress size={"55px"} />
        </Container>
      )}
      {promise && (
        <>
          <DialogTitle>
            <Typography component="div" variant="h6" sx={{ mt: 1.2 }}>
              <b>Access Request to Permit Sharing Of Patient Record</b>
              <Typography sx={{ color: "text.secondary", fontSize: "14px" }}>
                {item.NotificationString}
              </Typography>
            </Typography>
            <Divider sx={{ mt: 1 }} />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
              <RadioGroup
                aria-labelledby="demo-error-radios"
                name="quiz"
                value={valueAccept}
                onChange={(e) => setValueAccep(e.target.value)}
                sx={{
                  "& .MuiFormControlLabel-root": {
                    color: "text.primary"
                  },
                  "& .MuiFormControlLabel-root .MuiTypography-root": {
                    fontWeight: "bolder"
                  }
                }}>
                <FormControlLabel
                  value="accept"
                  control={<Radio />}
                  label={item.NotificationAccept}
                />
                <Collapse in={valueAccept === "accept"} timeout="auto">
                  <Box component={"div"} sx={{ ml: 3.5 }}>
                    <Typography sx={{ mb: 1, mb: 2 }}>
                      The patient record including the EMR record created by you will be
                      shared with the doctor who requested
                    </Typography>
                  </Box>
                </Collapse>
                <FormControlLabel
                  value="deny"
                  control={<Radio />}
                  label={item.NotificationDeny}
                />
                <Collapse in={valueAccept === "deny"} timeout="auto">
                  <Box component={"div"} sx={{ ml: 3.5 }}>
                    <Typography sx={{ mb: 2 }}>
                      If you would like to deny their request, please provide a polite
                      note below to inform the hospital about the denial
                    </Typography>
                    <TextField
                      fullWidth
                      name="note"
                      id="note"
                      value={note}
                      variant={"standard"}
                      autoFocus
                      margin="dense"
                      label={"Type the note here..."}
                      type="text"
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </Box>
                </Collapse>
              </RadioGroup>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {promiseForProcess ? (
              <CircularProgress size="24px" sx={{ mr: 2.5, mb: 1.5 }} />
            ) : (
              <>
                {/* // TODO: */}
                <Button onClick={handleProcess}>
                  <b>Process Request</b>
                </Button>
                <Button onClick={handleClose}>
                  <b>Close</b>
                </Button>
              </>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default function AppHeader({
  mode,
  newMode,
  logout,
  user,
  moreUserDetails,
  broadcastAlert
}) {
  const GetMode = () => (mode === "dark" ? <DarkMode /> : <DarkModeOutlined />);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const handleClickNoti = (event) => setAnchorElNotification(event.currentTarget);

  const [anchorElRequests, setAnchorElRequests] = useState(null);
  const handleClickReq = (event) => setAnchorElRequests(event.currentTarget);
  const [dialogData, setDialogData] = useState(null);
  const nav = useNavigate();
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "primary.sectionContainer",
          backgroundImage: "none",
          padding: "7px 0px",
          color: "text.primary"
        }}>
        <Toolbar variant="dense">
          <AppIconHead homeLink={"/doctor/my_patients"} role={"Hospital Doctor"} />
          <Box sx={{ color: "primary.main" }}>
            <Tooltip title={`Change to ${mode === "light" ? "Dark" : "Light"} Mode`}>
              <IconButton
                size="large"
                color="inherit"
                sx={{ padding: 1 }}
                onClick={() => newMode()}>
                <GetMode />
              </IconButton>
            </Tooltip>
            <Tooltip title={"Notifications"}>
              <IconButton
                size="large"
                color="inherit"
                sx={{ padding: 1 }}
                onClick={handleClickNoti}>
                <MarkEmailUnread />
              </IconButton>
            </Tooltip>
            <Tooltip title="Access Requests">
              <IconButton
                onClick={handleClickReq}
                size="large"
                aria-label="Notifications"
                color="inherit"
                sx={{ padding: 1, mr: 1 }}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                  }}
                  variant="dot">
                  <Notifications />
                </StyledBadge>
              </IconButton>
            </Tooltip>
            <Tooltip title="You">
              <Chip
                sx={{
                  "& .MuiChip-label": {
                    textTransform: "capitalize",
                    fontSize: "14px"
                  },
                  "& .MuiChip-avatar": {
                    width: "35px",
                    height: "35px",
                    ml: -0.5
                  }
                }}
                label={`Dr. ${user?.details?.lastName || ""}`}
                onClick={handleClick}
                onDelete={handleClick}
                avatar={<Avatar atl={"Profile Image"} src={adminImg} />}
                deleteIcon={<KeyboardArrowDown />}
              />
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0
                }
              }
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
            <MenuItem onClick={handleClose}>
              <Avatar sx={{ bgcolor: "primary.main" }}>H</Avatar>
              <Typography component="span" sx={{ fontSize: "13px", ml: 0.5 }}>
                <div>
                  Name :{" "}
                  {`Dr. ${user?.details?.firstName || ""} ${
                    user?.details?.middleName || ""
                  } ${user?.details?.lastName || ""}`}
                </div>
                <div>DoctorID : {moreUserDetails.username}</div>
                <div>Hospital : {moreUserDetails.org}</div>
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setOpenDialog(true)}>
              <ListItemIcon sx={{ color: "text.primary" }}>
                <ManageSearch />
              </ListItemIcon>
              Request External Patient Record
            </MenuItem>
            <MenuItem onClick={() => nav("/doctor/activity")}>
              <ListItemIcon sx={{ color: "text.primary" }}>
                <Description />
              </ListItemIcon>
              Activity History
            </MenuItem>
            <MenuItem onClick={() => logout()}>
              <ListItemIcon sx={{ color: "text.primary" }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          <AlertNotifications
            handleClose={() => setAnchorElNotification(null)}
            anchorEl={anchorElNotification}
            onClickProps={{ setDialogData }}
          />
          <RequestNotifications
            handleClose={() => setAnchorElRequests(null)}
            anchorEl={anchorElRequests}
          />
        </Toolbar>
        <GetDiolog
          anchorEl={setAnchorEl}
          user={user}
          moreUserDetails={moreUserDetails}
          isOpen={openDialog}
          setOpenDialog={setOpenDialog}
          broadcastAlert={broadcastAlert}
        />
      </AppBar>
      {dialogData && (
        <GetDialogForRequesting
          anchorEl={setAnchorElNotification}
          open={dialogData ? true : false}
          handleClose={() => {
            setDialogData(null);
          }}
          item={dialogData}
          moreuser={moreUserDetails}
          broadcastAlert={broadcastAlert}
        />
      )}
    </>
  );
}

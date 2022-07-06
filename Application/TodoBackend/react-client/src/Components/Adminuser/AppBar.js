import {
  DarkMode,
  DarkModeOutlined,
  KeyboardArrowDown,
  Logout,
  MarkEmailUnread
} from "@mui/icons-material";
import {
  Toolbar,
  IconButton,
  Tooltip,
  AppBar,
  Avatar,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Chip,
  Typography,
  Dialog,
  Collapse,
  DialogTitle,
  DialogContent,
  DialogContentText,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogActions,
  Button,
  CircularProgress,
  Container,
  Checkbox,
  TextField
} from "@mui/material";
import {
  AlertNotifications,
  AppIconHead,
  getAlertValues,
  Transition
} from "../StyledComponents";
import adminImg from "../../static/images/admin.png";
import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import {
  acceptExternalDoctorRequest,
  denyExternalDoctorRequest,
  getPatientDetails
} from "../../APIs/Admin/main.api";

function GetCheckBoxes({ checked, setChecked }) {
  return (
    <div>
      <FormControlLabel
        label="Associated Doctors"
        disabled={checked.length === 0}
        control={
          <Checkbox
            checked={checked.every((_, i) => checked[i].check)}
            indeterminate={
              !checked.every((ele, i) => !checked[i].check) &&
              !checked.every((_, i) => checked[i].check)
            }
            onChange={(e) =>
              setChecked(checked.map((ele) => ({ ...ele, check: e.target.checked })))
            }
          />
        }
      />
      <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
        {checked.length === 0 && (
          <Typography>
            No doctors are associated to this patient, a polite decline would be a optimal
            choice here"
          </Typography>
        )}
        {checked.map((ele, i) => (
          <FormControlLabel
            key={i}
            label={ele.label}
            control={
              <Checkbox
                checked={ele.check}
                onChange={(e) =>
                  setChecked(
                    checked.map((item, index) => ({
                      ...item,
                      check: i === index ? e.target.checked : item.check
                    }))
                  )
                }
              />
            }
          />
        ))}
      </Box>
    </div>
  );
}
function GetDialogForRequesting({ open, handleClose, item, broadcastAlert }) {
  const [valueAccept, setValueAccep] = useState("");
  const [promise, setPromise] = useState(false);
  // const [associatedDoctors, setAssociatedDoctors] = useState([]);
  const [checked, setChecked] = useState();
  const [note, setNote] = useState("");
  const [promiseForProcess, setPromiseForProcess] = useState(false);
  const Data = JSON.parse(item.Data);
  const getData = useCallback(async () => {
    setPromise(false);
    try {
      const doctors = [];
      const r = await getPatientDetails(Data.PatientID);
      Object.keys(r.data.associatedDoctors).every((key) => {
        const ele = r.data.associatedDoctors[key];
        doctors.push({
          ID: key,
          check: false,
          label: `${ele.name} - ${key}`,
          EMRID: ele.EMRID,
          name: ele.name
        });
        return true;
      });
      setChecked(doctors);
      setPromise(true);
    } catch (err) {
      handleClose();
    }
  }, []);
  useEffect(() => {
    getData();
  }, [getData]);

  const handleProcess = async () => {
    if (
      valueAccept === "" ||
      (valueAccept === "accept" && checked.every((ele, i) => !checked[i].check)) ||
      (valueAccept === "deny" && note.trim() === "")
    )
      return;
    setPromiseForProcess(true);
    if (valueAccept === "accept") {
      const selected = [];
      console.log(checked);
      checked.forEach((ele) => {
        if (ele.check)
          selected.push(JSON.stringify({ ID: ele.ID, EMRID: ele.EMRID, name: ele.name }));
      });

      console.log(selected);

      try {
        await acceptExternalDoctorRequest(selected, Data, item);
        broadcastAlert((prev) => [
          ...prev,
          getAlertValues(
            "success",
            "Request Processing Was Successfull",
            "The request to share EMR record of patient has been shared to all associated doctors. An automatic reply will be sent to the requesting doctor."
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
        await denyExternalDoctorRequest(Data, text, item);
        broadcastAlert((prev) => [
          ...prev,
          getAlertValues(
            "success",
            "Request Processing Was Successfull",
            "The denied request alert was successfully sent to the requesting hospital doctor."
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
              <b>Access Request Permit Sharing Of Records</b>
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
                      Below are the following records associated to different doctors.
                      Please select all the records you would like to share with{" "}
                      {Data.FromOrg} doctor. After the accepting their request, the below
                      selected doctors will be notified about it and asked for permission
                      as well.
                    </Typography>
                    <GetCheckBoxes checked={checked} setChecked={setChecked} />
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
                <Button onClick={handleClose}>
                  <b>Close</b>
                </Button>
                <Button onClick={handleProcess}>
                  <b>Process Request</b>
                </Button>
              </>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
export function AppContentBar({ mode, newMode, logout, user, broadcastAlert }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const GetMode = () => (mode === "dark" ? <DarkMode /> : <DarkModeOutlined />);
  const handleClickYou = (event) => setAnchorEl(event.currentTarget);
  const handleClickNoti = (event) => setAnchorElNotification(event.currentTarget);
  const [dialogData, setDialogData] = useState(null);
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
          <AppIconHead homeLink="/admin/hospital/" role="Hospital Admin" />
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
            <Tooltip title={"Email Notifications"}>
              <IconButton
                size="large"
                color="inherit"
                sx={{ padding: 1, mr: 2 }}
                onClick={handleClickNoti}>
                <MarkEmailUnread />
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
                label={user.username.split()[0]}
                onClick={handleClickYou}
                onDelete={handleClickYou}
                avatar={<Avatar atl={user.username[0]} src={adminImg} />}
                deleteIcon={<KeyboardArrowDown />}
              />
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
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
            <MenuItem onClick={() => setAnchorEl(null)}>
              <Avatar sx={{ bgcolor: "primary.main" }}>H</Avatar>
              <Typography component="span" sx={{ fontSize: "13px", ml: 0.5 }}>
                <div>AdminID : {user.username}</div>
                <div>Organization : {user.org}</div>
              </Typography>
            </MenuItem>
            <Divider />
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
        </Toolbar>
      </AppBar>
      {dialogData && (
        <GetDialogForRequesting
          open={dialogData ? true : false}
          handleClose={() => {
            setDialogData(null);
          }}
          item={dialogData}
          broadcastAlert={broadcastAlert}
        />
      )}
    </>
  );
}

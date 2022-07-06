import { DarkMode, DarkModeOutlined, Logout, MarkEmailUnread } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import { useState } from "react";
import {
  AlertNotifications,
  AppIconHead,
  getAlertValues,
  Transition
} from "../StyledComponents";
import adminImg from "../../static/images/admin.png";
import {
  acceptRequestToFromDoctors,
  denyRequestToFromDoctors
} from "../../APIs/Patient/api";

function GetDialogForRequesting({
  anchorEl,
  open,
  handleClose,
  item,
  moreuser,
  broadcastAlert
}) {
  const [valueAccept, setValueAccep] = useState("");
  // const [associatedDoctors, setAssociatedDoctors] = useState([]);
  const [note, setNote] = useState("");
  const [promiseForProcess, setPromiseForProcess] = useState(false);
  const Data = JSON.parse(item.Data);
  if (open) anchorEl(null);

  const handleProcess = async () => {
    if (valueAccept === "deny" && note.trim() === "") return;
    setPromiseForProcess(true);
    if (valueAccept === "accept") {
      try {
        await acceptRequestToFromDoctors(Data, moreuser.fullOrg, item);
        broadcastAlert((prev) => [
          ...prev,
          getAlertValues(
            "success",
            "Request Processing Was Successfull",
            "The request to share EMR record with external doctor was successfull. An automatic reply will be sent back to the doctor."
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
        console.log("HELLO1");
        console.log("SENDING -", Data, moreuser.fullOrg, text, item);
        await denyRequestToFromDoctors(Data, moreuser.fullOrg, text, item);
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
                  Your complete Personal Health Record (PHR) along with the accepted
                  Electronic Medical Records will shared with the external doctor. Please
                  confirm with the hospital Admin and doctors before proceeding, in other
                  case please proceed.
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
                  If you would like to deny their request, please provide a polite note
                  below to inform the hospital about the denial
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
    </Dialog>
  );
}

export default function PatientAppBar({
  mode,
  newMode,
  logout,
  user,
  moreUserDetails,
  broadcastAlert
}) {
  const GetMode = () => (mode === "dark" ? <DarkMode /> : <DarkModeOutlined />);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const handleClickNoti = (event) => setAnchorElNotification(event.currentTarget);
  const [dialogData, setDialogData] = useState(null);
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "primary.sectionContainer",
          backgroundImage: "none",
          padding: "7px 0px",
          color: "text.primary"
        }}>
        <Toolbar variant="dense">
          <AppIconHead homeLink="/patients/profile" role="Patient Profile" />
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
                sx={{ padding: 1 }}
                onClick={handleClickNoti}>
                <MarkEmailUnread />
              </IconButton>
            </Tooltip>
            <Tooltip title="User">
              <IconButton
                onClick={handleClick}
                size="large"
                edge="end"
                aria-label="User"
                color="inherit"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}>
                <Avatar alt="Superuser" src={adminImg} />
              </IconButton>
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
              <Typography component="span" sx={{ fontSize: "13px", ml: 1 }}>
                <div>
                  Name :{" "}
                  {`${user?.details?.firstName || ""} ${
                    user?.details?.middleName === "UNDEFINED"
                      ? ""
                      : user.details.middleName
                  } ${user?.details?.lastName || ""}`}
                </div>
                <div>PatientID : {moreUserDetails.username}</div>
                <div>Hospital : {moreUserDetails.org}</div>
                <div>
                  Status :{" "}
                  {user.active === "Waiting To Be Assigned"
                    ? "In-Active"
                    : user.active === "Not Patients"
                    ? "Not Patient"
                    : "Active Patient"}
                </div>
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

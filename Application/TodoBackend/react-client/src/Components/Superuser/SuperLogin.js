import { useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  SectionContainer,
  Logo,
  Transition,
  GetVisibility
} from "../StyledComponents.js";
import {
  AccountCircle,
  AdminPanelSettings,
  AlternateEmail,
  LocalHospital,
  Lock,
  Person,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Tooltip
} from "@mui/material";
import { loginAuth } from "../../APIs/Superuser/network.api.js";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import {
  adminLoginAuth,
  loginOnBehalfOF,
  patientLoginAuth
} from "../../APIs/Admin/main.api.js";
const login = async (user, pass, type) => {
  switch (type) {
    case "superuser":
      return loginAuth(user, pass);
    case "admin":
      return adminLoginAuth(user, pass);
    case "patient":
      return patientLoginAuth(user, pass);
    default:
      break;
  }
};
const ButtonMailto = ({ mailto, label }) => {
  return (
    <Link
      to="#"
      onClick={(e) => {
        window.location.href = `mailto:${mailto}`;
        e.preventDefault();
      }}>
      {label}
    </Link>
  );
};
const otherLogins = [
  { type: "admin", label: "Admin", url: "/admin/login", icon: <AdminPanelSettings /> },
  { type: "patient", label: "Patient", url: "/patient/login", icon: <Person /> },
  { type: "doctor", label: "Doctor", url: "/doctor/login", icon: <AccountCircle /> },
  {
    type: "superuser",
    label: "SuperAdmin",
    url: "/superuser/login",
    icon: <LocalHospital />
  }
];
export default function Login({ setLogin, pathname, message, loginType }) {
  let navigate = useNavigate();
  const [pwVisible, setpwVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(message);
  const [open, setOpen] = useState(message ? true : false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [extraDataAfterNewPass, setExtraDataAfterNewPass] = useState({});
  const [loadingForDialog, setLoadingForDialog] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [dialogPassVisible, setDialogPassVisible] = useState(false);
  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };
  const handleResetPassword = () => {
    setDialogError("");
    if (newPassword.trim() === extraDataAfterNewPass.password) {
      setDialogError(
        "Password should not be same as previously defined by hospital organization"
      );
      return;
    }
    console.log("submitted the new pass - 1");
    setLoadingForDialog(true);
    loginOnBehalfOF(extraDataAfterNewPass.user, newPassword.trim())
      .then((r) => {
        console.log("recieved response the new pass - 1");
        console.log(r.data);
        setLogin(r.data);
        setLoadingForDialog(false);
        navigate(pathname, { state: { org: r.data.org } });
      })
      .catch((e) => {
        e.response?.data
          ? setDialogError(e.response.data.DETAILS)
          : setDialogError(
              `Failed to connect to the server. Check your internet connection`
            );
        setTimeout(() => {
          setLoadingForDialog(false);
        }, 500);
      });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    login(data.get("username").trim(), data.get("password").trim(), loginType)
      .then((r) => {
        if (r.data) {
          if (r.data.isOnBehalf === -1 || loginType !== "patient") {
            setLogin(r.data);
            navigate(pathname, { state: { org: r.data.org } });
          } else {
            setOpenDialog(true);
            r.data.password = data.get("password").trim();
            setExtraDataAfterNewPass(r.data);
          }
        }
      })
      .catch((e) => {
        e.response?.data
          ? setError(e.response.data.DETAILS)
          : setError(`Failed to connect to the server. Check your internet connection`);
        setTimeout(() => {
          setLoading(false);
          setOpen(true);
        }, 500);
      });
  };

  const changeVisibility = () => setpwVisible(!pwVisible);
  const navigateToSignup = () => navigate(`/${loginType}/signup`);
  const getLabelForLogin = (label = false) => {
    switch (loginType) {
      case "superuser":
        return label ? "Superuser " : { placeholder: "SuperAdmin ID" };
      case "admin":
        return label ? "Admin " : { placeholder: "Admin ID" };
      case "patient":
        return label ? "Patient " : { placeholder: "Patient ID" };
      case "doctor":
        return label ? "Staff " : { placeholder: "Staff ID" };
      default:
        break;
    }
  };
  const GetLabelForHelp = () => {
    switch (loginType) {
      case "superuser":
        return "Please contact the blockchain developer if you have forgotten your password";
      case "admin":
        return "Please contact the superuser head of network if you have forgotten your password";
      case "patient":
      case "doctor":
        return (
          <Link
            onClick={navigateToSignup}
            sx={{
              width: "100%",
              textAlign: "center",
              cursor: "pointer"
            }}>
            <b>New to the site? Sign up Now!</b>
          </Link>
        );
      default:
        return "";
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        onClose={toggleDialog}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            bgcolor: "primary.sectionContainer"
          }
        }}>
        <DialogTitle>Set New Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            The account signup was done by the hospital staff. To maintain the anonymity
            and secure data within the registering hospital{" "}
            {`[${extraDataAfterNewPass.org || ""}]`}, we require you to set a new password
            known to you alone. For more details, please contact the hospital Admin or{" "}
            <b>
              <ButtonMailto
                label="email us your problem"
                mailto="kamal20012011@hotmail.com"
              />
            </b>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="passwordReset"
            label="Set Password"
            type={dialogPassVisible ? "text" : "password"}
            fullWidth
            variant="standard"
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "text.primary" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={dialogPassVisible ? "Hide Password" : "Show Password"}>
                    <IconButton
                      onClick={() => setDialogPassVisible(!dialogPassVisible)}
                      sx={{ color: "text.primary" }}>
                      <GetVisibility visible={dialogPassVisible} />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
            error={dialogError !== "" ? true : false}
            helperText={dialogError}
          />
        </DialogContent>
        <DialogActions>
          {loadingForDialog ? (
            <CircularProgress sx={{ mr: 2, mb: 2 }} />
          ) : (
            <>
              <Button onClick={toggleDialog}>
                <b>Go Back</b>
              </Button>
              <Button onClick={handleResetPassword}>
                <b>Continue</b>
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <SectionContainer
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "start"
        }}>
        <Typography sx={{ width: "100%", textAlign: "center", mb: 1 }}>
          <b>Other Login Redirects</b>
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            backgroundColor: "primary.sectionBorder",
            borderRadius: "20px",
            pr: -1,
            mb: 2.5
          }}>
          {otherLogins.map((ele, i) => {
            return (
              <span key={i}>
                {ele.type !== loginType && (
                  <Box
                    component="div"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}>
                    <Button
                      onClick={() => navigate(ele.url)}
                      startIcon={ele.icon}
                      sx={{ textTransform: "capitalize", ml: 1 }}>
                      <b>{ele.label}</b>
                    </Button>
                  </Box>
                )}
              </span>
            );
          })}
        </Box>
        <Divider textAlign="center" sx={{ width: "100%", mb: 1.5 }} />
        <Box textAlign="center">
          <Logo />
          <Typography component="h1" variant="h5" fontWeight="bolder" marginTop="10px">
            {getLabelForLogin(true)}
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="username"
              {...getLabelForLogin()}
              autoComplete="username"
              autoFocus
              sx={{ borderRadius: 34 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail sx={{ color: "text.primary" }} />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              placeholder="Password"
              type={pwVisible ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "text.primary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={pwVisible ? "Hide Password" : "Show Password"}>
                      <IconButton
                        onClick={() => changeVisibility()}
                        sx={{ color: "text.primary" }}>
                        <GetVisibility visible={pwVisible} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
            {/* {(loginType === "patient" ||
                            loginType === "doctor") && <GetOrganizationField />} */}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
              sx={{ mt: 3, mb: 2, fontWeight: "bolder" }}>
              Sign In
            </LoadingButton>
            {error && (
              <Collapse
                in={open}
                onExited={() => {
                  setError(undefined);
                }}>
                <Alert
                  severity="error"
                  sx={{ fontSize: "13px", mb: 2 }}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => setOpen(false)}>
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }>
                  <b>{error}</b>
                </Alert>
              </Collapse>
            )}
            <Grid container textAlign="center" fontSize="13px" color="text.secondary">
              <GetLabelForHelp />
            </Grid>
          </Box>
        </Box>
      </SectionContainer>
    </Container>
  );
}

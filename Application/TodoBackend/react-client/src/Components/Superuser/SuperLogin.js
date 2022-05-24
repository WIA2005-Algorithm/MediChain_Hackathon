import { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { SectionContainer, Logo, Transition } from "../StyledComponents.js";
import {
    AlternateEmail,
    Lock,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import {
    Alert,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    MenuItem,
    Select,
    Tooltip,
} from "@mui/material";
import { loginAuth } from "../../APIs/Superuser/network.api.js";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import {
    adminLoginAuth,
    getHospitalsEnrolled,
    loginOnBehalfOF,
    patientLoginAuth,
} from "../../APIs/Admin/main.api.js";

const login = async (user, pass, type) => {
    switch (type) {
        case "superuser":
            return loginAuth(user, pass);
            break;
        case "admin":
            return adminLoginAuth(user, pass);
        case "patient":
            return patientLoginAuth(user, pass);
        default:
            break;
    }
};
// const GetOrganizationField = () => {
//     const [promise, setPromise] = useState(false);
//     const [options, setOptions] = useState([]);
//     let fetchHospitalOptions = useCallback(async () => {
//         let res = await getHospitalsEnrolled();
//         if (res) setOptions(res.data);
//         setPromise(() => true);
//     }, []);

//     useEffect(() => {
//         fetchHospitalOptions();
//     }, [fetchHospitalOptions]);

//     return (
//         <FormControl>
//             <InputLabel id="hospital-select-helper">
//                 Hospital Organization
//             </InputLabel>
//             <Select
//                 labelId="hospital-select-helper"
//                 id="org"
//                 required
//                 value=""
//                 name="org"
//                 disabled={!promise}
//                 label="Hospital Organization"
//             >
//                 <MenuItem value="">
//                     <em>Please Select</em>
//                 </MenuItem>
//                 {options.map((val) => (
//                     <MenuItem key={val} value={val}>
//                         {val}
//                     </MenuItem>
//                 ))}
//             </Select>
//             <FormHelperText>
//                 Please key in your the hospital you want to register for the
//                 record. If you are unable to find your hospital, please contact
//                 the hospital as soon as possible.
//             </FormHelperText>
//         </FormControl>
//     );
// };
export default function Login({ setLogin, pathname, message, loginType }) {
    let navigate = useNavigate();
    const [pwVisible, setpwVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(message);
    const [open, setOpen] = useState(message ? true : false);
    const [openDialog, setOpenDialog] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [extraDataAfterNewPass, setExtraDataAfterNewPass] = useState({});
    const toggleDialog = () => {
        setOpenDialog(!openDialog);
    };

    const handleResetPassword = () => {
        if (newPassword.trim() === "") return;
        loginOnBehalfOF(extraDataAfterNewPass.user, newPassword.trim())
            .then((r) => {
                setLogin(r.data);
                navigate(pathname, { state: { org: r.data.org } });
            })
            .catch((e) => {
                e.response?.data
                    ? setError(e.response.data.DETAILS)
                    : setError(
                          `Failed to connect to the server. Check your internet connection`
                      );
                setTimeout(() => {
                    setLoading(false);
                    setOpen(true);
                }, 500);
            });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);
        login(
            data.get("username").trim(),
            data.get("password").trim(),
            loginType
        )
            .then((r) => {
                if (r.data) {
                    if (r.data.isOnBehalf === -1 || loginType !== "patient") {
                        setLogin(r.data);
                        navigate(pathname, { state: { org: r.data.org } });
                    } else {
                        setOpenDialog(true);
                        setExtraDataAfterNewPass(r.data.loginDetails);
                    }
                }
            })
            .catch((e) => {
                e.response?.data
                    ? setError(e.response.data.DETAILS)
                    : setError(
                          `Failed to connect to the server. Check your internet connection`
                      );
                setTimeout(() => {
                    setLoading(false);
                    setOpen(true);
                }, 500);
            });
    };

    function GetVisibility() {
        return pwVisible ? <Visibility /> : <VisibilityOff />;
    }

    const changeVisibility = () => setpwVisible(!pwVisible);

    const navigateToSignup = () =>
        navigate(`/${loginType}/signup`, { state: { type: loginType } });
    const getLabelForLogin = (label = true) => {
        switch (loginType) {
            case "superuser":
                return label ? "Superuser " : "SuperAdminID";
            case "admin":
                return label ? "Admin " : "AdminID";
            case "patient":
                return label ? "Patient " : "PatientID";
            case "doctor":
                return label ? "Staff " : "StaffID";
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
                return (
                    <Link onClick={navigateToSignup}>
                        New to the site? Sign up Now!
                    </Link>
                );
            case "doctor":
                return (
                    <Link onClick={navigateToSignup}>
                        New to the site? Sign up Now!
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
                keepMounted
                onClose={toggleDialog}
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{
                    sx: {
                        bgcolor: "primary.sectionContainer",
                    },
                }}
            >
                <DialogTitle>Set Your Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The Signup was attempted on behalf of the hospital -
                        Please set up a new password to continue.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="passwordReset"
                        label="Set Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleDialog}>Go Back</Button>
                    {/* // TODO: ADD A HANDLER HERE */}
                    <Button onClick={handleResetPassword}>Continue</Button>
                </DialogActions>
            </Dialog>
            <SectionContainer
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                }}
            >
                <Box textAlign="center">
                    <Logo />
                    <Typography
                        component="h1"
                        variant="h5"
                        fontWeight="bolder"
                        marginTop="10px"
                    >
                        {getLabelForLogin}
                        Login
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Username"
                            name="username"
                            placeholder={() => getLabelForLogin(false)}
                            autoComplete="username"
                            autoFocus
                            sx={{ borderRadius: 34 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AlternateEmail
                                            sx={{ color: "text.primary" }}
                                        />
                                    </InputAdornment>
                                ),
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
                                        <Tooltip
                                            title={
                                                pwVisible
                                                    ? "Hide Password"
                                                    : "Show Password"
                                            }
                                        >
                                            <IconButton
                                                onClick={() =>
                                                    changeVisibility()
                                                }
                                                sx={{ color: "text.primary" }}
                                            >
                                                <GetVisibility />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* {(loginType === "patient" ||
                            loginType === "doctor") && <GetOrganizationField />} */}
                        <LoadingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            loading={loading}
                            sx={{ mt: 3, mb: 2, fontWeight: "bolder" }}
                        >
                            Sign In
                        </LoadingButton>
                        {error && (
                            <Collapse
                                in={open}
                                onExited={() => {
                                    setError(undefined);
                                }}
                            >
                                <Alert
                                    severity="error"
                                    sx={{ fontSize: "13px", mb: 2 }}
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => setOpen(false)}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                >
                                    <b>{error}</b>
                                </Alert>
                            </Collapse>
                        )}
                        <Grid
                            container
                            textAlign="center"
                            fontSize="13px"
                            color="text.secondary"
                        >
                            <GetLabelForHelp />
                        </Grid>
                    </Box>
                </Box>
            </SectionContainer>
        </Container>
    );
}

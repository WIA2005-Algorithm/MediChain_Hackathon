import { useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { SectionContainer, Logo } from "../StyledComponents.js";
import {
    AlternateEmail,
    Lock,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import {
    Alert,
    Collapse,
    IconButton,
    InputAdornment,
    Tooltip,
} from "@mui/material";
import { loginAuth } from "../../APIs/Superuser/network.api.js";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
export default function Login({ setLogin, pathname }) {
    let navigate = useNavigate();
    const [pwVisible, setpwVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const [open, setOpen] = useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);
        loginAuth(data.get("username").trim(), data.get("password"))
            .then((r) => {
                setLogin(r.data);
                navigate(pathname);
            })
            .catch((e) => {
                console.log(e);
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

    return (
        <Container component="main" maxWidth="xs">
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
                        Superuser Login
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
                            placeholder="Superuser"
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
                            Please contact the blockchain developer, if you have
                            forgotten your superuser password
                        </Grid>
                    </Box>
                </Box>
            </SectionContainer>
        </Container>
    );
}

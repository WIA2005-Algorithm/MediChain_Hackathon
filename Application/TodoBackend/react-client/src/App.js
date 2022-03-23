import "./App.css";
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber } from "@mui/material/colors";
import Header from "./Components/Superuser/header";
import { Button, Container, CssBaseline } from "@mui/material";
import NetworkPage from "./Components/Superuser/networksPage";
import Middle from "./Components/Superuser/middle";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "./Components/Superuser/Login";
import { useAuth } from "./Components/UserAuth";
import {
    AddNewNotification,
    getAlertValues,
} from "./Components/StyledComponents";

const getDesignTokens = (mode) => ({
    typography: {
        fontSize: 13,
    },
    palette: {
        mode,
        primary: {
            ...(mode === "light"
                ? {
                      main: "#0C3E8C",
                      sectionContainer: "#FFF",
                      sectionBorder: "#d21ab5",
                  }
                : {
                      main: amber[600],
                      sectionContainer: "#0A1929",
                      sectionBorder: "#2F3D4C",
                  }),
        },
        ...(mode === "light"
            ? {
                  background: {
                      default: "#F3F6FD",
                  },
              }
            : {
                  background: {
                      default: "#001E3C",
                  },
              }),
        text: {
            ...(mode === "light"
                ? {
                      primary: "#000",
                      secondary: "#606060",
                      reverse: "#fff",
                  }
                : {
                      primary: "#fff",
                      secondary: "#C4C4C4",
                      reverse: "#000",
                  }),
        },
        shape: {
            boxShadow:
                "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
        },
        error: {
            main: "#d32f2f",
            secondary: "rgba(250, 0, 0, 0.123)",
        },

        success: {
            main: "#2e7d32",
            secondary: "rgba(28, 173, 105, 0.219)",
        },

        info: {
            main: "#0288d1",
            secondary: "#0288d11a",
        },
    },
});

const ColorModeContext = React.createContext();
function App() {
    const [notis, setNotis] = React.useState([]);
    const handleRemove = (id) => setNotis(notis.filter((el) => el.id != id));
    const [isLogged, login, logout, user] = useAuth();
    const [navigation, setNavigation] = React.useState({});
    const isNightMode = () => localStorage.getItem(btoa("NIGHT_MODE"));
    const [colorMode, setColorMode] = React.useState(isNightMode() || "dark");
    const ChangeColorMode = () => {
        const newMode = colorMode === "light" ? "dark" : "light";
        localStorage.setItem(btoa("NIGHT_MODE"), newMode);
        setColorMode(newMode);
    };
    const theme = createTheme(getDesignTokens(colorMode));
    return (
        <ColorModeContext.Provider value={{ colorMode, update: setColorMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Routes>
                        {!isLogged && (
                            <Route
                                path="/superuser/login"
                                element={<Login setLogin={login} />}
                            />
                        )}
                        {isLogged && (
                            <Route
                                path="/superuser/networks/*"
                                element={
                                    <>
                                        <Header
                                            newMode={ChangeColorMode}
                                            mode={colorMode}
                                            logout={logout}
                                            user={user}
                                        />
                                        <Container>
                                            <Middle nav={navigation} />
                                            <NetworkPage
                                                nav={navigation}
                                                setNav={setNavigation}
                                                notis={setNotis}
                                            />
                                        </Container>
                                    </>
                                }
                            />
                        )}
                        <Route
                            path="/superuser/*"
                            element={
                                <Navigate
                                    to={
                                        isLogged
                                            ? "/superuser/networks"
                                            : "/superuser/login"
                                    }
                                />
                            }
                        />
                    </Routes>
                    <AddNewNotification notis={notis} Onremove={handleRemove} />
                </Router>
                <Button
                    onClick={() =>
                        setNotis([
                            ...notis,
                            getAlertValues(
                                "info",
                                "Request to start the network succeeded successfully",
                                ""
                            ),
                        ])
                    }
                >
                    Info
                </Button>
                <Button
                    onClick={() =>
                        setNotis([
                            ...notis,
                            getAlertValues(
                                "error",
                                "There was an error in starting the network",
                                "Please wait for a moment then try again later"
                            ),
                        ])
                    }
                >
                    Error
                </Button>
                <Button
                    onClick={() =>
                        setNotis([
                            ...notis,
                            getAlertValues(
                                "success",
                                "The network has been started successfully",
                                "Please check the network status for more information.",
                                false
                            ),
                        ])
                    }
                >
                    Success
                </Button>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
export default App;

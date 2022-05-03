import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber } from "@mui/material/colors";
import Header from "./Components/Superuser/header";
import { Container, CssBaseline } from "@mui/material";
import NetworkPage from "./Components/Superuser/networksPage";
import Middle from "./Components/Superuser/middle";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import Login from "./Components/Superuser/Login";
import { useAuth } from "./Components/UserAuth";
import { AddNewNotification } from "./Components/StyledComponents";
import { createContext, useState } from "react";
import { HospitalAdminContent } from "./Components/Adminuser/AdminApp";

const getDesignTokens = (mode) => ({
    "@global": {
        "*::-webkit-scrollbar": {
            width: "0.4em",
        },
        "*::-webkit-scrollbar-track": {
            "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "*::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.1)",
            outline: "1px solid slategrey",
        },
    },
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
                      sectionBorder: "rgba(0, 0, 0, 0.12)",
                      background100: "rgba(12, 62, 140, 0.04)",
                  }
                : {
                      main: amber[600],
                      sectionContainer: "#0A1929",
                      sectionBorder: "rgba(255, 255, 255, 0.12)",
                      background100: "rgba(255, 179, 0, 0.08)",
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

const GoToLogin = ({ logged }) => {
    console.log("helloTo");
    const { pathname } = useLocation();
    console.log(pathname);
    if (!logged)
        return <Navigate to="/superuser/login" state={{ pathname }} replace />;
    return <Navigate to={pathname} replace />;
};
const GoFromLogin = ({ logged, setLogin }) => {
    console.log("helloFrom");
    const { state } = useLocation();
    const pathname = state ? state.pathname : "/superuser/networks";
    if (logged) return <Navigate to={pathname} replace />;
    return <Login setLogin={setLogin} pathname={pathname} />;
};

const ColorModeContext = createContext();
function App() {
    const [notis, setNotis] = useState([]);
    // Solved my problem of re-rendering here
    const handleRemove = (id) =>
        setNotis((n) => n.filter((el) => el.id !== id));
    const [isLogged, login, logout, user] = useAuth();
    const [navigation, setNavigation] = useState({});
    const isNightMode = () => localStorage.getItem(btoa("NIGHT_MODE"));
    const [colorMode, setColorMode] = useState(isNightMode() || "dark");
    const ChangeColorMode = () => {
        const newMode = colorMode === "light" ? "dark" : "light";
        localStorage.setItem(btoa("NIGHT_MODE"), newMode);
        setColorMode(newMode);
    };
    const theme = createTheme(getDesignTokens(colorMode));
    return (
        <ColorModeContext.Provider value={{ colorMode, update: setColorMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <Router>
                    <Routes>
                        {isLogged && user && user.role === "superadmin" && (
                            <Route
                                path="/superuser/networks/*"
                                element={
                                    <>
                                        <Header
                                            newMode={ChangeColorMode}
                                            mode={colorMode}
                                            logout={logout}
                                            user={user}
                                            setNotis={setNotis}
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
                            exact
                            path="/admin/lol"
                            element={
                                <HospitalAdminContent
                                    mode={colorMode}
                                    newMode={ChangeColorMode}
                                    logout={logout}
                                    user={user}
                                />
                            }
                        />
                        <Route
                            exact
                            path="/superuser/login"
                            element={
                                <GoFromLogin
                                    logged={isLogged}
                                    setLogin={login}
                                />
                            }
                        />
                        <Route
                            path="/superuser/*"
                            element={<GoToLogin logged={isLogged} />}
                        />
                    </Routes>
                    <AddNewNotification notis={notis} Onremove={handleRemove} />
                </Router>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
export default App;

import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber } from "@mui/material/colors";
import { CircularProgress, CssBaseline } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import Login from "./Components/Superuser/SuperLogin";
import { useAuth } from "./Components/UserAuth";
import { AddNewNotification } from "./Components/StyledComponents";
import { createContext, useEffect, useState } from "react";
import { HospitalAdminContent } from "./Components/Adminuser/AdminApp";
import SuperAdminContent from "./Components/Superuser/SuperUserAdmin";
import { Box } from "@mui/system";
import RegisterPatient from "./Components/Adminuser/DialogContent/RegisterPatientOrDoctor";

const getDesignTokens = (mode) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em"
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)"
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey"
    }
  },
  typography: {
    fontSize: 13
  },
  palette: {
    mode,
    primary: {
      ...(mode === "light"
        ? {
            main: "#0C3E8C",
            sectionContainer: "#FFF",
            sectionBorder: "rgba(0, 0, 0, 0.12)",
            background100: "rgba(12, 62, 140, 0.04)"
          }
        : {
            main: amber[600],
            sectionContainer: "#0A1929",
            sectionBorder: "rgba(255, 255, 255, 0.12)",
            background100: "rgba(255, 179, 0, 0.08)"
          })
    },
    ...(mode === "light"
      ? {
          background: {
            default: "#F3F6FD"
          }
        }
      : {
          background: {
            default: "#001E3C"
          }
        }),
    text: {
      ...(mode === "light"
        ? {
            primary: "#000",
            secondary: "#606060",
            reverse: "#fff"
          }
        : {
            primary: "#fff",
            secondary: "#C4C4C4",
            reverse: "#000"
          })
    },
    shape: {
      boxShadow:
        "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)"
    },
    error: {
      main: "#d32f2f",
      secondary: "rgba(250, 0, 0, 0.123)"
    },

    success: {
      main: "#2e7d32",
      secondary: "rgba(28, 173, 105, 0.219)"
    },

    info: {
      main: "#0288d1",
      secondary: "#0288d11a"
    }
  }
});

const GoToLogin = ({ logged, user, logout, type = "superuser" }) => {
  console.log(1, user);
  const { pathname } = useLocation();
  console.log(2, pathname);
  const wasLogged = logged;
  useEffect(() => {
    if (user && user.role !== type) {
      console.log(3, user && user.role !== type);
      logout();
    }
  }, []);

  if (user && user.role === type && pathname.includes(type))
    return <Navigate to={pathname} replace />;
  console.log(type);
  return (
    <Navigate
      to={`/${type}/login`}
      state={{
        pathname,
        message: wasLogged
          ? "You were not authorized to access this sector. Login to access"
          : ""
      }}
      replace
    />
  );
};
const GoFromLogin = ({ user, setLogin, logout, type = "superuser" }) => {
  console.log(4, user);
  const { state } = useLocation();
  useEffect(() => {
    if (user && user.role !== type) {
      console.log(5);
      logout();
    }
  }, []);
  let pathname;
  if (type === "superuser") pathname = state ? state.pathname : "/superuser/networks";
  else pathname = state ? state.pathname : `/admin/hospital/`;
  console.log(pathname);
  if (user && user.role === type && pathname.includes(type))
    return <Navigate to={pathname} replace />;
  return (
    <Login
      setLogin={setLogin}
      pathname={pathname}
      message={state && state.message}
      loginType={type}
    />
  );
};

const ColorModeContext = createContext();
function App() {
  const [notis, setNotis] = useState([]);
  // Solved my problem of re-rendering here
  const handleRemove = (id) => setNotis((n) => n.filter((el) => el.id !== id));
  const [isLogged, login, logout, user] = useAuth();
  const [navigation, setNavigation] = useState({});
  const isNightMode = () => localStorage.getItem(btoa("NIGHT_MODE"));
  const [colorMode, setColorMode] = useState(isNightMode() || "dark");
  const ChangeColorMode = () => {
    const newMode = colorMode === "light" ? "dark" : "light";
    localStorage.setItem(btoa("NIGHT_MODE"), newMode);
    setColorMode(newMode);
  };
  // To load the user data initially...
  const [userAvailable, setUserAvailable] = useState(false);

  useEffect(() => {
    if (user !== undefined) {
      setUserAvailable(true);
    }
  }, [user]);

  const theme = createTheme(getDesignTokens(colorMode));
  return (
    <ColorModeContext.Provider value={{ colorMode, update: setColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {!userAvailable && (
          <Box
            sx={{
              display: "flex",
              height: "100vh",
              width: "100vw",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <CircularProgress />
          </Box>
        )}
        {userAvailable && (
          <Router>
            <Routes>
              {isLogged && user && user.role === "superadmin" && (
                <Route
                  path="/superuser/networks/*"
                  element={
                    <SuperAdminContent
                      newMode={ChangeColorMode}
                      mode={colorMode}
                      logout={logout}
                      user={user}
                      setNotis={setNotis}
                      nav={navigation}
                      setNav={setNavigation}
                    />
                  }
                />
              )}
              {isLogged && user && user.role === "admin" && (
                <Route
                  exact
                  path={`/admin/hospital/*`}
                  element={
                    <HospitalAdminContent
                      mode={colorMode}
                      newMode={ChangeColorMode}
                      logout={logout}
                      user={user}
                      setNotis={setNotis}
                    />
                  }
                />
              )}
              <Route
                exact
                path="/superuser/login"
                element={<GoFromLogin user={user} setLogin={login} logout={logout} />}
              />
              <Route
                exact
                path="/admin/login"
                element={
                  <GoFromLogin
                    user={user}
                    setLogin={login}
                    logout={logout}
                    type="admin"
                  />
                }
              />
              <Route
                exact
                path="/patient/signup"
                element={<RegisterPatient broadcastAlert={setNotis} user={user} />}
              />
              <Route
                exact
                path="/patient/login"
                element={
                  <GoFromLogin
                    user={user}
                    setLogin={login}
                    logout={logout}
                    type="patient"
                  />
                }
              />
              <Route
                exact
                path="/doctor/login"
                element={
                  <GoFromLogin
                    user={user}
                    setLogin={login}
                    logout={logout}
                    type="doctor"
                  />
                }
              />

              <Route
                exact
                path="/doctor/signup"
                element={
                  <RegisterPatient broadcastAlert={setNotis} user={user} TYPE="doctor" />
                }
              />

              <Route
                exact
                path="/admin/*"
                element={
                  <GoToLogin logged={isLogged} user={user} logout={logout} type="admin" />
                }
              />
              <Route
                path="/superuser/*"
                element={<GoToLogin logged={isLogged} user={user} logout={logout} />}
              />
              <Route
                exact
                path="/patient/*"
                element={
                  <GoToLogin
                    logged={isLogged}
                    user={user}
                    logout={logout}
                    type="patient"
                  />
                }
              />
              <Route
                path="/doctor/*"
                element={
                  <GoToLogin
                    logged={isLogged}
                    user={user}
                    logout={logout}
                    type="doctor"
                  />
                }
              />
            </Routes>
            <AddNewNotification notis={notis} Onremove={handleRemove} />
          </Router>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
export default App;

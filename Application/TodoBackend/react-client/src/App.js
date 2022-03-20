import './App.css';
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { amber } from '@mui/material/colors';
import Header from './Components/Superuser/header';
import { Container, CssBaseline } from '@mui/material';
import NetworkPage from './Components/Superuser/networksPage';
import Middle from './Components/Superuser/middle';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './Components/Superuser/Login';
import { AuthVerify, useAuth } from './Components/UserAuth';

const getDesignTokens = (mode) => ({
  typography: {
    fontSize: 13,
  },
  palette: {
    mode,
    primary: {
      ...(mode === 'light'
      ? {
        main: '#0C3E8C',
        sectionContainer: '#FFF',
        sectionBorder: '#d21ab5'
      }
      : {
        main: amber[600],
        sectionContainer: '#0A1929',
        sectionBorder: '#2F3D4C'
      })
    },
    ...(mode === 'light'
    ? {
      background: {
        default: '#F3F6FD'
      }
    }
    : {
      background: {
        default: '#001E3C'
      }
    }),
    text: {
      ...(mode === 'light'
        ? {
            primary: '#000',
            secondary: '#606060',
            reverse: '#fff'
          }
        : {
            primary: '#fff',
            secondary: '#C4C4C4',
            reverse: '#000'
          }),
    },
    shape: {
      boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    }
  },
});

const ColorModeContext = React.createContext();
function App() {
  const [isLogged, login, logout] = useAuth();
  const [navigation, setNavigation] = React.useState({});
  const isNightMode = () => localStorage.getItem(btoa('NIGHT_MODE'));
  const [colorMode, setColorMode] = React.useState(isNightMode()|| 'dark')
  const ChangeColorMode = () => {
    const newMode = colorMode=='light'? 'dark': 'light';
    localStorage.setItem(btoa('NIGHT_MODE'), newMode);
    setColorMode(newMode);
  };
  const theme = createTheme(getDesignTokens(colorMode));
  return (
    <ColorModeContext.Provider value={{ colorMode, update: setColorMode }}>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Routes>
        {!isLogged && (<Route path="/superuser/login" element={<Login setLogin={login}/>} />)}
        {isLogged && <Route path="/superuser/networks/*" element={<>
        <Header newMode={ChangeColorMode} mode={colorMode}/>
        <Container>
          <Middle nav={navigation}/>
          <NetworkPage nav={navigation} setNav={setNavigation}/>
        </Container></>} />}
        <Route path="/superuser/*" element={<Navigate to={isLogged? "/superuser/networks" : "/superuser/login"} />}/>
      </Routes>
    </Router>
    </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
export default App;

import {
  AppBar,
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip
} from "@mui/material";
import { AppIconHead, getAlertValues, StyledBadge } from "../StyledComponents.js";
import { Box } from "@mui/system";
import { DarkMode, DarkModeOutlined, Logout } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import profile from "../../static/images/profile.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNetworks } from "../../APIs/Superuser/network.api.js";

export default function Header({ mode, newMode, logout, user, setNotis }) {
  const GetMode = () => (mode === "dark" ? <DarkMode /> : <DarkModeOutlined />);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => setAnchorEl(null);
  const nav = useNavigate();
  const open = Boolean(anchorEl);
  const openActivityLog = async () => {
    if (window.location.pathname.split("/").pop() === "activity_logs") return;
    const res = await getAllNetworks();
    if (res && res.data) {
      nav(`/superuser/networks/${res.data.Name}/activity_logs`);
    } else {
      setNotis((prev) => [
        ...prev,
        getAlertValues(
          "info",
          "No Network is initialized yet",
          "Incase, if the network has been inilialized, please reload the page and try again..",
          false
        )
      ]);
    }
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "primary.sectionContainer",
        backgroundImage: "none",
        padding: "7px 0px",
        color: "text.primary"
      }}>
      <Toolbar variant="dense">
        <AppIconHead homeLink="/superuser/networks" role="Root Admin" />
        <Box sx={{ color: "primary.main" }}>
          <Tooltip title={`Change to ${mode === "light" ? "Dark" : "Light"} Mode`}>
            <IconButton
              size="large"
              color="inherit"
              sx={{ padding: 1, mr: 1 }}
              onClick={() => newMode()}>
              <GetMode />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton
              onClick={openActivityLog}
              size="large"
              aria-label="Notifications"
              color="inherit"
              sx={{ padding: 1 }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                variant="dot">
                <NotificationsIcon />
              </StyledBadge>
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
              <Avatar alt="Superuser" src={profile} />
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
            <Avatar sx={{ bgcolor: "primary.main" }}>S</Avatar> {user && user.username}
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => logout()}>
            <ListItemIcon sx={{ color: "text.primary" }}>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

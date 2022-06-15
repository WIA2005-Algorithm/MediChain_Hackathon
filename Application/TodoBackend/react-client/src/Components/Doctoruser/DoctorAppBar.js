import {
  AccountBox,
  DarkMode,
  DarkModeOutlined,
  Description,
  KeyboardArrowDown,
  Logout,
  ManageSearch,
  Notifications
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { AppIconHead, StyledBadge } from "../StyledComponents";
import adminImg from "../../static/images/admin.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function AppHeader({
  mode,
  newMode,
  logout,
  user,
  moreUserDetails,
  broadcastAlert
}) {
  const GetMode = () => (mode === "dark" ? <DarkMode /> : <DarkModeOutlined />);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const nav = useNavigate();
  return (
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
        <AppIconHead homeLink={"/doctor/my_patients"} role={"Hospital Doctor"} />
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
          <Tooltip title="Notifications">
            <IconButton
              // TODO:: THE ONCLICK
              //   onClick
              size="large"
              aria-label="Notifications"
              color="inherit"
              sx={{ padding: 1, mr: 1 }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                variant="dot">
                <Notifications />
              </StyledBadge>
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
              label={`Dr. ${user?.details?.lastName || ""}`}
              onClick={handleClick}
              onDelete={handleClick}
              avatar={<Avatar atl={"Profile Image"} src={adminImg} />}
              deleteIcon={<KeyboardArrowDown />}
            />
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
          {/* TODO: ADD ANOTHER ITEM */}
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ bgcolor: "primary.main" }}>H</Avatar>
            <Typography component="span" sx={{ fontSize: "13px", ml: 0.5 }}>
              <div>
                Name :{" "}
                {`Dr. ${user?.details?.firstName || ""} ${
                  user?.details?.middleName || ""
                } ${user?.details?.lastName || ""}`}
              </div>
              <div>DoctorID : {moreUserDetails.username}</div>
              <div>Hospital : {moreUserDetails.org}</div>
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemIcon sx={{ color: "text.primary" }}>
              <ManageSearch />
            </ListItemIcon>
            Request External Patient Record
          </MenuItem>
          <MenuItem>
            <ListItemIcon sx={{ color: "text.primary" }}>
              <Description />
            </ListItemIcon>
            Activity History
          </MenuItem>
          <MenuItem onClick={() => nav("/doctor/about_me")}>
            <ListItemIcon sx={{ color: "text.primary" }}>
              <AccountBox />
            </ListItemIcon>
            My Profile
          </MenuItem>
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

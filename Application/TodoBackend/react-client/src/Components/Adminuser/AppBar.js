import {
    DarkMode,
    DarkModeOutlined,
    KeyboardArrowDown,
    Logout,
} from "@mui/icons-material";
import {
    Toolbar,
    IconButton,
    Tooltip,
    AppBar,
    Avatar,
    Button,
    Divider,
    ListItemIcon,
    Menu,
    MenuItem,
    Chip,
    Typography,
} from "@mui/material";
import { AppIconHead } from "../StyledComponents";
import adminImg from "../../static/images/admin.png";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";

export function AppContentBar({ mode, newMode, logout, user }) {
    const GetMode = () =>
        mode === "dark" ? <DarkMode /> : <DarkModeOutlined />;
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);
    useEffect(() => {
        console.log(user);
    }, [user]);
    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: "primary.sectionContainer",
                backgroundImage: "none",
                padding: "7px 0px",
                color: "text.primary",
            }}
        >
            <Toolbar variant="dense">
                {/* TODO: CHANGE APP HOME LINK */}
                <AppIconHead
                    homeLink="/superuser/networks"
                    role="Hospital Admin"
                />
                <Box sx={{ color: "primary.main" }}>
                    <Tooltip
                        title={`Change to ${
                            mode === "light" ? "Dark" : "Light"
                        } Mode`}
                    >
                        <IconButton
                            size="large"
                            color="inherit"
                            sx={{ padding: 1, mr: 1 }}
                            onClick={() => newMode()}
                        >
                            <GetMode />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="You">
                        <Chip
                            sx={{
                                "& .MuiChip-label": {
                                    textTransform: "capitalize",
                                    fontSize: "14px",
                                },
                                "& .MuiChip-avatar": {
                                    width: "35px",
                                    height: "35px",
                                    ml: -0.5,
                                },
                            }}
                            label={user.username.split()[0]}
                            onClick={handleClick}
                            onDelete={handleClick}
                            avatar={
                                <Avatar atl={user.username[0]} src={adminImg} />
                            }
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
                                mr: 1,
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
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    {/* TODO: ADD ANOTHER ITEM */}
                    <MenuItem onClick={handleClose}>
                        <Avatar sx={{ bgcolor: "primary.main" }}>H</Avatar>
                        <Typography
                            component="span"
                            sx={{ fontSize: "13px", ml: 0.5 }}
                        >
                            <div>AdminID : {user.username}</div>
                            <div>Organization : {user.org}</div>
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
            </Toolbar>
        </AppBar>
    );
}

import { AddCircle, PermContactCalendar } from "@mui/icons-material";
import {
    Toolbar,
    Button,
    ListItemButton,
    Divider,
    List,
    ListItemIcon,
    ListItemText,
    Drawer,
    ListItem,
} from "@mui/material";
import { Box } from "@mui/system";

export function AppNavSideBar({ optSelected, changeTabTo, navItems }) {
    const drawerWidth = 240;
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: "primary.sectionContainer",
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
                <List
                    sx={{
                        "&& .MuiListItemText-root, && .MuiListItemIcon-root": {
                            color: "text.secondary",
                        },
                        // selected and (selected + hover) states
                        "&& .Mui-selected, && .Mui-selected:hover": {
                            backgroundColor: "transparent",
                            "& .MuiListItemIcon-root": {
                                color: "primary.main",
                            },
                            "& .MuiListItemText-root": {
                                color: "text.primary",
                            },
                            "& .MuiListItemText-root > .MuiTypography-root": {
                                fontWeight: "bold",
                            },
                        },
                        // hover states
                        "& .MuiListItemButton-root:hover": {
                            backgroundColor: "transparent",
                            "& .MuiListItemIcon-root, & .MuiListItemText-root":
                                {
                                    color: "text.primary",
                                },
                        },
                        mt: 3,
                    }}
                >
                    <ListItemText
                        sx={{
                            ml: 1,
                            "& .MuiTypography-root": { fontWeight: "bold" },
                        }}
                    >
                        Admin
                    </ListItemText>
                    {navItems.map((item, i) => (
                        <div key={item.id}>
                            <ListItemButton
                                selected={optSelected === item.id}
                                // TODO: Onclick item
                                onClick={() => changeTabTo(item.id)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                            {i === 3 && (
                                <>
                                    <Divider />
                                    <ListItemText
                                        sx={{
                                            m: 1,
                                            "& .MuiTypography-root": {
                                                fontWeight: "bold",
                                            },
                                        }}
                                    >
                                        Patients
                                    </ListItemText>
                                </>
                            )}
                        </div>
                    ))}
                </List>
                <Divider />
                <ListItem sx={{ mt: 1 }}>
                    <Button
                        variant="contained"
                        endIcon={<AddCircle />}
                        sx={{
                            textTransform: "capitalize",
                            width: "100%",
                        }}
                        onClick={() => changeTabTo('/registerPatient')}
                    >
                        <b>Register Patient</b>
                    </Button>
                </ListItem>
                <ListItem>
                    <Button
                        variant="outlined"
                        endIcon={<PermContactCalendar />}
                        sx={{
                            textTransform: "capitalize",
                            width: "100%",
                        }}
                    >
                        <b>Contact SuperAdmin</b>
                    </Button>
                </ListItem>
            </Box>
        </Drawer>
    );
}

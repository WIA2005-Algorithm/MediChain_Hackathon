import {
    AddCircle,
    AssignmentTurnedIn,
    ExitToApp,
    History,
    MedicalServices,
    PeopleAlt,
    PermContactCalendar,
    QueryStats,
    ReceiptLong,
} from "@mui/icons-material";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AppNavSideBar() {
    const [optSelected, setOptSelected] = useState(0);
    const nav = useNavigate();
    const drawerWidth = 240;
    //@INFO: JUST TO PASS DATA BETWEEN TABS
    const navigate = (item, ...extra) => {
        setOptSelected(item.id);
        nav(item.url, { state: { extra } });
    };
    const adminItems = [
        //TODO: ADD URL INSIDE BELOW ICON ATTRIBUTE
        {
            id: 0,
            name: "Overview",
            icon: <QueryStats />,
            url: "/",
        },
        {
            id: 1,
            name: "Patients",
            icon: <PeopleAlt />,
            url: "/",
        },
        {
            id: 3,
            name: "Doctors",
            icon: <MedicalServices />,
            url: "/",
        },
        {
            id: 4,
            name: "Activity History",
            icon: <History />,
            url: "/",
        },
    ];

    const patientItems = [
        //TODO: ADD URL INSIDE BELOW ICON ATTRIBUTE
        {
            id: 5,
            name: "Enroll Patient",
            icon: <ReceiptLong />,
            url: "/",
        },
        {
            id: 6,
            name: "Assign Patient",
            icon: <AssignmentTurnedIn />,
            url: "/",
        },
        {
            id: 7,
            name: "Discharge Patients",
            icon: <ExitToApp />,
            url: "/",
        },
    ];
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
                    {adminItems.map((item) => (
                        <ListItemButton
                            key={item.id}
                            selected={optSelected === item.id}
                            // TODO: Onclick item
                            onClick={() => navigate(item)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    ))}
                    <Divider />
                    <ListItemText
                        sx={{
                            m: 1,
                            "& .MuiTypography-root": { fontWeight: "bold" },
                        }}
                    >
                        Patients
                    </ListItemText>
                    {patientItems.map((item) => (
                        <ListItemButton
                            key={item.id}
                            selected={optSelected === item.id}
                            // TODO: Onclick item
                            onClick={() => navigate(item)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
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
                    >
                        <b>Register Doctor</b>
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

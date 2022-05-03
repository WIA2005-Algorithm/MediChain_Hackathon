import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import {
    CallMissedOutgoing,
    Contacts,
    ExpandLess,
    ExpandMore,
    Face,
    HourglassBottom,
    LocationCity,
    LocationOn,
    Logout,
    Male,
    Person,
    Search,
    Visibility,
} from "@mui/icons-material";
import {
    AppBar,
    Chip,
    CircularProgress,
    Collapse,
    Divider,
    IconButton,
    InputBase,
    Paper,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { SectionContainer } from "../../StyledComponents";

function DoctorItem() {
    return (
        <Box component="div" sx={{ display: "flex", width: "100%", mb: 1 }}>
            <CallMissedOutgoing sx={{ transform: "rotate(45deg)" }} />
            <Box
                component="div"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    mt: 0.7,
                }}
            >
                <Typography sx={{ flexGrow: 1 }} component="div">
                    Dr. Ayati Tinkala Unkgu
                    <Typography className="secondary">
                        Assigned to patient on 24th October, 2021
                    </Typography>
                    <Typography className="secondary">
                        Department - Neurology
                    </Typography>
                </Typography>
                <Divider
                    orientation="vertical"
                    sx={{ height: "40px", mr: 1, ml: 1 }}
                />
                <Typography sx={{ flexGrow: 1 }} component="div">
                    Status - Actively Watched
                    <Typography className="secondary">
                        Associated with Neural, Cardio and Other Unknown
                        department doctors
                    </Typography>
                </Typography>
            </Box>
        </Box>
    );
}
export function ItemForTab({ item, collapse, setCollapse }) {
    const handleCollapseOuterClick = () => setCollapse.outer(item.ID);
    const handleCollapseInnerClick = () => setCollapse.inner(item.ID);
    return (
        <SectionContainer
            component="div"
            sx={{
                position: "relative",
                margin: 2,
                padding: "8px 16px",
                borderRadius: "6px",
                "& .MuiTypography-root": {
                    color: "text.primary",
                    fontWeight: "bold",
                },
                "& .MuiTypography-root .secondary": {
                    color: "text.secondary",
                    fontWeight: "normal",
                    fontSize: "14px",
                },
                "& .MuiSvgIcon-root": {
                    fontSize: "1.5rem",
                    color: "primary.main",
                    mr: 1,
                },
            }}
        >
            <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ flexGrow: "1" }} component="div">
                    <Box
                        component="div"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                        <Person />
                        <Typography component="div">
                            Kamal Kumar Khatri
                            <Typography className="secondary">
                                Last admitted as patient on 24th October, 2022
                            </Typography>
                        </Typography>
                    </Box>
                    <Box
                        component="div"
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <Male />
                        <Typography>Adult Male - 18 years old</Typography>
                    </Box>
                </Box>
                <Divider
                    orientation="vertical"
                    sx={{ height: "40px", mr: 1, ml: 1 }}
                />
                <Typography sx={{ flexGrow: "1" }} component="div">
                    Status - Actively Watched
                    <Typography className="secondary">
                        Associated with Neural, Cardio and Other Unknown
                        department doctors
                    </Typography>
                </Typography>
            </Box>
            <Chip
                label={`See ${collapse.outer ? "Less" : "More"}`}
                onClick={handleCollapseOuterClick}
                onDelete={handleCollapseOuterClick}
                variant="outlined"
                size="small"
                deleteIcon={
                    collapse.outer ? (
                        <ExpandLess sx={{ color: "primary.main" }} />
                    ) : (
                        <ExpandMore sx={{ color: "primary.main" }} />
                    )
                }
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: "primary.main",
                    borderColor: "primary.main",
                    fontWeight: "bold",
                    "& .MuiSvgIcon-root, .MuiSvgIcon-root:hover": {
                        color: "primary.main",
                    },
                }}
            />
            <Collapse in={collapse.outer} timeout="auto">
                <Box
                    component="div"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 2.5,
                        mb: 1,
                    }}
                >
                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: 1,
                        }}
                    >
                        <Contacts />
                        <Typography component="div">
                            Main : +60 166 290 306
                            <Typography className="secondary">
                                Whatsapp: +60 166 290 306
                            </Typography>
                            <Typography className="secondary">
                                Other: N/A
                            </Typography>
                        </Typography>
                    </Box>
                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: 1,
                        }}
                    >
                        <LocationOn />
                        <Typography>
                            9 Jln Jujur 1 Bandar Tun Abdul Razak
                            <br />
                            Kuala Lumpur
                        </Typography>
                    </Box>
                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: 1,
                        }}
                    >
                        <LocationCity />
                        <Typography>
                            Wilayah Persekutuan
                            <br />
                            Malaysia
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <Box component="div" sx={{ position: "relative" }}>
                    <Typography sx={{ mt: 1, mb: 2 }} component="div">
                        <u style={{ fontSize: "1rem" }}>Associated Doctors</u>
                        <Typography className="secondary">
                            Due associated to 3 different doctors{" "}
                        </Typography>
                    </Typography>
                    <Chip
                        label={collapse.inner ? "Collapse" : "Expand"}
                        onClick={handleCollapseInnerClick}
                        onDelete={handleCollapseInnerClick}
                        variant="outlined"
                        size="small"
                        deleteIcon={
                            collapse.inner ? (
                                <ExpandLess sx={{ color: "primary.main" }} />
                            ) : (
                                <ExpandMore sx={{ color: "primary.main" }} />
                            )
                        }
                        sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            color: "primary.main",
                            borderColor: "primary.main",
                            fontWeight: "bold",
                            "& .MuiSvgIcon-root, .MuiSvgIcon-root:hover": {
                                color: "primary.main",
                            },
                        }}
                    />
                    <Collapse in={collapse.inner} timeout="auto">
                        <DoctorItem />
                        <DoctorItem />
                        <DoctorItem />
                    </Collapse>
                </Box>
            </Collapse>
        </SectionContainer>
    );
}
function PatientList() {
    // TODO: REMOVE TEMPORARY DATA AND GO TO NEXT TO-DO ITEM...
    const [collapse, setCollapse] = useState({
        1: { outer: false, inner: true },
        2: { outer: false, inner: true },
        3: { outer: false, inner: true },
        4: { outer: false, inner: true },
    });
    const handleCollapse = {
        outer: (index) => {
            const current = collapse[index].outer;
            setCollapse({
                ...collapse,
                [index]: { ...collapse[index], outer: !current },
            });
        },
        inner: (index) => {
            const current = collapse[index].inner;
            setCollapse({
                ...collapse,
                [index]: { ...collapse[index], inner: !current },
            });
        },
    };
    // TODO: setCollapse string for initial items, inner true outer false
    //
    // TODO: Change to dynamic data
    return (
        <>
            <ItemForTab
                item={{ ID: 1 }}
                collapse={collapse[1]}
                setCollapse={handleCollapse}
            />
            <ItemForTab
                item={{ ID: 2 }}
                collapse={collapse[2]}
                setCollapse={handleCollapse}
            />
            <ItemForTab
                item={{ ID: 3 }}
                collapse={collapse[3]}
                setCollapse={handleCollapse}
            />
            <ItemForTab
                item={{ ID: 4 }}
                collapse={collapse[4]}
                setCollapse={handleCollapse}
            />
        </>
    );
}
export default function PatientData() {
    const [value, setValue] = useState("ID01");
    const [promiseResolved, setPromiseResolved] = useState(true);
    const handleChange = (_, newValue) => {
        setPromiseResolved(false);
        setValue(newValue);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const searchString = new FormData(e.currentTarget).get("search");
    };
    return (
        <Box component="div" sx={{ position: "relative", width: "inherit" }}>
            <AppBar
                position="static"
                sx={{
                    bgcolor: "transparent",
                    backgroundImage: "none",
                    boxShadow: "none",
                }}
            >
                <Paper
                    component="form"
                    sx={{
                        p: "2px 4px",
                        mb: 1,
                        mr: 2,
                        ml: 2,
                        display: "flex",
                        alignItems: "center",
                        backgroundImage: "none",
                        boxShadow: "none",
                        bgcolor: "primary.sectionContainer",
                        border: "1px solid",
                        borderColor: "primary.sectionBorder",
                    }}
                    onSubmit={handleSearchSubmit}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Patients By Name or ID"
                        inputProps={{
                            "aria-label": "search patients by name or ID",
                        }}
                        id="search"
                        name="search"
                    />
                    <IconButton
                        type="submit"
                        sx={{ p: "10px" }}
                        aria-label="search"
                    >
                        <Search sx={{ color: "text.primary" }} />
                    </IconButton>
                </Paper>

                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="patient types data"
                >
                    <Tab
                        value="ID01"
                        icon={<Visibility />}
                        label={<b>Active - Watched</b>}
                        iconPosition="start"
                    />
                    <Tab
                        value="ID02"
                        label={<b>Active - Waiting for discharge</b>}
                        icon={<Logout />}
                        iconPosition="start"
                    />
                    <Tab
                        value="ID03"
                        label={<b>Active - Waiting to be assigned</b>}
                        icon={<HourglassBottom />}
                        iconPosition="start"
                    />
                    <Tab
                        value="ID04"
                        label={<b>Members - Not Patients</b>}
                        icon={<Face />}
                        iconPosition="start"
                    />
                </Tabs>
            </AppBar>
            <Box component="div">
                {!promiseResolved && (
                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "300px",
                        }}
                    >
                        <CircularProgress sx={{ alignSelf: "center" }} />
                    </Box>
                )}
                {promiseResolved && <PatientList />}
            </Box>
        </Box>
    );
}

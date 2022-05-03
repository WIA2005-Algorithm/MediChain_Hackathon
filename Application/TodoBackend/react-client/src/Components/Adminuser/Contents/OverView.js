import {
    IconButton,
    Table,
    TableContainer,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    Tooltip as Tip,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    NativeSelect,
    MenuItem,
    Select,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
} from "chart.js";
import { Doughnut, Line, PolarArea } from "react-chartjs-2";
import {
    AccountBalanceWallet,
    KingBed,
    People,
    AcUnit,
    CheckBoxOutlineBlank,
    ContentCut,
    EscalatorWarning,
    Face,
    Favorite,
    Hearing,
    Home,
    LocalHospital,
    Psychology,
    Visibility,
    TransitEnterexit,
} from "@mui/icons-material";
import { SectionContainer } from "../../StyledComponents";
import { useState } from "react";
const Link = () => <TransitEnterexit sx={{ transform: "rotate(180deg)" }} />;
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
);
function createDivisionStatsData(icon, department, number) {
    return { icon, department, number };
}

function createNormalSectionBoxData(icon, num, title, link = null) {
    return { icon, num, title, link };
}
function NormalSectionBox() {
    const sectionBoxContent = [
        createNormalSectionBoxData(
            <KingBed color="inherit" />,
            234,
            "Total Patients",
            "/"
        ),
        createNormalSectionBoxData(
            <People color="inherit" />,
            34,
            "Total Available Staff",
            "/"
        ),
        createNormalSectionBoxData(
            <AccountBalanceWallet color="inherit" />,
            "$2,345",
            "Avg Treatment Cost"
        ),
    ];
    const nav = useNavigate();
    return sectionBoxContent.map(({ icon, num, title, link }) => (
        <SectionContainer
            key={title}
            sx={{
                display: "flex",
                flexGrow: 1,
                m: 2,
                alignItems: "flex-start",
                position: "relative",
            }}
        >
            <Box
                component="div"
                sx={{
                    borderRadius: "50%",
                    backgroundColor: "primary.background100",
                    p: 2,
                    mr: 2,
                    height: "40px",
                    width: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "primary.main",
                }}
            >
                {icon}
            </Box>
            <Typography component="h5">
                <b>{num}</b>
                <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
                    {title}
                </Typography>
            </Typography>
            {link && (
                <Tip title={`Go to ${title} Section`}>
                    <IconButton
                        onClick={() => nav(link)}
                        sx={{ position: "absolute", right: 2, top: 2 }}
                    >
                        <Link />
                    </IconButton>
                </Tip>
            )}
        </SectionContainer>
    ));
}

const columns = [
    { id: "icon", label: <Home />, minWidth: 100, align: "center" },
    {
        id: "department",
        label: "Department",
        minWidth: 150,
        align: "center",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "number",
        label: "Number of Patients",
        minWidth: 100,
        align: "center",
        format: (value) => value.toFixed(0),
    },
];
function DivisionStats() {
    const rows = [
        createDivisionStatsData(<EscalatorWarning />, "General", 63),
        createDivisionStatsData(<LocalHospital />, "Medicine", 63),
        createDivisionStatsData(<ContentCut />, "Surgery", 63),
        createDivisionStatsData(<AcUnit />, "Neurology", 63),
        createDivisionStatsData(<Favorite />, "Cardiology", 63),
        createDivisionStatsData(<Psychology />, "Psychology", 63),
        createDivisionStatsData(<Face />, "Dermotology", 63),
        createDivisionStatsData(<Hearing />, "ENT", 63),
        createDivisionStatsData(<Visibility />, "Ophthalmology", 63),
        createDivisionStatsData(<CheckBoxOutlineBlank />, "Other", 63),
    ];
    const nav = useNavigate();
    return (
        <SectionContainer
            sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                m: 2,
                position: "relative",
            }}
        >
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="left"
                                colSpan={2}
                                sx={{
                                    backgroundColor: "primary.sectionContainer",
                                }}
                            >
                                <Typography sx={{ whiteSpace: "nowrap" }}>
                                    <span>
                                        <b>Admitted Patients By Department</b>
                                        <br></br>
                                        <Typography
                                            sx={{
                                                fontSize: "13px",
                                                color: "text.secondary",
                                            }}
                                        >
                                            Scroll for more departments
                                        </Typography>
                                    </span>
                                </Typography>
                            </TableCell>
                            <TableCell
                                align="right"
                                colSpan={1}
                                sx={{
                                    backgroundColor: "primary.sectionContainer",
                                }}
                            >
                                <Tip title="Go to Patients Section">
                                    <IconButton
                                        //TODO: add a navlink
                                        onClick={() => nav("/")}
                                    >
                                        <Link />
                                    </IconButton>
                                </Tip>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        top: 75,
                                        minWidth: column.minWidth,
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <TableRow tabIndex={-1} key={row.department}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                            >
                                                {column.format &&
                                                typeof value === "number"
                                                    ? column.format(value)
                                                    : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </SectionContainer>
    );
}

const statsDataInOut = (data = []) => ({
    labels: ["In Patients", "Waiting/Out Patients"],
    datasets: [
        {
            label: "# of Patients In and Out",
            data,
            backgroundColor: [
                "rgb(255, 223, 111, 0.5)",
                "rgba(255, 99, 132, 0.5)",
            ],
            borderColor: ["rgb(255, 223, 111)", "rgb(255, 99, 132)"],
            borderWidth: 2.5,
        },
    ],
});

function StatsInOutPatient() {
    const getData = statsDataInOut([23, 34]);
    return (
        <Box
            sx={{
                maxWidth: "348px",
                width: "100%",
            }}
        >
            <Doughnut data={getData} />
        </Box>
    );
}

const statsGenderData = (data) => ({
    labels: ["Male", "Female"],
    datasets: [
        {
            label: "# of Patients By Gender",
            data: data,
            backgroundColor: [
                "rgb(255, 223, 111, 0.5)",
                "rgba(255, 99, 132, 0.5)",
            ],
            borderColor: ["rgb(255, 223, 111)", "rgb(255, 99, 132)"],
            borderWidth: 2.5,
        },
    ],
});

function StatsGenderPatient() {
    const getData = statsGenderData([23, 34]);
    return (
        <Box
            sx={{
                maxWidth: "348px",
                width: "100%",
            }}
        >
            <PolarArea data={getData} />
        </Box>
    );
}

function StatsSection() {
    const [statsDay, setStatsDay] = useState(0);
    const handleChange = (event) => {
        setStatsDay(event.target.value);
    };
    return (
        <SectionContainer
            sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                minWidth: "720px",
                m: 2,
            }}
        >
            <Typography
                component="div"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span>
                    <b>Patients Statistics for Hospital</b>
                    <br></br>
                    <Typography
                        sx={{ fontSize: "13px", color: "text.secondary" }}
                    >
                        Select from the options to see the suitable statistics
                    </Typography>
                </span>
                <FormControl variant="standard" sx={{ minWidth: "200px" }}>
                    <InputLabel id="stats-select-doughnut-and-polar-graph">
                        Show For
                    </InputLabel>
                    <Select
                        labelId="stats-select-doughnut-and-polar-graph"
                        id="stats-select-doughnut-and-polar-graph-standard"
                        value={statsDay}
                        // TODO: HANDLE ON CHANGE
                        onChange={handleChange}
                        label="Show For"
                    >
                        <MenuItem value={0}>Today</MenuItem>
                        <MenuItem value={1}>Yesterday</MenuItem>
                        <MenuItem value={2}>Last week</MenuItem>
                        <MenuItem value={3}>Last month</MenuItem>
                    </Select>
                </FormControl>
            </Typography>
            <Divider sx={{ mt: 2, mb: 1 }} />
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <StatsInOutPatient />
                <Divider orientation="vertical" />
                <StatsGenderPatient />
            </Box>
        </SectionContainer>
    );
}

const optionsForTimeAdmitted = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom",
        },
        title: {
            display: true,
            text: "",
        },
    },
};

const morningLabels = [
    "7 am",
    "8 am",
    "9 am",
    "10 am",
    "11 am",
    "12 pm",
    "1 pm",
    "2 pm",
    "3 pm",
    "4 pm",
    "5 pm",
    "6 pm",
    "7 pm",
];
const nightLabels = [
    "7 pm",
    "8 pm",
    "9 pm",
    "10 pm",
    "11 pm",
    "12 am",
    "1 am",
    "2 am",
    "3 am",
    "4 am",
    "5 am",
    "6 am",
    "7 am",
];

const getDataForLineGraph = (data = [], morning = true) => {
    return {
        labels: morning ? morningLabels : nightLabels,
        datasets: [
            {
                label: "Number of Patients",
                data,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };
};
function TimeAdmittedPatients() {
    const data = getDataForLineGraph([
        34, 56, 56, 77, 23, 56, 56, 32, 45, 37, 32, 23, 15,
    ]);
    return (
        <Box sx={{ maxWidth: "900px", width: "100%" }}>
            <Line options={optionsForTimeAdmitted} data={data} redraw={true} />
        </Box>
    );
}

function TimeLineGraph() {
    const [statsDate, setstatsDate] = useState(0);
    const [statsDay, setstatsDay] = useState(0);
    const handleChangeDate = (e) => {
        setstatsDate(e.target.value);
    };

    const handleChangeDay = (e) => {
        setstatsDay(e.target.value);
    };
    return (
        <SectionContainer
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
                position: "relative",
                m: 2,
                p: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Typography sx={{ whiteSpace: "nowrap" }}>
                    <span>
                        <b>Admitted Patients By Department</b>
                        <br></br>
                        <Typography
                            sx={{
                                fontSize: "13px",
                                color: "text.secondary",
                            }}
                        >
                            Scroll for more departments
                        </Typography>
                    </span>
                </Typography>
                <Box component="div" sx={{ display: "flex" }}>
                    <FormControl
                        variant="standard"
                        sx={{ minWidth: "200px", mr: 2 }}
                    >
                        <InputLabel id="stats-select-for-time-date-line-graph">
                            Date
                        </InputLabel>
                        <Select
                            labelId="stats-select-for-time-date-line-graph"
                            id="stats-select-for-time-date-line-graph-standard"
                            value={statsDate}
                            // TODO: HANDLE ON CHANGE
                            onChange={handleChangeDate}
                            label="Date"
                        >
                            <MenuItem value={0}>Today</MenuItem>
                            <MenuItem value={1}>Yesterday</MenuItem>
                            <MenuItem value={2}>Before Yesterday</MenuItem>
                            <MenuItem value={3} disabled>
                                Choose Date [Not Available]
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ minWidth: "200px" }}>
                        <InputLabel id="stats-select-for-time-day-line-graph">
                            Date
                        </InputLabel>
                        <Select
                            labelId="stats-select-for-time-day-line-graph"
                            id="stats-select-for-time-day-line-graph-standard"
                            value={statsDay}
                            // TODO: HANDLE ON CHANGE
                            onChange={handleChangeDay}
                            label="Date"
                        >
                            <MenuItem value={0}>Morning [7am-7pm]</MenuItem>
                            <MenuItem value={1}>Night [7pm-7am]</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <TimeAdmittedPatients />
        </SectionContainer>
    );
}
export function OverViewTab() {
    return (
        <Box component='div'
            sx={{
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                }}
            >
                <NormalSectionBox />
            </Box>
            <Box sx={{ display: "flex", width: "100%" }}>
                <DivisionStats />
                <StatsSection />
            </Box>
            <Box sx={{ display: "flex", width: "100%", minHeight: " 550px" }}>
                <TimeLineGraph />
            </Box>
        </Box>
    );
}

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
  MenuItem,
  Select,
  CircularProgress
} from "@mui/material";
import { Box } from "@mui/system";
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
  RadialLinearScale
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
  TransitEnterexit
} from "@mui/icons-material";
import {
  getAlertValues,
  SectionContainer,
  departmentOptions
} from "../../StyledComponents";
import { useCallback, useEffect, useState } from "react";
import {
  getAllDoctorData,
  getAllPatientData,
  PatientDataStatsCheckInCheckOut
} from "../../../APIs/Admin/main.api";
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
function createNormalSectionBoxData(icon, num, title, linkID = null) {
  return { icon, num, title, linkID };
}
function NormalSectionBox({ changeTabTo, doctors, patients }) {
  const sectionBoxContent = [
    createNormalSectionBoxData(
      <KingBed color="inherit" />,
      patients?.length || 0,
      "Total Patients",
      1
    ),
    createNormalSectionBoxData(
      <People color="inherit" />,
      doctors?.length || 0,
      "Total Available Staff",
      2
    ),
    createNormalSectionBoxData(
      <AccountBalanceWallet color="inherit" />,
      "$2,345",
      "Avg Treatment Cost"
    )
  ];
  return sectionBoxContent.map(({ icon, num, title, linkID }) => (
    <SectionContainer
      key={title}
      sx={{
        display: "flex",
        flexGrow: 1,
        m: 2,
        alignItems: "flex-start",
        position: "relative"
      }}>
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
          color: "primary.main"
        }}>
        {icon}
      </Box>
      <Typography component="h5">
        <b>{num}</b>
        <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
          {title}
        </Typography>
      </Typography>
      {linkID && (
        <Tip title={`Go to ${title} Section`}>
          <IconButton
            onClick={() => changeTabTo(linkID)}
            sx={{ position: "absolute", right: 2, top: 2 }}>
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
    format: (value) => value.toLocaleString("en-US")
  },
  {
    id: "number",
    label: "Number of Patients",
    minWidth: 100,
    align: "center",
    format: (value) => value.toFixed(0)
  }
];
function DivisionStats({ changeTabTo, patients }) {
  const filterThePatientData = () => {
    const departmentsDict = {};
    departmentOptions.forEach((ele) => (departmentsDict[ele] = 0));
    patients.forEach((pt) => {
      Object.keys(pt.associatedDoctors).forEach((key) => {
        const ele = pt.associatedDoctors[key];
        departmentsDict[ele.department] = departmentsDict[ele.department]++;
      });
    });

    return [
      createDivisionStatsData(
        <EscalatorWarning />,
        departmentOptions[0],
        departmentsDict[departmentOptions[0]]
      ),
      createDivisionStatsData(
        <LocalHospital />,
        departmentOptions[1],
        departmentsDict[departmentOptions[1]]
      ),
      createDivisionStatsData(
        <ContentCut />,
        departmentOptions[2],
        departmentsDict[departmentOptions[2]]
      ),
      createDivisionStatsData(
        <AcUnit />,
        departmentOptions[3],
        departmentsDict[departmentOptions[3]]
      ),
      createDivisionStatsData(
        <Favorite />,
        departmentOptions[4],
        departmentsDict[departmentOptions[4]]
      ),
      createDivisionStatsData(
        <Psychology />,
        departmentOptions[5],
        departmentsDict[departmentOptions[5]]
      ),
      createDivisionStatsData(
        <Face />,
        departmentOptions[6],
        departmentsDict[departmentOptions[6]]
      ),
      createDivisionStatsData(
        <Hearing />,
        departmentOptions[7],
        departmentsDict[departmentOptions[7]]
      ),
      createDivisionStatsData(
        <Visibility />,
        departmentOptions[8],
        departmentsDict[departmentOptions[8]]
      ),
      createDivisionStatsData(
        <CheckBoxOutlineBlank />,
        departmentOptions[9],
        departmentsDict[departmentOptions[9]]
      )
    ];
  };
  return (
    <SectionContainer
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        m: 2,
        position: "relative"
      }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                colSpan={2}
                sx={{
                  backgroundColor: "primary.sectionContainer"
                }}>
                <Typography sx={{ whiteSpace: "nowrap" }} component="div">
                  <span>
                    <b>Admitted Patients By Department</b>
                    <br></br>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "text.secondary"
                      }}>
                      Scroll for more departments
                    </Typography>
                  </span>
                </Typography>
              </TableCell>
              <TableCell
                align="right"
                colSpan={1}
                sx={{
                  backgroundColor: "primary.sectionContainer"
                }}>
                <Tip title="Go to Patients Section">
                  <IconButton
                    //TODO: add a navlink
                    onClick={() => changeTabTo(1)}>
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
                    minWidth: column.minWidth
                  }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filterThePatientData().map((row) => {
              return (
                <TableRow tabIndex={-1} key={row.department}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
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
  labels: ["Checked In", "Checked Out"],
  datasets: [
    {
      label: "# of Patients In and Out",
      data,
      backgroundColor: ["rgb(255, 223, 111, 0.5)", "rgba(255, 99, 132, 0.5)"],
      borderColor: ["rgb(255, 223, 111)", "rgb(255, 99, 132)"],
      borderWidth: 2.5
    }
  ]
});

function StatsInOutPatient({ IN, OUT }) {
  const getData = statsDataInOut([IN, OUT]);
  return (
    <Box
      sx={{
        maxWidth: "348px",
        width: "100%"
      }}>
      <Doughnut data={getData} />
    </Box>
  );
}

const statsGenderData = (data) => ({
  labels: ["Male", "Female", "Other"],
  datasets: [
    {
      label: "# of Patients By Gender",
      data: data,
      backgroundColor: [
        "rgb(255, 223, 111, 0.5)",
        "rgba(255, 99, 132, 0.5)",
        "rgba(255, 237, 0, 0.5)"
      ],
      borderColor: ["rgb(255, 223, 111)", "rgb(255, 99, 132)", "rgb(255, 237, 0)"],
      borderWidth: 2.5
    }
  ]
});

function StatsGenderPatient({ Male, Female, Other }) {
  const getData = statsGenderData([Male, Female, Other]);
  return (
    <Box
      sx={{
        maxWidth: "348px",
        width: "100%"
      }}>
      <PolarArea data={getData} />
    </Box>
  );
}

function StatsSection({ broadcastAlert }) {
  const [statsDay, setStatsDay] = useState(0);
  const [promiseStats, setPromiseStats] = useState(false);
  const [statsData, setStatsData] = useState({
    checkedIn: 0,
    checkedOut: 0,
    Male: 0,
    Female: 0,
    Other: 0
  });
  const handleChange = (event) => {
    setStatsDay(event.target.value);
  };

  const getRangeUsingStatsDay = () => {
    const now = new Date();
    switch (parseInt(statsDay)) {
      case 0:
        return [new Date(now.getTime() - 24 * 60 * 60 * 1000).getTime(), now.getTime()];
      case 1:
        return [
          new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).getTime(),
          new Date(now.getTime() - 24 * 61 * 60 * 1000).getTime()
        ];
      case 2:
        return [
          new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime(),
          now.getTime()
        ];
      case 3:
        return [
          new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime(),
          now.getTime()
        ];
      default:
        return [new Date(now.getTime() - 24 * 60 * 60 * 1000).getTime(), now.getTime()];
    }
  };
  const handleCall = useCallback(async () => {
    setPromiseStats(false);
    const range = getRangeUsingStatsDay();
    console.log(range);
    try {
      const results = await PatientDataStatsCheckInCheckOut(range[0], range[1]);
      console.log(results.data);
      if (results.data) setStatsData(results.data);
    } catch (error) {
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          "Error Loading Statistics",
          error.response?.data?.DETAILS ||
            "An unexpected error occured. Please make sure blockchain is running. Contact SuperAdmin for this."
        )
      ]);
    } finally {
      setPromiseStats(true);
    }
  }, []);

  useEffect(() => {
    handleCall();
  }, [statsDay]);

  return (
    <SectionContainer
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minWidth: "720px",
        m: 2
      }}>
      {!promiseStats ? (
        <Box
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "500px"
          }}>
          <CircularProgress sx={{ alignSelf: "center" }} />
        </Box>
      ) : (
        <>
          <Typography
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
            <span>
              <b>Patients Statistics for Hospital</b>
              <br></br>
              <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
                Select from the options to see the suitable statistics
              </Typography>
            </span>
            <FormControl variant="standard" sx={{ minWidth: "200px" }}>
              <InputLabel id="stats-select-doughnut-and-polar-graph">Show For</InputLabel>
              <Select
                labelId="stats-select-doughnut-and-polar-graph"
                id="stats-select-doughnut-and-polar-graph-standard"
                value={statsDay}
                // TODO: HANDLE ON CHANGE
                onChange={handleChange}
                label="Show For">
                <MenuItem value={0}>Today</MenuItem>
                <MenuItem value={1}>Yesterday</MenuItem>
                <MenuItem value={2}>This week</MenuItem>
                <MenuItem value={3}>This month</MenuItem>
              </Select>
            </FormControl>
          </Typography>
          <Divider sx={{ mt: 2, mb: 1 }} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center"
            }}>
            <StatsInOutPatient
              IN={statsData["checkedIn"]}
              OUT={statsData["checkedOut"]}
            />
            <Divider orientation="vertical" />
            <StatsGenderPatient
              Male={statsData["Male"]}
              Female={statsData["Female"]}
              Other={statsData["Other"]}
            />
          </Box>
        </>
      )}
    </SectionContainer>
  );
}

const optionsForTimeAdmitted = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom"
    },
    title: {
      display: true,
      text: ""
    }
  }
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
  "7 pm"
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
  "7 am"
];

const getDataForLineGraph = (data = [], morning = true) => {
  return {
    labels: morning ? morningLabels : nightLabels,
    datasets: [
      {
        label: "Number of Patients",
        data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      }
    ]
  };
};

function TimeAdmittedPatients() {
  const data = getDataForLineGraph([34, 56, 56, 77, 23, 56, 56, 32, 45, 37, 32, 23, 15]);
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
        p: 2
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        }}>
        <Typography sx={{ whiteSpace: "nowrap" }} component="div">
          <span>
            <b>Admitted Patients By Department</b>
            <br></br>
            <Typography
              sx={{
                fontSize: "13px",
                color: "text.secondary"
              }}>
              Scroll for more departments
            </Typography>
          </span>
        </Typography>
        <Box component="div" sx={{ display: "flex" }}>
          <FormControl variant="standard" sx={{ minWidth: "200px", mr: 2 }}>
            <InputLabel id="stats-select-for-time-date-line-graph">Date</InputLabel>
            <Select
              labelId="stats-select-for-time-date-line-graph"
              id="stats-select-for-time-date-line-graph-standard"
              value={statsDate}
              // TODO: HANDLE ON CHANGE
              onChange={handleChangeDate}
              label="Date">
              <MenuItem value={0}>Today</MenuItem>
              <MenuItem value={1}>Yesterday</MenuItem>
              <MenuItem value={2}>Before Yesterday</MenuItem>
              <MenuItem value={3} disabled>
                Choose Date [Not Available]
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ minWidth: "200px" }}>
            <InputLabel id="stats-select-for-time-day-line-graph">Date</InputLabel>
            <Select
              labelId="stats-select-for-time-day-line-graph"
              id="stats-select-for-time-day-line-graph-standard"
              value={statsDay}
              // TODO: HANDLE ON CHANGE
              onChange={handleChangeDay}
              label="Date">
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
export function OverViewTab({ changeTabTo, broadcastAlert }) {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [promiseToRetriveData, setPromiseToRetriveData] = useState(false);

  const loadAllPatientsForThisOrg = useCallback(async () => {
    try {
      setPatients((await getAllPatientData()).data || []);
      setDoctors((await getAllDoctorData()).data || []);
    } catch (error) {
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "error",
          error.response?.data?.MESSAGE || "Error Loading the data",
          error.response?.data?.DETAILS ||
            "An unexpected error occured. Please make sure blockchain is running. Contact SuperAdmin for this."
        )
      ]);
    } finally {
      setPromiseToRetriveData(true);
    }
  }, []);

  useEffect(() => {
    if (!promiseToRetriveData) loadAllPatientsForThisOrg();
  }, [loadAllPatientsForThisOrg, promiseToRetriveData]);

  return (
    <>
      {!promiseToRetriveData ? (
        <Box
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "500px"
          }}>
          <CircularProgress sx={{ alignSelf: "center" }} />
        </Box>
      ) : (
        <Box component="div" sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            <NormalSectionBox
              changeTabTo={changeTabTo}
              doctors={doctors}
              patients={patients}
            />
          </Box>
          <Box sx={{ display: "flex", width: "100%" }}>
            <DivisionStats changeTabTo={changeTabTo} patients={patients} />
            {/* TODO STATS SECTION */}
            <StatsSection broadcastAlert={broadcastAlert} />
          </Box>
          <Box sx={{ display: "flex", width: "100%", minHeight: " 550px" }}>
            {/* TODO TIME LINE GRAPH */}
            <TimeLineGraph />
          </Box>
        </Box>
      )}
    </>
  );
}

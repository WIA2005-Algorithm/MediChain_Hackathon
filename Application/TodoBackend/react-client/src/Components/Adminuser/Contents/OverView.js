import {
    AppBar,
    Divider,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import {
    AccountBalanceWallet,
    Home,
    KingBed,
    Link,
    People,
} from "@mui/icons-material";
import { SectionContainer } from "../../StyledComponents";

const sectionBoxContent = [
    {
        icon: <KingBed color="inherit" />,
        num: "234",
        title: "Total Patients",
        link: "/",
    },
    {
        icon: <People color="inherit" />,
        num: "34",
        title: "Total Available Staff",
        link: "/",
    },
    {
        icon: <AccountBalanceWallet color="inherit" />,
        num: "$2,345",
        title: "Avg Treatment Cost",
        link: null,
    },
];
function NormalSectionBox({ icon, num, title, linkDirect }) {
    const nav = useNavigate();
    return (
        <SectionContainer
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
            {linkDirect && (
                <Tooltip title={`Go to ${title} Section`}>
                    <IconButton
                        onClick={() => nav(linkDirect)}
                        sx={{ position: "absolute", right: 2, top: 2 }}
                    >
                        <Link />
                    </IconButton>
                </Tooltip>
            )}
        </SectionContainer>
    );
}

function DivisionStats() {
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
            <div style={{ postion: "absolute", top: 0, width: "100%" }}>
                <Typography>
                    <b>Patients By Division</b>
                </Typography>
                <Divider sx={{ mt: 1, mb: 2 }} />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "13px",
                        width: "100%",
                    }}
                >
                    <Home sx={{ flexGrow: 1 }} />
                    <Typography sx={{ flexGrow: 1 }}>Division</Typography>
                    <Typography sx={{ flexGrow: 1 }}>
                        No. of Patients
                    </Typography>
                </Box>
                <Tooltip title="Go to Patients Section">
                    <IconButton
                        //TODO: add a navlink
                        onClick={() => nav("/")}
                        sx={{ position: "absolute", right: 2, top: 2 }}
                    >
                        <Link />
                    </IconButton>
                </Tooltip>
            </div>
            <Toolbar />
        </SectionContainer>
    );
}
export function OverViewTab() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                }}
            >
                {sectionBoxContent.map((item) => (
                    <NormalSectionBox
                        icon={item.icon}
                        num={item.num}
                        title={item.title}
                        linkDirect={item.link}
                    />
                ))}
            </Box>
            <Box sx={{ display: "flex", width: "100%" }}>
                <DivisionStats />
            </Box>
        </Box>
    );
}

import {
    Avatar,
    CircularProgress,
    IconButton,
    Typography,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import {
    getAllNetworks,
    getNetworkCount,
} from "../../APIs/Superuser/network.api";
import CreateNetwork from "./CreateNetworkForm";
import nothing from "../../static/images/nothing.png";
import { Box } from "@mui/system";
import { ExpandCircleDown } from "@mui/icons-material";
import { NetStatus, SectionContainer } from "../StyledComponents";
import NetworkImage from "../../static/images/NetworkImg.svg";
import { Link, Route, Routes } from "react-router-dom";
import OrganizationTables from "./organizationTable";

function NothingYet(props) {
    return (
        <div
            style={{
                width: "100%",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <CreateNetwork
                openForm={props.openForm}
                setOpenForm={props.setOpenForm}
                fetch={props.fetch}
            />
            <Avatar
                alt="no networks added"
                src={nothing}
                sx={{ width: "150px", height: "150px", mt: 1.8 }}
            />
            <Typography component="span" variant="h6" sx={{ mt: 1.2 }}>
                <b>No Fabric Networks Available yet</b>
            </Typography>
            <Typography component="small" sx={{ color: "text.secondary" }}>
                Try creating a new fabric network using the form above
            </Typography>
        </div>
    );
}

function NetworkAvailable() {
    const [promise, setPromise] = useState(false);
    const [response, setResponse] = useState(undefined);
    const [pending, setpending] = useState(undefined);
    let fetchNetworkDetails = useCallback(async () => {
        let res = await getAllNetworks();
        let date = new Date(res.data.createdAt);
        console.log(res);
        setResponse({
            ...res.data,
            createdAt: `${date.toLocaleString("default", {
                month: "long",
            })} ${date.getDate()}, ${date.getFullYear()}`,
        });
        setpending(res.data.Status);
        setPromise(() => true);
    }, []);
    useEffect(() => {
        fetchNetworkDetails();
    }, [fetchNetworkDetails]);
    if (!promise) return null;
    return (
        <SectionContainer
            sx={{
                width: "fit-content",
                display: "flex",
                justifyContent: "stretch",
                alignItems: "center",
                padding: "16px 24px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar
                    alt="network"
                    src={NetworkImage}
                    sx={{ width: "80px", height: "80px" }}
                />
                <NetStatus
                    status={pending}
                    setStatus={setpending}
                    circlesx={{ mt: 2, width: "25px", height: "25px" }}
                    sx={{
                        color: "primary.main",
                        mt: 1,
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                />
            </div>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    ml: 5,
                    mr: 5,
                }}
            >
                <Typography
                    component="small"
                    sx={{ color: "text.secondary", mt: 1, fontSize: "13px" }}
                >
                    Network Name
                </Typography>
                <Typography
                    component="small"
                    sx={{ color: "text.main", fontWeight: "bold" }}
                >
                    {response.Name}
                </Typography>
                <Typography
                    component="small"
                    sx={{ color: "text.secondary", mt: 1, fontSize: "13px" }}
                >
                    Network ID
                </Typography>
                <Typography
                    component="small"
                    sx={{ color: "text.main", fontWeight: "bold" }}
                >
                    {response.NetID}
                </Typography>
                <Typography
                    component="small"
                    sx={{ color: "text.secondary", mt: 1, fontSize: "13px" }}
                >
                    Network Address
                </Typography>
                <Typography
                    component="small"
                    sx={{ color: "text.main", fontWeight: "bold" }}
                >
                    {response.Address}
                </Typography>
                <Typography
                    component="small"
                    sx={{ color: "text.secondary", mt: 1, fontSize: "13px" }}
                >
                    Created At
                </Typography>
                <Typography
                    component="small"
                    sx={{ color: "text.main", fontWeight: "bold" }}
                >
                    {response.createdAt}
                </Typography>
                <Typography
                    component="small"
                    sx={{ color: "text.secondary", mt: 1, fontSize: "13px" }}
                >
                    Hospitals Enrolled
                </Typography>
                <Typography
                    component="small"
                    sx={{ color: "text.main", fontWeight: "bold" }}
                >
                    Count: {response.Organizations.length}
                </Typography>
            </Box>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Link to={`${response.Name}`}>
                    <IconButton size="large" sx={{ color: "text.primary" }}>
                        <ExpandCircleDown
                            sx={{ transform: "rotate(-90deg)" }}
                        />
                    </IconButton>
                </Link>
            </div>
        </SectionContainer>
    );
}

function Load(props) {
    const [promise, setPromise] = useState(false);
    const [response, setResponse] = useState(undefined);
    let fetchNetworkCount = useCallback(async () => {
        const res = await getNetworkCount();
        setResponse(res.data);
        setPromise(true);
    }, []);
    useEffect(() => {
        fetchNetworkCount();
    }, [fetchNetworkCount]);
    if (!promise) return <CircularProgress sx={{ alignSelf: "center" }} />;
    else {
        if (response.count === 0)
            return (
                <NothingYet
                    openForm={props.openForm}
                    setOpenForm={props.setOpenForm}
                    fetch={fetchNetworkCount}
                />
            );
        return <NetworkAvailable />;
    }
}

export default function NetworkPage(props) {
    const [enableForm, setEnableForm] = useState(true);
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Routes>
                <Route
                    path="/:networkName/*"
                    element={
                        <OrganizationTables
                            nav={props.nav}
                            setNav={props.setNav}
                            notis={props.notis}
                        />
                    }
                ></Route>
                <Route
                    path="/"
                    element={
                        <Load
                            openForm={enableForm}
                            setOpenForm={setEnableForm}
                        />
                    }
                />
            </Routes>
        </Box>
    );
}

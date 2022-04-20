import {
    Badge,
    CircularProgress,
    IconButton,
    Slide,
    Tooltip,
    Typography,
} from "@mui/material";
import { v4 as ID } from "uuid";
import { Box, styled } from "@mui/system";
import logo from "../static/images/Logo.png";
import { useState, useCallback, useEffect, forwardRef } from "react";
import { getNetworkStatus } from "../APIs/Superuser/network.api.js";
import {
    CheckCircle,
    Close,
    DoubleArrow,
    Error,
    Info,
    Subtitles,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const SectionContainer = styled("div")(({ theme }) => ({
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary.sectionContainer,
    padding: theme.spacing(2, 2),
    fontSize: theme.typography.fontSize,
    borderRadius: 8,
    boxShadow: theme.palette.shape.boxShadow,
    // border: `1px solid ${theme.palette.primary.sectionBorder}`
}));

export const Logo = () => (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div className="logo_back">
            <img alt="Medichain" width="40px" src={logo} />
        </div>
    </div>
);

export const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        backgroundColor: "#FF0000",
        color: "#FF0000",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
}));

export const AppIconHead = ({ homeLink, role }) => {
    const nav = useNavigate();
    return (
        <>
            <Tooltip title="Home">
                <IconButton
                    onClick={() => nav(homeLink)}
                    size="small"
                    edge="start"
                    color="inherit"
                    sx={{ mr: 0.5 }}
                >
                    <Logo />
                </IconButton>
            </Tooltip>
            <Typography variant="h5" noWrap component="div" fontWeight="bold">
                Medi
                <Typography
                    component="span"
                    variant="h5"
                    color="primary"
                    fontWeight="bold"
                >
                    chain
                </Typography>
            </Typography>
            <DoubleArrow
                sx={{ color: "text.secondary", ml: 1 }}
                fontSize="inherit"
            />
            <Typography component="small" fontWeight="bold" sx={{ ml: 1 }}>
                {role}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
        </>
    );
};

export function Status({ state, notis }) {
    let checkStatus = useCallback(async () => {
        let res = await getNetworkStatus();
        const code = res.data.code;
        if (code !== 300) {
            notis((prev) => [
                ...prev,
                getAlertValues(
                    code === 200 ? "success" : code === 0 ? "info" : "error",
                    "Network Status From Server",
                    `${res.data.message} the network`,
                    code === 200 ? false : undefined
                ),
            ]);
        }
        state(res.data);
    }, []);

    useEffect(() => {
        const intervalID = setInterval(() => {
            checkStatus();
        }, 5000);
        return () => clearInterval(intervalID);
    }, [checkStatus]);
    return null;
}

export function NetStatus(props) {
    const { status, setStatus } = props;
    return (
        <Typography component="div" sx={props.sx}>
            {status.code === 300 && (
                <Status state={setStatus} notis={props.notis} />
            )}
            {status.message === "Pending" && (
                <CircularProgress sx={props.circlesx} />
            )}
            <div>{status.message}</div>
        </Typography>
    );
}

export const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function SetIcon({ type, sx }) {
    switch (type) {
        case "success":
            return <CheckCircle sx={sx} />;
        case "error":
            return <Error sx={sx} />;
        case "info":
            return <Info sx={sx} />;
        default:
            return null;
    }
}

function Notification({ item, Onremove, autoRemove = true }) {
    const [classClose, setclassClose] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };
    const manualClose = () => {
        setclassClose(1);
        setTimeout(() => Onremove(item.id), 900);
    };
    useEffect(() => {
        let x = setTimeout(() => manualClose(), 5000);
        if (autoRemove === false || classClose === 1) clearTimeout(x);
        return () => clearTimeout(x);
    }, [classClose]);

    return (
        <Box
            className={classClose === 0 ? "addAlert" : "removeAlert"}
            onMouseEnter={autoRemove === false ? handleMouseOver : undefined}
            onMouseLeave={autoRemove === false ? handleMouseOut : undefined}
            sx={{
                boxShadow: "rgb(0 0 0 / 27%) 0px 2px 3px 2px",
                borderRadius: "60px 0 0 60px",
                borderBottom: "2px solid",
                borderBottomColor: `${item.type}.main`,
                display: "flex",
                alignItems: "center",
                mt: 2,
                mb: 1,
                width: "400px",
                transform: `translate3d(${
                    classClose === 0 ? 1000 : 0
                }px, 0, 0)`,
                backgroundColor: "primary.sectionContainer",
                float: "right",
            }}
        >
            <Box
                sx={{
                    minHeight: "60px",
                    minWidth: "60px",
                    borderRadius: "60px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: `${item.type}.secondary`,
                    m: 0.5,
                }}
            >
                {isHovering && (
                    <IconButton onClick={manualClose}>
                        <Close
                            sx={{
                                color: `${item.type}.main`,
                                width: "40px",
                                height: "40px",
                            }}
                        />
                    </IconButton>
                )}
                {!isHovering && (
                    <SetIcon
                        type={item.type}
                        sx={{
                            color: `${item.type}.main`,
                            width: "40px",
                            height: "40px",
                        }}
                        autoRemove={autoRemove}
                    />
                )}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "start",
                    m: 1,
                }}
            >
                <Typography
                    sx={{ color: `${item.type}.main`, fontSize: "13.5px" }}
                >
                    <b>{item.mTitle}</b>
                </Typography>
                <Typography sx={{ color: "text.primary", fontSize: "12.5px" }}>
                    {item.mSubComp}
                </Typography>
            </Box>
        </Box>
    );
}

export function AddNewNotification({ notis, Onremove }) {
    return (
        <Box
            sx={{
                position: "absolute",
                right: 0,
                top: 0,
                paddingLeft: "32px",
                width: "fit-content",
                height: "fit-content",
                maxHeight: "100%",
                overflow: "hidden",
                zIndex: "1001",
                display: "flex",
                alignItems: "flex-end",
                flexDirection: "column",
            }}
        >
            {notis.map((el) => {
                return (
                    <Notification
                        key={el.id}
                        item={el}
                        Onremove={Onremove}
                        autoRemove={el.autoRemove}
                    />
                );
            })}
        </Box>
    );
}

export function getAlertValues(
    alertType,
    title,
    subtitle,
    mautoRemove = undefined
) {
    return {
        id: ID(),
        type: alertType,
        mTitle: title,
        mSubComp: subtitle,
        autoRemove:
            mautoRemove !== undefined
                ? mautoRemove
                : alertType === "error"
                ? false
                : true,
    };
}

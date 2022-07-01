import {
  Avatar,
  Badge,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Slide,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import { v4 as ID } from "uuid";
import { Box, styled } from "@mui/system";
import logo from "../static/images/Logo.png";
import { useState, useCallback, useEffect, forwardRef } from "react";
import { getNetworkStatus } from "../APIs/Superuser/network.api.js";
import {
  Add,
  Check,
  CheckCircle,
  Clear,
  ClearAll,
  Close,
  DoubleArrow,
  Error,
  Info,
  PlaylistAddCheckCircle,
  RadioButtonChecked,
  RemoveCircle,
  Replay,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import no_patient from "../static/images/no_patient.jpg";
import {
  getNotificationData,
  getRequestData,
  markNotificationRead
} from "../APIs/Utilities/api";

export const SectionContainer = styled("div")(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.primary.sectionContainer,
  padding: theme.spacing(2, 2),
  fontSize: theme.typography.fontSize,
  borderRadius: 8,
  boxShadow: theme.palette.shape.boxShadow
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
      content: '""'
    }
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0
    }
  }
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
          sx={{ mr: 0.5 }}>
          <Logo />
        </IconButton>
      </Tooltip>
      <Typography variant="h5" noWrap component="div" fontWeight="bold">
        Medi
        <Typography component="span" variant="h5" color="primary" fontWeight="bold">
          chain
        </Typography>
      </Typography>
      <DoubleArrow sx={{ color: "text.secondary", ml: 1 }} fontSize="inherit" />
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
        )
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
      {status.code === 300 && <Status state={setStatus} notis={props.notis} />}
      {status.message === "Pending" && <CircularProgress sx={props.circlesx} />}
      <div>{status.message}</div>
    </Typography>
  );
}

export const GetVisibility = ({ visible }) =>
  visible ? <Visibility /> : <VisibilityOff />;
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
        transform: `translate3d(${classClose === 0 ? 1000 : 0}px, 0, 0)`,
        backgroundColor: "primary.sectionContainer",
        float: "right"
      }}>
      <Box
        sx={{
          minHeight: "60px",
          minWidth: "60px",
          borderRadius: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: `${item.type}.secondary`,
          m: 0.5
        }}>
        {isHovering && (
          <IconButton onClick={manualClose}>
            <Close
              sx={{
                color: `${item.type}.main`,
                width: "40px",
                height: "40px"
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
              height: "40px"
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
          m: 1
        }}>
        <Typography sx={{ color: `${item.type}.main`, fontSize: "13.5px" }}>
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
        position: "fixed",
        right: 0,
        top: "70px",
        paddingLeft: "32px",
        width: "fit-content",
        height: "fit-content",
        maxHeight: "100%",
        overflow: "hidden",
        zIndex: (theme) => theme.zIndex.snackbar,
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "column"
      }}>
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

export function getAlertValues(alertType, title, subtitle, mautoRemove = undefined) {
  return {
    id: ID(),
    type: alertType,
    mTitle: title,
    mSubComp: subtitle,
    autoRemove:
      mautoRemove !== undefined ? mautoRemove : alertType === "error" ? false : true
  };
}

export const departmentOptions = [
  "General",
  "Medicine",
  "Surgery",
  "Neurology",
  "Cardiology",
  "Psychology",
  "Dermotology",
  "ENT",
  "Ophthalmology",
  "Other"
];

export const getIcon = (icon, type = "superuser") => {
  switch (icon.trim()) {
    case "add":
      return ["primary", <Add />];
    case "removecircle":
      return ["primary", <RemoveCircle />];
    case "clear":
      if (type === "superuser") return ["primary", <Clear />];
      else return ["primary", <ClearAll />];
    case "success":
      return ["success", <Check />];
    case "info":
      return ["info", <Info />];
    case "error":
      return ["error", <Error />];
    default:
      return [null, null];
  }
};

export const ButtonMailto = ({ mailto, label }) => {
  return (
    <Link
      to="#"
      sx={{ cursor: "pointer" }}
      onClick={(e) => {
        window.location.href = `mailto:${mailto}`;
        e.preventDefault();
      }}>
      {label}
    </Link>
  );
};

export const getFormattedDate = (d) => {
  const date = new Date(d);
  return `${date.toLocaleString("default", {
    month: "long"
  })} ${date.getDate()}, ${date.getFullYear()}`;
};

export const getTime = (d) => {
  return new Date(d).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

export const getDoctorDeparmentString = (item, doctors) => {
  let departmentStr = "";
  const array = Object.keys(item.associatedDoctors);
  array.forEach((itm, i) => {
    const doc = item.associatedDoctors[itm];
    if (array.length > 1 && i === doctors - 1) departmentStr += " and ";
    departmentStr += doc.department + (i === doctors - 1 ? "" : ", ");
  });
  return departmentStr;
};

export const getAgeString = (item) => {
  let string = "";
  var ageDifMs = Date.now() - new Date(item.details.DOB).getTime();
  var ageDate = new Date(ageDifMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  string += age > 18 ? "Adult " : "Young ";
  if (item.details.gender !== "Male" && item.details.gender !== "Female")
    string += `[Gender ${item.details.gender}]`;
  else string += item.details.gender;
  string += ` - ${age} years old`;
  return string;
};

/// Boolean(dialog) --> is to check if dialog is open
const AlertNotification = ({ item, setRefresh, onClickProps, handleClose }) => {
  let From = item.From.split("#");
  if (From[0] === "null") From = null;
  const [progress, setProgress] = useState(false);
  const { setDialogData } = onClickProps;
  const handleClick = async (e) => {
    e.stopPropagation();
    if (item.Read) return;
    setProgress(true);
    try {
      await markNotificationRead(item._id);
      setRefresh(true);
    } catch (err) {
      console.log(err.message);
      setProgress(false);
    }
  };

  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.NotificationAccept === "null" || item.NotificationDeny === "null") return;
    setDialogData(item);
    handleClose();
  };
  return (
    <div>
      <MenuItem onClick={handleOnClick} style={{ whiteSpace: "normal", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%"
          }}
          component="div">
          <Box component="div" sx={{ display: "flex", alignItems: "flex-start" }}>
            {!item.Read && <RadioButtonChecked fontSize="small" sx={{ mr: 1 }} />}
            {item.Read && <CheckCircle fontSize="small" sx={{ mr: 1 }} />}
            <Typography component="div" sx={{ fontSize: "14px" }}>
              {item.Read ? item.NotificationString : <b>{item.NotificationString}</b>}{" "}
              {item.NotificationAccept !== "null" && item.NotificationDeny !== "null" ? (
                <Box
                  sx={{ color: "primary.main", display: "inline-block" }}
                  component="div">
                  <b>
                    <u>Click to Open More</u>
                  </b>
                </Box>
              ) : (
                ""
              )}
              <Typography sx={{ color: "text.secondary", fontSize: "13px", mt: 0.5 }}>
                From: {From ? `${From[0]}, ${From[1]}` : "Web System"}
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "13px", pt: 0 }}>
                {`${getFormattedDate(item.createdAt)} at ${getTime(item.createdAt)}`}
              </Typography>
            </Typography>
          </Box>
          {!progress ? (
            <Tooltip title="Mark as read">
              <IconButton onClick={handleClick}>
                <PlaylistAddCheckCircle fontSize="large" />
              </IconButton>
            </Tooltip>
          ) : (
            <CircularProgress />
          )}
        </Box>
      </MenuItem>
      <Divider />
    </div>
  );
};

export function AlertNotifications({ anchorEl, handleClose, onClickProps }) {
  const [process, setProcess] = useState(true);
  const [data, setData] = useState([]);

  const getData = useCallback(async () => {
    setProcess(true);
    try {
      const r = await getNotificationData();
      setData(() => r.data);
    } catch (err) {
      console.log(err);
    } finally {
      setProcess(false);
    }
  }, []);

  useEffect(() => {
    if (process) getData();
  }, [getData, process]);

  return (
    <Menu
      anchorEl={anchorEl}
      id="notification-menu"
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
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
      sx={{
        "& .MuiList-root": {
          pt: "0px !important",
          minWidth: "500px !important",
          maxWidth: "500px !important",
          maxHeight: "calc(100vh - 370px)",
          overflowY: "auto",
          overflowX: "hidden"
        },
        "& .MuiSvgIcon-root": {
          color: "primary.main"
        }
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
      <Box
        component={"div"}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: "100%",
          bgcolor: "primary.sectionContainer",
          color: "text.primary",
          display: "flex",
          p: 2,
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed"
        }}>
        <Typography sx={{ fontSize: "18px" }} component="div">
          <b>Notifications</b>
          <Typography
            sx={{ color: "text.secondary", mt: 0.5 }}
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <RadioButtonChecked fontSize="small" sx={{ mr: 1 }} />
            <small>Un-Read Messages</small>
          </Typography>
          <Typography
            sx={{ color: "text.secondary", mt: 0.5 }}
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <CheckCircle fontSize="small" sx={{ mr: 1 }} />
            <small>Messages Read</small>
          </Typography>
        </Typography>
        {process ? (
          <CircularProgress size={"32px"} />
        ) : (
          <Tooltip title="Reload Notifications">
            <IconButton
              onClick={() => setProcess(true)}
              sx={{ border: "2px solid", borderColor: "primary.main" }}>
              <Replay />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Toolbar sx={{ mb: 6 }} />
      <Divider sx={{ mt: "0px !important" }} />
      {process ? (
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            minWidth: "500px",
            mt: 1,
            mb: 1
          }}>
          <CircularProgress size={"30px"} />
        </Container>
      ) : data.length !== 0 ? (
        data.map((item) => (
          <AlertNotification
            key={item._id}
            item={item}
            setRefresh={setProcess}
            onClickProps={onClickProps}
            handleClose={handleClose}
          />
        ))
      ) : (
        <MenuItem>
          <Box
            component="div"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
              mb: 2,
              minHeight: "300px"
            }}>
            <Avatar
              alt="No Results"
              src={no_patient}
              sx={{ width: "150px", height: "150px", mt: 1.8, alignSelf: "center" }}
            />
            <Typography
              component="div"
              variant="h6"
              sx={{ mt: 1.2, textAlign: "center" }}>
              <b>No New Notifications Found</b>
              <Typography className="secondary">
                Try refreshing or Comeback Later
              </Typography>
            </Typography>
          </Box>
        </MenuItem>
      )}
    </Menu>
  );
}

const RequestNotification = ({ item }) => {
  const nav = useNavigate();
  const handleRequestClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.Status === "Accepted") nav("/doctor/external_patients", { state: item });
  };
  const dataExists = item.Data !== "null";
  return (
    <div>
      <MenuItem
        onClick={handleRequestClick}
        style={{ whiteSpace: "normal", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%"
          }}
          component="div">
          <Box component="div" sx={{ display: "flex", alignItems: "flex-start" }}>
            <>
              {item.Status === "Active" && (
                <RadioButtonChecked fontSize="small" sx={{ mr: 1 }} />
              )}
              {item.Status !== "Active" && (
                <CheckCircle fontSize="small" sx={{ mr: 1 }} />
              )}
              <Typography component="div" sx={{ fontSize: "14px" }}>
                {item.Status === "Active" ? (
                  <b>{item.CommentToAccessOrDeny}</b>
                ) : (
                  item.CommentToAccessOrDeny
                )}{" "}
                {item.Status === "Accepted" ? (
                  <Box
                    sx={{ color: "primary.main", display: "inline-block" }}
                    component="div">
                    <b>
                      <u>Click to Open More</u>
                    </b>
                  </Box>
                ) : (
                  ""
                )}
                {item.Status !== "Active" && (
                  <Typography sx={{ color: "text.secondary", fontSize: "13px", mt: 0.5 }}>
                    {item.Status === "Accepted" ? "Acceptance" : "Denial"} Note :{" "}
                    {item.Note}
                  </Typography>
                )}
                <Typography sx={{ color: "text.secondary", fontSize: "13px", mt: 0.5 }}>
                  From: Web System
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "13px", pt: 0 }}>
                  {`${getFormattedDate(item.createdAt)} at ${getTime(item.createdAt)}`}
                </Typography>
              </Typography>
            </>
          </Box>
        </Box>
      </MenuItem>
      <Divider />
    </div>
  );
};
export function RequestNotifications({ anchorEl, handleClose }) {
  const [process, setProcess] = useState(true);
  const [data, setData] = useState([]);
  const getData = useCallback(async () => {
    setProcess(true);
    try {
      const r = await getRequestData();
      setData(() => r.data);
    } catch (err) {
      console.log(err);
    } finally {
      setProcess(false);
    }
  }, []);

  useEffect(() => {
    if (process) getData();
  }, [getData, process]);

  return (
    <Menu
      anchorEl={anchorEl}
      id="notification-menu"
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
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
      sx={{
        "& .MuiList-root": {
          pt: "0px !important",
          minWidth: "500px !important",
          maxWidth: "500px !important",
          maxHeight: "calc(100vh - 370px)",
          overflowY: "auto",
          overflowX: "hidden"
        },
        "& .MuiSvgIcon-root": {
          color: "primary.main"
        }
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
      <Box
        component={"div"}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: "100%",
          bgcolor: "primary.sectionContainer",
          color: "text.primary",
          display: "flex",
          p: 2,
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed"
        }}>
        <Typography sx={{ fontSize: "18px" }} component="div">
          <b>Access Requests</b>
          <Typography
            sx={{ color: "text.secondary", mt: 0.5 }}
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <RadioButtonChecked fontSize="small" sx={{ mr: 1 }} />
            <small>Active Requests</small>
          </Typography>
          <Typography
            sx={{ color: "text.secondary", mt: 0.5 }}
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <CheckCircle fontSize="small" sx={{ mr: 1 }} />
            <small>In-Active Requests</small>
          </Typography>
        </Typography>
        {process ? (
          <CircularProgress size={"32px"} />
        ) : (
          <Tooltip title={"Reload Requests"}>
            <IconButton
              onClick={() => setProcess(true)}
              sx={{ border: "2px solid", borderColor: "primary.main" }}>
              <Replay />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Toolbar sx={{ mb: 6 }} />
      <Divider sx={{ mt: "0px !important" }} />
      {process ? (
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            minWidth: "500px",
            mt: 1,
            mb: 1
          }}>
          <CircularProgress size={"30px"} />
        </Container>
      ) : data.length !== 0 ? (
        data.map((item) => <RequestNotification key={item._id} item={item} />)
      ) : (
        <MenuItem>
          <Box
            component="div"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
              mb: 2,
              minHeight: "300px"
            }}>
            <Avatar
              alt="No Results"
              src={no_patient}
              sx={{ width: "150px", height: "150px", mt: 1.8, alignSelf: "center" }}
            />
            <Typography
              component="div"
              variant="h6"
              sx={{ mt: 1.2, textAlign: "center" }}>
              <b>{"No New Requests Found"}</b>
              <Typography className="secondary">
                Try refreshing or Comeback Later
              </Typography>
            </Typography>
          </Box>
        </MenuItem>
      )}
    </Menu>
  );
}

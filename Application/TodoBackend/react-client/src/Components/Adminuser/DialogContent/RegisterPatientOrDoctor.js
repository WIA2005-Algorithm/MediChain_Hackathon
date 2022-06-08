import { useState, useRef, useCallback, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import {
  departmentOptions,
  getAlertValues,
  GetVisibility,
  Transition
} from "../../StyledComponents";
import {
  Alert,
  Autocomplete,
  Collapse,
  Container,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  ListItemButton,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from "@mui/material";
import { Box } from "@mui/system";
import {
  ExpandCircleDown,
  Grid3x3,
  AlternateEmail,
  Visibility,
  VisibilityOff,
  AssistantPhoto,
  LocationCity,
  FmdGood,
  Signpost,
  Phone,
  PermPhoneMsg,
  AddCircle,
  ContactPhone,
  RemoveCircle,
  Lock
} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import CountryCity from "countrycitystatejson";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import frLocale from "date-fns/locale/en-IN";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  addNewPatientOrDoctorAPI,
  getHospitalsEnrolled
} from "../../../APIs/Admin/main.api";

function AddressDetails({ address, setTheField, setRequiredError }) {
  const setField = (id, value) => setTheField(id, value, "address");
  const onCountryChange = (_, values) => {
    if (values === null) {
      setField("country", null);
      return;
    }
    setField("country", `${values.name} (${values.shortName})`);
  };
  return (
    <Box sx={{ padding: "8px 16px" }}>
      <TextField
        margin="normal"
        required
        fullWidth
        name="street1"
        label="Location Address 1"
        placeholder="Street 1, Col 1"
        type="text"
        id="street1"
        autoComplete="address-line1"
        helperText="Please enter the street line address 1 for the record"
        onChange={(e) => setField("street1", String(e.target.value).trim())}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FmdGood sx={{ color: "text.primary" }} />
            </InputAdornment>
          )
        }}
      />
      <TextField
        margin="normal"
        fullWidth
        name="street2"
        label="Location Address 2"
        placeholder="Street 2"
        type="text"
        id="street2"
        onChange={(e) => setField("street2", String(e.target.value).trim())}
        autoComplete="address-line2"
        helperText="Please enter the street line address 2 for the record"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FmdGood sx={{ color: "text.primary" }} />
            </InputAdornment>
          )
        }}
      />
      <Box component="div" sx={{ display: "flex", alignItems: "flex-start", mt: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="postcode"
          label="Postal Code"
          placeholder="11100"
          type="number"
          onChange={(e) => setField("postcode", String(e.target.value).trim())}
          id="postcode"
          autoComplete="postal-code"
          helperText="A valid postal code is atleast 4-6 digits"
          sx={{ mr: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Signpost sx={{ color: "text.primary" }} />
              </InputAdornment>
            )
          }}
        />
        <Autocomplete
          fullWidth
          options={CountryCity.getCountries()}
          autoHighlight
          sx={{ mr: 1, mt: 2, mb: 1 }}
          getOptionLabel={(option) => option.name}
          onChange={onCountryChange}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          renderOption={(props, option) => (
            <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
              <img
                loading="lazy"
                width="20"
                src={`https://flagcdn.com/w20/${option.shortName.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w40/${option.shortName.toLowerCase()}.png 2x`}
                alt=""
              />
              {option.name} ({option.shortName})
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a country"
              helperText="Please select a country from the list"
              required
              name="country"
              id="country"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <AssistantPhoto sx={{ color: "text.primary" }} />
                  </InputAdornment>
                )
              }}
            />
          )}
        />
      </Box>
      <Box component="div" sx={{ display: "flex", alignItems: "flex-start", mt: 2 }}>
        <Autocomplete
          key={address.country}
          fullWidth
          sx={{ mr: 1, mt: 2, mb: 1 }}
          disabled={address.country ? false : true}
          options={
            address.country
              ? CountryCity.getStatesByShort(address.country.split("(")[1].slice(0, -1))
              : []
          }
          autoHighlight
          getOptionLabel={(option) => option}
          onChange={(_, val) => setField("state", val)}
          renderOption={(props, option) => (
            <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
              {option}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a State/Province"
              helperText="Please select a valid state/province from the list after you have selected your country"
              required
              name="state"
              id="state"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationCity sx={{ color: "text.primary" }} />
                  </InputAdornment>
                )
              }}
            />
          )}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="city"
          label="City"
          placeholder="Kuala Lumpur"
          type="text"
          id="city"
          error={setRequiredError.city}
          onChange={(e) => setField("city", String(e.target.value).trim())}
          autoComplete="off"
          helperText="A valid location (City) contains only alphabets and spaces"
          sx={{ mr: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FmdGood sx={{ color: "text.primary" }} />
              </InputAdornment>
            )
          }}
        />
      </Box>
    </Box>
  );
}

function PersonalDetails({
  personalDetails,
  setTheField,
  setRequiredError,
  extraField = false
}) {
  const setField = (id, value) => setTheField(id, value, "personalDetails");
  return (
    <Box sx={{ padding: "8px 16px" }}>
      <Box
        component="div"
        sx={{
          display: "flex",
          alignItems: "flex-start"
        }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="firstName"
          label="First Name"
          placeholder="Nicole"
          type="text"
          id="firstName"
          error={setRequiredError.firstName}
          autoComplete="given-name"
          helperText="A valid first name contains atleast 3 characters with only alphabets"
          sx={{ mr: 1 }}
          onChange={(e) => setField("firstName", String(e.target.value).trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  sx={{
                    color: "text.primary",
                    fontSize: "18px"
                  }}>
                  <b>F</b>
                </Typography>
              </InputAdornment>
            )
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          name="middleName"
          label="Middle Name"
          placeholder="Wang"
          type="text"
          id="middleName"
          autoComplete="additional-name"
          helperText="A valid middle name contains atleast 0-3 characters with only alphabets. This field is not required"
          sx={{ mr: 1 }}
          error={setRequiredError.middleName}
          onChange={(e) => setField("middleName", String(e.target.value).trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  sx={{
                    color: "text.primary",
                    fontSize: "18px"
                  }}>
                  <b>M</b>
                </Typography>
              </InputAdornment>
            )
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="lastName"
          label="Family/Last Name"
          placeholder="Sew"
          type="text"
          id="lastName"
          error={setRequiredError.lastName}
          autoComplete="family-name"
          helperText="A valid last name contains atleast 3 characters with only alphabets"
          sx={{ mr: 1 }}
          onChange={(e) => setField("lastName", String(e.target.value).trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  sx={{
                    color: "text.primary",
                    fontSize: "18px"
                  }}>
                  <b>L</b>
                </Typography>
              </InputAdornment>
            )
          }}
        />
      </Box>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        placeholder="nicole23@domain.com"
        error={setRequiredError.email}
        helperText="A email contains atleast 7 characters including domain name and id."
        onChange={(e) => setField("email", String(e.target.value).toLocaleLowerCase())}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AlternateEmail
                sx={{
                  color: "text.primary"
                }}
              />
            </InputAdornment>
          )
        }}
      />
      <Box component="div" sx={{ display: "flex", alignItems: "flex-start" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
          <DatePicker
            label="Date of Birth"
            value={personalDetails.DOB}
            mask={"__/__/____"}
            maxDate={new Date()}
            onChange={(newValue) => {
              setField("DOB", new Date(newValue).getTime());
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
                name="DOB"
                id="DOB"
                helperText="Please Key in your valid date of birth in the format DD/MM/YYYY"
                sx={{ mr: 1, mt: 2, mb: 1 }}
              />
            )}
          />
        </LocalizationProvider>
        <FormControl
          sx={{
            mr: 1,
            mt: 2,
            mb: 1,
            width: "100%"
          }}>
          <InputLabel id="marital-status-helper">Gender</InputLabel>
          <Select
            labelId="marital-status-helper"
            id="gender"
            required
            value={personalDetails.gender}
            name="gender"
            label="Gender"
            onChange={(newM) => setField("gender", newM.target.value)}>
            <MenuItem value="">
              <em>Please Select</em>
            </MenuItem>
            <MenuItem value={"Male"}>Male</MenuItem>
            <MenuItem value={"Female"}>Female</MenuItem>
            <MenuItem value={"NA"}>Prefer Not to Say</MenuItem>
          </Select>
          <FormHelperText>Please key in your gender for the record</FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            mr: 1,
            mt: 2,
            mb: 1,
            width: "100%"
          }}>
          <InputLabel id="marital-status-helper">Marital Status</InputLabel>
          <Select
            labelId="marital-status-helper"
            id="maritalStatus"
            required
            value={personalDetails.maritalStatus}
            name="maritalStatus"
            label="Marital Status"
            onChange={(newM) => setField("maritalStatus", newM.target.value)}>
            <MenuItem value="">
              <em>Please Select</em>
            </MenuItem>
            <MenuItem value={"Single"}>Single</MenuItem>
            <MenuItem value={"Married"}>Married</MenuItem>
            <MenuItem value={"Divorced"}>Divorced</MenuItem>
            <MenuItem value={"Legally Seperated"}>Legally Seperated</MenuItem>
            <MenuItem value={"Windowed"}>Windowed</MenuItem>
          </Select>
          <FormHelperText>
            Please key in your marital status for the record
          </FormHelperText>
        </FormControl>
      </Box>
      {extraField && (
        <FormControl
          sx={{
            mr: 1,
            mt: 2,
            mb: 1,
            width: "100%"
          }}>
          <InputLabel id="department-select-helper">Department *</InputLabel>
          <Select
            labelId="department-select-helper"
            id="department"
            required
            value={personalDetails.department}
            name="department"
            label="Department"
            onChange={(newM) => setField("department", newM.target.value)}>
            <MenuItem value="">
              <em>Please Select</em>
            </MenuItem>
            {departmentOptions.map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Please key in your department in which you specilize at the hospital. If you
            are unable to find your department, please contact the hospital as soon as
            possible.
          </FormHelperText>
        </FormControl>
      )}
    </Box>
  );
}

function ContactDetails({ setTheField }) {
  const setField = (id, value) => setTheField(id, value, "contactDetails");
  const [otherNoActive, setOtherNoActive] = useState(false);
  return (
    <Box sx={{ padding: "8px 16px" }}>
      <Box
        component="div"
        sx={{
          display: "flex",
          alignItems: "center"
        }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="mobile"
          label="Mobile Number"
          placeholder="+(CO)1XXXXXXXX"
          type="tel"
          id="mobile"
          autoComplete="tel"
          helperText="A valid tel number depends upon the selected country. Please enter in full including country code."
          sx={{ mr: 1 }}
          onChange={(e) => setField("mobile", String(e.target.value).trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone
                  sx={{
                    color: "text.primary"
                  }}
                />
              </InputAdornment>
            )
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          name="whatsapp"
          label="Whatsapp Number For Easier Access"
          placeholder="+(CO)1XXXXXXXX"
          type="tel"
          id="whatsapp"
          autoComplete="tel"
          helperText="A valid tel number depends upon on your whatsapp number. Please enter in full including country code."
          sx={{ mr: 1 }}
          onChange={(e) => setField("whatsapp", String(e.target.value).trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PermPhoneMsg
                  sx={{
                    color: "text.primary"
                  }}
                />
              </InputAdornment>
            )
          }}
        />
        <Box
          component="div"
          sx={{
            alignSelf: "stretch",
            mt: 3
          }}>
          <Tooltip title={`${otherNoActive ? "Remove" : "Add"} another number`}>
            <IconButton
              onClick={() => {
                if (otherNoActive) setField("other", "");
                setOtherNoActive(!otherNoActive);
              }}>
              {otherNoActive && (
                <RemoveCircle sx={{ color: "text.primary" }} fontSize="large" />
              )}
              {!otherNoActive && (
                <AddCircle sx={{ color: "text.primary" }} fontSize="large" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Collapse in={otherNoActive} timeout="auto">
        <TextField
          margin="normal"
          fullWidth
          name="other"
          label="Additional Other Number as an alternative, if any"
          placeholder="+(CO)1XXXXXXXX"
          type="tel"
          id="other"
          autoComplete="tel"
          helperText="A valid tel number depends upon on your whatsapp number. Please enter in full including country code."
          sx={{ mr: 1 }}
          onChange={(e) => setField("other", String(e.target.value).trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ContactPhone
                  sx={{
                    color: "text.primary"
                  }}
                />
              </InputAdornment>
            )
          }}
        />
      </Collapse>
    </Box>
  );
}

function LoginDetails({ user, loginDetails, setTheField, setRequiredError }) {
  const setField = (id, value) => setTheField(id, value, "loginDetails");
  const [pwVisible, setpwVisible] = useState(false);
  const [promise, setPromise] = useState(false);
  const [options, setOptions] = useState([]);

  let fetchHospitalOptions = useCallback(async () => {
    let res = await getHospitalsEnrolled();
    if (res) setOptions(res.data);
    setPromise(() => true);
  }, []);

  useEffect(() => {
    if (!user) fetchHospitalOptions();
  }, [fetchHospitalOptions, user]);
  return (
    <Box sx={{ padding: "8px 16px" }}>
      <Box component="div" sx={{ display: "flex", alignItems: "flex-start" }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="ID"
          label="NRIC/Passport No."
          placeholder="123456-78-GB02"
          type="text"
          id="ID"
          helperText="A valid NRIC/Passport number contains only digits and alphabets including hypens for NRIC number"
          sx={{ mr: 1 }}
          onChange={(e) => setField("ID", String(e.target.value).trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Grid3x3
                  sx={{
                    color: "text.primary"
                  }}
                />
              </InputAdornment>
            )
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label={!user ? "Password" : "Alternate Key For Patient"}
          placeholder="Strong12_Pass$%word"
          type={pwVisible ? "text" : "password"}
          id="password"
          error={setRequiredError.password}
          autoComplete="new-password"
          helperText={`${
            user ? "This alternate key acts as first time login for patient." : ""
          }A valid username contains atleast 8 characters with 1 uppercase character, 1 lowercase character, 1 special character and 1 digit with no restrictions on dot character`}
          sx={{ ml: 1 }}
          onChange={(e) => setField("password", String(e.target.value).trim())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock
                  sx={{
                    color: "text.primary"
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setpwVisible(!pwVisible)}
                  sx={{
                    color: "text.primary"
                  }}>
                  <GetVisibility visible={pwVisible} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      {!user && (
        <FormControl
          sx={{
            mr: 1,
            mt: 2,
            mb: 1,
            width: "100%"
          }}>
          <InputLabel id="hospital-select-helper">Hospital Organization *</InputLabel>
          <Select
            labelId="hospital-select-helper"
            id="org"
            required
            value={loginDetails.org}
            name="org"
            disabled={!promise}
            label="Hospital Organization"
            onChange={(newM) => setField("org", newM.target.value)}>
            <MenuItem value="">
              <em>Please Select</em>
            </MenuItem>
            {options.map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Please key in your the hospital you want to register for the record. If you
            are unable to find your hospital, please contact the hospital as soon as
            possible.
          </FormHelperText>
        </FormControl>
      )}
    </Box>
  );
}
export default function RegisterPatient({ broadcastAlert, user, TYPE = "patient" }) {
  const [loginDetails, setLoginDetails] = useState({
    fields: {
      active: false,
      org: (user && user.org) || "",
      ID: "",
      password: "",
      //TODO WHEN ADDING DOCTOR SIGNUP
      TYPE
    },
    setRequiredError: { password: false }
  });
  const [personalDetails, setPersonalDetails] = useState({
    fields: {
      active: false,
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      DOB: null,
      gender: "",
      maritalStatus: "",
      department: ""
    },
    setRequiredError: {
      firstName: false,
      middleName: false,
      lastName: false,
      email: false
    }
  });
  const [address, setAddress] = useState({
    fields: {
      active: false,
      street1: "",
      street2: "",
      postcode: "",
      country: "",
      state: "",
      city: ""
    },
    setRequiredError: {
      city: false
    }
  });
  const [contactDetails, setContactDetails] = useState({
    fields: {
      active: false,
      mobile: "",
      whatsapp: "",
      other: ""
    },
    setRequiredError: {}
  });

  const setTheField = (field, value, type) => {
    switch (type) {
      case "loginDetails":
        setLoginDetails((prev) => ({
          ...prev,
          fields: { ...prev.fields, [field]: value },
          setRequiredError: { password: false }
        }));
        break;
      case "personalDetails":
        let newReplace;
        for (const [key, _] of Object.entries(personalDetails.setRequiredError))
          if (key === field) {
            newReplace = { [key]: false };
            break;
          }
        setPersonalDetails((prev) => ({
          ...prev,
          fields: { ...prev.fields, [field]: value },
          setRequiredError: {
            ...prev.setRequiredError,
            ...newReplace
          }
        }));
        break;
      case "address":
        setAddress((prev) => ({
          ...prev,
          fields: { ...prev.fields, [field]: value },
          setRequiredError: { city: false }
        }));
        break;
      case "contactDetails":
        setContactDetails((prev) => ({
          ...prev,
          fields: { ...prev.fields, [field]: value }
        }));
        break;
      default:
        break;
    }
  };

  const handleValidationError = (message, key, fun) => {
    fun((prev) => ({
      ...prev,
      setRequiredError: { ...prev.setRequiredError, [key]: true }
    }));
    setFormResponseAlert((prev) => `${prev ? prev + "\n" : "\n"}${message}`);
    return true;
  };

  const closeForError = (message) => {
    if (message) setFormResponseAlert((prev) => `${message} - ${prev || ""}`);
    setTimeout(() => {
      setLoading(false);
      setOpen(true);
    }, 200);
    setTimeout(() => {
      scrollToBottom();
    }, 600);
  };
  const navigate = useNavigate();
  const handleClose = (url) => {
    if (url && user?.org)
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "info",
          `New ${String(loginDetails.fields.TYPE).charAt(0).toUpperCase()}${String(
            loginDetails.fields.TYPE
          ).slice(1)} was enrolled successfully`,
          user
            ? `You may now ask the patient to login with the alternate key with - ${user.org}`
            : `Now you may login with yoour credentials to continue. Thank you`
        )
      ]);
    if (!user)
      broadcastAlert((prev) => [
        ...prev,
        getAlertValues(
          "info",
          `New ${String(loginDetails.fields.TYPE).charAt(0).toUpperCase()}${String(
            loginDetails.fields.TYPE
          ).slice(1)} was enrolled successfully`,
          `You may now login to enter the application.`
        )
      ]);
    navigate(url && user ? url : -1);
  };
  // OPEN OR CLOSE THE ALERT
  const [open, setOpen] = useState(false);
  // SET THE ERROR IN ALERT
  const [formResponseAlert, setFormResponseAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const scrollToBottom = () => bottomRef.current.scrollIntoView({ behavior: "smooth" });
  const handleSubmit = (event) => {
    event.preventDefault();
    setFormResponseAlert(false);
    let error = false;
    setLoading(true);
    const [pass, v] = Object.entries(loginDetails.fields)[3];
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&_])(?=.{8,})/.test(v))
      error = handleValidationError(
        "Password entered is in invalid format",
        pass,
        setLoginDetails
      );
    if (error) {
      closeForError(`An error has occured in "Sign Up Details" Section as follows`);
      return;
    }

    for (const [key, val] of Object.entries(personalDetails.fields)) {
      switch (key) {
        case "firstName":
          if (!/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(val))
            error = handleValidationError(
              "First Name format entered is invalid",
              key,
              setPersonalDetails
            );
          break;
        case "middleName":
          if (val && !/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(val))
            error = handleValidationError(
              "Middle Name format entered is invalid",
              key,
              setPersonalDetails
            );
          break;
        case "lastName":
          if (!/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(val))
            error = handleValidationError(
              "Last Name format entered is invalid",
              key,
              setPersonalDetails
            );
          break;
        case "email":
          if (
            !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              val
            )
          )
            error = handleValidationError(
              "Email entered is invalid",
              key,
              setPersonalDetails
            );
          break;
        default:
          break;
      }
    }

    if (error) {
      closeForError(`An error has occured in "Personal Details" Section as follows`);
      return;
    }
    const [city, val] = Object.entries(address.fields)[6];
    if (!/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(val))
      error = handleValidationError("City Name entered is invalid", city, setAddress);
    if (error) {
      closeForError(`An error has occured in "Address Details" Section as follows`);
      return;
    }
    personalDetails.fields.passport = loginDetails.fields.ID;
    addNewPatientOrDoctorAPI(
      loginDetails.fields,
      personalDetails.fields,
      address.fields,
      contactDetails.fields,
      user ? true : false
    )
      .then(() => {
        handleClose(!user ? "../overview" : -1);
      })
      .catch((e) => {
        closeForError(
          e.response?.data?.DETAILS
            ? e.response.data.DETAILS
            : `Failed to connect to the server. Check your internet connection`
        );
      });
  };
  return (
    <Dialog
      fullScreen
      open={true}
      onClose={() => handleClose()}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          bgcolor: "background.default",
          backgroundImage: "none"
        }
      }}>
      <AppBar
        sx={{
          position: "relative",
          bgcolor: "primary.sectionContainer",
          color: "text.primary",
          backgroundImage: "none"
        }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => handleClose()}
            aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {user && "Create New Patient Record"}
            {!user && `New ${TYPE === "doctor" ? "Doctor" : "Patient"} Signup`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box
          sx={{
            borderRadius: "12px",
            mt: 4,
            p: 2,
            bgcolor: "primary.sectionContainer",
            boxShadow:
              "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)"
          }}>
          <Typography component="span" variant="h6">
            {user && (
              <span>
                Signup On Patient's Behalf -<b> For {user.org}</b>
              </span>
            )}
            {!user && "Signup to Create Account"}
            <Typography sx={{ color: "text.secondary" }}>
              <small>
                {user &&
                  "The patient's details filled below on their behalf are concluded as accurately spoken by patient themselves. The password filled is temporary and patient needs to put a new password when they login."}
                {!user &&
                  "Your personal details are be filled as accurately as possible to conclude correct diagnosis as well as help the hospital identify you easily"}
              </small>
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              <small>
                <em>All four parts of the form are required to create the account</em>
              </small>
            </Typography>
          </Typography>
          <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
            <ListItemButton
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: `${loginDetails.fields.active ? "12px 12px 0 0" : "12px"}`
              }}
              onClick={() =>
                setTheField("active", !loginDetails.fields.active, "loginDetails")
              }>
              <Typography component="small">
                <b>Account Signup Details</b>
                <Typography sx={{ color: "text.secondary" }}>
                  <small>
                    The below details will serve as the login details for the account.
                    Passport Number is the userID
                  </small>
                </Typography>
              </Typography>
              <ExpandCircleDown
                sx={{
                  transform: `rotate(${loginDetails.fields.active ? 180 : 0}deg)`,
                  transition: "ease-in 0.2s"
                }}
              />
            </ListItemButton>
            <Collapse in={loginDetails.fields.active} timeout="auto">
              <LoginDetails
                user={user}
                loginDetails={loginDetails.fields}
                setTheField={setTheField}
                setRequiredError={loginDetails.setRequiredError}
              />
            </Collapse>
            <Divider
              sx={{
                mt: loginDetails.fields.active ? 2 : 1,
                mb: personalDetails.fields.active ? 2 : 1
              }}
            />
            <ListItemButton
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: `${
                  personalDetails.fields.active ? "12px 12px 0 0" : "12px"
                }`
              }}
              onClick={() =>
                setTheField("active", !personalDetails.fields.active, "personalDetails")
              }>
              <Typography component="small">
                <b>Personal Details</b>
                <Typography sx={{ color: "text.secondary" }}>
                  <small>
                    Personal Details are required to create new patient account. These
                    details are expected to be as accurate as possible.
                  </small>
                </Typography>
              </Typography>
              <ExpandCircleDown
                sx={{
                  transform: `rotate(${personalDetails.fields.active ? 180 : 0}deg)`,
                  transition: "ease-in 0.2s"
                }}
              />
            </ListItemButton>
            <Collapse in={personalDetails.fields.active} timeout="auto">
              <PersonalDetails
                personalDetails={personalDetails.fields}
                setTheField={setTheField}
                setRequiredError={personalDetails.setRequiredError}
                extraField={TYPE === "doctor"}
              />
            </Collapse>
            <Divider
              sx={{
                mt: address.fields.active ? 2 : 1,
                mb: loginDetails.fields.active ? 2 : 1
              }}
            />
            <ListItemButton
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: `${address.fields.active ? "12px 12px 0 0" : "12px"}`
              }}
              onClick={() => setTheField("active", !address.fields.active, "address")}>
              <Typography component="small">
                <b>Location Details</b>
                <Typography sx={{ color: "text.secondary" }}>
                  <small>
                    The location details are required for the hospital for the benefit of
                    the patient
                  </small>
                </Typography>
              </Typography>
              <ExpandCircleDown
                sx={{
                  transform: `rotate(${address.fields.active ? 180 : 0}deg)`,
                  transition: "ease-in 0.2s"
                }}
              />
            </ListItemButton>
            <Collapse in={address.fields.active} timeout="auto">
              <AddressDetails
                address={address.fields}
                setTheField={setTheField}
                setRequiredError={address.setRequiredError}
              />
            </Collapse>
            <Divider
              sx={{
                mt: contactDetails.fields.active ? 2 : 1,
                mb: address.fields.active ? 2 : 1
              }}
            />
            <ListItemButton
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: `${contactDetails.fields.active ? "12px 12px 0 0" : "12px"}`
              }}
              onClick={() =>
                setTheField("active", !contactDetails.fields.active, "contactDetails")
              }>
              <Typography component="small">
                <b>Contact Details</b>
                <Typography sx={{ color: "text.secondary" }}>
                  <small>
                    The contact details are important for the hospital to contact{" "}
                    {user && "the patient"} {!user && "you"} for further process, if any
                  </small>
                </Typography>
              </Typography>
              <ExpandCircleDown
                sx={{
                  transform: `rotate(${contactDetails.fields.active ? 180 : 0}deg)`,
                  transition: "ease-in 0.2s"
                }}
              />
            </ListItemButton>
            <Collapse in={contactDetails.fields.active} timeout="auto">
              <ContactDetails setTheField={setTheField} />
            </Collapse>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
              sx={{ mt: 3, mb: 2, fontWeight: "bolder" }}>
              CREATE
            </LoadingButton>
            {formResponseAlert && (
              <Collapse in={open} onExited={() => setFormResponseAlert(undefined)}>
                <Alert
                  id="response_alert"
                  severity="error"
                  sx={{ fontSize: "13px", mb: 2 }}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => setOpen(false)}>
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }>
                  <b style={{ whiteSpace: "pre-wrap" }}>{formResponseAlert}</b>
                </Alert>
                <div style={{ float: "left", clear: "both" }} ref={bottomRef} />
              </Collapse>
            )}
          </Box>
        </Box>
      </Container>
    </Dialog>
  );
}

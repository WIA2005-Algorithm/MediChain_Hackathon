import { useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import { Transition } from '../StyledComponents';
import {
  Alert,
  Autocomplete,
  Collapse,
  Container,
  InputAdornment,
  ListItemButton,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import {
  DriveFileRenameOutline,
  ExpandCircleDown,
  Grid3x3,
  AlternateEmail,
  Visibility,
  VisibilityOff,
  Lock,
  AssistantPhoto,
  LocationCity,
  FmdGood,
} from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import CountryCity from 'countrycitystatejson';
import { createOrganization } from '../../APIs/Superuser/network.api';

function CountrySelect() {
  const [country, setCountry] = useState(undefined);
  const onCountryChange = (_, values) => {
    if (values === null) {
      setCountry(undefined);
      return;
    }
    setCountry(values.shortName);
  };
  return (
    <>
      <Box component="div" sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
        <Autocomplete
          fullWidth
          options={CountryCity.getCountries()}
          autoHighlight
          sx={{ mr: 1 }}
          getOptionLabel={(option) => option.name}
          onChange={onCountryChange}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
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
              helperText="A valid country contains only alphabets and spaces"
              required
              name='country'
              id='country'
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <AssistantPhoto sx={{color: 'text.primary'}} />
                  </InputAdornment>
                )
              }}
            />
          )}
        />
        <Autocomplete
          key={country}
          fullWidth
          disabled={country ? false : true}
          options={country ? CountryCity.getStatesByShort(country) : []}
          autoHighlight
          sx={{ ml: 1 }}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              {option}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a State/Province"
              helperText="A valid state/province contains only alphabets and spaces"
              required
              name='state'
              id='state'
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationCity sx={{color: 'text.primary'}} />
                  </InputAdornment>
                )
              }}
            />
          )}
        />
      </Box>
      <TextField
        margin="normal"
        required
        fullWidth
        name="location"
        label="Location"
        placeholder="Location"
        type="text"
        id="location"
        autoComplete="off"
        helperText="A valid location (City) contains only alphabets and spaces"
        sx={{ mr: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FmdGood sx={{ color: 'text.primary' }} />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}

export default function FullScreenDialog() {
  const navigate = useNavigate();
  const { networkName } = useParams();
  const handleClose = () => navigate(`/superuser/networks/${networkName}/`);
  // OPEN OR CLOSE THE ALERT
  const [open, setOpen] = useState(false);
  const [openOrgDetails, setOpenOrgDetails] = useState(false);
  const [openAdminDetails, setOpenAdminDetails] = useState(false);
  // SET THE ERROR IN ALERT
  const [formResponseAlert, setFormResponseAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pwVisible, setpwVisible] = useState(false);
  const GetVisibility = () => (pwVisible ? <Visibility /> : <VisibilityOff />);
  const bottomRef = useRef(null);
  const scrollToBottom = () => {
    console.log(bottomRef);
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    createOrganization(
      networkName,
      data.get('orgName').trim(),
      data.get('orgID').trim(),
      data.get('adminID').trim(),
      data.get('password').trim(),
      data.get('country').trim(),
      data.get('state').trim(),
      data.get('location').trim())
      .then(() => {
        handleClose();
      })
      .catch((e)=> {
        e.response.data.DETAILS? setFormResponseAlert(e.response.data.DETAILS): setFormResponseAlert(`Failed to connect to the server. Check your internet connection`);
        setTimeout(() => {
          setLoading(false);
          setOpen(true);
        }, 200);
        setTimeout(() => {
          scrollToBottom();
        }, 600);
      });
  };
  return (
    <Dialog
      fullScreen
      open={true}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          bgcolor: 'background.default',
          backgroundImage: 'none',
        },
      }}
    >
      <AppBar
        sx={{
          position: 'relative',
          bgcolor: 'primary.sectionContainer',
          color: 'text.primary',
          backgroundImage: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Hospital Organizations
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box
          sx={{
            borderRadius: '12px',
            mt: 4,
            p: 2,
            bgcolor: 'primary.sectionContainer',
            boxShadow:
              '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
          }}
        >
          <Typography component="span" variant="h6">
            Create a new hospital organization
            <Typography sx={{ color: 'text.secondary' }}>
                  <small>
                    There are 2 parts of this form listed below. Both are required.
                  </small>
                </Typography>
          </Typography>
          <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
            <ListItemButton
              component="div"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: `${openOrgDetails ? '12px 12px 0 0' : '12px'}`,
              }}
              onClick={() => setOpenOrgDetails(!openOrgDetails)}
            >
              <Typography component="small">
                <b>Hospital Organization Details</b>
                <Typography sx={{ color: 'text.secondary' }}>
                  <small>
                    The hospital organization details helps determine and create
                    the Certification Authority (CA) for it's particular doctors
                    and patients
                  </small>
                </Typography>
              </Typography>
              <ExpandCircleDown
                sx={{
                  transform: `rotate(${openOrgDetails ? 180 : 0}deg)`,
                  transition: 'ease-in 0.2s',
                }}
              />
            </ListItemButton>
            <Collapse in={openOrgDetails} timeout="auto">
              <Box sx={{ padding: '8px 16px' }}>
                <Box
                  component="div"
                  sx={{ display: 'flex', alignItems: 'flex-start' }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    autoFocus
                    name="orgName"
                    label="Hospital Organization Name"
                    placeholder="University Of Malaya Medical Centre"
                    type="text"
                    id="orgName"
                    helperText="A valid hospital name contains only alphabets and spaces"
                    sx={{ mr: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DriveFileRenameOutline
                            sx={{ color: 'text.primary' }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="orgID"
                    label="Hospital ID/Short Name"
                    name="orgID"
                    placeholder="UMMC"
                    helperText="A valid ID/Short Name contains atleast 5 characters with no spaces, no special characters in the beginning or end. Allowed special characters include 'underscore' and 'dot'"
                    sx={{ ml: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Grid3x3 sx={{ color: 'text.primary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box
                  component="div"
                  sx={{ display: 'flex', alignItems: 'flex-start' }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="adminID"
                    label="Admin Username"
                    placeholder="Admin"
                    type="text"
                    id="adminID"
                    autoComplete="username"
                    helperText="A valid username contains atleast 5 characters with no spaces, no special characters in the beginning or end. Allowed special characters include 'underscore' and 'dot'"
                    sx={{ mr: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AlternateEmail sx={{ color: 'text.primary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Admin Password"
                    name="password"
                    autoComplete="new-password"
                    type={pwVisible ? 'text' : 'password'}
                    placeholder="Adminpw_12"
                    helperText="A valid username contains atleast 8 characters with 1 uppercase character, 1 lowercase character, 1 special character and 1 digit with no restrictions on dot character"
                    sx={{ ml: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'text.primary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setpwVisible(!pwVisible)}
                            sx={{ color: 'text.primary' }}
                          >
                            <GetVisibility />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            </Collapse>
            <Divider sx={{ mb: 3, mt: 3 }} />
            <ListItemButton
              component="div"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: `${openAdminDetails ? '12px 12px 0 0' : '12px'}`,
              }}
              onClick={() => setOpenAdminDetails(!openAdminDetails)}
            >
              <Typography component="small">
                <b>Hospital Location Details</b>
                <Typography sx={{ color: 'text.secondary' }}>
                  <small>
                    The hospital location details helps determine the valid
                    permission control over the records for it's particular
                    doctors and patients while exchangin records between
                    hospitals
                  </small>
                </Typography>
              </Typography>
              <ExpandCircleDown
                sx={{
                  transform: `rotate(${openAdminDetails ? 180 : 0}deg)`,
                  transition: 'ease-in 0.2s',
                }}
              />
            </ListItemButton>
            <Collapse in={openAdminDetails} timeout="auto">
              <Box sx={{ padding: '8px 16px' }}>
                <CountrySelect />
              </Box>
            </Collapse>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
              sx={{ mt: 3, mb: 2, fontWeight: 'bolder' }}
            >
              CREATE
            </LoadingButton>
            {formResponseAlert && (
              <Collapse
                in={open}
                onExited={() => setFormResponseAlert(undefined)}
              >
                <Alert
                  id="response_alert"
                  severity="error"
                  sx={{ fontSize: '13px', mb: 2 }}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => setOpen(false)}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  <b>{formResponseAlert}</b>
                </Alert>
                <div style={{ float:"left", clear: "both" }} ref={bottomRef}/>
              </Collapse>
            )}
          </Box>
        </Box>
      </Container>
    </Dialog>
  );
}
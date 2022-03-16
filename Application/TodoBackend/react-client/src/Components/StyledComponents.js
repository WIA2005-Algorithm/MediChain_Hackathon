import { Badge, CircularProgress, Slide, Snackbar, Typography } from '@mui/material';
import { styled} from '@mui/system';
import logo from "../static/images/Logo.png";
import { useState, useCallback, useEffect, forwardRef } from "react";
import { getNetworkStatus } from '../APIs/Superuser/network.api.js';

export const SectionContainer = styled('div')(({ theme }) => ({
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary.sectionContainer,
    padding: theme.spacing(6, 3),
    fontSize: theme.typography.fontSize,
    borderRadius: 12,
    boxShadow: theme.palette.boxShadow,
    // border: `1px solid ${theme.palette.primary.sectionBorder}`
  }));

export const Logo = () => (
<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
  <div className='logo_back'>
    <img alt="Medichain" width='40px' src={logo} /></div>
</div>
);

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#FF0000',
    color: '#FF0000',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export function TransitionsSnackbar({state, setState}) {
  const handleClose = () => {
    setState({
      ...state,
      open: false,
      message: ""
    });
  };

  return (
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message={state.message}
        key={state.Transition.name}
        ContentProps={{
          sx: {
            bgcolor: 'primary.main',
            color: 'text.reverse',
            backgroundImage: 'none',
            border: '1px solid',
            borderColor: 'primary.main',
            fontWeight: 'bold'
          }
        }}
      />
  );
}

export function Status(props) {
  let checkStatus = useCallback(async () => {
    let res = await getNetworkStatus();
    console.log(res);
    props.state(res.data);
}, []);

useEffect(() => {
  const intervalID = setInterval(() => {
    checkStatus();
  }, 2000);
  return () => clearInterval(intervalID)
}, [checkStatus]);
return null;
}

export function NetStatus(props){
  const {status, setStatus} = props;
  return (
    <Typography component='div' sx={props.sx}>
    {status.code === 300 && <Status state={setStatus}/>}
    {status.message==='Pending'&& <CircularProgress sx={props.circlesx}/>}
    <div>{status.message}</div>
    </Typography>
    )
}

export const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

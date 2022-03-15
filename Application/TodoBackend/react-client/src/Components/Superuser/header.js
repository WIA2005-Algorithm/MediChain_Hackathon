
import { AppBar, Avatar, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import {Logo, StyledBadge} from '../StyledComponents.js'
import { Box } from '@mui/system';
import { Shield, DarkMode, DarkModeOutlined, DoubleArrow} from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import profile from "../../static/images/profile.png";

export default function Header(props) {
    function GetMode() {
        return props.mode==='dark'? <DarkMode/>:<DarkModeOutlined/>;
    }
    return(
        <AppBar position="static" sx={{bgcolor: 'primary.sectionContainer', backgroundImage: 'none', padding: '7px 0px', color: 'text.primary'}}>
        <Toolbar variant="dense">
           <Tooltip title="Home">
           <IconButton
            size="small"
            edge="start"
            color="inherit"
            sx={{ mr: 0.5 }}>
            <Logo/>
          </IconButton>
           </Tooltip>
          <Typography
            variant="h5"
            noWrap
            component="div"
            fontWeight='bold'>
            Medi
            <Typography  component="span" variant="h5" color='primary' fontWeight='bold'>
            chain
            </Typography>
          </Typography>
            <DoubleArrow sx={{color: 'text.secondary', ml: 1}} fontSize='inherit'/>
            <Typography  component="small" fontWeight='bold' sx={{ml: 1}}>Root Admin</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{color: 'primary.main'}}>
          <Tooltip title={`Change to ${props.mode==='light'?'Dark':'Light'} Mode`} >
          <IconButton 
          size="large" 
          color="inherit" 
          sx={{padding: 1, mr: 1}} 
          onClick={()=> props.newMode()}>
             <GetMode/>
            </IconButton>
          </Tooltip>
          <Tooltip title='Hospital Identities'>
          <IconButton size="large" color="inherit" sx={{padding: 1, mr: 1}}>
             <Shield />
            </IconButton>
          </Tooltip>
           <Tooltip title='Notifications'>
           <IconButton
              size="large"
              aria-label="Notifications"
              color="inherit"
              sx={{padding: 1}}
            >
                <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot">
                    <NotificationsIcon />
                </StyledBadge>
            </IconButton>
           </Tooltip>
           <Tooltip title='User'>
           <IconButton
              size="large"
              edge="end"
              aria-label="User"
              color="inherit">
            <Avatar alt='Superuser' src={profile}/>
            </IconButton>
           </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    )
}
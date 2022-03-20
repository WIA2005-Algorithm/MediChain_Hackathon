
import { AppBar, Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material'
import {Logo, StyledBadge} from '../StyledComponents.js'
import { Box } from '@mui/system';
import { Shield, DarkMode, DarkModeOutlined, DoubleArrow, Logout} from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import profile from "../../static/images/profile.png";
import { useState } from 'react';

export default function Header({mode, newMode, logout, user}) {
    const GetMode = () => mode==='dark'? <DarkMode/>:<DarkModeOutlined/>;
    const handleClick = (event) => setAnchorEl(event.currentTarget)
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClose = () => setAnchorEl(null)
    const open = Boolean(anchorEl);
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
          <Tooltip title={`Change to ${mode==='light'?'Dark':'Light'} Mode`} >
          <IconButton 
          size="large" 
          color="inherit" 
          sx={{padding: 1, mr: 1}} 
          onClick={()=> newMode()}>
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
              onClick={handleClick}
              size="large"
              edge="end"
              aria-label="User"
              color="inherit"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}>
            <Avatar alt='Superuser' src={profile}/>
            </IconButton>
           </Tooltip>
          </Box>
          <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar sx={{bgcolor: 'primary.main'}}>S</Avatar> {user && user.username}
        </MenuItem>
        <Divider />
        <MenuItem onClick={()=> logout()}>
          <ListItemIcon sx={{color: 'text.primary'}}>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
        </Toolbar>
      </AppBar>
    )
}
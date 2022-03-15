import { DriveFileRenameOutline, ExpandCircleDown, Grid3x3, Public } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Collapse, IconButton, InputAdornment, ListItemButton, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import {SectionContainer} from '../StyledComponents.js';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { createNetwork } from '../../APIs/Superuser/network.api.js';

export default function CreateNetwork(props) {
    const [loading, setLoading] = useState(false);
    const [formResponse, setFormResponse] = useState(undefined)
    const [open, setOpen] = useState(true);
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);
        createNetwork(data.get('networkID'), data.get('networkName').trim(), data.get('networkAdd'))
        .then(function () {
          props.fetch();
        })
        .catch((e)=> {
            setFormResponse(e.response.data.DETAILS? e.response.data.DETAILS: `Failed to connect to the server. Check your internet connection`);
        })
        .finally(()=>{
          setTimeout(() => {
            setLoading(false);
            setOpen(true);
          }, 400);
        })
        ;
      };
return(
    <SectionContainer sx={{margin: 2, padding: 0, width: '100%'}}>
        <ListItemButton 
        component='div' 
        sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center',  padding: '8px 16px', borderRadius: `${props.openForm? '12px 12px 0 0': '12px'}`}}
        onClick={()=>props.setOpenForm(!props.openForm)}>
            <Typography component='span' variant='h6'>
                Create a new hyperledger fabric network
            </Typography>
                <ExpandCircleDown sx={{transform: `rotate(${props.openForm? 180: 0}deg)`, transition: 'ease-in 0.2s'}}/>
        </ListItemButton>
        <Collapse in={props.openForm} timeout="auto" unmountOnExit>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, padding: '8px 16px' }}>
            <Box component='div' sx={{display: 'flex', alignItems: 'center'}}>
            <TextField
              margin="normal"
              required
              fullWidth
              autoFocus
              name="networkName"
              label="Network Name"
              placeholder='First_Network'
              type='text'
              id="networkName"
              helperText="A valid network Name contains atleast 5 characters with no spaces, no special characters in the beginning or end. Allowed special characters include 'underscore' and 'dot'"
              sx={{mr: 1}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DriveFileRenameOutline sx={{color: 'text.primary'}}/>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="networkID"
              label="Network ID"
              name="networkID"
              placeholder='Medic'
              helperText="A valid network ID contains atleast 5 characters with no spaces, no special characters in the beginning or end. Allowed special characters include 'underscore' and 'dot'"
              sx={{ml: 1}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Grid3x3 sx={{color: 'text.primary'}}/>
                  </InputAdornment>
                ),
              }}
            />
            </Box>
            <TextField
              margin="normal"
              required
              fullWidth
              name="networkAdd"
              label="Network Address"
              placeholder='Type your network address here...'
              type='text'
              helperText='For blockchain address please remove http|https:// and www., if any'
              id="networkAdd"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Public sx={{color: 'text.primary'}}/>
                  </InputAdornment>
                )
              }}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
              sx={{ mt: 3, mb: 2, fontWeight: 'bolder' }}
            >
              Sign In
            </LoadingButton>
            {formResponse && 
            <Collapse in={open} onExited={() => setFormResponse(undefined)}>
                <Alert severity='error' sx={{fontSize: '13px', mb: 2}}  
            action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setOpen(false)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }><b>{formResponse}</b></Alert></Collapse>}
          </Box>
        </Collapse>
    </SectionContainer>)
}
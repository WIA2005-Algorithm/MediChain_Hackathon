import { DoubleArrow } from "@mui/icons-material";
import { Divider, Typography } from "@mui/material";

export default function Middle(props) {
    return(
        <div style={{marginTop: '36px', width: '100%'}}>
        <Typography component='div' variant="h5" sx={{color: 'primary.main', fontWeight: 'bold'}}>
            Networks
        </Typography>
        <Typography component='div' sx={{display: 'flex', fontSize: '14px', fontWeight: 'bold', alignItems: 'center'}}>
            HyperLedger Fabric Networks
            {props.nav.networkName &&
            <>
            <DoubleArrow sx={{color: 'text.secondary', ml: 1, mr: 1}} fontSize='inherit'/>
            {props.nav.networkName}
            </>}
            {props.nav.organization && 
            <>
            <DoubleArrow sx={{color: 'text.secondary', ml: 1, mr: 1}} fontSize='inherit'/>{props.nav.organization}
            </>}
        </Typography>
        <Divider sx={{mt: 3, mb: 3}}/>
        </div>

    )
}
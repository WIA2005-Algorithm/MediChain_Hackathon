import { AddCircle, PermContactCalendar } from "@mui/icons-material";
import {
  Toolbar,
  Button,
  ListItemButton,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  Drawer,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { ButtonMailto, Transition } from "../StyledComponents";

function ContactUs({ open, setOpen }) {
  const handleClose = () => setOpen(false);
  return (
    <Dialog
      PaperProps={{
        sx: {
          bgcolor: "background.default",
          backgroundImage: "none"
        }
      }}
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle>
        <Typography component="div" variant="h5" sx={{ mt: 1.2 }}>
          <b>Contact SuperAdmin</b>
          <Typography sx={{ color: "text.secondary" }} variant="h6">
            <small>We're all ears</small>
          </Typography>
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Typography sx={{ mb: 1 }}>
            SuperAdmin manages all the tasks around creating, managing blockchain servers
            as well as hospitals and it's admin users. SuperAdmin does not hold any
            responsibility against hospital patients and doctors and neither will be held
            responsible for it in the future.
          </Typography>
          <Typography>
            If you have read the above paragraph and still wish to contact SuperAdmin,
            then you may do so by clicking the below link.
          </Typography>
          <Typography>
            Email us at :{" "}
            <u>
              <b>
                <ButtonMailto
                  label="kamal20012011@hotmail.com"
                  mailto="kamal20012011@hotmail.com"
                />
              </b>
            </u>
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export function AppNavSideBar({ optSelected, changeTabTo, navItems }) {
  const drawerWidth = 240;
  const [open, setOpen] = useState(false);
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "primary.sectionContainer"
        }
      }}>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List
          sx={{
            "&& .MuiListItemText-root, && .MuiListItemIcon-root": {
              color: "text.secondary"
            },
            // selected and (selected + hover) states
            "&& .Mui-selected, && .Mui-selected:hover": {
              backgroundColor: "transparent",
              "& .MuiListItemIcon-root": {
                color: "primary.main"
              },
              "& .MuiListItemText-root": {
                color: "text.primary"
              },
              "& .MuiListItemText-root > .MuiTypography-root": {
                fontWeight: "bold"
              }
            },
            // hover states
            "& .MuiListItemButton-root:hover": {
              backgroundColor: "transparent",
              "& .MuiListItemIcon-root, & .MuiListItemText-root": {
                color: "text.primary"
              }
            },
            mt: 3
          }}>
          <ListItemText
            sx={{
              ml: 1,
              "& .MuiTypography-root": { fontWeight: "bold" }
            }}>
            Admin
          </ListItemText>
          {navItems.map((item, i) => (
            <div key={item.id}>
              <ListItemButton
                selected={optSelected === item.id}
                // TODO: Onclick item
                onClick={() => changeTabTo(item.id)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </div>
          ))}
        </List>
        <Divider />
        <ListItem sx={{ mt: 1 }}>
          <Button
            variant="contained"
            endIcon={<AddCircle />}
            sx={{
              textTransform: "capitalize",
              width: "100%"
            }}
            onClick={() => changeTabTo("/registerPatient")}>
            <b>Register Patient</b>
          </Button>
        </ListItem>
        <ListItem>
          <Button
            variant="outlined"
            endIcon={<PermContactCalendar />}
            sx={{
              textTransform: "capitalize",
              width: "100%"
            }}
            onClick={() => setOpen(true)}>
            <b>Contact SuperAdmin</b>
          </Button>
        </ListItem>
      </Box>
      {open && <ContactUs open={open} setOpen={setOpen} />}
    </Drawer>
  );
}

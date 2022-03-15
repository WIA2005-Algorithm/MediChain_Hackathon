import * as React from 'react';
import PropTypes from 'prop-types';
import { lighten, alpha, darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import LoadingButton from '@mui/lab/LoadingButton';
import { useParams } from 'react-router-dom';
import { deleteOrganization, getNetworkExists, startNetwork, stopNetwork } from '../../APIs/Superuser/network.api';
import { Alert, Avatar, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import emptyTable from '../../static/images/emptyTable.png'
import { NetStatus, Status } from '../StyledComponents';

function createData(objID, name, id, admin, state, country, createAt) {
  return {
    objID,
    name,
    id,
    admin,
    state,
    country,
    createAt,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'fullName',
    numeric: false,
    disablePadding: true,
    label: 'Full Name',
  },
  {
    id: 'id',
    numeric: true,
    disablePadding: false,
    label: 'Hospital ID',
  },
  {
    id: 'admin',
    numeric: true,
    disablePadding: false,
    label: 'Admin ID',
  },
  {
    id: 'state',
    numeric: true,
    disablePadding: false,
    label: 'State (CA origin)',
  },
  {
    id: 'country',
    numeric: true,
    disablePadding: false,
    label: 'Country (CA orgin)',
  },
  {
    id: 'created',
    numeric: true,
    disablePadding: false,
    label: 'Created On',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const EnhancedTableToolbar = (props) => {
  const { numSelected, selected, rows, setRows, setSelected, network } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [completedDeletion, setCompletedDeletion] = React.useState(false);
  const [pending, setPending] = React.useState(network.Status);

  const handleClose = () => {
      setCompletedDeletion(true);
      setOpenDialog(!openDialog);
  }
  const toggleNetwork = () => {
      setPending({code: 300, message: "Pending"});
      startNetwork(network.Name).then((res)=>{
        console.log(res.data.Status)
        setPending(res.data.Status);
      })
      .catch((e)=> console.log(e));
  }
  const deleteSelected = async () => {
    setCompletedDeletion(false);
    var temprows = rows.map((x) => x);
    await stopNetwork(network.Name).then(()=>{
      setPending({code: 300, message: "Pending"});
    })
    for (let k = 0; k < selected.length; k++) {
        const org = selected[k];
        let deleted = await deleteOrganization(network.Name, org);
        console.log(deleted);
            for (let i = 0; i < temprows.length; i++)
                if(org === temprows[i].objID){
                    temprows.splice(i, 1);
                    break;
                }        
    }
    setSelected([]);
    console.log(temprows);
    setRows(temprows.map((x)=>x));
    handleClose();
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        borderRadius: '12px 12px 0 0',
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
        <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
            sx: {
                bgcolor: 'primary.sectionContainer'
            }
          }}
      >
        <DialogTitle>{`Do you really want to delete selected hospital(s)?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Please be aware than you can recover these deleted hospital organizations. Fabric network will automatically stop before deleting the hospital organizations.
            Do you wish to go forward with this?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        {!completedDeletion?<CircularProgress sx={{mr: 2, mb: 2}}/>: <>
            <Button onClick={handleClose}>No</Button>
          <Button onClick={deleteSelected}>Yes</Button>
            </>}
        </DialogActions>
      </Dialog>

      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%', fontWeight: 'bold' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Hospitals Enrolled
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={()=> handleClose()}>
            <DeleteIcon sx={{color: 'text.primary'}}/>
          </IconButton>
        </Tooltip>
      ) : (
        <>
        <Tooltip title="Start/Stop Network">
          <span style={{minWidth: 'fit-content' }}>
          <LoadingButton
              variant="contained"
              color={pending.code===200?'success': pending.code===500? 'error': 'primary'}
              loading={pending.code===300}
              disabled={rows.length===0 || pending.code===300}
              sx={{fontWeight: 'bolder'}}
              onClick={toggleNetwork}
            >
             {pending.code === 300 && <Status state={setPending} />}
            {pending.message}
            </LoadingButton>
          </span>
        </Tooltip>
        <Tooltip title="Add Hospital">
           <IconButton
              variant="contained"
              sx={{ fontWeight: 'bolder', minWidth: 'fit-content', ml: 1 }}
            >
            <AddCircle sx={{color: 'text.primary', width: '30px', height: '30px'}}/>
            </IconButton>
        </Tooltip>
        </>
      )}
    </Toolbar>
  );
};

export default function EnhancedTable({nav, setNav}) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('fullName');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const {networkName} = useParams();
  const [network, setNetwork] = React.useState(false);
  const [rows, setrows] = React.useState([]);
  let networkExists = async () => {
    let res = await getNetworkExists(networkName);
    // console.log(res.data);
    if(res.data.network==undefined)
    {
        setNetwork(res.data);
        let columns = [];
        res.data.Organizations.map((org) => {
            let date = new Date(org.createdAt);
            columns.push(createData(
                org._id,
                org.FullName,
                org.Name,
                org.AdminID,
                org.State,
                org.Country,
                `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`
            ))
        })
        console.log(columns);
        setrows(columns);
    }
}
  React.useEffect(() => {
      networkExists();
  }, []);
  React.useEffect(()=>{
      console.log(selected);
  }, [selected]);
  React.useEffect(() => {
    setNav({...nav, networkName: networkName});
}, [setNav]);  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.objID);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, objID) => {
    const selectedIndex = selected.indexOf(objID);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, objID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0; 
  if(network===false) 
  return (
    <Alert variant="outlined" severity="error">
    The network with name '{networkName}' doesn't exists
  </Alert>) 
  else
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', mb: 2, p:2.5, borderRadius: '12px', bgcolor: 'primary.sectionContainer' }}>
        <EnhancedTableToolbar numSelected={selected.length} rows={rows} selected={selected} setRows={setrows} setSelected={setSelected} network={network}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.objID);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.objID)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.objID}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.id}</TableCell>
                      <TableCell align="right">{row.admin}</TableCell>
                      <TableCell align="right">{row.state}</TableCell>
                      <TableCell align="right">{row.country}</TableCell>
                      <TableCell align="right">{row.createAt}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {rows.length === 0 &&
                <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2.5, mb: 2.5}}>
                    <Avatar src={emptyTable} style={{height: '150px', width: '150px'}}/>
                    <Typography component='span' variant='h6' sx={{mt: 1.2}}>
                        <b>No Hospital Organizations Available yet</b>
                    </Typography>
                    <Typography component='small' sx={{color: 'text.secondary'}}>
                        Try creating a new hospital organization by clicking the plus sign above
                    </Typography>
                </Box>
              }
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}

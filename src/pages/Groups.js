import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Modal,
  Box,
  Grid,
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { GroupsListToolbar, GroupMoreMenu, CreateGroupForm, EditGroupForm, GroupListHead } from '../sections/@dashboard/groups';
import { EditContactForm, ContactListHead, ContactMoreMenu, CreateContactForm, ContactListToolbar, } from '../sections/@dashboard/contacts';

// client
import { getAllGroups, getAllUsers } from '../client';
import { getAllContacts } from './../client';
// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'owner', label: 'Owner', alignRight: false },
  { id: '', label: 'Action' },
];

const TABLE_HEAD_Contacts = [
  { id: 'id_user1', label: 'User 1', alignRight: false },
  { id: 'id_user2', label: 'User 2', alignRight: false },
  { id: '', label: 'Action' },
];



// ----------------------------------------------------------------------

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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (group) => group.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function applySortFilterContacts(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (contact) => contact.users1?.username.toLowerCase().indexOf(query.toLowerCase()) !== -1 || contact.users2?.username.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Groups() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [selectedContacts, setSelectedContacts] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(12);

  const [groups, setGroups] = useState([]);

  const [editRow, setEditRow] = useState({});

  const [open, setOpen] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openContact, setOpenContact] = useState(false);

  const [openEditContact, setOpenEditContact] = useState(false);

  const [contacts, setContacts] = useState([]);

  const [filterContacts, setFilterContacts] = useState('');

  const [contactsToDelete, setContactsToDelete] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    requestAllGroups();
    requestAllContacts();
  }, [])


  const requestAllGroups = () => {
    getAllGroups()
      .then(response => {
        response.data.includes('html') ? navigate('/', { replace: true }) : setGroups(response.data);
      })
      .catch(() => navigate('/', { replace: true }));
  }

  const requestAllContacts = () => {
    getAllContacts()
      .then(response => {
        response.data.includes('html') ? navigate('/', { replace: true }) : setContacts(response.data);
      })
      .catch(() => navigate('/', { replace: true }));
  }


  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleOpenEdit = () => setOpenEdit(true);

  const handleCloseEdit = () => setOpenEdit(false);


  const handleOpenContact = () => setOpenContact(true);

  const handleCloseContact = () => setOpenContact(false);

  const handleOpenEditContact = () => setOpenEditContact(true);

  const handleCloseEditContact = () => setOpenEditContact(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = groups?.map((n) => n.id)
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleClickContacts = (event, index, users1, users2) => {
    const selectedIndex = selectedContacts.indexOf(index);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedContacts, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selectedContacts.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedContacts.slice(0, selectedIndex), selectedContacts.slice(selectedIndex + 1));
    }
    setSelectedContacts(newSelected);
    if (contactsToDelete.includes(users1) && contactsToDelete.includes(users2))
      setContactsToDelete(current => current.filter(contact => contact !== users1 && contact !== users2));
    else
      setContactsToDelete(current => [...current, users1, users2]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleFilterContacts = (event) => {
    setFilterContacts(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - groups?.length) : 0;

  const filteredUsers = applySortFilter(groups, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers?.length === 0;

  const emptyRowsContacts = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contacts?.length) : 0;

  const filteredContacts = applySortFilterContacts(contacts, getComparator(order, orderBy), filterContacts);

  const isContactNotFound = filteredContacts?.length === 0;

  return (
    <Page title="Groups">
      <Container maxWidth="xxl" style={{ height: 1, marginTop: -50 }} >

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Groups / Contacts
          </Typography>
          <div>
            <Button variant="contained" component={RouterLink} to="#" style={{ paddingLeft: 30, paddingRight: 30 }} onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
              New Group
            </Button>
            <Button variant="contained" component={RouterLink} to="#" style={{ marginLeft: 20, paddingLeft: 30, paddingRight: 30 }} onClick={handleOpenContact} startIcon={<Iconify icon="eva:plus-fill" />}>
              New Contact
            </Button>
          </div>
        </Stack>

        <CreateGroupForm requestAllGroups={requestAllGroups} navigate={navigate} open={open} handleClose={handleClose} />
        <EditGroupForm open={openEdit} handleClose={handleCloseEdit} editRow={editRow} setGroups={setGroups} />

        <CreateContactForm requestAllContacts={requestAllContacts} navigate={navigate} open={openContact} handleClose={handleCloseContact} />
        <EditContactForm open={openEditContact} requestAllContacts={requestAllContacts} handleClose={handleCloseEditContact} editRow={editRow} setContacts={setContacts} />

        <Grid container spacing={3}>
          <Grid item sm={12} lg={12} xl={6}>
            <Card sx={{ width: 1 }}>
              <GroupsListToolbar setSelected={setSelected} selected={selected} navigate={navigate} setGroups={setGroups} filterName={filterName} onFilterName={handleFilterByName} />
              <Scrollbar>
                <TableContainer sx={{ height: '74vh' }}>
                  <Table>
                    <GroupListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={groups?.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { id, name, owner } = row;
                        const isItemSelected = selected.indexOf(id) !== -1;
                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                            </TableCell>
                            <TableCell align="left">{id}</TableCell>
                            <TableCell align="left">{name}</TableCell>
                            <TableCell align="left">{owner.username}</TableCell>
                            <TableCell align="left">
                              <GroupMoreMenu setGroups={setGroups} navigate={navigate} handleOpen={handleOpenEdit} row={row} setEditRow={setEditRow} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isUserNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[12, 35, 50]}
                component="div"
                count={groups?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>
          <Grid item lg={12} xl={6}>
            <Card sx={{ width: 1 }}>
              <ContactListToolbar setSelected={setSelectedContacts} selected={selectedContacts} setContacts={setContacts} contactsToDelete={contactsToDelete} setContactsToDelete={setContactsToDelete} navigate={navigate} filterName={filterContacts} onFilterName={handleFilterContacts} />
              <Scrollbar>
                <TableContainer sx={{ height: '74vh' }}>
                  <Table>
                    <ContactListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD_Contacts}
                      rowCount={groups?.length}
                      numSelected={selectedContacts.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredContacts?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                        const { id_user1: id, users1, users2 } = row;
                        const isItemSelected = selectedContacts.indexOf(index) !== -1;
                        return (
                          <TableRow
                            hover
                            key={index}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} onChange={(event) => handleClickContacts(event, index, users1.id, users2.id)} />
                            </TableCell>
                            <TableCell align="left">{users1.username}</TableCell>
                            <TableCell align="left">{users2.username}</TableCell>
                            <TableCell align="left">
                              <ContactMoreMenu setContacts={setContacts} navigate={navigate} handleOpen={handleOpenEditContact} row={row} setEditRow={setEditRow} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRowsContacts > 0 && (
                        <TableRow style={{ height: 53 * emptyRowsContacts }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isContactNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[12, 35, 50]}
                component="div"
                count={groups?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>
        </Grid>

      </Container>

    </Page>
  );
}

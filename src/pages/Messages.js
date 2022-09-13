import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
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
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { MessageListHead, MessageListToolbar, MessageMoreMenu, CreateMessageForm, EditMessageForm } from '../sections/@dashboard/messages';
// client
import { getAllMessages, getAllUsers } from '../client';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'sender', label: 'Sender', alignRight: false },
  { id: 'receiver', label: 'Receiver', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'message', label: 'Message', alignRight: false },
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
    return filter(array, (message) => message.receiver.username.toLowerCase().indexOf(query.toLowerCase()) !== -1 || message.sender.username.toLowerCase().indexOf(query.toLowerCase()) !== -1 );
  }
  return stabilizedThis.map((el) => el[0]);
}

const messages_mock = [
  {
    id: 1,
    sender: {
      username: "John"
    },
    receiver: {
      username: "Frank"
    },
    date: "2017-04-05",
    message: "Hello its me"
  }
]

export default function Messages() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [messages, setMessages] = useState([]);

  const [editRow, setEditRow] = useState({});

  const [open, setOpen] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    requestAllMessages();
  }, [])


  const requestAllMessages = () => {
    getAllMessages()
      .then(response => {
        response.data.includes('html') ? navigate('/', { replace: true }) : setMessages(response.data);
      })
      .catch(() => navigate('/', { replace: true }));
  }


  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleOpenEdit = () => setOpenEdit(true);

  const handleCloseEdit = () => setOpenEdit(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = messages?.map((n) => n.id)
      setSelected(newSelecteds);
      console.log(newSelecteds);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - messages?.length) : 0;

  const filteredUsers = applySortFilter(messages, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers?.length === 0;

  return (
    <Page title="User">
      <Container maxWidth="xxl" style={{ height: 1, marginTop: -50 }} >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Messages
          </Typography>
          <Button variant="contained" component={RouterLink} to="#" style={{ paddingLeft: 30, paddingRight: 30 }} onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Message
          </Button>
        </Stack>

        <CreateMessageForm requestAllMessages={requestAllMessages} navigate={navigate} open={open} handleClose={handleClose} />
        <EditMessageForm open={openEdit}  handleClose={handleCloseEdit} editRow={editRow} setMessages={setMessages} />
        <Card sx={{ width: 1 }}>
          <MessageListToolbar setSelected={setSelected} selected={selected} navigate={navigate} setUsersData={setMessages} filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, height: '74vh' }}>
              <Table>
                <MessageListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={messages?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, sender, receiver, date, message } = row;
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
                        <TableCell align="left">{sender.username}</TableCell>
                        <TableCell align="left">{receiver.username}</TableCell>
                        <TableCell align="left">{date}</TableCell>
                        <TableCell align="left">{message}</TableCell>
                        <TableCell align="left">
                          <MessageMoreMenu setMessages={setMessages} navigate={navigate} handleOpen={handleOpenEdit} row={row} setEditRow={setEditRow} />
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
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={messages?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

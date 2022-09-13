import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import { deleteUsers, deleteContacts } from 'src/client';

// ----------------------------------------------------------------------

export default function ContactMoreMenu({ handleOpen, row, setEditRow, navigate, setContacts }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClickEdit = () => {
    handleOpen();
    setEditRow(row);
    setIsOpen(false);
  }

  const handleDelete = () => {
    deleteContacts([row.id_user1, row.id_user2])
      .then((response) => {
        if (response.data.includes('html'))
          navigate('/', { replace: true });
          setContacts(contacts => contacts.filter(contact => contact != row));
          setIsOpen(false);
      })
      .catch((err) => {
        navigate('/', { replace: true });
      });
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDelete}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }} onClick={handleClickEdit}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}

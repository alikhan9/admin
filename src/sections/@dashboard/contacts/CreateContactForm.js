import * as Yup from 'yup';
import { useState, useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Modal, Box, TextField, MenuItem, FormControl, Select } from '@mui/material';

import { LoadingButton } from '@mui/lab';

// client
import { addContact, addGroup, getUsersUsernames, login } from '../../../client';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function CreateContactForm({ open, handleClose, navigate, requestAllContacts }) {

  const [errorMessage, setErrorMessage] = useState('nan');

  const [successMessage, setSuccessMessage] = useState('nan');

  const [users, setUsers] = useState('nan');

  const [userId, setUserId] = useState('');

  const [user2Id, setUser2Id] = useState('');

  const [error, setError] = useState(false);

  const [error2, setError2] = useState(false);



  useEffect(() => {
    getUsersUsernames()
      .then((users) => {
        if (users.data?.includes('html'))
          navigate('/', { replace: true });
        setUsers(users.data);
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.message);
      });
  }, [])

  const LoginSchema = Yup.object().shape({
  });

  const defaultValues = {
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (form) => {
    if (userId === "") {
      setError(true);
      return;
    }

    if (user2Id === "") {
      setError2(true);
      return;
    }

    const contact = {
      user1: userId,
      user2: user2Id
    }

    if (userId !== "" && error === true)
      setError(false);

    if (user2Id !== "" && error2 === true)
      setError2(false);

    addContact(contact).then(response => {
      if (response.data?.includes('html'))
        navigate('/', { replace: true });
      setErrorMessage('nan');
      setSuccessMessage('Contact created successfully!');
      methods.reset();
      requestAllContacts();
      setError(false);
      setError2(false);
    }).catch(error => {
      setSuccessMessage('nan');
      if (error.code === 'ERR_NETWORK')
        setErrorMessage('Network error');
      else
        setErrorMessage(error.response.data.message);
    });
  };

  const handleChange = (newValue) => {
    setValue(newValue);
  };


  const handleChangeUser = (event) => {
    setUserId(event.target.value);
  };

  const handleChangeUser2 = (event) => {
    setUser2Id(event.target.value);
  };

  const onClose = () => {
    setErrorMessage('nan');
    setSuccessMessage('nan');
    handleClose();
    methods.reset();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {errorMessage === 'nan' ? null : <TextField value={errorMessage} variant={"standard"} error />}
            {successMessage === 'nan' ? null : <TextField value={successMessage} variant={"standard"} color="success" focused />}
            <TextField
              error={error}
              value={userId}
              select
              label="User 1"
              onChange={handleChangeUser}
            >
              {users === 'nan' ? null : users?.map((user, index) => <MenuItem key={index} value={user.id}>{user.username}</MenuItem>
              )}
            </TextField>
            <TextField
              error={error2}
              value={user2Id}
              select
              label="User 2"
              onChange={handleChangeUser2}
            >
              {users === 'nan' ? null : users?.map((user, index) => <MenuItem key={index} value={user.id}>{user.username}</MenuItem>
              )}
            </TextField>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <LoadingButton fullWidth size="large" color="error" variant="contained" onClick={onClose}>
                Cancel
              </LoadingButton>
              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Create
              </LoadingButton>
            </Box>
          </Stack>
        </FormProvider>
      </Box>

    </Modal >
  );
}

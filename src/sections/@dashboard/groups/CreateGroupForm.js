import * as Yup from 'yup';
import { useState, useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Modal, Box, TextField, MenuItem, FormControl, Select } from '@mui/material';

import { LoadingButton } from '@mui/lab';

// client
import { addGroup, getUsersUsernames } from '../../../client';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function CreateUserForm({ open, handleClose, navigate, requestAllGroups }) {
  const [errorMessage, setErrorMessage] = useState('nan');
  const [successMessage, setSuccessMessage] = useState('nan');
  const [users, setUsers] = useState('nan');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(false);

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
    name: Yup.string().required('Name is required')
  });

  const defaultValues = {
    name: '',
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
    const group = {
      name: form.name,
      owner: userId
    }

    if(userId !== "" && error === true)
      setError(false);

    addGroup(group).then(response => {
      if (response.data?.includes('html'))
        navigate('/', { replace: true });
      setErrorMessage('nan');
      setSuccessMessage('Group created successfully!');
      methods.reset();
      requestAllGroups();
      setError(false);
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


  const handleChangeusers = (event) => {
    setUserId(event.target.value);
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
            <RHFTextField name="name" label="Name" />
            <TextField
              error={error}
              value={userId}
              select
              label="Owner"
              onChange={handleChangeusers}
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

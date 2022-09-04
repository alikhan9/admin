import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Modal, Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// client
import { addUser, login } from '../../../client';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import RHFDatePicker from '../../../components/hook-form/RHFDatePicker';

// ----------------------------------------------------------------------

export default function CreateUserForm({ open, handleClose, navigate, requestAllUsers }) {
  const [value, setValue] = useState(new Date());

  const [errorMessage, setErrorMessage] = useState('nan');
  const [successMessage, setSuccessMessage] = useState('nan');

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    dateofbirth: Yup.string().required('Date of birth is required').matches(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/, 'Please enter a valid date'),
  });

  const defaultValues = {
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
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
    addUser(form).then(response => {
      if (response.data?.includes('html'))
        navigate('/login', { replace: true });
      setErrorMessage('nan');
      setSuccessMessage('User created successfully!');
      methods.reset();
      requestAllUsers();
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
            <RHFTextField name="username" label="Username" />
            <RHFTextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" >
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <RHFTextField name="first_name" label="First name" />
            <RHFTextField name="last_name" label="Last name" />
            <RHFTextField name="email" label="Email" />
            <RHFDatePicker name="dateofbirth" label="Date of birth" />

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

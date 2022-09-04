import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Modal, Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

// client
import { addUser, login } from '../../../client';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function CreateUserForm({ open, handleClose, navigate, requestAllUsers }) {
  const [value, setValue] = useState(new Date());

  const [errorMessage, setErrorMessage] = useState('nan');
  const [successMessage, setSuccessMessage] = useState('nan');

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
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
            <RHFTextField name="name" label="Name" />
            {/* <ListItem style={style} key={index} component="div" disablePadding>
              <ListItemButton>
                <ListItemText primary={`Item ${index + 1}`} />
              </ListItemButton>
            </ListItem> */}

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

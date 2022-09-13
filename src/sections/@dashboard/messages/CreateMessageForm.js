import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Modal, Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// client
import { addMessage } from '../../../client';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function CreateMessageForm({ open, handleClose, navigate, requestAllMessages }) {
  const [value, setValue] = useState(new Date());

  const [errorMessage, setErrorMessage] = useState('nan');
  const [successMessage, setSuccessMessage] = useState('nan');


  const LoginSchema = Yup.object().shape({
    sender: Yup.string().required('Sender is required'),
    receiver: Yup.string().required('Receiver is required'),
    message: Yup.string().required('Message is required'),
  });

  const defaultValues = {
    sender: '',
    receiver: '',
    message: '',
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
    addMessage(form).then(response => {
      if (response.data?.includes('html'))
        navigate('/', { replace: true });
      setErrorMessage('nan');
      setSuccessMessage('Message created successfully!');
      methods.reset();
      requestAllMessages();
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
            <RHFTextField name="sender" label="Sender" />
            <RHFTextField name="receiver" label="Receiver" />
            <RHFTextField name="message" label="Message" />

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

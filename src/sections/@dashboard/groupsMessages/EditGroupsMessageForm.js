import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack ,Modal, Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// client
import { editGroupMessage } from './../../../client';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';


// ----------------------------------------------------------------------

export default function EditGroupsMessageForm({ open, handleClose, navigate, editRow, setGroupsMessages }) {
    const [value, setValue] = useState(new Date());

    const [errorMessage, setErrorMessage] = useState('nan');
    const [successMessage, setSuccessMessage] = useState('nan');

    const LoginSchema = Yup.object().shape({
        id: Yup.string(),
        sender: Yup.string().required('Sender is required'),
        receiver: Yup.string().required('Receiver is required'),
        date: Yup.string().required('Date name is required'),
        message: Yup.string().required('Message is required')
    });

    const defaultValues = {
        id: editRow.id,
        sender: editRow.sender?.username,
        receiver: editRow.receiver?.name,
        date: editRow.date,
        message: editRow.message,
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
        defaultValues
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (form) => {
        editGroupMessage(form).then(response => {
            if (response.data?.includes('html'))
                navigate('/', { replace: true });
            setErrorMessage('nan');
            setSuccessMessage('Message edited successfully!');
            setGroupsMessages(messages => messages.map(message => message.id == form.id ? form : message));
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
                        <RHFTextField name="id" label="Id" inputProps={{ readOnly: true, }} val={editRow.id} />
                        <RHFTextField name="sender" label="Sender" val={editRow.sender?.username} />
                        <RHFTextField name="receiver" label="Receiver" val={editRow.receiver?.name} />
                        <RHFTextField name="date"  label="Date" val={editRow.date} />
                        <RHFTextField name="message" label="Message" val={editRow.message} />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <LoadingButton fullWidth size="large" color="error" variant="contained" onClick={onClose}>
                                Cancel
                            </LoadingButton>
                            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                                Update
                            </LoadingButton>
                        </Box>
                    </Stack>
                </FormProvider>
            </Box>

        </Modal >
    );
}

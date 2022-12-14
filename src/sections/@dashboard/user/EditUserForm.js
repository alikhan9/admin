import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Modal, Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// client
import { editUser } from '../../../client';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import RHFDatePicker from '../../../components/hook-form/RHFDatePicker';

// ----------------------------------------------------------------------

export default function EditUserForm({ open, handleClose, navigate, editRow, setUsersData }) {
    const [value, setValue] = useState(new Date());

    const [errorMessage, setErrorMessage] = useState('nan');
    const [successMessage, setSuccessMessage] = useState('nan');

    const LoginSchema = Yup.object().shape({
        id: Yup.string(),
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Please enter a valid email address').required('Email is required'),
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        dateofbirth: Yup.string().required('Date of birth is required').matches(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/, 'Please enter a valid date'),
    });

    const defaultValues = {
        id: editRow.id,
        username: editRow.username,
        email: editRow.email,
        first_name: editRow.first_name,
        last_name: editRow.last_name,
        dateofbirth: editRow.dateofbirth
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
        editUser(form).then(response => {
            if (response.data?.includes('html'))
                navigate('/', { replace: true });
            setErrorMessage('nan');
            setSuccessMessage('User edited successfully!');
            setUsersData(users => users.map(user => user.id == form.id ? form : user));
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
                        <RHFTextField name="username" label="Username" val={editRow.username} />
                        <RHFTextField name="first_name" label="First name" val={editRow.first_name} />
                        <RHFTextField name="last_name"  label="Last name" val={editRow.last_name} />
                        <RHFTextField name="email" label="Email" val={editRow.email} />
                        <RHFDatePicker name="dateofbirth"  label="Date of birth" val={editRow.dateofbirth}/>

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

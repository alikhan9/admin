import { useEffect, useState } from 'react';
// @mui
import { Stack, Modal, Box, TextField, MenuItem, FormControl, InputLabel, NativeSelect } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// client
import { editContact, getUsersUsernames } from '../../../client';

// ----------------------------------------------------------------------

export default function EditContactForm({ open, handleClose, navigate, editRow, requestAllContacts }) {

    const [errorMessage, setErrorMessage] = useState('nan');

    const [successMessage, setSuccessMessage] = useState('nan');

    const [users, setUsers] = useState('nan');

    const [user2, setUser2] = useState();


    useEffect(() => {
        getUsersUsernames()
            .then((users) => {
                if (users.data?.includes('html'))
                    navigate('/', { replace: true });
                setUsers(users.data);
                setUser2(editRow.id_user2);
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.message);
            });
    }, [])

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

    const onSubmit = async (form) => {
        if (!user2)
            return;
        const contact = {
            "user1": editRow.id_user1,
            "user2": user2,
            "oldUser2": editRow.id_user2
        }

        editContact(contact).then(response => {
            if (response.data?.includes('html'))
                navigate('/', { replace: true });
            setErrorMessage('nan');
            setSuccessMessage('Contact updated successfully!');
            requestAllContacts();
        }).catch(error => {
            setSuccessMessage('nan');
            if (error.code === 'ERR_NETWORK')
                setErrorMessage('Network error');
            else
                setErrorMessage(error.response.data.message);
        });
    };


    const onClose = () => {
        setErrorMessage('nan');
        setSuccessMessage('nan');
        handleClose();
    }

    const handleChangeUser2 = (event) => {
        setUser2(event.target.value);
    };


    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Stack spacing={3}>
                    {errorMessage === 'nan' ? null : <TextField value={errorMessage} variant={"standard"} error />}
                    {successMessage === 'nan' ? null : <TextField value={successMessage} variant={"standard"} color="success" focused />}
                    <TextField
                        value={editRow.users1?.username}
                        InputProps={{ readOnly: true }}
                        label="User1"
                    >
                    </TextField>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            User2
                        </InputLabel>
                        <NativeSelect
                            defaultValue={user2}
                            onChange={handleChangeUser2}
                            inputProps={{
                                name: 'age',
                                id: 'uncontrolled-native',
                            }}
                        >
                            {users === 'nan' ? null : users?.map((u, index) => <option key={index} value={u.id}>{u.username}</option>
                            )}
                        </NativeSelect>
                    </FormControl>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <LoadingButton fullWidth size="large" color="error" variant="contained" onClick={onClose}>
                            Cancel
                        </LoadingButton>
                        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={onSubmit}>
                            Update
                        </LoadingButton>
                    </Box>
                </Stack>
            </Box>

        </Modal >
    );
}

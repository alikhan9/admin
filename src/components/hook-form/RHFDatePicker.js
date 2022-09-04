import * as Yup from 'yup';
import PropTypes from 'prop-types';
import moment from "moment";
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";



// ----------------------------------------------------------------------

RHFDatePicker.propTypes = {
    name: PropTypes.string,
};

export default function RHFDatePicker({ name, label, val, ...other }) {
    const { control } = useFormContext();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
                name={name}
                control={control}
                defaultValue={val}
                render={({
                    field: { onChange, value },
                    fieldState: { error }
                }) => (
                    <DatePicker
                        label={label}
                        mask="____-__-__"
                        inputFormat="yyyy-MM-dd"
                        disableFuture
                        value={value}
                        onChange={(value) =>{
                            onChange(moment(value).format().substring(0,10));   
                        }
                        }
                        renderInput={(params) => (

                            (
                                <TextField
                                    helperText={error?.message}
                                    id="dateofbirth"
                                    fullWidth
                                    autoComplete="bday"
                                    {...params}
                                    {...other}
                                    error={!!error}
                                />
                            )
                        )}
                    />
                )}
            />
        </LocalizationProvider>
    );
}

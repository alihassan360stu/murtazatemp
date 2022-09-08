import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';
import { AiOutlineMail, FaSlackHash } from 'react-icons/all'
const useStyles = makeStyles(theme => ({
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.common.dark, 0.12),
        }
    }
}));


const BasicForm = ({ state, busy, handleOnChangeTF }) => {
    const classes = useStyles();

    return (
        <div
            style={{ width: '100%' }}
        >
            <TextField
                type="text"
                label={'Name'}
                name="name"
                fullWidth
                onChange={handleOnChangeTF}
                value={state.name}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                disabled={busy}
            />
            <TextField
                type="text"
                label={'Description'}
                name="description"
                fullWidth
                onChange={handleOnChangeTF}
                value={state.description}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                disabled={busy}
            />
        </div >
    );
};

export default BasicForm;

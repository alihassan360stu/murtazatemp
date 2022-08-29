import React, { useState } from 'react';
import { TextField, MenuItem, InputAdornment, IconButton } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.common.dark, 0.12),
        }
    }
}));

const BasicForm = ({ state, busy, handleOnChangeTF }) => {

    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div>
            <TextField
                type="text"
                label={'Folder Name'}
                fullWidth
                name="name"
                value={state.name}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                onChange={handleOnChangeTF}
                disabled={busy}
            />
            <TextField
                type="text"
                label={'Description'}
                fullWidth
                name="description"
                value={state.description}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                onChange={handleOnChangeTF}
                disabled={busy}
            />
        </div >

    );
};

export default BasicForm;

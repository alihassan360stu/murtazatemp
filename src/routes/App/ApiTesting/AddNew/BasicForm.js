import React from 'react';
import { MenuItem, TextField } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.common.dark, 0.12),
        }
    }
}));

const BasicForm = ({ state, handleOnChangeTF, roles, busy }) => {
    const classes = useStyles();
    return (
        <div>
            <TextField
                type="email"
                label={'Emaill'}
                name="identifier"
                fullWidth
                onChange={handleOnChangeTF}
                value={state.identifier}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                disabled={busy}
            />
            <TextField
                type="text"
                label={'Select Role'}
                fullWidth
                select
                name="role_id"
                value={state.role_id}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                onChange={handleOnChangeTF}
                disabled={busy}
            >
                <MenuItem value={-1}>Not Selected</MenuItem>
                {roles && roles.map(item => {
                    return <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                })}
            </TextField>
        </div >

    );
};

export default BasicForm;

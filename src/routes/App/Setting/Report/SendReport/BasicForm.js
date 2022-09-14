import React from 'react';
import {TextField } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.common.dark, 0.12),
        }
    }
}));
const BasicForm = ({ state, handleOnChangeTF }) => {
    const classes = useStyles();
    return (
        <div>
            <TextField
                type="text"
                label={'Email Address'}
                name="email"
                fullWidth
                onChange={(e)=>{handleOnChangeTF({email:e.target.value})}}
                value={state.email}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}   
            />
        </div >

    );
};
export default BasicForm;
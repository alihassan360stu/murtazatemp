import React, { useState } from 'react';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
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
    const onchangeData = (e,a) => {
        var { name, value } = e.target;
        if (name === "notify") {
            value = a;
        }
        handleOnChangeTF({ ...state, [name]:value })
    }
    return (
        <div>
            <FormControlLabel checked={state.notify} control={<Checkbox />} label={'Notify On / Off'}
                onChange={onchangeData} name="notify"/>
            <br />
            <TextField
                type="text"
                label={'Email Address'}
                name="email"
                fullWidth
                onChange={onchangeData}
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

import React from 'react';
import { MenuItem, TextField } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';
import CodeEditor from '@uiw/react-textarea-code-editor';

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
                label={'User Name'}
                name="username"
                fullWidth
                onChange={handleOnChangeTF}
                value={state.username}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                disabled={state.is_loading}
            />
                 <TextField
                type="text"
                label={'Full Name'}
                name="full_name"
                fullWidth
                onChange={handleOnChangeTF}
                value={state.full_name}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                disabled={state.is_loading}
            />
            <TextField
                type="text"
                label={'Email'}
                fullWidth
                name="email"
                value={state.email}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                onChange={handleOnChangeTF}
                disabled={state.is_loading}
            />
                {/* <TextField
                type="password"
                label={'Password'}
                fullWidth
                name="password"
                value={state.password}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                onChange={handleOnChangeTF}
                disabled={state.is_loading}
            /> */}
                        <TextField
                type="text"
                label={'Accoyunt Type'}
                fullWidth
                select
                name="type"
                value={state.type}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                onChange={handleOnChangeTF}
                disabled={state.is_loading}
            >
            <MenuItem value={"Project Owner"}>Project Owner</MenuItem>
            <MenuItem value={"Tester"}>Tester</MenuItem>
            </TextField>
        </div >

    );
};

export default BasicForm;

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

const getPrefIcon = (pref) => {
    if (pref == 1) {
        return <AiOutlineMail />
    } else {
        return <FaSlackHash />
    }
}

const BasicForm = ({ state, busy, handleOnChangeTF }) => {
    const classes = useStyles();
    const notifyOnArr = [
        { name: "None", idx: 1 },
        { name: "On First Failure", idx: 3 },
        { name: "On Every Failure", idx: 2 },
        { name: "On Every Run", idx: 4 },
    ]

    const perfTypes = [
        { name: "Email", id: 1 },
        { name: "Slack", id: 2 },
    ]

    return (
        <div
            style={{ width: '100%' }}
        >
            <br />
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
            <br />
            <TextField
                id="outlined-select-currency"
                select
                label="Notify On"
                margin='normal'
                name='notify_on'
                fullWidth
                value={state.notify_on}
                onChange={handleOnChangeTF}
                variant="outlined" >
                {
                    notifyOnArr.map(item => (
                        <MenuItem key={item.idx} value={item.idx}>
                            {item.name}
                        </MenuItem>
                    ))
                }
            </TextField>
            <br />
            <TextField
                id="outlined-select-currency"
                select
                label="Preference"
                margin='normal'
                name='prefs'
                fullWidth
                value={state.prefs}
                onChange={handleOnChangeTF}
                variant="outlined" >
                {
                    perfTypes.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                            {getPrefIcon(item.id)}&nbsp;{item.name}
                        </MenuItem>
                    ))
                }
            </TextField>
            <br />
            {state.prefs == 1 &&
                <TextField
                    type="text"
                    label={'Comma Separated Emails'}
                    name="emails"
                    fullWidth
                    onChange={handleOnChangeTF}
                    value={state.emails}
                    margin="normal"
                    variant="outlined"
                    className={classes.textFieldRoot}
                    disabled={busy}
                />
            }
        </div >
    );
};

export default BasicForm;

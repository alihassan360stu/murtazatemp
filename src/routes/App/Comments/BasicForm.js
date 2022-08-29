import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.common.dark, 0.12),
        }
    }
}));


const BasicForm = ({ state, handleOnChangeTF, busy, type, setType, types }) => {

    const classes = useStyles();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
            <div>
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Comment Related To"
                    margin='normal'
                    fullWidth
                    disabled={busy}
                    value={type}
                    onChange={(e) => {
                        e.preventDefault();
                        let { value } = e.target;
                        setType(value)
                    }}
                    variant="outlined" >
                    {
                        types.map(role => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))
                    }
                </TextField>
            </div>
            <div>
                <TextField
                    type="text"
                    label={'Comment'}
                    name="description"
                    fullWidth
                    multiline
                    disabled={busy}
                    aria-multiline={'true'}
                    onChange={handleOnChangeTF}
                    value={state.description}
                    margin="normal"
                    variant="outlined"
                    required
                    className={classes.textFieldRoot}
                />
            </div>
            <div>
                <TextField
                    type="text"
                    label={'Link To Issue'}
                    fullWidth
                    name="link_to_issue"
                    value={state.link_to_issue}
                    margin="normal"
                    variant="outlined"
                    disabled={busy}
                    required
                    className={classes.textFieldRoot}
                    onChange={handleOnChangeTF}
                />
            </div>
        </div >
    );
};

export default BasicForm;

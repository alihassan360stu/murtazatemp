import React, { useEffect } from 'react';
import { RadioGroup, TextField, Divider, FormControl, OutlinedInput, InputLabel, MenuItem, Chip, FormControlLabel, Radio, Box, Fab, Checkbox, Select } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';
import TimezoneSelect from "react-timezone-select";

import { useState } from 'react';
// const moment = require('moment'); //moment-timezone

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const useStyles = makeStyles(theme => ({
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.common.dark, 0.12),
        }
    }
}));


const screens = [
    { title: 'iPhone 5', id: 1, value: 1 },
    { title: 'iPhone 6', id: 2, value: 2 },
    { title: 'iPhone 7', id: 3, value: 3 },
    { title: 'iPhone 8', id: 4, value: 4 },
    { title: 'iPhone X', id: 5, value: 5 },
    { title: 'Samsung Galaxy S6', id: 6, value: 6 },
    { title: 'Samsung Galaxy S7', id: 7, value: 7 },
    { title: 'Samsung Galaxy S7 Edge', id: 8, value: 8 },
    { title: 'Samsung Galaxy S8', id: 9, value: 9 },
    { title: 'Samsung Galaxy S9', id: 10, value: 10 },
    { title: 'Samsung Galaxy S10', id: 11, value: 11 },
    { title: 'Samsung Galaxy S20', id: 12, value: 12 },
    { title: 'Samsung Galaxy S21', id: 13, value: 13 },
    { title: 'Samsung Galaxy S22 Ultra', id: 14, value: 14 },
    { title: 'Google Pixel', id: 15, value: 15 },
    { title: 'Google Pixel 4', id: 16, value: 16 },
    { title: 'Google Pixel 5', id: 17, value: 17 },
    { title: 'Google Pixel 6', id: 18, value: 18 },
    { title: 'Google Pixel 6 Pro', id: 19, value: 19 },
]

const monitorOptions = [
    { title: 'Every 15 Seconds', value: (((1 / 60) / 60) * 15), id: 0 },
    { title: 'Every 30 Seconds', value: (((1 / 60) / 60) * 30), id: 1 },
    { title: 'Every 15 Minutes', value: ((1 / 60) * 15), id: 2 },
    { title: 'Every 30 Minutes', value: ((1 / 60) * 30), id: 3 },
    { title: 'Every Hour', value: 1, id: 4 },
    { title: 'Every 5 Hour', value: 5, id: 5 },
    { title: 'Every 10 Hour', value: 10, id: 6 },
]

const getBrowser = (browser) => {
    if (browser == 'chrome') {
        return (<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={'/images/chrome.svg'} height={20} />
            &nbsp;
            <h6> Chrome </h6>
        </div>)
    }

    if (browser == 'firefox') {
        return (<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {/* <FaFirefox size={50} color={'green'} /> */}
            <img src={'/images/firefox.svg'} height={20} />
            &nbsp;
            <h6> FireFox </h6>
        </div>)
    }

    if (browser == 'edge') {
        return (<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <img src={'/images/edge.svg'} height={20} />
            &nbsp;
            <h6> Edge </h6>
        </div>)
    }
}

const BasicForm = ({
    state,
    busy,
    setBusy,
    handleOnChangeTF,
    days,
    setDays,
    browsers,
    setBrowsers,
    setHours }) => {
    const classes = useStyles();
    const [daysArr, setDaysArr] = useState([])
    const [monitor, setMonitor] = useState(4)
    const [cbsArr, setCbsArr] = useState([])
    const [personName, setPersonName] = useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        );

    };

    const getDayTitle = (idx) => {
        let title = '';
        switch (idx) {
            case 0:
                title = 'S'
                break;
            case 1:
                title = 'M'
                break;
            case 2:
                title = 'T'
                break;
            case 3:
                title = 'W'
                break;
            case 4:
                title = 'T'
                break;
            case 5:
                title = 'F'
                break;
            case 6:
                title = 'S'
                break;
            default:
                break;
        }
        return title;
    }

    const setDaysLocal = () => {
        let tempArr = []
        for (let x = 0; x < 6; x++) {
            tempArr.push(
                <div
                    style={{ 'flex': 1 }}
                >
                    <Fab color={days[x] ? 'primary' : 'default'} size='small'
                        disabled={busy}
                        onClick={(e) => {
                            e.preventDefault();
                            let tempDays = days;
                            tempDays[x] = !tempDays[x];
                            setDays(tempDays);
                            setTimeout(() => {
                                setDaysLocal();
                            }, 50);
                        }}
                    >
                        {getDayTitle(x)}
                    </Fab>
                </div>

            )
        }
        setDaysArr(tempArr);
    }

    const setCBSARRAY = () => {
        let tempArr = [];
        tempArr.push(<FormControlLabel checked={browsers[0]} disabled={busy} value={0} control={<Checkbox />} label={getBrowser('chrome')} onChange={onChangeCB} />)
        tempArr.push(<FormControlLabel checked={browsers[1]} disabled={busy} value={1} control={<Checkbox />} label={getBrowser('edge')} onChange={onChangeCB} />)
        tempArr.push(<FormControlLabel checked={browsers[2]} disabled={busy} value={2} control={<Checkbox />} label={getBrowser('firefox')} onChange={onChangeCB} />)
        setCbsArr(tempArr);
    }

    useEffect(() => {
        setDaysLocal();
        setCBSARRAY();
        setBusy(false)
    }, [days, setDays, browsers, setBrowsers, busy])

    const onChangeCB = (e) => {
        let { value, checked } = e.target
        let tempBrowsers = browsers;
        tempBrowsers[value] = Boolean(checked);
        setBusy(true)
        setBrowsers(tempBrowsers)
    }

    return (
        <div
            style={{ width: '100%' }}
        >
            <br />
            <h4>Adjust Your Time Schedule</h4>
            <br />
            <Divider />
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={state.schedule_type}
                onChange={handleOnChangeTF}
                style={{ width: '100%' }}
            >
                <Box display={'flex'} style={{ width: '100%' }} justifyContent={'center'}>
                    <FormControlLabel disabled={busy} value="1" name="schedule_type" checked={state.schedule_type == 1} control={<Radio />} label="Nightly Run" />
                    <FormControlLabel disabled={busy} value="2" name="schedule_type" checked={state.schedule_type == 2} control={<Radio />} label="Monitor" />
                </Box>
            </RadioGroup>
            <Divider />
            <br />

            {state.schedule_type == 2 &&
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Select Monitor Duration"
                    margin='normal'
                    fullWidth
                    value={monitor}
                    onChange={(e) => {
                        e.preventDefault();
                        let { value } = e.target;
                        setMonitor(value)
                        setHours(monitorOptions[value].value)
                    }}
                    variant="outlined" >
                    {
                        monitorOptions.map(item => (
                            <MenuItem key={item.id} value={item.id}>
                                {item.title}
                            </MenuItem>
                        ))
                    }
                </TextField>
            }

            {state.schedule_type == 1 &&
                <div>
                    <br />
                    <h4>Select Timezone</h4>
                    <TimezoneSelect
                        value={state.timezone}
                        // defaultValue={}
                        isDisabled={busy}
                        onChange={(e) => {
                            let data = {};
                            data.preventDefault = () => { };
                            data.target = {};
                            data.target.name = "timezone";
                            if (e && e.value) {
                                data.target.value = e.value
                                handleOnChangeTF(data);
                            }
                        }}
                    />
                </div>
            }
            {state.schedule_type == 1 &&
                <div>
                    <br />
                    <h4>Frequency</h4>
                    <br />
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        {daysArr}
                    </div>
                </div>
            }
            <br />
            <Divider />
            <br />
            <div>
                <h4>Select Browsers</h4>
                {cbsArr}
            </div>
            <br />
            <Divider />
            <br />
            <h4>Select Additional Devices</h4>
            <FormControl fullWidth>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((item) => (
                                <Chip key={item} label={item} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {screens.map((item) => (
                        <MenuItem
                            key={item.id}
                            value={item.title}
                        >
                            {item.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <br />

            <Divider />
            <br />
        </div >
    );
};

export default BasicForm;

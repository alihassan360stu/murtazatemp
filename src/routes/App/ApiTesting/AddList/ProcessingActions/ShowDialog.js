import React, { useState } from 'react'
import {
    Box, Typography, Button, Dialog, DialogTitle, DialogActions, DialogContent,
    DialogContentText, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel,
    Radio, Divider, MenuItem, Tab, Tabs, Fab, TextareaAutosize
} from '@mui/material'
import { chengeTextFieldBehavier } from "../Constant/Constant"
import { selectorChangeDefault } from "../Constant/Constant"
import { tabChangeDefault } from "../Constant/Constant"
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const getRequest = [
    { value: 0, label: "GET" },
    { value: 1, label: "PUT" },
    { value: 2, label: "POST" },
    { value: 3, label: "DELETE" },
    { value: 4, label: "PATCH" },
    { value: 5, label: "OPTION" },
    { value: 6, label: "TRACE" },
    { value: 7, label: "CONNECT" },
    { value: 8, label: "HEAD" },
    { value: 9, label: "ANY" },
]
function ShowDialog({hideDialog,dialogValue}) {
    const [radioValue, setRadioValue] = useState("")
    const [methodValue, setMethodValue] = useState(0)
    const [tabValues, setTabValues] = useState(0);
    const [header, setHeader] = React.useState([])
    const [queryParameter, setQueryParameter] = React.useState([])


    const radioControll = (e) => {
        setRadioValue(e.target.value)
    }

    return <Dialog maxWidth={"sm"} fullWidth={"sm"} open={dialogValue} onClose={() => { hideDialog(false) }}>
        <DialogTitle sx={{ fontSize: "0.8rem" }}>Webhook Definition</DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ fontSize: "0.8rem" }}>
                Define a webhook that the Mock Service will send as asynchronous request later.
                The webhook is scheduled, when the transaction matches. You can use dynamic parameters and
                data parameters in the webhook callback definition.
            </DialogContentText>

            <TextField label="Name" name="name" fullWidth sx={{ mt: "3vh", mb: "3vh", ...chengeTextFieldBehavier }} />
            <FormControl>
                <FormLabel sx={{ fontSize: "0.8rem" }} id="demo-controlled-radio-buttons-group">Trigger After</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    onChange={radioControll}
                >
                    <FormControlLabel value="specific" control={<Radio />} label="Specific Delay" />
                    {radioValue === "specific" && <TextField type="number" label="MS" sx={{ width: "sm", mt: "2vh", mb: "2vh", ...chengeTextFieldBehavier }} />}
                    <FormControlLabel value="Random" control={<Radio />} label="Random Delay Between" />
                    {radioValue === "Random" && <Box mt="2vh" mb="2vh" display="flex">
                        <Box display="flex" flexDirection="column" mr="2vw">
                            <TextField type="number" label="Mili S" sx={{ mr: "2vw", width: "sm", ...chengeTextFieldBehavier }} />
                            <Typography variant='body1' sx={{ fontSize: "0.6rem" }}>Lower Time</Typography>
                        </Box>
                        <Box display="flex" flexDirection="column">
                            <TextField type="number" label="Mili S" sx={{ mr: "2vw", width: "sm", ...chengeTextFieldBehavier }} />
                            <Typography variant='body1' sx={{ fontSize: "0.6rem" }}>Upper Time</Typography>
                        </Box>
                    </Box>}
                </RadioGroup>
            </FormControl>
            <Divider />
            <Box width="sm">
                <TextField select onChange={(e) => { setMethodValue(e.target.value) }} name="equals" value={methodValue}
                    sx={{ mt: "3vh", mb: "3vh", width: "19%", ...selectorChangeDefault }}>
                    {
                        getRequest.map((values, index) => {
                            return <MenuItem value={values.value} key={index}>
                                {values.label}
                            </MenuItem>
                        })
                    }
                </TextField>
                <TextField label="Callback URL" name="name" sx={{ width: "80%", mt: "3vh", ...chengeTextFieldBehavier }} />
            </Box>
            <Tabs value={tabValues} sx={{ ...tabChangeDefault }} onChange={(e, valu) => {
                setTabValues(valu)
            }}>
                <Tab label={`Query Parameters (${queryParameter.length}))`} />
                <Tab label={`Headers (${header.length})`} />
                <Tab label={`Body `} />
            </Tabs>
            <Divider />
            {
                tabValues === 0 && <MakeTabPanel usestate={setQueryParameter} data={queryParameter} tabValue={0} />
            }
            {
                tabValues === 1 && <MakeTabPanel usestate={setHeader} data={header} tabValue={1} />
            }

            {
                tabValues === 2 && <Box mt="2vh">
                    <Typography variant='body1' sx={{ fontSize: "0.8rem" }}>
                        Callback Body
                    </Typography>
                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={4}
                        placeholder="Body Content"
                        style={{ width: "100%", marginTop: "3vh" }}
                    />
                </Box>
            }

        </DialogContent>
        <DialogActions>
            <Button variant="contained" size='small'>Save</Button>
            <Button sx={{ mr: "5%" }} variant="contained" size='small' onClick={() => { hideDialog(false) }}>Cancel</Button>
        </DialogActions>
    </Dialog>
}
export default ShowDialog;



const MakeTabPanel = ({ usestate, data, tabValue }) => {
    return <>
        <Typography variant='body1' sx={{ mt: "3vh", ml: "1%", fontSize: "0.8rem" }}>
            {tabValue === 0 && "The following query parameters will be added to the HTTP request triggered by the webhook"}
            {tabValue === 1 && "The following headers will be added to the HTTP request triggered by the webhook."}
        </Typography>

        { // tabs  ( 0 , 1 ,and 2)
            data.length === 0 ? <Fab size="small" color="primary" sx={{
                mt: "3vh", ml: "1%", mb: "3vh"
            }}
                onClick={() => { usestate([Math.random() * 1000000000]) }}>
                <AddIcon style={{ color: "white" }} />
            </Fab>
                :
                data.length !== 0 && data.map((machingId, index) => {
                    return <Box display={"flex"} ml="0.5%" mt="3vh" mb="2vh">
                        <Box>
                            <TextField label={"Name"} name="name" sx={{ mr: "2%", width: "45%", ...chengeTextFieldBehavier }} />
                            <TextField label={"Value"} name="value" sx={{ width: "45%", ...chengeTextFieldBehavier }} />
                        </Box>
                        <Box display="flex" mt={"-.7vh"}>
                            <Fab size="small" color="error" onClick={() => {
                                let temp = data.filter((hitId) => {
                                    return hitId !== machingId
                                })
                                usestate(temp)
                            }}>
                                <DeleteIcon style={{ color: "white" }} />
                            </Fab>
                            {
                                index === data.length - 1 &&
                                <Fab sx={{ ml: "4%" }} size="small" color="primary" aria-label="add" onClick={() => { usestate([...data, [Math.random() * 1000000000]]) }}>
                                    <AddIcon style={{ color: "white" }} />
                                </Fab>
                            }
                        </Box>
                    </Box>
                })
        }
    </>
    // comparison
}

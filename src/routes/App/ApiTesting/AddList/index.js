import {
    Button, TextField, 
    Typography ,Box, styled, MenuItem, Tabs, Tab
} from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ProcessAction from './ProcessingActions';
import Request from "./RequestMatcher";
import Responce from './Responce';
import { chengeTextFieldBehavier } from "./Constant/Constant";
import { tabChangeDefault } from "./Constant/Constant"
import CloseIcon from '@material-ui/icons/Close';
import { selectorChangeDefault } from "./Constant/Constant"

const BoxWraper = styled('Box')({
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "5vh",
});


const Services = [
    { value: 0, label: "Default Services" },
    { value: 1, label: "AWS S3 Sample" },
    { value: 2, label: "FaceBook Login Sample" },
    { value: 3, label: "Open Banking Sample" },
    { value: 4, label: "Salesforce Login Sample" },
]

const tags = [
    { value: 0, label: "Define Tags.." },
    { value: 1, label: "Account" },
    { value: 2, label: "Auth" },
    { value: 3, label: "Balance" },
    { value: 4, label: "Bank" },
    { value: 5, label: "Loan" },
    { value: 6, label: "Negative" },
    { value: 7, label: "Positive" },
    { value: 8, label: "Security" },
    { value: 9, label: "Transactions" },
    { value: 10, label: "V1" },
    { value: 11, label: "V2" },
    { value: 12, label: "V3" },
]
const AddList = ({hideDialog}) => {
    const theme = useTheme();
    const [tabValue, setTabValue] = React.useState(0)
    const [addList, setAddList] = React.useState({
        name: "",
        services: 0,
        tags: "",
        description: ""
    })

    const onChangeValue = (event) => {
        let { name, value } = event.target;
        setAddList({ ...addList, [name]: value });
    }
    const tabOpen = (event, value) => {

        setTabValue(value)

    }
    return (
        <Box width="100%" p="2vh 2%" boxSizing="border-box" boxShadow={1} display="flex" flexDirection="column" bgcolor={"white"}>
            <Box position="relative">
                <Typography>
                    Add List
                </Typography>
                <span style={{ position: "absolute", right: "2%", top: "2vh" }}>
                    <CloseIcon style={{ color: "red", cursor: "pointer" }}  onClick={() => { hideDialog(false) }}  />
                </span>
            </Box>


            <Box display="flex" flexDirection="column">
                <BoxWraper>
                    <TextField value={addList.name} sx={{ width: "31%", ...chengeTextFieldBehavier }}
                        label="Name" name="name" onChange={onChangeValue} />
                    <Box m={"0px 4%"} width={"31%"}><Typography sx={{ fontSize: "0.8rem" }} vraiant="h6">Created by ...</Typography></Box>
                    <Box width={"31%"}><Typography sx={{ fontSize: "0.8rem" }} vraiant="h6">Updated by ...</Typography></Box>
                </BoxWraper>
                <BoxWraper>
                    <TextField value={addList.services} name="services" onChange={onChangeValue} select sx={{ width: "31%", ...selectorChangeDefault }} label="Services" >
                        {
                            Services.map((values, index) => {
                                return <MenuItem key={index} value={values.value}>
                                    {values.label}
                                </MenuItem>
                            })
                        }
                    </TextField>
                    <TextField value={addList.tags} name="tags" onChange={onChangeValue} select sx={{ width: "31%", margin: "0px 4%", ...selectorChangeDefault }} label="Tags" >
                        {
                            tags.map((values, index) => {
                                return <MenuItem key={index} value={values.value} disabled={values.value === 0}>
                                    {values.label}
                                </MenuItem>
                            })
                        }
                    </TextField>
                    <TextField value={addList.description} sx={{ width: "31%", ...chengeTextFieldBehavier }} label="Description" name="description" onChange={onChangeValue} />
                </BoxWraper>
                <BoxWraper sx={{ justifyContent: "flex-start" }}>
                    <Tabs sx={{ ...tabChangeDefault }} value={tabValue} onChange={tabOpen}>
                        <Tab label="Request Matcher" />
                        <Tab label="Responce" />
                        <Tab label="Processing Actions" />

                    </Tabs>


                </BoxWraper>
                {
                    tabValue === 0 && <Request />
                }
                {
                    tabValue === 1 && <Responce />
                }
                {
                    tabValue === 2 && <ProcessAction />
                }
            </Box>

            <Box mt="5vh" mb="3vh">
                <Button sx={{ mr: "2%" }} type='button' variant="contained" color="primary">
                    Add
                </Button>
                <Button type='button' variant="contained" color="primary"  onClick={() => { hideDialog(false) }} >
                    Cancel
                </Button>
            </Box>

        </Box>

    )
}
export default AddList;
import React from 'react'
import {
  Box, Typography, TextField, MenuItem, Tabs, Tab,
  FormControlLabel, Checkbox, TextareaAutosize, FormControl, FormLabel,
  RadioGroup, Radio,Fab
} from '@mui/material'
import { chengeTextFieldBehavier } from "../Constant/Constant"
import { selectorChangeDefault } from "../Constant/Constant"
import { tabChangeDefault } from "../Constant/Constant"
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
const tags = [
  { value: 0, label: "100 - Continues" },
  { value: 1, label: "101 - Switching Protocols" },
  { value: 2, label: "102 - Processing" },
  { value: 3, label: "200 - Ok" },
  { value: 4, label: "201 - Created" },
  { value: 5, label: "202 - Accepted" },
  { value: 6, label: "203 - Not Authoritative Information" },
  { value: 7, label: "204 - Non Content" },
  { value: 8, label: "205 - Reset Content" },
  { value: 9, label: "206 - Partial Content" },
  { value: 10, label: "207 - Multi Status" },
  { value: 11, label: "208 - Already Reported" },
  { value: 12, label: "226 - IM Used" },
  { value: 13, label: "300 - Multiple Choices" },
  { value: 14, label: "301 - Moved Permanently" },
  { value: 15, label: "302 - Found" },
  { value: 16, label: "303 - See Other" },
  { value: 17, label: "304 - Not Modified" },
  { value: 18, label: "305 - Use Proxy" },
  { value: 19, label: "307 - Temporay Redirect" },
  { value: 20, label: "308 - Permanent Redirect" },
  { value: 21, label: "400 - Bad Request" },
  { value: 22, label: "401 - Unauthorized" },
  { value: 23, label: "402 - Payment Required" },
  { value: 24, label: "403 - Forbidden" },
  { value: 25, label: "404 - Not Fount" },
  { value: 26, label: "405 -  Methid Not Allowed" },
  { value: 27, label: "406 - Not Acceptable" },
  { value: 28, label: "407 - Proxy Authentication Required" },
  { value: 29, label: "408 - Request Timeout" },
  { value: 30, label: "409 - Conflict" },
  { value: 31, label: "410 - Gone" },
  { value: 32, label: "411 - Length Required" },
  { value: 33, label: "412 - Precondition Failed" },
  { value: 34, label: "413 - Paylod Too large" },
  { value: 35, label: "414 - URL Too Long" },
  { value: 36, label: "415 - Unsuported Media Type" },
  { value: 37, label: "416 - Tange Not Satisfiable" },
  { value: 38, label: "417 - Expectation Field" },
  { value: 40, label: "418 - Im A Teapot" },
  { value: 41, label: "421 - Misdirected Report" },
  { value: 42, label: "422 - Unprocessible Entity" },
  { value: 43, label: "423 - Locked" },
  { value: 44, label: "424 - Field Dependency" },
  { value: 45, label: "425 - Unorderd Condition" },
  { value: 46, label: "428 - Precondition Required" },
  { value: 47, label: "429 - Too Many Request" },
]
const Responce = () => {
  const [tabValue, setTabValue] = React.useState(0)
  const [headerResponce, setHeaderResponce] = React.useState([])
  const [checkBoxValue, setCheckBoxValue] = React.useState("")
  const [proxyUrl, setProxyUrl] = React.useState("")
  const [radioContral, setRadioContral] = React.useState("")
  const checkbox = (e) => {
    setCheckBoxValue(e.target.value)
  }
  return (
    <Box width={"100%"} pt="2vh" boxShadow={1} boxSizing="border-box">
      <Typography variant='body1' sx={{ ml: "1%", mt: "2vh", fontSize: "0.8rem" }}>
        Use data parameters from Service data model in request matchers and response content. You can also use dynamic parameters in your response
      </Typography>
      <TextField label="Status Code" select name="status" sx={{ mt: "4vh", ml: "1%", width: "35%", ...selectorChangeDefault }}>
        {
          tags.map((values, index) => {
            return <MenuItem key={index} value={values.value}>
              {values.label}
            </MenuItem>
          })
        }
      </TextField>
      <Tabs value={tabValue} sx={{ mt: "2vh", ...tabChangeDefault }} onChange={(e, valu) => {
        setTabValue(valu)
      }}>
        <Tab label={`Body`} />
        <Tab label={`Responce Header (${headerResponce.length})`} />
        <Tab label={`Proxy URL  (${proxyUrl !== "" ? "Defined" : "Not Defined"})`} />
        <Tab label={`Think Time`} />
      </Tabs>
      <Box width="100%" borderTop={"0.5px solid gray"} pt={2}>
        {
          tabValue === 0 && <>
            <FormControlLabel
              value="raw"
              checked={checkBoxValue === "raw"}
              control={<Checkbox />}
              label="Raw"
              labelPlacement="start"
              name='raw'
              onChange={checkbox}
            />
            <FormControlLabel sx={{ fontSize: "0.8rem" }}
              value="binary"
              checked={checkBoxValue === "binary"}
              control={<Checkbox />}
              label="Binary"
              labelPlacement="start"
              name='binary'
              onChange={checkbox}
            />
            <Box width="97%" m="0px auto" mt="3vh">
              <TextareaAutosize
                aria-label="minimum height"
                minRows={30}
                placeholder="Body Content"
                style={{ width: "100%", fontSize: "0.8rem" }}
              />
            </Box>

          </>
        }
        {tabValue === 1 && <>
          <Typography variant='body1' sx={{ ml: "1%", fontSize: "0.8rem" }}>
            There are no Response Headers defined.
          </Typography>
          {headerResponce.length === 0 ? <Fab size="small" color="primary" sx={{  mt: "3vh", ml: "1%", mb: "3vh" }}
            onClick={() => { setHeaderResponce([Math.random() * 1000000000]) }}>
            <AddIcon style={{ color: "white" }} />
          </Fab> :
            headerResponce.length !== 0 && headerResponce.map((machingId, index) => {
              return <Box width="100%" display={"flex"} ml="0.5%" mt="2vh" mb="2vh">
                <Box width="60%">
                  <TextField label="Name" name="name" sx={{ width: "40%", ...chengeTextFieldBehavier }} />
                  <TextField label="Value" name="value" sx={{ width: "40%", ...chengeTextFieldBehavier, m: "0px 2%" }} />
                </Box>
                <Box width="10%" mr="10%" display="flex">
                  <Fab size="small" color="error" sx={{ mr: "10%" }} onClick={() => {
                    let temp = headerResponce.filter((hitId) => {
                      return hitId !== machingId
                    })
                    setHeaderResponce(temp)
                  }}>
                    <DeleteIcon style={{ color: "white" }} />
                  </Fab>
                  {
                    index === headerResponce.length - 1 &&
                    <Fab size="small" color="primary" onClick={() => { setHeaderResponce([...headerResponce, [Math.random() * 1000000000]]) }}>
                      <AddIcon style={{ color: "white" }} />
                    </Fab>
                  }
                </Box>
              </Box>
            })
          }
        </>}
        {
          tabValue === 2 && <>
            <Typography variant='body1' sx={{ ml: "1%", fontSize: "0.8rem" }}>
              Enter Proxy URL
            </Typography>
            <Box width={"100%"} mt='2vh' mb="5vh" ml="1%">
              <TextField label={"Proxy URL"} name="value" value={proxyUrl} sx={{ width: "40%", ...chengeTextFieldBehavier }} onChange={(e) => { setProxyUrl(e.target.value) }} />
            </Box>

          </>
        }
        {
          tabValue === 3 && <>
            <Box mt="3vh" ml="1%" mb="3vh">
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Think Time</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                  onChange={(e) => { setRadioContral(e.target.value) }}
                >
                  <FormControlLabel sx={{ "& .MuiFormControlLabel-root": { fontSize: "0.8rem" } }} name='not' value="not" control={<Radio />} label="Don't Use Transaction Delay" />
                  <FormControlLabel name="fixed" value="fixed" control={<Radio />} label="Fixed Delay" />
                  {radioContral === "fixed" && <TextField label="MS" name="name" type="number"
                    sx={{ m: "2vh 0px", width: "100%", ...chengeTextFieldBehavier }} />}
                  <FormControlLabel name="uniform" value="uniform" control={<Radio />} label="Random Uniform Delay" />
                  {radioContral === "uniform" && <>
                    <Box width={"100%"} display="flex" justifyContent={"space-evenly"}>
                      <TextField label="MS" name="name" type="number"
                        sx={{ m: "2vh 0px", mr: "5%", width: "70%", ...chengeTextFieldBehavier }} />
                      <TextField label="MS" name="name" type="number"
                        sx={{ m: "2vh 0px", width: "70%", ...chengeTextFieldBehavier }} />
                    </Box>
                  </>}
                  <FormControlLabel name="lognormal" value="lognormal" control={<Radio />} label="Random Lognormal Delay" />
                  {radioContral === "lognormal" && <Box width={"100%"} display="flex" justifyContent={"space-evenly"}>
                    <TextField label="MS" name="name" type="number"
                      sx={{ m: "2vh 0px", mr: "5%", width: "70%", ...chengeTextFieldBehavier }} />
                    <TextField label="MS" name="name" type="number"
                      sx={{ m: "2vh 0px", width: "70%", ...chengeTextFieldBehavier }} />
                  </Box>}
                </RadioGroup>
              </FormControl>
            </Box>

          </>
        }

      </Box>
    </Box>

  )
}
// setHeaderResponce

export default Responce
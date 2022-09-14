import React from 'react'
import {
  Box, Typography, TextField, MenuItem, Tabs, Tab,
  FormControlLabel, Checkbox, TextareaAutosize, FormControl, FormLabel,
  RadioGroup, Radio, Fab
} from '@mui/material'
import { chengeTextFieldBehavier } from "../Constant/Constant"
import { selectorChangeDefault } from "../Constant/Constant"
import { tabChangeDefault } from "../Constant/Constant"
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
const tags =
  [
    { value: 0, Label: "100-Continue" },
    { value: 1, Label: "101-Switching Protocols" },
    { value: 2, Label: "102-Processing" },
    { value: 3, Label: "200-Ok" },
    { value: 4, Label: "201-Created" },
    { value: 5, Label: "202-Accepted" },
    { value: 6, Label: "203-Non-Authoritative Information" },
    { value: 7, Label: "204-No Content" },
    { value: 8, Label: "205-Reset Content" },
    { value: 9, Label: "206-Partial Content" },
    { value: 10, Label: "207-Multi-Status" },
    { value: 11, Label: "208-Already Reported" },
    { value: 12, Label: "226-IM Used" },
    { value: 13, Label: "300-Multiple Choices" },
    { value: 14, Label: "301-Multiple Permanently" },
    { value: 15, Label: "302-Found" },
    { value: 16, Label: "303-See Other" },
    { value: 17, Label: "304-Not Modified" },
    { value: 18, Label: "305-Use Proxy" },
    { value: 19, Label: "307-Tempory Redirect" },
    { value: 20, Label: "308-Permanent Redirect" },
    { value: 21, Label: "400-Bad Request" },
    { value: 22, Label: "401-Unauthorized" },
    { value: 23, Label: "402-Payment Required" },
    { value: 24, Label: "403-Forbidden" },
    { value: 25, Label: "404-Not Found" },
    { value: 26, Label: "405- Method Not Allowed" },
    { value: 27, Label: "406-Not Accepted" },
    { value: 28, Label: "407-Proxy Authentication Required" },
    { value: 29, Label: "408-Request Timeout" },
    { value: 30, Label: "409-Conflict" },
    { value: 31, Label: "410-Gone" },
    { value: 32, Label: "411-Length Required" },
    { value: 33, Label: "412-Precondition Failed" },
    { value: 34, Label: "413-Payload Too Large" },
    { value: 35, Label: "414-URl Too Long" },
    { value: 36, Label: "415-Unsupported Media Type" },
    { value: 37, Label: "416-Range Not Satisfiable" },
    { value: 38, Label: "417-Expectation Failed" },
    { value: 39, Label: "418- I`am a teapot" },
    { value: 40, Label: "421-Misdirected Report" },
    { value: 41, Label: "422-Unprocessable Entity" },
    { value: 42, Label: "423-Locked" },
    { value: 43, Label: "424-Failed Dependency" },
    { value: 44, Label: "425-Unordered Collection" },
    { value: 45, Label: "426-Upgrade Required" },
    { value: 46, Label: "428-Precondition Required" },
    { value: 47, Label: "429-Too Many Requests" },
    { value: 48, Label: "431-Request Header Field Too Large" },
    { value: 49, Label: "451-Unavailable For Legal Resons" },
    { value: 50, Label: "500-Internal Server Error" },
    { value: 51, Label: "501-Not Implemented" },
    { value: 52, Label: "502-Bad Gateway" },
    { value: 53, Label: "503-Service Unavailable" },
    { value: 54, Label: "504-Gateway Timeout" },
    { value: 55, Label: "505-HTTP Version Not Supported" },
    { value: 56, Label: "506-Variant Also Negotiates" },
    { value: 57, Label: "507-Insufficient Storage" },
    { value: 58, Label: "508-Loop Detected" },
    { value: 59, Label: "509-Bandwidth Limit Exceedded" },
    { value: 60, Label: "510-Not Extended" },
    { value: 61, Label: "511-Network Authentication Required" },

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
          tags.map((data, index) => {
            return <MenuItem key={index} value={data.value}>
              { data.Label}
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
          {headerResponce.length === 0 ? <Fab size="small" color="primary" sx={{ mt: "3vh", ml: "1%", mb: "3vh" }}
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
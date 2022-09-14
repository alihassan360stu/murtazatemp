import React from 'react'
import { Box, MenuItem, TextField, Typography, Tabs, Tab, TextareaAutosize, Fab } from '@mui/material';
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
const comparison = [
  { value: 0, label: "Equals" },
  { value: 1, label: "Equals (case insentive)" },
  { value: 2, label: "Contains Text" },
  { value: 3, label: "Matches Regex" },
  { value: 4, label: "Does Not Match Regex" },
  { value: 5, label: "Is Absent" },
]

const tags = [
  { value: 0, label: "Equals" },
  { value: 1, label: "Equals (case insentive)" },
  { value: 2, label: "Contains Text" },
  { value: 3, label: "Matches Regex" },
  { value: 4, label: "Does Not Match Regex" },
  { value: 5, label: "Is Absent" },
  { value: 6, label: "Equals To XML" },
  { value: 7, label: "Equals To JSON" },
  { value: 8, label: "Matches XPath" },
  { value: 9, label: "Matches JSON Path" },
]

const Request = () => {
  const [getData, setGetData] = React.useState({ get: "", url: "", equals: 1 })
  const [tabValues, setTabValues] = React.useState(0);
  const [header, setHeader] = React.useState([])
  const [queryParameter, setQueryParameter] = React.useState([])
  const [body, setBody] = React.useState([])
  const [cookies, setCookies] = React.useState([])
  const [showCredentials, setShowCredentials] = React.useState(false)
  const [credentialsValue, setCredentialsValue] = React.useState("")
  const onChangeMethod = (e) => {
    const { name, value } = e.target;
    setGetData({ ...getData, [name]: value });
  }
  return (
    <Box width={"100%"} pt="2vh" boxShadow={1} boxSizing="border-box">
      <Typography variant='body1' sx={{ ml: "1%", mt: "2vh", fontSize: "0.8rem" }}>
        Use data parameters from Service data model in request matchers and response content. You can also use dynamic parameters in your response.
      </Typography>
      <Box width="100%" display="flex" mt="4vh" justifyContent="space-evenly">
        <TextField label="Method" select onChange={onChangeMethod} name="get" value={getData.get} sx={{ width: "19%", ...selectorChangeDefault }}>
          {
            getRequest.map((values, index) => {
              return <MenuItem key={index} value={values.value}>
                {values.label}
              </MenuItem>
            })
          }
        </TextField>
        <TextField label="URL" name="url" value={getData.url} onChange={onChangeMethod} sx={{ width: "59%", ...chengeTextFieldBehavier }} />
        <TextField select onChange={onChangeMethod} name="equals" value={getData.equals} sx={{ width: "19%", ...selectorChangeDefault }}>
          <MenuItem value={1}>
            Equls
          </MenuItem>
          <MenuItem value={2}>
            Matches Regex
          </MenuItem>
        </TextField>
      </Box>

      <Tabs value={tabValues} sx={{ mt: "2vh", ...tabChangeDefault }} onChange={(e, valu) => {
        setTabValues(valu)
      }}>
        <Tab label={`Headers (${header.length})`} />
        <Tab label={`Query Parameters (${queryParameter.length})`} />
        <Tab label={`Cookies (${cookies.length})`} />
        <Tab label={`Credentials ${credentialsValue !== "" ? "Defined" : "Not Defined"}`} />
        <Tab label={`Body (${body.length})`} />
      </Tabs>

      <Box width="100%" borderTop={"0.5px solid gray"} pt={2}>
        {
          tabValues === 0 && <MakeTabPanel usestate={setHeader} data={header} tabValue={0} labels={["Name", "Comparison Operator", "Value"]} />
        }
        {
          tabValues === 1 && <MakeTabPanel usestate={setQueryParameter} data={queryParameter} tabValue={1} labels={["Name", "Comparison Operator", "Value"]} />
        }
        {
          tabValues === 2 && <MakeTabPanel usestate={setCookies} data={cookies} tabValue={2} labels={["Name", "Comparison Operator", "Value"]} />

        }
        {
          tabValues === 3 && <>
            <Typography variant='body1' sx={{ ml: "1%", fontSize: "0.8rem" }}>
              There are no Credentials defined.
            </Typography>
            {
              showCredentials ? <Box width="100%" display={"flex"} ml="0.5%" mt="2vh" mb="2vh">

                <Box width="80%" display={"flex"} justifyContent="flex-start">
                  <TextField label="User Name" name="name" sx={{ width: "30%", ...chengeTextFieldBehavier }} onChange={(r) => { setCredentialsValue(r.target.value) }} />
                  <TextField label="Password" name="password" sx={{ width: "30%", ...chengeTextFieldBehavier, m: "0px 2%" }} onChange={(r) => { setCredentialsValue(r.target.value) }} />
                  <Fab size="small" color="error" sx={{ mr: "10%" }} onClick={() => { setShowCredentials(false); setCredentialsValue("") }}>
                    <DeleteIcon style={{ color: "white" }} />
                  </Fab>
                </Box>
              </Box>
                : <Fab size="small" color="primary" sx={{ mt: "3vh", ml: "1%", mb: "3vh" }}
                  onClick={() => { setShowCredentials(true) }}>
                  <AddIcon style={{ color: "white" }} />
                </Fab>
            }
          </>
        }
        {
          tabValues === 4 && <>
            <Typography variant='body1' sx={{ ml: "1%", fontSize: "0.8rem" }}>
              Request must match ALL of these conditions.
            </Typography>

            {
              body.length === 0 ? <Fab size="small" color="primary" sx={{ mt: "3vh", ml: "1%", mb: "3vh" }}
                onClick={() => { setBody([Math.random() * 1000000000]) }}>
                <AddIcon style={{ color: "white" }} />
              </Fab> :
                body.length !== 0 && body.map((machingId, index) => {
                  return <Box width="40%" display={"flex"} justifyContent="flex-start" flexDirection="column" boxShadow={1} padding="5vh 5%" mt="5vh" ml="2%">
                    <TextField label="Body Matcher" select name="matcher" sx={{ width: "100%", ...selectorChangeDefault }}>
                      {
                        tags.map((values, index) => {
                          return <MenuItem key={index} value={values.value}>
                            {values.label}
                          </MenuItem>
                        })
                      }
                    </TextField>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={12}
                      placeholder="Body Content"
                      style={{ width: "99%", marginTop: "3vh" }}
                    />

                    <Box width="100%" mt="2vh" display="flex" justifyContent="flex-end">
                      <Fab size="small" color="error" sx={{ mr: "2%" }} onClick={() => {
                        let temp = body.filter((hitId) => {
                          return hitId !== machingId
                        })
                        setBody(temp)
                      }}>
                        <DeleteIcon style={{ color: "white" }} />
                      </Fab>
                      {
                        index === body.length - 1 &&
                        <Fab size="small" color="primary" onClick={() => { setBody([...body, [Math.random() * 1000000000]]) }}>
                          <AddIcon style={{ color: "white" }} />
                        </Fab>
                      }
                    </Box>
                  </Box>
                })

            }
          </>
        }
      </Box>
    </Box >
  )
}

const MakeTabPanel = ({ usestate, data, tabValue, labels }) => {
  return <>
    <Typography variant='body1' sx={{ ml: "1%", fontSize: "0.8rem" }}>
      {tabValue === 0 && "Request must match ALL of these conditions."}
      {tabValue === 1 && "There are no Query Parameters matchers defined."}
      {tabValue === 2 && "There are no Cookie matchers defined."}
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
          return <Box width="100%" display={"flex"} ml="0.5%" mt="2vh" mb="2vh">
            <Box width="80%">
              <TextField label={labels[0]} name="name" sx={{ width: "30%", ...chengeTextFieldBehavier }} />
              <TextField label={labels[1]} name="services" select sx={{ m: "0px 3%", width: "31%", ...selectorChangeDefault }} >
                {
                  comparison.map((values, index) => {
                    return <MenuItem key={index} value={values.value}>
                      {values.label}
                    </MenuItem>
                  })
                }
              </TextField>
              <TextField label={labels[2]} name="value" sx={{ width: "30%", ...chengeTextFieldBehavier }} />
            </Box>
            <Box width="10%" mr="10%" display="flex">
              <Fab size="small" color="error" onClick={() => {
                let temp = data.filter((hitId) => {
                  return hitId !== machingId
                })
                usestate(temp)
              }}>
                <DeleteIcon style={{ color: "white" }} />
              </Fab>
              {
                index === data.length - 1 && <Fab sx={{ ml: "4%" }} size="small" color="primary" aria-label="add" onClick={() => { usestate([...data, [Math.random() * 1000000000]]) }}>
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
export default Request
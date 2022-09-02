import React, { useState, useEffect } from 'react';
import { Box, Divider, Typography } from '@material-ui/core';

import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, orange } from '@material-ui/core/colors';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import GridContainer from '@jumbo/components/GridContainer';
import { withStyles } from '@material-ui/styles';
import { Constants } from '@services';
import HoverInfoCard from './HoverInfoCard'
import TestImCard from './TestImCard'
import CmtCard from '@coremat/CmtCard';
import Axios from 'axios';
import qs from 'qs';
import MoveToFolder from './MoveToFolder';
import Schedule from '../ScheduleDialog';
import MultiRun from './MultiRun';

import { ViewCompactAlt, Language, LogoDev, Adb, BlurOn, AllInclusive, Title, Replay, Mouse, HourglassBottom, ListAlt, TravelExplore } from '@mui/icons-material';
import { BiCheckbox, AiOutlineCheckSquare, GrLinkNext, BiScreenshot, BsMouse2, FaEquals, CgScrollV, FaRegKeyboard, TbSelect, BiGitCommit } from 'react-icons/all'
import Fade from 'react-reveal/Fade';

import { GrSchedulePlay, AiTwotoneDelete, BsFillPlayFill, MdDriveFileMoveOutline } from 'react-icons/all'
import { useSelector } from 'react-redux';

var crypto = require('crypto');
const MySwal = withReactContent(Swal);

const useStyles = makeStyles(theme => ({
  cardRoot: {
    position: 'relative',
    padding: 10,
    minHeight: 40,
    display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center',
    '&:hover': {
      boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.14), 0px 5px 22px rgba(0, 0, 0, 0.12), 0px 7px 8px rgba(0, 0, 0, 0.2)',
      // '& $iconThumb': {
      //   width: 95,
      //   height: '100%',
      //   borderRadius: 0,
      // },
      // '& $hoverContent': {
      //   transform: 'translate(-10px, -50%)',
      // },
    },
  },
  actionBlueButton: {
    color: blue[50],
    '&:hover': {
      backgroundColor: blue[700],
      color: '#fff',
    },
  },
  root: {
    // maxWidth: '100vh',
    // padding: '2%',
    // margin: '0 auto',
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },

  pageTitle: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '6px 4px 6px hsla(0,0%,45.9%,.8)',
  },
  tableNumberField: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '2px 2px 3px hsla(0,0%,45.9%,.8)',
  },
}));

const Toast = MySwal.mixin({
  target: '#myTest',
  customClass: {
    container: {
      position: 'absolute',
      zIndex: 999999999,
    }
  },
  toast: true,
  position: 'top',

  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  onOpen: toast => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const getCommandIcon = (command) => {
  let icon = ''
  switch (command) {
    case 'type':
      icon = <FaRegKeyboard style={{ color: 'black' }} />
      break;
    case 'check':
      icon = <AiOutlineCheckSquare style={{ color: 'black' }} />
      break;
    case 'uncheck':
      icon = <BiCheckbox style={{ color: 'black' }} />
      break;
    case 'log':
      icon = <LogoDev style={{ color: 'black' }} />
      break;
    case 'debug':
      icon = <Adb style={{ color: 'black' }} />
      break;
    case 'blur':
      icon = <BlurOn style={{ color: 'black' }} />
      break;
    case 'each':
      icon = <AllInclusive style={{ color: 'black' }} />
      break;
    case 'viewport':
      icon = <ViewCompactAlt style={{ color: 'black' }} />
      break;
    case 'title':
      icon = <Title style={{ color: 'black' }} />
      break;
    case 'next':
      icon = <GrLinkNext style={{ color: 'black' }} />
      break;
    case 'go':
      icon = <GrLinkNext style={{ color: 'black' }} />
      break;
    case 'eq':
      icon = <FaEquals style={{ color: 'black' }} />
      break;
    case 'rightclick':
      icon = <Mouse style={{ color: 'black' }} />
      break;
    case 'dblclick':
      icon = <Mouse style={{ color: 'black' }} />
      break;
    case 'screenshot':
      icon = <BiScreenshot style={{ color: 'black' }} />
      break;
    case 'wait':
      icon = <HourglassBottom style={{ color: 'black' }} />
      break;
    case 'scrollTo':
      icon = <CgScrollV style={{ color: 'black' }} />
      break;
    case 'visit':
      icon = <Language style={{ color: 'black' }} />
      break;
    case 'click':
      icon = <BsMouse2 style={{ color: 'black' }} />
      break;
    case 'find':
      icon = <TravelExplore style={{ color: 'black' }} />
      break;
    case 'get':
      icon = <TbSelect style={{ color: 'black' }} />
      break;
    case 'contains':
      icon = <ListAlt style={{ color: 'black' }} />
      break;
    case 'should':
      icon = <Replay style={{ color: 'black' }} />
      break;
    case 'reload':
      icon = <Replay style={{ color: 'black' }} />
      break;
    default:
      icon = <BiGitCommit style={{ color: 'black' }} />
      break;
  }

  return icon;
}

let tempResponse = {
  "_id": "630b984d5689530431d6e118",
  "test_id": "630b9814e43d1386c3c3c5ba",
  "test_name": "copy of LATEST",
  "org_id": "630a82f443ac89e3811f3a2d",
  "browser": "chrome",
  "org_name": "Tapfreaks",
  "pass": 1,
  "fail": 0,
  "start_duration": "2022-08-28T16:30:49.963Z",
  "end_duration": "2022-08-28T16:31:03.183Z",
  "error": null,
  "result": "1",
  "user_id": "62f7791b6c8d5049f669c468",
  "video": null,
  "screenshot": null,
  "steps": [
    {
      "type": "cy:command",
      "severity": "success",
      "command": "visit",
      "message": "https://www.wikipedia.org/",
      "screenshot": "D:\\Current Projects\\Freelancing\\DevsChain\\AWS Remote\\Backend\\cypress\\screenshots\\1661704234023_630b9814e43d1386c3c3c5ba.cy.js\\example to-do app -- displays two todo items by default.png"
    },
    {
      "type": "cy:command",
      "severity": "success",
      "command": "get",
      "message": "#www-wikipedia-org",
      "screenshot": "D:\\Current Projects\\Freelancing\\DevsChain\\AWS Remote\\Backend\\cypress\\screenshots\\1661704234023_630b9814e43d1386c3c3c5ba.cy.js\\example to-do app -- displays two todo items by default (1).png"
    },
    {
      "type": "cy:command",
      "severity": "success",
      "command": "get",
      "message": "#searchInput",
      "screenshot": "D:\\Current Projects\\Freelancing\\DevsChain\\AWS Remote\\Backend\\cypress\\screenshots\\1661704234023_630b9814e43d1386c3c3c5ba.cy.js\\example to-do app -- displays two todo items by default (2).png"
    },
    {
      "type": "cy:command",
      "severity": "success",
      "command": "type",
      "message": "programming language",
      "screenshot": "D:\\Current Projects\\Freelancing\\DevsChain\\AWS Remote\\Backend\\cypress\\screenshots\\1661704234023_630b9814e43d1386c3c3c5ba.cy.js\\example to-do app -- displays two todo items by default (3).png"
    }
  ],
  "status": true,
  "videos": "D:\\Current Projects\\Freelancing\\DevsChain\\AWS Remote\\Backend\\cypress\\videos\\1661704234023_630b9814e43d1386c3c3c5ba.cy.js.mp4",
  "screenshots": [
    {
      "path": "D:\\Current Projects\\Freelancing\\DevsChain\\AWS Remote\\Backend\\cypress\\screenshots\\1661704234023_630b9814e43d1386c3c3c5ba.cy.js\\example to-do app -- displays two todo items by default.png"
    },
    {
      "path": "D:\\Current Projects\\Freelancing\\DevsChain\\AWS Remote\\Backend\\cypress\\screenshots\\1661704234023_630b9814e43d1386c3c3c5ba.cy.js\\example to-do app -- displays two todo items by default (1).png"
    },
    {
      "path": "D:\\Current Projects\\Freelancing\\DevsChain\\AWS Remote\\Backend\\cypress\\screenshots\\1661704234023_630b9814e43d1386c3c3c5ba.cy.js\\example to-do app -- displays two todo items by default (2).png"
    },
    {
      "path": "D:\\Current Projects\\Freelancing\\DevsChain\\AWS Remote\\Backend\\cypress\\screenshots\\1661704234023_630b9814e43d1386c3c3c5ba.cy.js\\example to-do app -- displays two todo items by default (3).png"
    }
  ],
  "created_at": "2022-08-28T16:31:09.319Z",
  "updated_at": "2022-08-28T16:31:09.319Z",
  "__v": 0,
  "notes": [],
  "username": "devasad",
  "full_name": "Asad Ali",
  "index": 1
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const ListAll = (props) => {
  const { theme, match } = props;
  const classes = useStyles();
  const xs = 6, sm = 4, xl = 3, md = 3, lg = 3;
  const [histId, setHistId] = useState(null);
  const [testData, setTestData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const [showMultiRun, setShowMultiRun] = useState(false);
  const org = useSelector(({ org }) => org);
  const [baseUrl, setBaseUrl] = useState(null);

  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  const getData = (params) => {
    return new Promise((resolve, reject) => {
      Axios.post('test/result', params).then(ans => {
        console.log(ans.data);
        if (ans.data.status) {
          let tempData = ans.data.data.steps;
          if (tempData) {
            setData(tempData);
          }
          resolve(true)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        reject(e.message)
      })
    })
  }

  useEffect(() => {
    try {
      var decipher = crypto.createDecipher(Constants.ALGO, Constants.TKV);
      var paramData = decipher.update(match.params.id, 'hex', 'utf8') + decipher.final('utf8');
      if (paramData) {
        paramData = JSON.parse(paramData);
        setHistId(paramData._id)
        setTestData(paramData)
      }
      if (histId) {
        let params = {
          history_id: histId
        }
        async function remoteData() {
          try {
            let ans = await getData(params)
          } catch (error) {
            showMessage('error', error)
          }
        }
        remoteData();
      }
    } catch (error) {

    }
  }, [histId])

  let arr = [];
  data.map(item => {
    if (item.command === 'visit') {
      if (!baseUrl)
        setBaseUrl(item.message)
    }
    arr.push(
      <Grid item xs={xs} sm={sm} xl={xl} md={md} lg={lg}>
        <TestImCard
          icon={getCommandIcon(item.command)}
          title={item.command}
          subTitle={item.message}
          imageUrl={`${Constants.SCREENSHOT_URL}${item.screenshot}`}
          isPassed={item.severity === 'success' ? true : false}
          description={`${item.command} ${item.message}`}
        />
        {/* <HoverInfoCard
          icon={getCommandIcon(item.command)}
          title={item.command}
          subTitle={item.message}
          imageUrl={`${Constants.SCREENSHOT_URL}${item.screenshot}`}
          isPassed={item.severity === 'success' ? true : false}
          description={`${item.command} ${item.message}`}
        /> */}
      </Grid>
    )
  })

  const testRunSync = (params) => {
    return new Promise((resolve, reject) => {
      let { test_id, browser } = params
      let data = qs.stringify({
        test_id,
        browser,
        org_id: org._id,
        type: 1
      });

      var config = {
        method: 'post',
        url: '/test/bulk-run',
        data: data
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
          resolve(ans.data.message)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    })
  }

  const testRunAsync = (params) => {
    return new Promise((resolve, reject) => {
      let { test_id, browser } = params
      let data = qs.stringify({
        test_id,
        browser,
        org_id: org._id,
        type: 1
      });

      var config = {
        method: 'post',
        url: '/test/bulk-run-concurrent',
        data: data
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
          resolve(ans.data.message)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    })
  }

  const deleteCall = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post('test/delete', data).then(ans => {
        if (ans.data.status) {
          resolve(ans.data.message)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        reject(e)
      })
    })
  }

  const deleteRowClick = async (rowData) => {
    if (testData) {
      MySwal.fire({
        title: 'Are you sure?',
        text: "Do You Want To Remove This Test",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it !',
        cancelButtonText: 'No, cancel !',
        reverseButtons: true,
      }).then(async result => {
        if (result.value) {
          try {
            setBusy(true)
            const result = await deleteCall({ test_id: testData._id })
            MySwal.fire('Success', result, 'success');
            setBusy(false)
          } catch (e) {
            MySwal.fire('Error', e, 'error');
          }
        }
      });
    }
  }

  const scheduleRowClick = async () => {
    setTimeout(() => {
      setShowSchedule(true)
    }, 10);
  }

  const moveFolderRowClick = async () => {
    setTimeout(() => {
      setShowMove(true)
      // setShowSchedule(true)
    }, 10);
  }

  const onRunButtonClick = (e) => {
    setTimeout(() => {
      setShowMultiRun(true)
    }, 10);
  }


  const testRunCallMulti = async (browser, type) => {
    try {
      let params = {
        test_id: testData.test_id,
        browser,
      }
      if (type == 1) {
        testRunSync(params)
      } else {
        testRunAsync(params)
      }
      MySwal.fire('success', 'Selected Test Is Running Please Check Tests View After Few Minutes', 'success')
    } catch (e) {
      showMessage('error', e, 'error')
    }
  }

  return (
    <PageContainer heading="" breadcrumbs={[]}>
      <div style={{ marginTop: "-6%" }}>
        <br />
        <h1>Test Run Details</h1>
        <br />
        <Divider />
        {testData &&
          <CmtCard className={classes.cardRoot}>
            <Box display='flex' flexDirection='row' width={'100%'} >
              <div style={{ 'flex': 1, display: 'flex', alignItems: 'center' }}>
                <h3 >{testData.test_name}</h3>
              </div>
              <Box display='flex' flexDirection='row' justifyContent='end' >
                <Fade right opposite cascade >
                  <Tooltip
                    title={"Run Test"}
                  >
                    <IconButton size="medium" color="default" aria-label="add" onClick={onRunButtonClick} disabled={busy}>
                      <BsFillPlayFill style={{ color: 'black' }} />
                    </IconButton>
                  </Tooltip>
                </Fade>

                <Fade right opposite cascade >
                  <Tooltip
                    title={"Add To Folder"}
                  >
                    <IconButton size="medium" color="default" aria-label="add" onClick={moveFolderRowClick} disabled={busy}>
                      <MdDriveFileMoveOutline style={{ color: 'black' }} />
                    </IconButton>
                  </Tooltip>
                </Fade>


                <Fade right opposite cascade >
                  <Tooltip
                    title={"Schedule Test"}
                  >
                    <IconButton size="medium" color="default" aria-label="add" onClick={scheduleRowClick} disabled={busy}>
                      <GrSchedulePlay style={{ color: 'black' }} />
                    </IconButton>
                  </Tooltip>
                </Fade>


                <Fade right opposite cascade>
                  <Tooltip
                    title={"Delete"}
                  >
                    <IconButton size="medium" color="default" aria-label="add" onClick={deleteRowClick} disabled={busy}>
                      <AiTwotoneDelete style={{ color: 'black' }} />
                    </IconButton>
                  </Tooltip>
                </Fade>

              </Box>
            </Box>
          </CmtCard>}
        <br />
        <Divider />
        <br />

        {/* {testData && testData.fail === 1 &&
          <Box bgcolor={orange[500]} display={'flex'} justifyContent={'center'} width={'100%'}>
            <Typography
              variant='h4'
              style={{ fontWeight: 'bold', color: 'white' }}>
              {testData.error}
            </Typography>
            <br />
            <Divider />
            <br />
          </Box>
        } */}

        <Box display={'flex'}>
          <Box display={'flex'}>
            <Typography color='textPrimary' variant='h5' style={{ fontWeight: 'bold' }}> Default config:</Typography> &nbsp;&nbsp;   <Typography color='textSecondary' variant='caption'> {testData && capitalizeFirstLetter(testData.browser)} | macOS Catalina | 1024 x 680 </Typography>
          </Box>
          &nbsp;&nbsp;
          <Box display={'flex'}>
            <Typography color='textPrimary' variant='h5' style={{ fontWeight: 'bold' }}> Base URL:</Typography> &nbsp;&nbsp; <Typography color='textSecondary' variant='caption'> {baseUrl && baseUrl} </Typography>
          </Box>
        </Box>
        <br />

        <GridContainer>
          {arr}
        </GridContainer>
      </div>

      {showMultiRun && <MultiRun showDialog={setShowMultiRun} testRunCall={testRunCallMulti} />}
      {showSchedule && <Schedule hideDialog={setShowSchedule} groupId={null} testId={testData.test_id} link={"create"} />}
      {showMove && <MoveToFolder hideDialog={setShowMove} setRefereshData={() => { }} selectedRows={[testData.test_id]} />}

    </PageContainer>
  );
};

export default (withStyles({}, { withTheme: true })(ListAll));

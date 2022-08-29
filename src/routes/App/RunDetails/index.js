import React, { useState, forwardRef, useEffect, createRef } from 'react';
import { Box, TextField, MenuItem, Chip, Divider } from '@material-ui/core';

import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, green, grey, orange } from '@material-ui/core/colors';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import { Grid } from '@material-ui/core';
import GridContainer from '@jumbo/components/GridContainer';
import { withStyles } from '@material-ui/styles';
import { Constants } from '@services';
import HoverInfoCard from './HoverInfoCard'

import { ViewCompactAlt, Language, LogoDev, Adb, BlurOn, AllInclusive, Title, Replay, Mouse, HourglassBottom, ListAlt, TravelExplore } from '@mui/icons-material';
import { BiCheckbox, AiOutlineCheckSquare, GrLinkNext, BiScreenshot, BsMouse2, FaEquals, CgScrollV, FaRegKeyboard, IoMdBrowsers, TbSelect, BiGitCommit } from 'react-icons/all'
var crypto = require('crypto');
const MySwal = withReactContent(Swal);


const useStyles = makeStyles(theme => ({

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

// {
//   "type": "cy:command",
//   "severity": "success",
//   "command": "visit",
//   "message": "http://3.21.230.123/app/tests",
//   "screenshot": "F:\\Freelance Work\\auton8\\cypress\\screenshots\\1661621822777_6306024fc5758a4aae0bf47c.cy.js\\Search in Wikipedia -- Search in Wikipedia.png"
// },
// {
//   "type": "cy:command",
//   "severity": "error",
//   "command": "get",
//   "message": ":nth-child(2) > a",
//   "screenshot": "F:\\Freelance Work\\auton8\\cypress\\screenshots\\1661621822777_6306024fc5758a4aae0bf47c.cy.js\\Search in Wikipedia -- Search in Wikipedia (failed).png"
// }

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

const ListAll = (props) => {
  const { theme, match } = props;
  const classes = useStyles();
  const xs = 4, sm = 4, xl = 3, md = 3, lg = 3;
  const [histId, setHistId] = useState(null);
  const [data, setData] = useState([]);

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
      var id = decipher.update(match.params.id, 'hex', 'utf8') + decipher.final('utf8');
      setHistId(id)
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

  // BsMouse2,CgScrollV,FaRegKeyboard,IoMdBrowsers
  // let dataArr = [
  //   {
  //     description: 'Visit www.yahoo.com',
  //     icon: <IoMdBrowsers style={{ color: 'black' }} />
  //   },
  //   {
  //     description: 'Click On #123',
  //     icon: <BsMouse2 style={{ color: 'black' }} />
  //   },
  //   {
  //     description: 'Scroll To #myDiv',
  //     icon: <CgScrollV style={{ color: 'black' }} />
  //   },
  //   {
  //     description: 'Typing into #myInput',
  //     icon: <FaRegKeyboard style={{ color: 'black' }} />
  //   },
  // ]

  var SERVICE_URL = window.location.origin + '/api/screenshots/';
  let arr = [];
  data.map(item => {
    arr.push(
      <Grid item xs={xs} sm={sm} xl={xl} md={md} lg={lg}>
        <HoverInfoCard
          icon={getCommandIcon(item.command)}
          title={item.command}
          subTitle={item.message}
          imageUrl={`${Constants.SCREENSHOT_URL}${item.screenshot}`}
          isPassed={item.severity === 'success' ? true : false}
          description={`${item.command} ${item.message}`}
        />
      </Grid>
    )
  })

  return (
    <PageContainer heading="" breadcrumbs={[]}>
      <div style={{ marginTop: "-6%" }}>
        <br />
        <h1>Test Run Details</h1>
        <br />
        <Divider />
        <br />
        <GridContainer>
          {arr}
        </GridContainer>
      </div>
    </PageContainer>
  );
};

export default (withStyles({}, { withTheme: true })(ListAll));

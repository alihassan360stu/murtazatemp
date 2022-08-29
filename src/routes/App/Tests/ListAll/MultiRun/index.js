import React, { useState } from 'react';
import { Box, Button, Dialog, TextField, MenuItem, RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import { FaChrome, FaFirefox, FaEdge } from 'react-icons/fa';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100vh',
    padding: '2%',
    margin: '0 auto',
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
  },
  titleRoot: {
    marginBottom: 14,
    color: theme.palette.text.primary,
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    }
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
  }
}));



const EditDialog = ({ showDialog, testRunCall }) => {
  // dialogState
  const classes = useStyles();
  const [browser, setBrowser] = useState('chrome')
  const [type, setType] = useState(1)

  const handleOnChangeTF = (e) => {
    var { value } = e.target;
    e.preventDefault();
    setBrowser(value);
  }

  const handleClose = (e) => {
    e.preventDefault();
    setTimeout(() => {
      showDialog(false)
    }, 100);
  }


  const getBrowser = (browser) => {
    if (browser == 'chrome') {
      return (<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src={'/images/chrome.svg'} height={50} />
        &nbsp;&nbsp;
        <h4> Google Chrome </h4>
      </div>)
    }

    if (browser == 'firefox') {
      return (<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {/* <FaFirefox size={50} color={'green'} /> */}
        <img src={'/images/firefox.svg'} height={50} />
        &nbsp;&nbsp;
        <h4> FireFox </h4>
      </div>)
    }

    if (browser == 'edge') {
      return (<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src={'/images/edge.svg'} height={50} />
        &nbsp;&nbsp;
        <h4> Microsoft Edge </h4>
      </div>)
    }
  }


  return (
    <PageContainer heading="" breadcrumbs={[]}>
      <Dialog
        id='myTest'
        maxWidth={'md'}
        scroll={'body'}
        open={true}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose(event)
          }
        }}
        aria-labelledby="form-dialog-title">
        <CmtCard mt={20}>
          <CmtCardContent >
            <div>
              <Box className={classes.pageTitle} fontSize={{ xs: 15, sm: 15 }}>
                Run Tests
              </Box>
            </div>
            <Divider />
            <h4> Select Browser </h4>
            <RadioGroup
              style={{ width: '100%', display: 'flex', justifyContent: 'space-around', flexDirection: "row", alignContent: 'center', marginTop: '10px', height: '100px' }}
              onChange={handleOnChangeTF}>

              <FormControlLabel checked={browser === 'chrome'} value={'chrome'} control={<Radio />} label={getBrowser('chrome')} />
              <FormControlLabel checked={browser === 'firefox'} value={'firefox'} control={<Radio />} label={getBrowser('firefox')} />
              <FormControlLabel checked={browser === 'edge'} value="edge" control={<Radio />} label={getBrowser('edge')} />
            </RadioGroup>
            <Divider />
            <h4> Select Run Type </h4>
            <RadioGroup
              style={{ width: '100%', display: 'flex', justifyContent: 'space-around', flexDirection: "row", alignContent: 'center', marginTop: '10px' }}
              onChange={(e) => {
                let { value } = e.target;
                setType(value)
              }}>

              <FormControlLabel checked={type == 1} value={1} control={<Radio />} label={'Sequential'} />
              <FormControlLabel checked={type == 2} value={2} control={<Radio />} label={'Concurrent'} />
            </RadioGroup>
            <br />
            <Divider />
            <TextField
              type="number"
              defaultValue={1}
              label={'Number Of Instances'}
              name="instances"
              fullWidth
              margin="normal"
              variant="standard"
            />
            <br />
            <Button style={{ marginTop: 10 }} type='button' variant="contained" color="primary" onClick={(e) => {
              handleClose(e)
              testRunCall(browser, type)
            }}>
              Start
            </Button>
            <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" onClick={handleClose}>
              Cancel
            </Button>
          </CmtCardContent>
        </CmtCard>
      </Dialog>
    </PageContainer>
  );
};

export default EditDialog;

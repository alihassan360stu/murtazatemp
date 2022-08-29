import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Backdrop, Dialog } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import BasicForm from './BasicForm';
import Schedule from './Schedule';
import validator from 'validator';
import moment from 'moment-timezone'

const MySwal = withReactContent(Swal);

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


const iniitalFormState = {
  schedule_type: 1,
  name: '',
  description: '',
  timezone: moment.tz.guess(true),
  notify_on: 1,
  prefs: 1,
  emails: ''
}

const initialDays = [false, false, false, false, false, false, false,];
const initialBrowsers = [false, false, false];

const EditDialog = ({ hideDialog, groupId, testId, link }) => {
  // dialogState
  const classes = useStyles();
  const [formState, setFormState] = useState(iniitalFormState);
  const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState(true);
  const [hours, setHours] = useState(1);
  const [browsers, setBrowsers] = useState(initialBrowsers);
  const [days, setDays] = useState(initialDays);
  const org = useSelector(({ org }) => org);

  const resetForm = () => {
    setDays(initialDays)
    setHours(1)
    setBrowsers(initialBrowsers)
    setBusy(false)
    setFormState(iniitalFormState)
  }

  const handleOnChangeTF = (e) => {
    var { name, value } = e.target;
    e.preventDefault();
    setFormState(prevState => ({ ...prevState, [name]: value }));
  }

  useEffect(() => {
    if (reset) {
      setReset(false)
    }
    resetForm()
  }, [reset])

  const showMessage = (icon, text, title) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  const validate = () => {
    console.log(formState);
    console.log(browsers);
    console.log(days);

    let { name, description, timezone, schedule_type, prefs } = formState;

    if (!validator.isLength(name, { min: 5 })) {
      showMessage('error', "Invalid Schedule Name", '')
      return false;
    }

    if (!validator.isLength(description, { min: 7 })) {
      showMessage('error', "Invalid Schedule Description", '')
      return false;
    }

    if (schedule_type == 1) {
      if (!validator.isLength(timezone, { min: 7 })) {
        showMessage('error', "Invalid Schedule Timezone", '')
        return false;
      }
    }

    // debugger;
    let temp = [];
    if (schedule_type == 1) {
      for (let x = 0; x < days.length; x++) {
        let item = days[x];
        if (item) {
          temp.push((x + 1))
        }
      }
      if (temp.length < 1) {
        showMessage('error', "Please Select Frequency First To Continue", '')
        return false;
      }
    }

    temp = [];
    for (let x = 0; x < browsers.length; x++) {
      let item = browsers[x];
      if (item) {
        temp.push((x + 1))
      }
    }

    if (temp.length < 1) {
      showMessage('error', "Please Select Atleast A Browser, To Continue", '')
      return false;
    }
    return true;
  }

  const submitRequest = (data) => {
    try {
      setBusy(true)
      Axios.post(`schedule/${link}`, data).then(result => {
        result = result.data;;
        console.log(result)
        if (result.status) {
          showMessage('success', result.message);
          resetForm()
          setTimeout(() => {
            hideDialog(false)
          }, 1000);
        } else {
          setBusy(false)
          showMessage('error', result.message);
        }
      }).catch(e => {
        setBusy(false)
        showMessage('error', e);
      })
    } catch (e) {
      setBusy(false)
      showMessage('error', e);
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        let { name, description, schedule_type, prefs, emails, timezone, notify_on } = formState;
        let temp = [];
        for (let x = 0; x < days.length; x++) {
          let item = days[x];
          if (item) {
            temp.push((x + 1))
          }
        }
        let frequency = '';
        if (temp.length > 0)
          frequency = temp.join(",");
        else
          frequency = "1";

        temp = [];
        for (let x = 0; x < browsers.length; x++) {
          let item = browsers[x];
          if (item) {
            temp.push((x + 1))
          }
        }
        let browsersIds = temp.join(",");

        if (org) {
          let dataToSubmit = {
            name,
            description,
            test_id: testId,
            schedule_type,
            timezone,
            hours,
            frequency,
            emails,
            preference: prefs,
            notify_on,
            browsers: browsersIds,
            org_id: org._id,
            group_id: groupId
          };
          submitRequest(dataToSubmit)
        } else {
          MySwal.fire('Error', 'No Organization Selected', 'error');
        }
      } catch (e) {
        MySwal.fire('Error', e, 'error');
      }
    }
  }

  const handleClose = (e) => {
    e.preventDefault();
    hideDialog(false)
  }

  return (
    <PageContainer heading="" breadcrumbs={[]}>
      <Dialog
        id='myTest'
        fullWidth={true}
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
                Schedule Test
              </Box>
            </div>
            <Divider />

            <form autoComplete="off" onSubmit={onSubmit}>
              <Box mb={2}>
                <Box display={'flex'}>
                  <BasicForm
                    style={{ width: '100%' }}
                    state={formState}
                    busy={busy}
                    handleOnChangeTF={handleOnChangeTF}
                  />

                  <Divider orientation='vertical' variant='inset' style={{ width: '20px' }} />
                  {!reset &&
                    <Schedule
                      style={{ width: '100%' }}
                      state={formState}
                      busy={busy}
                      handleOnChangeTF={handleOnChangeTF}
                      days={days}
                      setDays={setDays}
                      browsers={browsers}
                      setBrowsers={setBrowsers}
                      setBusy={setBusy}
                      setHours={setHours}
                    />}
                </Box>
                <br />
                <Divider />
                {/* <br />
                <Divider /> */}
                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={busy}>
                  Create
                </Button>
                <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" disabled={busy} onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </form>
          </CmtCardContent>
        </CmtCard>
      </Dialog>
      <Backdrop className={classes.backdrop} open={busy}>
        <CircularProgress color="secondary" />
      </Backdrop>
    </PageContainer>
  );
};

export default EditDialog;

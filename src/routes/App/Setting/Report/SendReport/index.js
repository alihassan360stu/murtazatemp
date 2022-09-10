import React, { useState } from 'react';
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


const EditDialog = ({ hideDialog, setRefereshData }) => {
  const org = useSelector(({ org }) => org);
  const classes = useStyles();
  const [formState, setFormState] = useState({ email: "", notify: false, is_loading: false });
  const handleClose = (e) => {
    e.preventDefault();
    setTimeout(() => {
      hideDialog(false)
    }, 100);
  }

  const showMessage = (icon, text, title) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  const validate = () => {
    return true;
  }

  const submitRequest = (data) => {
    const tempData = data.email.split(",");
    console.log("my name is ali hassan ",tempData)
    try {
      Axios.put('report', { ...data, tempData }).then(result => {
        result = result.data;;
        if (result.status) {
          showMessage('success', result.message);
          setTimeout(() => {
            hideDialog(false)
            setRefereshData(true)
          }, 1000);
        } else {
          showMessage('error', result.message);
          setFormState(prevState => ({ ...prevState, is_loading: false }));

        }
      }).catch(e => {
        setFormState(prevState => ({ ...prevState, is_loading: false }));
        showMessage('error', e);
      })
    } catch (e) {
      showMessage('error', e);
    }
  }


  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        let { email, notify } = formState
        setFormState({ ...formState, is_loading: true })
        if (org) {
          let dataToSubmit = { email, notify, org_id: org._id };
          submitRequest(dataToSubmit)

        } else {
          MySwal.fire('Error', 'No Organization Selected', 'error');
        }
      } catch (e) {
        MySwal.fire('Error', e, 'error');
      }
    }
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
                Reports
              </Box>
            </div>
            <Divider />

            <form autoComplete="off" onSubmit={(e) => {
              e.preventDefault();
              onSubmit(e)
            }}>
              <Box mb={2} position="relative">
                {
                  formState.is_loading && <CircularProgress style={{
                    position: "absolute", left: "50%",
                    top: "50%", transform: "translate(-50%,-50%)"
                  }} color="secondary" />

                }


                <BasicForm state={formState} handleOnChangeTF={setFormState} />
                <br />
                <Divider />
                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary">
                  Save
                </Button>
                <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </form>
          </CmtCardContent>
        </CmtCard>
      </Dialog>
    </PageContainer>
  );
};

export default EditDialog;

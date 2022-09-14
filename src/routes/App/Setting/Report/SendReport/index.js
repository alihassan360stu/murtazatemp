import React, { useState } from 'react';
import { Box, Button, CircularProgress, Backdrop, Dialog } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BasicForm from './BasicForm'
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
const EditDialog = ({ hideDialog, previesData, edit, editEmail, updateGrid }) => {
  const classes = useStyles();
  const [formState, setFormState] = useState({ email: edit ? editEmail.email : "" });

  const handleClose = (e) => {
    e.preventDefault();
    setTimeout(() => {
      hideDialog(false)
    }, 100);
  }

  const checkEmailValiftion = () => {
    let splitEmail = formState.email.split(",");
    for (let i = 0; i < splitEmail.length; i++) {
      if (!splitEmail[i].includes("@gmail.com")) {
        MySwal.fire('Error', "Invalid Email", 'error');
        hideDialog(false)
        return null;
      }
    }
    if (edit) {

      if (splitEmail.length > 1) {
        MySwal.fire('Error', "Can Not Separeted By (,)", 'error');
        hideDialog(false)
        return null;
      }
      var tempEmail = previesData.filter((values) => {
        return values.email !== editEmail.email;
      })
      console.log("previes data is ", tempEmail)
      for (let i = 0; i < tempEmail.length; i++) {
        if (tempEmail[i].email === splitEmail[0]) {
          MySwal.fire('Error', `${tempEmail[i].email} Exist`, 'error');
          hideDialog(false)
          return null;
        }
      }
      tempEmail = previesData;
      tempEmail[editEmail.index - 1].email = formState.email;
      console.log("data ", tempEmail)
      updateGrid(tempEmail)
      hideDialog(false)
      MySwal.fire('success', `User Edit Successfully`, 'success');
    }
    else {

      for (let i = 0; i < previesData.length; i++) {
        for (let j = 0; j < splitEmail.length; j++) {
          if (previesData[i].email === splitEmail[j]) {
            MySwal.fire('Error', `${splitEmail[j]} Exist`, 'error');
            hideDialog(false)
            return null;
          }
        }
      }

      for (let i = 0; i < splitEmail.length; i++) {
        for (let j = i; j < splitEmail.length; j++) {
          if (splitEmail[i] === splitEmail[j + 1]) {
            MySwal.fire('Error', `Make Sure, Email Must Be Different`, 'error');
            hideDialog(false)
            return null;
          }
        }
      }
      updateGrid(splitEmail)
      hideDialog(false)
      MySwal.fire('success', `User Added Successfully`, 'success');
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
              hideDialog(false);
              checkEmailValiftion()
            }}>
              <Box mb={2}>
                <BasicForm state={formState} handleOnChangeTF={setFormState} />
                <br />
                <Divider />
                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary">
                  {edit ? "Edit" : "Add"}
                </Button>
                <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </form>
          </CmtCardContent>
        </CmtCard>
      </Dialog>
      <Backdrop className={classes.backdrop} open={formState.is_loading}>
        <CircularProgress color="secondary" />
      </Backdrop>
    </PageContainer>
  );
};

export default EditDialog;

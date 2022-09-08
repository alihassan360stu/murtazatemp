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
import validator from 'validator';

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


const initalFormState = {
  identifier: '',
  role_id: -1,
}

const EditDialog = ({ hideDialog, setRefereshData }) => {
  // dialogState
  const classes = useStyles();
  const [formState, setFormState] = useState(initalFormState);
  const [busy, setBusy] = useState(false);
  const [roles, setRoles] = useState([]);
  const org = useSelector(({ org }) => org);

  const handleOnChangeTF = (e) => {
    var { name, value } = e.target;
    e.preventDefault();
    setFormState(prevState => ({ ...prevState, [name]: value }));
  }

  const showMessage = (icon, text, title) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  const validate = () => {
    let { identifier, role_id } = formState

    if (role_id === -1) {
      showMessage('error', 'Please Select A Role First', '')
      return false;
    }

    if (!validator.isEmail(identifier)) {
      showMessage('error', 'Invalid Email Address', '')
      return false;
    }

    return true;
  }

  const submitRequest = (data) => {
    try {
      Axios.post('invite/create', data).then(result => {
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
        let { identifier, role_id } = formState
        if (org) {
          setBusy(true)
          let dataToSubmit = { identifier, role_id, org_id: org._id };
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
    setTimeout(() => {
      hideDialog(false)
    }, 100);
  }

  const getRoles = () => {
    try {
      Axios.post('role', { search: '', page: 1, pageSize: 200 }).then(ans => {
        if (ans.data.status) {
          setRoles(ans.data.data);
        } else {
          showMessage('error', ans.data.message)
        }
      }).catch(e => {
        showMessage('error', e)
      })
    } catch (error) {
      showMessage('error', error && error.message ? error.message : 'SOMETHING WENT WRONG')
    }
  }

  useEffect(() => {
    getRoles();
  }, [])

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
                Add Member
              </Box>
            </div>
            <Divider />

            <form autoComplete="off" onSubmit={onSubmit}>
              <Box mb={2}>
                <BasicForm state={formState} handleOnChangeTF={handleOnChangeTF} roles={roles} busy={busy} />
                <Divider />
                <br />
                <Divider />
                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={busy}>
                  Add
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

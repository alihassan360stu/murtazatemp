import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Backdrop, Dialog, Grid, FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
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
import moment from 'moment-timezone'
import GridContainer from '@jumbo/components/GridContainer';

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
  name: '',
  description: '',
  permission: ''
}

const initalPermissionsState = {
  "create-organization": false,
  "edit-organization": false,
  "delete-organization": false,
  "list-organization": false,
  "list-group": false,
  "create-group": false,
  "edit-group": false,
  "delete-group": false,
  "list-schedule": false,
  "create-schedule": false,
  "edit-schedule": false,
  "delete-schedule": false,
  "create-test": false,
  "edit-test": false,
  "delete-test": false,
  "run-test": false,
  "list-test": false,
  "list-test-history": false,
  "add-test-group": false,
  "change-test-group": false,
}

const EditDialog = ({ hideDialog, tableRef, rowData }) => {
  // dialogState
  const classes = useStyles();
  const [formState, setFormState] = useState({ ...iniitalFormState, name: rowData.name, description: rowData.description });
  const [busy, setBusy] = useState(false);
  const [changeCheck, setChangeCheck] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState([])
  const [mainPerms, setMainPerms] = useState([])
  const org = useSelector(({ org }) => org);

  const handleChange = event => {
    try {
      var { name, value, checked } = event.target
      let tempArr = selectedPerms;
      console.log({ name, value, checked });
      if (checked) {
        if (!tempArr.includes(value)) {
          tempArr.push(value)
        }
      } else {
        tempArr = tempArr.filter(item => item !== value)
      }
      setChangeCheck(true)
      // setSelectedPerms(tempArr)
      setSelectedPerms(tempArr)
      setTimeout(() => {
        setChangeCheck(false)
      }, 500);
    } catch (e) {

    }
  };

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
    let { name, description } = formState;

    if (!validator.isLength(name, { min: 5 })) {
      showMessage('error', "Invalid Role Name", '')
      return false;
    }

    if (!validator.isLength(description, { min: 7 })) {
      showMessage('error', "Invalid Role Description", '')
      return false;
    }

    if (selectedPerms.length < 1) {
      showMessage('error', "Please Select At-Least One Permission", '')
      return false;
    }

    return true;
  }

  const submitRequest = (data) => {
    try {
      setBusy(true)
      Axios.put(`role/create`, data).then(result => {
        result = result.data;;
        console.log(result)
        if (result.status) {
          showMessage('success', result.message);
          setTimeout(() => {
            hideDialog(false)
            tableRef.current.onQueryChange();
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
        let { name, description } = formState;
        let dataToSubmit = {
          name,
          description,
          permission: selectedPerms.join(','),
          role_id: rowData._id
        };
        submitRequest(dataToSubmit)

      } catch (e) {
        MySwal.fire('Error', e, 'error');
      }
    }
  }

  const handleClose = (e) => {
    e.preventDefault();
    hideDialog(false)
  }

  const getPermissions = () => {
    Axios.post('/permission', { search: '', page: 1, pageSize: 200 }).then(ans => {
      setBusy(false)
      if (ans.data.status) {
        setMainPerms(ans.data.data)
      } else {
        showMessage('error', ans.data.message);
      }
    }).catch(e => {
      setBusy(false)
      showMessage('error', e);
    })
  }

  useEffect(() => {
    if (rowData && rowData.permission && (rowData.permission.length !== selectedPerms.length)) {
      let tempArr = selectedPerms;
      rowData.permission.map(item => {
        if (!tempArr.includes(item._id)) {
          tempArr.push(item._id)
        }
      })
      setSelectedPerms(tempArr)
      setSelectedPerms(tempArr)
      setTimeout(() => {
        setChangeCheck(false)
      }, 500);
    }
    // if (mainPerms.length < 1)
    getPermissions()
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
                Update Policy
              </Box>
            </div>
            <Divider />

            <form autoComplete="off" onSubmit={onSubmit}>
              <Box mb={2}>
                <BasicForm
                  style={{ width: '100%' }}
                  state={formState}
                  busy={busy}
                  handleOnChangeTF={handleOnChangeTF}
                />
                <br />
                <Divider />
                <br />
                {!busy && <Box display={'felx'} justifyContent={'center'}>
                  <GridContainer>
                    {mainPerms.map(item => {
                      return <Grid key={item._id} sm={3}>
                        <FormControlLabel
                          control={<Checkbox checked={selectedPerms.includes(item._id)} onChange={handleChange} name={item.name} disabled={busy} value={item._id} />}
                          label={item.description}
                        />
                      </Grid>
                    })}
                  </GridContainer>
                </Box>
                }
                <br />
                <Divider />


                {/* <br />
                <Divider /> */}
                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={busy}>
                  Update
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

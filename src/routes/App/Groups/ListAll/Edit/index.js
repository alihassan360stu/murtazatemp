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
import validator from 'validator'

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


const EditDialog = ({ rowData, busy, setBusy, showDialog, setReload }) => {
    // dialogState
    const classes = useStyles();
    const [formState, setFormState] = useState({ ...rowData, name: rowData.name.name });

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
        var { name, description } = formState
        if (!validator.isLength(name, { min: 5 })) {
            showMessage('error', 'Invalid Folder Name')
            return false;
        }
        if (!validator.isLength(description, { min: 5 })) {
            showMessage('error', 'Invalid Description')
            return false;
        }
        return true;
    }

    const submitRequest = (data) => {
        try {
            Axios.put('group', data).then(result => {
                result = result.data;;
                if (result.status) {
                    showMessage('success', result.message, 'Success');
                    setTimeout(() => {
                        showDialog(false)
                        setReload(true)
                    }, 2000);
                } else {
                    setBusy(false)
                    showMessage('error', result.message, 'Error');
                }
            }).catch(e => {
                setBusy(false)
                showMessage('error', e, 'Error');
            })
        } catch (e) {
            showMessage('error', e, 'Error');
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setBusy(true)
                let { name, description } = formState
                const dataToSubmit = { name, description, group_id: rowData._id };
                submitRequest(dataToSubmit)
            } catch (e) {
                MySwal.fire('Error', e, 'error');
            }
        }
    }

    const handleClose = (e) => {
        e.preventDefault();
        setTimeout(() => {
            showDialog(false)
        }, 100);
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
                                Update Group
                            </Box>
                        </div>
                        <Divider />

                        <form autoComplete="off" onSubmit={onSubmit}>
                            <Box mb={2}>
                                <BasicForm state={formState} handleOnChangeTF={handleOnChangeTF} busy={busy} />
                                <Divider />
                                <br />
                                <Divider />
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
            <Backdrop className={classes.backdrop} open={formState.is_loading}>
                <CircularProgress color="secondary" />
            </Backdrop>
        </PageContainer>
    );
};

export default EditDialog;

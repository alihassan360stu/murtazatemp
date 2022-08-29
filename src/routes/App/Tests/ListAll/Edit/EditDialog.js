import React, { useState } from 'react';
import { Box, Button, CircularProgress, Backdrop, Dialog } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
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

const EditDialog = ({ hideDialog, setRefereshData, rowData }) => {
    // dialogState
    const classes = useStyles();
    const [formState, setFormState] = useState({ ...rowData, new_password: '', is_loading: false });

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
        return true;
    }

    const submitRequest = (data) => {
        try {
            Axios.put('/test', data).then(result => {
                result = result.data;;
                if (result.status) {
                    showMessage('success', result.message, 'Success');
                    setTimeout(() => {
                        hideDialog(false)
                        setRefereshData(true)
                    }, 2000);
                } else {
                    setFormState(prevState => ({ ...prevState, is_loading: false }));
                    showMessage('error', result.message, 'Error');
                }
            }).catch(e => {
                setFormState(prevState => ({ ...prevState, is_loading: false }));
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
                let { name, description, script } = formState
                setFormState(prevState => ({ ...prevState, is_loading: true }))
                let dataToSubmit = { name, description, script, kind: 'test', test_id: formState._id };
                submitRequest(dataToSubmit)
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
                                Update Test
                            </Box>
                        </div>
                        <Divider />

                        <form autoComplete="off" onSubmit={onSubmit}>
                            <Box mb={2}>
                                <BasicForm state={formState} handleOnChangeTF={handleOnChangeTF} />
                                <Divider />
                                <br />
                                <Divider />
                                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={formState.is_loading}>
                                    Update
                                </Button>
                                <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" disabled={formState.is_loading} onClick={handleClose}>
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

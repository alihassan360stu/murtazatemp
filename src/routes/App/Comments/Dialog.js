import React, { useEffect, useState } from 'react';
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

const initialState = {
    description: '',
    link_to_issue: ''
}

const EditDialog = ({ hideDialog, histId, tableRef }) => {
    // dialogState
    const classes = useStyles();
    const [formState, setFormState] = useState(initialState);
    const [busy, setBusy] = useState(false);
    const [type, setType] = useState(1);

    const types = [
        { name: "Bug in app", id: 1 },
        { name: "Environment issue", id: 2 },
        { name: "Invalid test data", id: 3 },
        { name: "Test Design", id: 4 },
        { name: "Other", id: 5 },
    ]

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
            setBusy(true)
            Axios.post('test/add-note', data).then(result => {
                result = result.data;;
                setBusy(false)
                if (result.status) {
                    showMessage('success', result.message, 'Success');
                    setTimeout(() => {
                        tableRef.current.onQueryChange()
                        hideDialog(false)
                    }, 2000);
                } else {
                    showMessage('error', result.message, 'Error');
                }
            }).catch(e => {
                setBusy(false)
                showMessage('error', e, 'Error');
            })
        } catch (e) {
            setBusy(false)
            showMessage('error', e, 'Error');
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                let { description, link_to_issue } = formState
                let dataToSubmit = { description, link_to_issue, history_id: histId, failure_type: type };
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

    const getOldComment = async (params) => {
        setBusy(true)
        Axios.post('test/note', params).then(result => {
            setBusy(false)
            result = result.data;;
            if (result.status) {
                if (result.data.length > 0) {
                    let data = result.data[0]
                    setFormState(prevState => ({
                        ...prevState,
                        link_to_issue: data.link_to_issue,
                        description: data.description
                    }));
                    setType(data.failure_type);
                }
            }
        }).catch(e => {
            setBusy(false)
            showMessage('error', e, 'Error');
        })
    }

    useEffect(() => {
        getOldComment({ history_id: histId });
    }, [histId])

    return (
        <PageContainer heading="" breadcrumbs={[]}>
            <Dialog
                id='myTest'
                fullWidth={true}
                maxWidth={'sm'}
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
                                Add/Edit Comment
                            </Box>
                        </div>
                        <Divider />

                        <form autoComplete="off" onSubmit={onSubmit}>
                            <Box mb={2}>
                                <BasicForm state={formState} handleOnChangeTF={handleOnChangeTF} busy={busy} type={type} setType={setType} types={types} />
                                <Divider />
                                <br />
                                <Divider />
                                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={busy}>
                                    Save
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

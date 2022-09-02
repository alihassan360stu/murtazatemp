import React, { useEffect } from 'react';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import 'react-virtualized/styles.css';
import { useState } from 'react';
import TableGrid from './TableGrid';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Divider, Breadcrumbs, Box, IconButton, Button, CircularProgress, Backdrop, Dialog } from '@material-ui/core';
import { FaHome, FcFolder } from 'react-icons/all'
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';

const MySwal = withReactContent(Swal);

const Toast = MySwal.mixin({
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

const styles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSize: 'border-box',
    border: '0px 0px 0px 1.5px solid #e6e6e6',
    width: '100%'
  },
  table: {
    width: '100%',
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
    width: '100%'
  },
  tableRowHover: {

  },
  selected: {
    backgroundColor: theme.palette.primary.main,
    textColor: 'white',
  },
  notSelected: {
    textColor: 'black',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.05),
    },
  },
  tableCell: {
    flex: 1,
    width: '100%'
  },
  noClick: {
    cursor: 'initial',
  },
}));

// for (let x = 0; x < selectedRows.length; x++) {
//   idsToRun.push(selectedRows[x]._id)
// }

export default function ReactVirtualizedTable({ hideDialog, setRefereshData, selectedRows }) {
  const classes = styles();
  const [selectedIdx, setSelectedIdx] = useState([]);
  const [busy, setBusy] = useState(true);
  const [reload, setReload] = useState(false);
  const [parent, setParent] = useState(null);
  const [paths, setPaths] = useState([]);
  const [data, setData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [reset, setReset] = useState(false);
  const org = useSelector(({ org }) => org);

  const setHomePath = () => {
    let tempPaths = paths;
    tempPaths.push({ name: 'Home', id: org.root, icon: <FaHome fontSize="inherit" />, index: 0 });
    setPaths(tempPaths)
  }

  const addBreadcrump = (data) => {
    let tempPaths = paths;
    tempPaths.push({ ...data, index: tempPaths.length });
    setPaths(tempPaths)
  }

  const getData = async (params) => {
    return new Promise((resolve, reject) => {
      Axios.post('group', params).then(ans => {
        setBusy(false)
        if (ans.data.status) {
          let tempData = ans.data.data;
          let groups = tempData.groups
          groups.map(item => {
            item.kind = 'group'
            item.name = { name: item.name, icon: 1 }
          })
          // let tests = tempData.tests
          // tests.map(item => {
          //   item.kind = 'test'
          //   item.name = { name: item.name, icon: 2 }
          // })
          setData(groups);
          resolve(true)
        } else {
          showMessage('error', ans.data.message)
          reject(ans.data.message)
        }
      }).catch(e => {
        showMessage('error', e.message)
        setBusy(false)
        reject(e.message)
      })
    })
  }

  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  useEffect(() => {
    setBusy(true)
    if (parent) {
      let params = {
        search: '',
        parent,
        org_id: org._id,
        pageSize: 1000,
        page: 1,
        status: "1"
      }
      getData(params);
    }
  }, [parent, org, reload])


  if (!parent) {
    setParent(org.root)
    setHomePath();
  }

  const getMore = async (rowData) => {
    try {
      let data = { name: rowData.name.name, id: rowData._id, icon: <FcFolder /> };
      addBreadcrump(data);
      setParent(rowData._id);
      setSelectedIdx([]);
    } catch (error) {
      showMessage('error', error)
    }
  }

  const onBreadClick = async (rowData) => {
    try {
      let tempArr = paths.filter((item) => item.index <= rowData.index);
      setPaths(tempArr)
      setParent(rowData.id);
      setSelectedIdx([]);
    } catch (error) {
      showMessage('error', error)
    }
  }

  const handleClose = (e) => {
    e.preventDefault();
    setTimeout(() => {
      hideDialog(false)
    }, 100);
  }

  const submitRequest = (data) => {
    try {
      Axios.post('test/add-group', data).then(result => {
        result = result.data;;
        if (result.status) {
          showMessage('success', result.message, 'Success');
          setTimeout(() => {
            hideDialog(false)
            setRefereshData(true)
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
      setBusy(false)
      showMessage('error', e, 'Error');
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let idsToRun = []
      for (let x = 0; x < selectedRows.length; x++) {
        idsToRun.push(selectedRows[x])
      }
      setBusy(true)
      let test_id = idsToRun.join(",");
      let group_id = parent;
      let dataToSubmit = { test_id, group_id };
      // console.log(dataToSubmit)
      submitRequest(dataToSubmit)
    } catch (e) {
      MySwal.fire('Error', e, 'error');
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
                Move To Folder
              </Box>
            </div>
            <Divider />

            <form autoComplete="off" onSubmit={onSubmit}>
              <br />
              <br />
              <Box mb={2}>
                <Breadcrumbs aria-label="breadcrumb">
                  {paths.map((item, index) => {
                    return (
                      <Box display='flex' className=' not-select' justifyContent={'center'} alignItems={'center'} key={index}>
                        <IconButton size='small' disabled={item.id === parent} defaultValue={item} name="temp" onClick={(e) => {
                          onBreadClick(item)
                        }}>
                          {item.icon}
                        </IconButton>
                        <h5>&nbsp;{item.name}</h5>
                      </Box>
                    )
                  })}
                </Breadcrumbs>
                <br />
                <br />
                <div
                  style={{
                    width: "100%", height: '200px'
                  }}
                >
                  <TableGrid
                    rowCount={data.length}
                    selectedIdx={selectedIdx}
                    rowHeight={40}
                    headerHeight={30}
                    busy={busy}
                    reset={reset}
                    setReset={setReset}
                    onRowClick={({ event, index, rowData }) => {
                      let clicks = event.detail;
                      if (clicks == 1) {
                        let tempArr = [];
                        tempArr.push(index)
                        setSelectedIdx(tempArr)
                        setReset(true)
                        setRowData(rowData)
                      } else {
                        if (rowData.name.icon === 1)
                          getMore(rowData)
                      }
                    }}

                    containerStyle={{
                      width: "100%",
                      maxWidth: "100%",
                    }}

                    rowGetter={({ index }) => data[index]}
                    columns={[
                      {
                        label: 'Name',
                        dataKey: 'name',
                        width: "100%"
                      },
                      {
                        label: 'Description',
                        dataKey: 'description',
                        width: "100%"
                      },
                      {
                        label: 'Kind',
                        dataKey: 'kind',
                      },
                    ]}
                  />
                </div>
              </Box>
              <Box mb={2}>
                <Divider />
                <br />
                <br />

                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={busy}>
                  Move Here
                </Button>
                <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" disabled={busy} onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </form>
          </CmtCardContent>
        </CmtCard>
      </Dialog>
    </PageContainer>
  )
}

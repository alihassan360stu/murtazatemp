import React, { useState, forwardRef, createRef } from 'react';
import { Box, CircularProgress, Tooltip, Dialog, Button } from '@material-ui/core';

import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, green, orange, red } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import qs from 'qs';

import {
  AddBox, ArrowDownward, Check, ChevronLeft,
  ChevronRight, Clear, DeleteOutline, Edit,
  FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn,
}
  from '@material-ui/icons';

import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import moment from 'moment';
import { useEffect } from 'react';

import Divider from '@material-ui/core/Divider';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';

const MySwal = withReactContent(Swal);


const useStyles = makeStyles(theme => ({

  actionBlueButton: {
    color: blue[50],
    '&:hover': {
      backgroundColor: blue[700],
      color: '#fff',
    },
  },
  root: {
    maxWidth: '100vh',
    padding: '2%',
    margin: '0 auto',
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  buttons: {
    // transition: 'all 6.6s ease',
    transition: 'opacity 2.6s ease-in',
  },

  pageTitle: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '6px 4px 6px hsla(0,0%,45.9%,.8)',
  },

  tableRowTitle: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    // textShadow: '0px 4px 4px hsla(0,0%,45.9%,.8)',
  },
  tableNumberField: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '2px 2px 3px hsla(0,0%,45.9%,.8)',
  },
}));

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

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


const initialDialogState = {
  show: false,
  refreshData: false,
  showPerm: false,
  rowData: {}
}

var tableRef = createRef();

const ListAll = ({ theme, showDialog, setReload, group_id, tests }) => {
  const classes = useStyles();
  const org = useSelector(({ org }) => org);
  const [selectedRows, setSelectedRows] = useState([]);
  const [busy, setBusy] = useState(false);

  const columns = [
    {
      title: 'S#', width: "4%", field: 'index', render: (rowData) => {
        return (
          <div>
            <h5>{rowData.index}</h5>
          </div>
        )
      }
    },
    {
      title: 'Test Name', field: 'name', render: (rowData) => {
        return (
          <div>
            <h5>{rowData.name}</h5>
          </div>
        )
      }
    },
    {
      title: 'Executed By', field: 'history.created_by', render: (rowData) => {
        return (
          <h5> {rowData.history ? rowData.history.created_by : 'Not Tested Yet'} </h5>
        )
      }
    },
    {
      title: 'Last Run', field: 'history.start_duration', render: (rowData) => {
        return (
          <h5> {rowData.history ? moment(rowData.history.start_duration).utc().local().format('D/MM/YYYY hh:mm a') : 'Not Tested Yet'} </h5>
        )
      }
    },
    {
      title: 'Fail / Pass', field: 'total_runs', render: (rowData) => {
        return (
          <Box display={'flex'}>
            <Tooltip title="Total Failed">
              <Box className={classes.tableRowTitle} fontSize={{ xs: 15, sm: 15 }} style={{ color: red[500] }}>
                {rowData.total_fail}
              </Box>
            </Tooltip>
            &nbsp;/&nbsp;
            <Tooltip title="Total Pass">
              <Box className={classes.tableRowTitle} fontSize={{ xs: 15, sm: 15 }} style={{ color: green[500] }}>
                {rowData.total_pass}
              </Box>
            </Tooltip>
          </Box>
        )
      }
    },
    {
      title: 'Success Rate', field: 'last_run', width: "18%",
      render: (rowData) => {
        let totalPassPercent = ((rowData.total_pass / (rowData.total_pass + rowData.total_fail)) * 100).toFixed(2);
        let totalFailedPercent = ((rowData.total_fail / (rowData.total_pass + rowData.total_fail)) * 100).toFixed(2)

        let bars = [
          { name: 'Total Pass', width: 40, color: '#04ca49' },
          { name: 'Total Failed', width: 80, color: '#a70505' },
        ]

        if (totalPassPercent === 'NaN')
          return (
            <h5>Not Tested Yet</h5>
          )
        else
          return (
            <div style={{ display: 'flex', width: '100%', borderRadius: '10px' }}>
              <Tooltip title={`Total Passed ${totalPassPercent}%`}>
                <div style={{ width: `${totalPassPercent}%`, background: '#04ca49', height: '3vh' }}></div>
              </Tooltip>
              <Tooltip title={`Total Passed ${totalFailedPercent}%`}>
                <div style={{ width: `${totalFailedPercent}%`, background: '#a70505', height: '3vh' }}></div>
              </Tooltip>
            </div>
          )
      }
    },
    {
      title: 'Status', field: 'is_running', render: (rowData) => {
        return (
          <div>
            {rowData.is_running ?
              <Box display={'flex'} flexDirection='row' justifyContent={'center'}>
                <h5 style={{ color: orange[500] }}> Running </h5>
                &nbsp; &nbsp;
                <CircularProgress size={20} variant='indeterminate' style={{ marginTop: '-2' }} />
              </Box>
              :
              <h5 style={{ color: green[500] }}>Idle </h5>
            }
          </div>
        )
      }
    }
  ]

  const getData = (params) => {
    return new Promise((resolve, reject) => {
      let { page, pageSize, search } = params
      let data = qs.stringify({
        search,
        page,
        pageSize,
        status: 1,
        org_id: org._id
      });

      var config = {
        method: 'post',
        url: '/test',
        data: data
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
          let runningIds = localStorage.getItem('runningIds');
          runningIds = runningIds ? JSON.parse(runningIds) : []

          ans.data.data.map(item => {
            if (runningIds.includes(item._id))
              item.is_running = true;
            else
              item.is_running = false;
          })

          let dataArr = ans.data.data;
          // let tempArr = [];
          // for (let x = 0; x < tests.length; x++) {
          //   let itemA = tests[x];
          //   for (let i = 0; i < dataArr.length; i++) {
          //     let itemB = dataArr[i];
          //     console.log(itemA._id, itemB._id)
          //     if (itemA._id !== itemB._id) {
          //       tempArr.map(item => {
          //         if (item._id !== itemB._id) {
          //           tempArr.push(itemB)
          //         }
          //       })
          //     }
          //   }
          // }
          resolve(dataArr)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    })
  }

  useEffect(() => {
    tableRef.current && tableRef.current.onQueryChange()
  }, [org])


  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  const validate = () => {
    if (selectedRows.length > 0) {
      return true;
    } else {
      showMessage('error', 'Please Select Atleast One Test Case To Continue')
      return false;
    }
  }

  const submitRequest = (data) => {
    try {
      Axios.post('test/add-group', data).then(result => {
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
      setBusy(false)
      showMessage('error', e, 'Error');
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setBusy(true);
        let idsToRun = []
        for (let x = 0; x < selectedRows.length; x++) {
          idsToRun.push(selectedRows[x]._id)
        }
        setBusy(true)
        let test_id = idsToRun.join(",");
        let dataToSubmit = { test_id, group_id };
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
                Add Tests
              </Box>
            </div>
            <Divider />

            <form autoComplete="off" onSubmit={onSubmit}>
              <Box mb={2}>
                <br />
                <br />
                <MaterialTable
                  tableRef={tableRef}
                  icons={tableIcons}
                  title="Tests List"
                  columns={columns}
                  onSelectionChange={(rows) => {
                    setSelectedRows(rows);
                  }}
                  // actions={actions}
                  data={async (query) => {
                    try {
                      var { orderBy, orderDirection, page, pageSize, search } = query;
                      const data = await getData({ orderBy: orderBy ? orderBy.field : null, orderDirection, page: (page + 1), pageSize, search });
                      return new Promise((resolve, reject) => {
                        resolve({
                          data,
                          page: query.page,
                          totalCount: data.length //? state.totalAssociations : 5//state.totalAssociations
                        })
                      })
                    } catch (e) {
                      return new Promise((resolve, reject) => {
                        resolve({
                          data: [],
                          page: query.page,
                          totalCount: 0 //? state.totalAssociations : 5//state.totalAssociations
                        })
                      })
                    }
                  }}
                  page={1}

                  options={{
                    // actionsColumnIndex: -1,
                    selection: true,
                    showSelectAllCheckbox: true,
                    draggable: false,
                    sorting: false,
                    headerStyle: {
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff'
                    },
                    cellStyle: {
                      hover: blue[500]
                    },
                    rowStyle: (rowData, index) => ({
                      backgroundColor: (selectedRows.includes(rowData)) ? '#EEE' : '#FFF',
                      padding: 10
                    }),
                    exportMenu: [{
                      label: 'Export PDF',
                      exportFunc: (cols, datas) => ExportPdf(cols, datas, 'List All Users ' + moment().format('DD-MM-YYYY'))
                    }, {
                      label: 'Export CSV',
                      exportFunc: (cols, datas) => ExportCsv(cols, datas, 'List All Users ' + moment().format('DD-MM-YYYY'))
                    }],
                    showFirstLastPageButtons: true,
                    pageSize: 5,
                    padding: 'default',
                    pageSizeOptions: [5, 10, 20],
                  }}
                />
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
    </PageContainer>
  )
};

export default (withStyles({}, { withTheme: true })(ListAll));

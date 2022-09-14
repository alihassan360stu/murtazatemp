import React, { useState, forwardRef, createRef } from 'react';
import { BoxTooltip, Typography, IconButton, Box, Tooltip, MenuItem, Fab } from '@material-ui/core';
import {TextField} from '@mui/material'
import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, green, orange, red } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import qs from 'qs';
import Fade from 'react-reveal/Fade';
import "react-virtualized/styles.css";

import {
  AddBox, ArrowDownward, Check, ChevronLeft,
  ChevronRight, Clear, DeleteOutline, Edit,
  FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn,
  Delete, FileCopy, PlayArrow
}
  from '@material-ui/icons';
  import AddIcon from '@material-ui/icons/Add';

import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import AddNew from "./AddList"
import EditUser from "./EditUser"
import { AiOutlineUserAdd, GrAdd } from 'react-icons/all'
const MySwal = withReactContent(Swal);

const breadcrumbs = [];


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
const selectorChangeDefault = {
  "& .MuiOutlinedInput-input": {
      padding: "4px",
      fontSize: "0.8rem"

  },
  "& .MuiFormLabel-root": {
      mt: "-10px",
      color: "black",
      fontSize: "0.8rem"

  }
}

const Services = [
  { value: 0, label: "Default Services" },
  { value: 1, label: "AWS S3 Sample" },
  { value: 2, label: "FaceBook Login Sample" },
  { value: 3, label: "Open Banking Sample" },
  { value: 4, label: "Salesforce Login Sample" },
]

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

const ListAll = (props) => {
  const { theme } = props;
  const classes = useStyles();
  const [dialogState, setDialogState] = useState(initialDialogState);
  const [refereshData, setRefereshData] = useState(false);
  const [busy, setBusy] = useState(false);
  const org = useSelector(({ org }) => org);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showCreateDial, setShowCreateDial] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [serviseValue, setServiseValue] = useState(0)
  const columns = [
    {
      title: 'S#', width: "4%", field: 'index', render: (rowData) => {
        return (
          <div>
            <Typography variant="h5">
              {rowData.index}
            </Typography>
          </div>
        )
      }
    },

    {
      title: 'ID', field: 'index', render: (rowData) => {
        return (
          <div>
            <Typography variant="h5">
              {rowData.index + "rnd23"}
            </Typography>
          </div>
        )
      }
    },

    {
      title: 'Name', field: 'username', render: (rowData) => {
        return (

          <Box display="flex" alignItems="center">
            <Typography variant="h5">
              {rowData.username}
            </Typography>
          </Box>

        )
      }
    },
    {
      title: 'Method', field: 'index', render: (rowData) => {
        return (
          <div>
            <Typography variant="h5">
              Get
            </Typography>
          </div>
        )
      }
    },
    {
      title: 'Response Status', field: 'index', render: (rowData) => {
        return (
          <div>
            <Typography variant="h5">
              200
            </Typography>
          </div>
        )
      }
    },
    {
      title: 'Services', field: 'type', render: (rowData) => {
        return (

          <Box display="flex" alignItems="center">
            <Typography variant="h5">
              {rowData.type}
            </Typography>
          </Box>

        )
      }
    },
    {
      title: 'Tags', field: 'Email', render: (rowData) => {
        return (
          <div style={{ display: 'flex', alignItems: "center" }}>
            <Typography variant="h5">
              Negative
            </Typography>
          </div>
        )
      }
    },
  ]

  const getData = (params) => {
    return new Promise((resolve, reject) => {
      let { page, pageSize, search } = params
      let data = qs.stringify({
        search,
        page,
        pageSize,
      });

      var config = {
        method: 'post',
        url: '/user',
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

          resolve(ans.data.data)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    })
  }

  const deleteCall = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post('user/delete', data).then(ans => {
        if (ans.data.status) {
          resolve(ans.data.message)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        reject(e)
      })
    })
  }

  const deleteMultiRow = async () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "Do You Want To Remove All Selected record",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete All !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {
          setBusy(true)
          // let dataRows = selectedRows;
          // for (let x = 0; x < dataRows.length; x++) {
          //   await deleteCall({ user_id: dataRows[x]._id })
          //   setRefereshData(true)
          // }
          setBusy(false)
          MySwal.fire('Success', "Successfully Remove All Selected Tests", 'success');
        } catch (e) {
          setBusy(false)
          MySwal.fire('Error', e, 'error');
        }
      }
    });
  }

  if (dialogState.refreshData) {
    tableRef.current.onQueryChange()
    setDialogState(prevState => ({ ...prevState, refreshData: false }))
    setSelectedRows([])
  }

  if (refereshData) {
    tableRef.current.onQueryChange()
    setRefereshData(false);
    setSelectedRows([])
  }

  return (
    <div>
      <PageContainer heading="" breadcrumbs={breadcrumbs}>
        {showCreateDial === false && <>
          <TextField sx={{...selectorChangeDefault}} variant="outlined" value={serviseValue} name="services" onChange={(e) => {
            setServiseValue(e.target.value)
          }} select style={{ width: "25%" }} label="Services" >
            {
              Services.map((values, index) => {
                return <MenuItem key={index} value={values.value}>
                  {values.label}
                </MenuItem>
              })
            }
          </TextField>
          <br />
          <div style={{ marginTop: "-3%" }}>
            <Box display='flex' flexDirection='row' justifyContent='end' alignItems="center" >
              {selectedRows.length > 0 &&
                <Fade right opposite cascade >
                  <Tooltip
                    title={"Delete Selected Members"}
                  >
                    <IconButton size="medium" color="default" aria-label="add" onClick={() => {
                      deleteMultiRow()
                    }} disabled={busy}>
                      <Delete style={{ color: 'red' }} />
                    </IconButton>
                  </Tooltip>
                </Fade>
              }
              {selectedRows.length === 1 &&
                <Fade right opposite cascade >
                  <Tooltip
                    title={"Edit Member"}
                  >
                    <IconButton size="medium" color="default" aria-label="add" onClick={() => {
                      setShowEdit(true)
                    }} disabled={busy}>
                      <Edit style={{ color: 'black' }} />
                    </IconButton>
                  </Tooltip>
                </Fade>
              }
              {selectedRows.length === 1 &&
                <Fade right opposite cascade >
                  <Tooltip
                    title={"Clone"}
                  >
                    <IconButton size="medium" color="default" aria-label="add" onClick={() => {
                      setShowEdit(true)
                    }} disabled={busy}>
                      <FileCopy style={{ color: 'black' }} />
                    </IconButton>
                  </Tooltip>
                </Fade>
              }

              {selectedRows.length === 1 &&
                <Fade right opposite cascade >
                  <Tooltip
                    title={"Run"}
                  >
                    <IconButton size="medium" color="default" aria-label="add" onClick={() => {
                      setShowEdit(true)
                    }} disabled={busy}>
                      <PlayArrow style={{ color: 'green' }} />
                    </IconButton>
                  </Tooltip>
                </Fade>
              }
              <Tooltip title={"Create New Transaction"}>
              
                <Fab color="primary" aria-label="add" onClick={() => { setShowCreateDial(true) }}>
                  <AddIcon style={{ color: "white" }} />
                </Fab>

              </Tooltip>
            </Box>
          </div>
          <br />
          <MaterialTable
            tableRef={tableRef}
            icons={tableIcons}
            title="Members List"
            columns={columns}
            onSelectionChange={(rows) => {
              setSelectedRows(rows);
            }}
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
              showFirstLastPageButtons: true,
              pageSize: 10,
              padding: 'default',
              pageSizeOptions: [20, 10, 50, 100],
            }}
          />
        </>
        }

        {showCreateDial && <AddNew hideDialog={setShowCreateDial} setRefereshData={setRefereshData} />}
        {/* {showEdit && <EditUser hideDialog={setShowEdit} setRefereshData={setRefereshData} formdata={selectedRows[0]} />} */}
      </PageContainer >

    </div >

  );
};

export default (withStyles({}, { withTheme: true })(ListAll));

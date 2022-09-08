import React, { useState, forwardRef, useEffect, createRef } from 'react';
import { Box, Button, MenuItem, Chip, Divider } from '@material-ui/core';

import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, green, grey, red } from '@material-ui/core/colors';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';

import {
  AddBox, ArrowDownward, Check, ChevronLeft,
  ChevronRight, Clear, DeleteOutline, Edit, Comment,
  FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn,
} from '@material-ui/icons';

import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { VscEdit, TbLockOpen, IoIosCloseCircle, RiDeleteBin7Line, BsCheck2Square, FiCheckCircle } from 'react-icons/all'
import AddNew from './AddNew'
import EditForm from './Edit'
var crypto = require('crypto');
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
    // maxWidth: '100vh',
    // padding: '2%',
    // margin: '0 auto',
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
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
  },
  tableNumberField: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '2px 2px 3px hsla(0,0%,45.9%,.8)',
  },
}));

const initalState = {
  totalData: 0,
  is_loading: true,
  showDialog: false,
  rowData: {}
}

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


const initState = [
  { name: 'Today', value: 1 },
  { name: 'Yesterday', value: 2 },
  { name: 'Last 7 Days', value: 3 },
  { name: 'Last 30 Days', value: 4 },
]

var tableRef = createRef();

const ListAll = (props) => {
  const { theme, match } = props;
  const classes = useStyles();
  const [rowData, setRowData] = useState(false);
  const [data, setData] = useState(null);
  const org = useSelector(({ org }) => org);
  const [showCreateDial, setShowCreateDial] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

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
      title: 'Name', field: 'name', render: (rowData) => {
        return (
          <div style={{ display: 'flex' }}>
            <h5>{rowData.name}</h5>
          </div>
        )
      }
    },
    {
      title: 'Description', field: 'description', render: (rowData) => {
        return (
          <div>
            <h5>{rowData.description}</h5>
            {/* <h5>{moment(rowData.start_duration).utc().local().format('D/MM/YYYY hh:mm a')}</h5> */}
          </div>
        )
      }
    },
  ]

  const getData = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post('role', data).then(ans => {
        if (ans.data.status) {
          setData(ans.data.data);
          resolve(ans.data.data)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        reject(e)
      })
    })
  }

  const blockCall = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post('schedule/change-status', data).then(ans => {
        if (ans.data.status) {
          tableRef.current.onQueryChange()
          resolve(ans.data.message)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        reject(e)
      })
    })
  }

  const deleteCall = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post('role/delete', data).then(ans => {
        if (ans.data.status) {
          tableRef.current.onQueryChange()
          resolve(ans.data.message)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        reject(e)
      })
    })
  }

  const editRowClick = async (event, rowData) => {
    event.preventDefault();
    setRowData(rowData);
    setTimeout(() => {
      setShowEdit(true)
    }, 100);
    // MySwal.fire({
    //   title: 'Are you sure?',
    //   text: "Do You Want To " + (rowData.is_active ? 'Block' : 'Unblock') + " This Schedule",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: rowData.is_active ? 'Yes, Block it !' : 'Yes, Unblock It !',
    //   cancelButtonText: 'No, cancel !',
    //   reverseButtons: true,
    // }).then(async result => {
    //   if (result.value) {
    //     try {
    //       const result = await blockCall({ schedule_id: rowData._id, is_active: rowData.is_active ? 0 : 1 })
    //       MySwal.fire('Success', result, 'success');
    //     } catch (e) {
    //       MySwal.fire('Error', e, 'error');
    //     }
    //   }
    // });
  }

  const deleteRowClick = async (event, rowData) => {
    event.preventDefault();
    MySwal.fire({
      title: 'Are you sure?',
      text: "Do You Want To Delete This Role",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {
          const result = await deleteCall({ role_id: rowData._id })
          MySwal.fire('Success', result, 'success');
        } catch (e) {
          MySwal.fire('Error', e, 'error');
        }
      }
    });
  }

  const actions = [
    row => ({
      icon: () => <VscEdit style={{ color: 'black' }} size={20} />,
      className: '',
      tooltip: `Edit Role`,
      onClick: editRowClick,
    }),
    row => ({
      icon: () => <RiDeleteBin7Line style={{ color: red[500] }} size={20} />,
      className: '',
      tooltip: `Delete Role`,
      onClick: deleteRowClick,
    }),
  ];

  return (
    <PageContainer heading="" breadcrumbs={breadcrumbs}>
      <div style={{ marginTop: "-6%" }}>
        <br />
        <h2>Schedules</h2>
        <br />
        <Box display='flex' flexDirection='row' justifyContent='end' alignItems={'center'}>
          <Button style={{ height: 40 }} type='button' variant="contained" color="primary" onClick={() => { setShowCreateDial(true) }}>
            Create Policy
          </Button>
        </Box>
        <br />
        <MaterialTable
          tableRef={tableRef}
          icons={tableIcons}
          title="Policies"
          columns={columns}
          actions={actions}
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
            actionsColumnIndex: -1,
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
              backgroundColor: (index % 2 === 0) ? grey[50] : '#FFF',
              // padding: 10,
              height: 5,
            }),
            exportMenu: [{
              label: 'Export PDF',
              exportFunc: (cols, datas) => ExportPdf(cols, datas, 'List All Users ' + moment().format('DD-MM-YYYY'))
            }, {
              label: 'Export CSV',
              exportFunc: (cols, datas) => ExportCsv(cols, datas, 'List All Users ' + moment().format('DD-MM-YYYY'))
            }],
            showFirstLastPageButtons: true,
            pageSize: 20,
            padding: 'default',
            pageSizeOptions: [20, 50, 100],
          }}
        />
      </div>
      {showCreateDial && <AddNew tableRef={tableRef} hideDialog={setShowCreateDial} />}
      {showEdit && <EditForm tableRef={tableRef} hideDialog={setShowEdit} rowData={rowData}/>}
    </PageContainer>
  );
};

export default (withStyles({}, { withTheme: true })(ListAll));

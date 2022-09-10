import React, { useState, forwardRef, createRef } from 'react';
import { Box, Typography, Tooltip, Fab } from '@material-ui/core';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MaterialTable from '@material-table/core';
import {
  AddBox, ArrowDownward, Check, ChevronLeft,
  ChevronRight, Clear, DeleteOutline, Edit,
  FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn, Delete,
} from '@material-ui/icons';
import ReportSending from "./SendReport"
import Axios from 'axios';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { blue } from '@material-ui/core/colors';
import { IoIosTimer } from 'react-icons/all'
import AddIcon from '@material-ui/icons/Add';

const MySwal = withReactContent(Swal);

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
const Report = (props) => {
  const org = useSelector(({ org }) => org);
  const [refereshData, setRefereshData] = useState(false);
  const [dialogState, setDialogState] = useState(initialDialogState);
  const [addEmail, setAddEmail] = useState(false);
  const showMessage = (icon, text, title) => {
    Toast.fire({
      icon,
      title: text
    });
  }
  const columns = [
    // {
    //   title: 'S#', width: "10%", field: 'index', render: (rowData) => {
    //     return (
    //       <div>
    //         <Typography variant="h5">
    //           {
    //             rowData.index
    //           }
    //         </Typography>
    //       </div>
    //     )
    //   }
    // },
    {
      title: 'Email', field: 'email', render: (rowData) => {
        return (

          <Box display="flex" alignItems="center">
            <Typography variant="h5">
              {
                rowData.email[0]
              }
            </Typography>
          </Box>

        )
      }
    },
    {
      title: 'Created At', field: 'created_at', render: (rowData) => {
        return (
          <div style={{ display: 'flex', alignItems: "center" }}>
            <Typography variant="h5">

              {
                rowData.created_at
              }
            </Typography>
          </div>
        )
      }
    },
    {
      title: 'Updated At', field: 'updated_at', render: (rowData) => {
        return (
          <div style={{ display: 'flex', alignItems: "center" }}>
            <Typography variant="h5">

              {
                rowData.updated_at
              }
            </Typography>
          </div>
        )
      }
    },
    {
      title: 'Notify', field: 'notify', render: (rowData) => {
        return (
          <div style={{ display: 'flex', alignItems: "center" }}>
            <Typography variant="h5">
              {
                rowData.notify ? "On" : "Off"
              }
            </Typography>
          </div>
        )
      }
    },
  ]


  const getData = (params) => {
    return new Promise((resolve, reject) => {
      let data = qs.stringify({
        org_id: org._id
      });
      var config = {
        method: 'post',
        url: '/report',
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

  const deleteMultiRow = async (selectedRows) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "Do You Want To Remove All Selected Tests",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete All !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {

          await deleteCall({ user_id: selectedRows._id })
          setRefereshData(true)
          MySwal.fire('Success', "Successfully Remove All Selected Tests", 'success');
        } catch (e) {
          MySwal.fire('Error', e, 'error');
        }
      }
    });
  }

  if (dialogState.refreshData) {
    tableRef.current.onQueryChange()
    setDialogState(prevState => ({ ...prevState, refreshData: false }))
  }

  if (refereshData) {
    tableRef.current.onQueryChange()
    setRefereshData(false);
  }

  const validate = () => {
    return true;
  }

  const submitRequest = (data) => {
    var newData = { ...data, org_id: org._id }
    try {
      Axios.put('report', newData).then(result => {
        result = result.data;;
        if (result.status) {
          showMessage('success', "Notify Change Successfully");
          setRefereshData(true)
        } else {
          showMessage('error', result.message);
        }
      }).catch(e => {
        showMessage('error', e);
      })
    } catch (e) {
      showMessage('error', e);
    }
  }


  const onSubmit = (e) => {
    if (validate()) {
      try {
        if (org) {
          const {email,notify}=e;
          var checkNotify;
          if (notify) {
            checkNotify = false;
          } else {
            checkNotify = true
          }

          submitRequest({ email:email[0],notify:checkNotify})
        } else {
          MySwal.fire('Error', 'No Organization Selected', 'error');
        }
      } catch (e) {
        MySwal.fire('Error', e, 'error');
      }
    }
  }


  const actions = [
    row => ({
      icon: () => <Delete style={{ color: "red" }} />,
      //   className: classes.actionBlueButton,
      tooltip: "Delete",
      onClick: () => { deleteMultiRow(row) },
    }),
    row => ({
      icon: () => <IoIosTimer style={{ color: row.notify ? "green" : blue[500] }} />,
      tooltip: 'Notify On / Off',
      onClick: () => {console.log("row data ",row) ;onSubmit(row) },
    }),
  ];


  return (
    <Box width={'100%'}>
      <Box width={"100%"} display="flex" justifyContent={"flex-end"}>
        <Tooltip title={"Create New Transaction"}>

          <Fab color="primary" aria-label="add" onClick={() => { setAddEmail(true) }}>
            <AddIcon style={{ color: "white" }} />
          </Fab>

        </Tooltip>
      </Box>
      <br />
      <MaterialTable
        tableRef={tableRef}
        icons={tableIcons}
        title="Report List"
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
          showSelectAllCheckbox: true,
          draggable: false,
          sorting: false,
          headerStyle: {
            backgroundColor: "rgba(58,24,229)",
            color: '#fff'
          },
          cellStyle: {
            hover: blue[500]
          },
          rowStyle: (rowData, index) => ({
            padding: 10
          }),
          showFirstLastPageButtons: true,
          pageSize: 10,
          padding: 'default',
          pageSizeOptions: [20, 10, 50, 100],
        }}
      />

      {addEmail && <ReportSending hideDialog={setAddEmail} setRefereshData={setRefereshData} />}
    </Box>
  );
};


export default Report;
import React, { useState, forwardRef, createRef, useEffect } from 'react';
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
  const [emailDataGrid, setEmailDataGrid] = useState([])
  const [updateState, setUpdateState] = useState([]);
  const [emailRowData, setEmailRowData] = useState([]);
  const [isUpdateEmail, setIsUpdateEmail] = useState(false)

  useEffect(() => {
    const apiCalled = async () => {
      let data = qs.stringify({
        org_id: org._id
      });
      var config = {
        method: 'post',
        url: '/report',
        data: data
      };
      let responce = await Axios(config);
      if (responce.data.status) {
        let temp = responce.data.data[0].email.map((value, index) => {
          return { index: index + 1, email: value };
        })
        setEmailDataGrid(temp)
      } else {
        MySwal.fire('Error', responce.data.message, 'error');
      }
    }
    apiCalled();
  }, []);




  useEffect(() => {
    const apiCalled = async () => {
      if (emailDataGrid.length !== 0) {
        var email = "";
        emailDataGrid.map((value) => {
          email += "," + value.email;
        })
        email = email.slice(1, email.length);
        let data = qs.stringify({
          org_id: org._id,
          email,
          notify: 1
        });
        var config = {
          method: 'put',
          url: '/report',
          data: data
        };
        let responce = await Axios(config);
        if (responce.data.status) {
        } else {
          MySwal.fire('Error', responce.data.message, 'error');
        }
      }
    }
    apiCalled();
  }, [emailDataGrid, updateState]);





  const columns = [
    {
      title: 'S#', width: "10%", field: 'index', render: (rowData) => {
        return (
          <div>
            <Typography variant="h5">
              {
                rowData.index
              }

            </Typography>
          </div>
        )
      }
    },
    {
      title: 'Email', field: 'email', render: (rowData) => {
        return (

          <Box display="flex" alignItems="center">
            <Typography variant="h5">
              {
                rowData.email
              }
            </Typography>
          </Box>

        )
      }
    }
  ]

  const deleteMultiRow = async (selectedRows) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "Do You Want To Remove User",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {
          var temparray = emailDataGrid;
          temparray = emailDataGrid.filter((value, index) => {
            return index + 1 !== selectedRows.index
          })
          for (let i = 0; i < temparray.length; i++) {
            temparray[i].index = i + 1;
          }
          setEmailDataGrid(temparray);
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
  const actions = [
    row => ({
      icon: () => <Delete style={{ color: "red" }} />,
      tooltip: "Delete",
      onClick: () => { deleteMultiRow(row) },
    }),
    row => ({
      icon: () => <Edit />,
      tooltip: 'Edit Mails',
      onClick: () => { setIsUpdateEmail(true); setEmailRowData(row); },
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
        data={emailDataGrid}
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
      {addEmail && <ReportSending hideDialog={setAddEmail} previesData={emailDataGrid} edit={isUpdateEmail} editEmail={emailRowData}
        updateGrid={(data) => {
          if (Array.isArray(data)) {
            var tempData = emailDataGrid;
            data.map((value) => {
              tempData.push({ index: emailDataGrid.length + 1, email: value })
            });
            setEmailDataGrid(tempData)
            setUpdateState(tempData)
          } else {
            setEmailDataGrid([...emailDataGrid, { index: emailDataGrid.length + 1, email: data }])
            setUpdateState(tempData)
          }
        }} />}

      {isUpdateEmail && <ReportSending hideDialog={setIsUpdateEmail} previesData={emailDataGrid} edit={isUpdateEmail} editEmail={emailRowData}
        updateGrid={(data) => { setEmailDataGrid(data) ; setUpdateState(data) }} />}
    </Box>
  );
};


export default Report;
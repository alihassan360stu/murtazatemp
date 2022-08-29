import React, { useState, forwardRef, useEffect, createRef } from 'react';
import { Box, CircularProgress, Backdrop, Divider } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  Info,
} from '@material-ui/icons';

import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import moment from 'moment';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import { UpdateDetails } from '@common';
import { green, orange, red } from '@material-ui/core/colors';

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
  avatar: {
    boxShadow: '6px 6px 6px hsla(0,0%,45.9%,.8)',
    borderRadius: '50%',
  },
}));

const initalState = {
  totalData: 0,
  is_loading: true,
  showDialog: false,
  rowData: {},
};

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

const initialDialogState = {
  show: false,
  refreshData: false,
  rowData: {},
};

const Toast = MySwal.mixin({
  target: '#myTest',
  customClass: {
    container: {
      position: 'absolute',
      zIndex: 999999999,
    },
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

var tableRef = createRef();

function getStatusChip(data) {
  switch (data.request_status) {
    case 0:
      return (
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          width={'100%'}
          style={{ backgroundColor: orange[500], color: 'white', borderRadius: '10px', padding: '2px' }}>
          Pending
        </Box>
      );
    case 1:
      return (
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          width={'100%'}
          style={{ backgroundColor: green[500], color: 'white', borderRadius: '10px', padding: '2px' }}>
          Approved
        </Box>
      );
    case 2:
      return (
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          width={'100%'}
          style={{ backgroundColor: red[500], color: 'white', borderRadius: '10px', padding: '2px' }}>
          Rejected
        </Box>
      );
    default:
      break;
  }
}

const ListAll = props => {
  const { theme } = props;
  const classes = useStyles();
  const [state, setState] = useState(initalState);
  const [dialogState, setDialogState] = useState(initialDialogState);
  const { authUser } = useSelector(({ auth }) => auth);

  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text,
    });
  };

  const getTotal = () => {
    Axios.post(authUser.api_url + '/edit/count', { request_status: 0 })
      .then(ans => {
        if (ans.data.status) {
          setState(prevState => ({ ...prevState, is_loading: false, totalData: ans.data.data.total }));
          tableRef.current.onQueryChange();
        } else {
          setState(prevState => ({ ...prevState, is_loading: false }));
        }
      })
      .catch(e => {
        setState(prevState => ({ ...prevState, is_loading: false }));
      });
  };

  const getData = data => {
    return new Promise((resolve, reject) => {
      try {
        Axios.post(authUser.api_url + '/edit/query', { ...data, request_status: 0 })
          .then(ans => {
            if (ans.data.status) {
              resolve(ans.data.data);
            } else {
              reject(ans.data.message);
            }
          })
          .catch(e => {
            reject(e);
          });
      } catch (e) {
        showMessage('error', e);
        reject(e);
      }
    });
  };

  const detailsRowClick = async (event, rowData) => {
    event.preventDefault();
    setTimeout(() => {
      setDialogState(prevState => ({ ...prevState, show: true, rowData }));
    }, 100);
  };

  const actions = [
    row => ({
      icon: () => <Info style={{ color: blue[500] }} />,
      className: classes.actionBlueButton,
      tooltip: 'Details',
      onClick: detailsRowClick,
    }),
  ];

  if (dialogState.refreshData) {
    tableRef.current.onQueryChange();
    setDialogState(prevState => ({ ...prevState, refreshData: false }));
  }

  useEffect(() => {
    getTotal();
  }, []);

  const columns = [
    {
      title: 'S#',
      width: '4%',
      field: 'itemNo',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.itemNo}</h4>
            {/* <Box className={classes.tableNumberField} fontSize={{ xs: 15, sm: 15 }}>
                            {rowData.itemNo}
                        </Box> */}
          </div>
        );
      },
    },
    {
      title: 'Request#',
      field: 'id',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.id}</h4>
            {/* <Box className={classes.tableNumberField} fontSize={{ xs: 15, sm: 15 }}>
                            {rowData.id}
                        </Box> */}
          </div>
        );
      },
    },
    {
      title: 'CNIC',
      field: 'cnic',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.cnic}</h4>
          </div>
        );
      },
    },
    {
      title: 'Requested By',
      field: 'created_by',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.created_by}</h4>
          </div>
        );
      },
    },
    {
      title: 'Requested At',
      field: 'request_at',
      render: rowData => {
        return (
          <div>
            <h4>{moment(rowData.created_at).format('D MMM YYYY hh:mm a')}</h4>
          </div>
        );
      },
    },
    {
      title: 'Status',
      field: 'status',
      render: rowData => {
        return <div>{getStatusChip(rowData)}</div>;
      },
    },
  ];

  return (
    <div>
      {/* {state.is_loading ? (
        <Backdrop className={classes.backdrop} open={state.is_loading}>
          <CircularProgress color="secondary" />
        </Backdrop>
      ) : ( */}
      <PageContainer>
        <div>
          <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
            Pending Update Requests
          </Box>
        </div>
        <Divider />
        <br />
        <br />

        <MaterialTable
          tableRef={tableRef}
          icons={tableIcons}
          title="Requests List"
          columns={columns}
          actions={actions}
          data={async query => {
            try {
              if (state.totalData > 0) {
                var { orderBy, orderDirection, page, pageSize, search } = query;
                const data = await getData({
                  orderBy: orderBy ? orderBy.field : null,
                  orderDirection,
                  page: page + 1,
                  pageSize,
                  search,
                });
                return new Promise((resolve, reject) => {
                  resolve({
                    data,
                    page: query.page,
                    totalCount: state.totalData, //? state.totalAssociations : 5//state.totalAssociations
                  });
                });
              } else {
                throw new Error('Test');
              }
            } catch (e) {
              return new Promise((resolve, reject) => {
                resolve({
                  data: [],
                  page: query.page,
                  totalCount: 0, //? state.totalAssociations : 5//state.totalAssociations
                });
              });
            }
          }}
          page={1}
          options={{
            actionsColumnIndex: -1,
            exportAllData: true,
            draggable: false,
            sorting: false,
            headerStyle: {
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
            },
            rowStyle: (rowData, index) => ({
              backgroundColor: index % 2 === 0 ? grey[50] : '#FFF',
            }),
            toolbar: true,
            exportMenu: [
              {
                label: 'Export PDF',
                exportFunc: (cols, datas) =>
                  ExportPdf(cols, datas, 'Pending Update Requests ' + moment().format('DD-MM-YYYY')),
              },
              {
                label: 'Export CSV',
                exportFunc: (cols, datas) =>
                  ExportCsv(cols, datas, 'Pending Update Requests ' + moment().format('DD-MM-YYYY')),
              },
            ],
            showFirstLastPageButtons: true,
            pageSize: 20,
            padding: 'default',
            pageSizeOptions: [20, 50, 100],
          }}
        />

        {dialogState.show && <UpdateDetails dialogState={dialogState} setDialogState={setDialogState} />}
      </PageContainer>
      {/* )} */}
    </div>
  );
};

export default withStyles({}, { withTheme: true })(ListAll);

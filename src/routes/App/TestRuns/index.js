import React, { useState, forwardRef, useEffect, createRef } from 'react';
import { Box, TextField, MenuItem, Chip, Divider } from '@material-ui/core';

import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, green, grey, orange } from '@material-ui/core/colors';

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
import Chart from './Chart'
import { useSelector } from 'react-redux';
import Comments from '../Comments';
import { BiCommentDots, FaInfoCircle } from 'react-icons/all'
import { Constants } from '@services';

const MySwal = withReactContent(Swal);
var crypto = require('crypto');

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



var tableRef = createRef();

const ListAll = (props) => {
  const { theme, match } = props;
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [dateStatus, setDateStatus] = useState(4);
  const [browserTF, setBrowser] = useState(0);
  const [resultStatus, setResultStatus] = useState(0);
  const org = useSelector(({ org }) => org);
  const [showComments, setShowComments] = useState(false);
  const [histId, setHistId] = useState(null);

  const dateStatusArr = [
    { name: 'Today', value: 1 },
    { name: 'Yesterday', value: 2 },
    { name: 'Last 7 Days', value: 3 },
    { name: 'Last 30 Days', value: 4 },
  ]

  const browsers = [
    { title: 'All', value: 0, name: '' },
    { title: 'Chrome', value: 1, name: 'chrome' },
    { title: 'FireFox', value: 2, name: 'firefox' },
    { title: 'Microsft Edge', value: 3, name: 'edge' },
  ]

  const testStatusArr = [
    { title: 'All', value: 0 },
    { title: 'Passed', value: 1 },
    { title: 'Failed', value: 2 },
  ]

  const getBrowser = (browser) => {

    if (browser === 'chrome') {
      return <img src={'/images/chrome.svg'} height={20} />
    }

    if (browser === 'firefox') {
      return <img src={'/images/firefox.svg'} height={20} />
    }

    if (browser === 'edge') {
      return <img src={'/images/edge.svg'} height={20} />
    }
  }

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
      title: 'Executed By', field: 'username', render: (rowData) => {
        return (
          <div style={{ display: 'flex' }}>
            <h5>{rowData.username}</h5>
          </div>
        )
      }
    },
    {
      title: 'Browser', field: 'browser', render: (rowData) => {
        return (
          <div style={{ display: 'flex' }}>
            {getBrowser(rowData.browser)}
            &nbsp;
            <h5>{rowData.browser}</h5>
          </div>
        )
      }
    },
    {
      title: 'Test Name', field: 'name', render: (rowData) => {
        return (
          <div style={{ display: 'flex' }}>
            <h5>{rowData.test_name}</h5>
          </div>
        )
      }
    },
    {
      title: 'Started At', field: 'start_duration', render: (rowData) => {
        return (
          <div>
            <h5>{moment(rowData.start_duration).utc().local().format('D/MM/YYYY hh:mm a')}</h5>
          </div>
        )
      }
    },
    {
      title: 'Duration', field: 'duration', render: (rowData) => {
        return (
          <div>
            <h5>{moment.duration((moment(rowData.start_duration).utc().local().diff(moment(rowData.end_duration).utc().local()))).humanize()}</h5>
          </div>
        )
      }
    },
    {
      title: 'Status', field: 'status', render: (rowData) => {
        return (
          <div>
            {rowData.pass === 1 ?
              <Chip size="small" label="Pass" color="primary" style={{ background: green[500] }} />
              :
              <Chip size="small" label="Failed" color="secondary" />
            }
            {/* <h5>{rowData.role}</h5> */}
          </div>
        )
      }
    }
  ]

  const actions = [
    row => ({
      icon: () => <BiCommentDots style={{ color: row.notes.length > 0 ? orange[500] : blue[500] }} />,
      className: classes.actionBlueButton,
      tooltip: row.notes.length > 0 ? `${row.notes[0].description}` : 'Add Comments',
      onClick: commentsRowClick,
    }),
    row => ({
      icon: () => <FaInfoCircle style={{ color: blue[500] }} />,
      className: classes.actionBlueButton,
      tooltip: 'Detailed Information',
      onClick: infoRowClick,
    }),
  ];

  const infoRowClick = async (event, rowData) => {
    event.preventDefault();
    setTimeout(() => {
      var cipher = crypto.createCipher(Constants.ALGO, Constants.TKV);
      var encrypted = cipher.update(rowData._id, 'utf8', 'hex') + cipher.final('hex');
      window.open(window.location.origin + `/app/rundetail/` + encrypted, '_blank');
    }, 10);
  };

  const commentsRowClick = async (event, rowData) => {
    event.preventDefault();
    setTimeout(() => {
      // setRowData(rowData);
      setHistId(rowData._id)
      setShowComments(true)
    }, 10);
  };


  const getData = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post('test/all-history', { ...data, type: dateStatus, org_id: org._id, browser: browserTF, result_status: resultStatus }).then(ans => {
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

  useEffect(() => {
    try {
      tableRef.current.onQueryChange()
    } catch (error) {

    }
  }, [])

  return (
    <PageContainer heading="" breadcrumbs={breadcrumbs}>

      <div style={{ marginTop: "-6%" }}>
        <br /><br />
        <Chart type={dateStatus} browser={browserTF} result_status={resultStatus} />
        <br />
        <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select Status"
            margin='normal'
            style={{ width: '20%' }}
            name='date_status'
            value={dateStatus}
            onChange={(e) => {
              e.preventDefault();
              let { value } = e.target;
              setDateStatus(value)
              tableRef.current.onQueryChange()
            }}
            variant="outlined" >
            {
              dateStatusArr.map(role => (
                <MenuItem key={role.value} value={role.value}>
                  {role.name}
                </MenuItem>
              ))
            }
          </TextField>
          &nbsp;&nbsp;
          <TextField
            id="outlined-select-currency"
            select
            style={{ width: '20%' }}
            label="Select Browser"
            margin='normal'
            value={browserTF}
            onChange={(e) => {
              e.preventDefault();
              let { value } = e.target;
              setBrowser(value)
              tableRef.current.onQueryChange()
            }}
            variant="outlined" >
            {
              browsers.map(role => (
                <MenuItem key={role.value} value={role.value}>
                  {getBrowser(role.name)} &nbsp; {role.title}
                </MenuItem>
              ))
            }
          </TextField>
          &nbsp;&nbsp;
          <TextField
            id="outlined-select-currency"
            select
            style={{ width: '20%' }}
            label="Result Status"
            margin='normal'
            value={resultStatus}
            onChange={(e) => {
              e.preventDefault();
              let { value } = e.target;
              setResultStatus(value)
              tableRef.current.onQueryChange()
            }}
            variant="outlined" >
            {
              testStatusArr.map(role => (
                <MenuItem key={role.value} value={role.value}>
                  {role.title}
                </MenuItem>
              ))
            }
          </TextField>
        </Box>
        <Divider />
        <br />
        <MaterialTable
          tableRef={tableRef}
          icons={tableIcons}
          title="Test Runs"
          columns={columns}
          actions={actions}
          data={async (query) => {
            try {
              var { orderBy, orderDirection, page, pageSize, search } = query;
              const data = await getData({ orderBy, orderDirection, page, pageSize, search });
              return new Promise((resolve, reject) => {
                resolve({
                  data: data,
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

        {showComments && <Comments hideDialog={setShowComments} histId={histId} tableRef={tableRef} />}
      </div>
    </PageContainer>
  );
};

export default (withStyles({}, { withTheme: true })(ListAll));

import { Tooltip, Fab, Box } from '@mui/material'
import React, { useState, forwardRef, createRef } from 'react';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, grey, red } from '@material-ui/core/colors';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Axios from 'axios';
import {
  AddBox, ArrowDownward, Check, ChevronLeft,
  ChevronRight, Clear, DeleteOutline, Edit,
  FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn,
} from '@material-ui/icons';
import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import { VscEdit, RiDeleteBin7Line, } from 'react-icons/all'
import AddIcon from '@material-ui/icons/Add';
import ShowDialog from "./ShowDialog";
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
var tableRef = createRef();
const ProcessAction = (props) => {
  const { theme } = props;
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const org = useSelector(({ org }) => org);
  const columns = [
    {
      title: 'S#', width: "4%", field: 'index', render: (rowData) => {
        return (
          <div>
            <h5>1</h5>
          </div>
        )
      }
    },
    {
      title: 'Name', field: 'name', render: (rowData) => {
        return (
          <div style={{ display: 'flex' }}>
            <h5>alihassas</h5>
          </div>
        )
      }
    },
    {
      title: 'Type', field: 'type', render: (rowData) => {
        return (
          <div>
            <h5>checking</h5>
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
  const actions = [
    row => ({
      icon: () => <VscEdit style={{ color: 'black' }} size={20} />,
      className: '',
      tooltip: `Edit Role`,
      onClick: () => { }
    }),
    row => ({
      icon: () => <RiDeleteBin7Line style={{ color: red[500] }} size={20} />,
      className: '',
      tooltip: `Delete Role`,
      onClick: () => { },
    }),
  ];

  return (
    <PageContainer heading="" breadcrumbs={breadcrumbs}>
      <Box width="100%" position="relative">
        <Fab size="small" color="primary" sx={{ position: "absolute", right: "5%" ,top:"-8vh"}}
          onClick={() => { setShowDialog(true)}}>
          <AddIcon style={{ color: "white" }} />
        </Fab>
      </Box>
      <MaterialTable
        tableRef={tableRef}
        icons={tableIcons}
        title="Processing Actions"
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
                totalCount: data.length
              })
            })
          } catch (e) {
            return new Promise((resolve, reject) => {
              resolve({
                data: [],
                page: query.page,
                totalCount: 0
              })
            })
          }
        }}
        page={1}
        options={{
          actionsColumnIndex: -1,
          draggable: false,
          sorting: false,
          cellStyle: {
            hover: blue[500]
          },
          rowStyle: (rowData, index) => ({
            backgroundColor: (index % 2 === 0) ? grey[50] : '#FFF',
            height: 5,
          }),
          showFirstLastPageButtons: true,
          pageSize: 10,
          padding: 'default',
          pageSizeOptions: [10, 20, 50, 100],
        }}
      />
      {showDialog && <ShowDialog  hideDialog={setShowDialog} dialogValue={showDialog}/>}
    </PageContainer>
  );
};

export default (withStyles({}, { withTheme: true })(ProcessAction));

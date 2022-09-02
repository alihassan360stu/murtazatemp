import React, { useState, forwardRef, createRef } from 'react';
import { Divider, Box, Typography, FormControlLabel, Checkbox, Button, TextField,Avatar } from '@material-ui/core';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MaterialTable from '@material-table/core';
import {
    AddBox, ArrowDownward, Check, ChevronLeft,
    ChevronRight, Clear, DeleteOutline, Edit,
    FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn,
    MoreVert, FileCopy, ControlPointDuplicate, Delete, PlayArrow, Add, History,
  }
    from '@material-ui/icons';
    import Axios from 'axios';
    import { makeStyles} from '@material-ui/core/styles';
import qs from 'qs';
import { blue, green, orange, red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: '100%',
        backgroundColor: theme.palette.background.paper,
    }}))


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

const initialDialogState = {
    show: false,
    refreshData: false,
    showPerm: false,
    rowData: {}
  }
    var tableRef = createRef();
const Report = (props) => {
    const [refereshData, setRefereshData] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [dialogState, setDialogState] = useState(initialDialogState);
    const [selectedRows, setSelectedRows] = useState([]);
    const { theme } = props;
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
          title: 'User Name', field: 'username', render: (rowData) => {
            return (
    
              <Box display="flex" alignItems="center">
                {/* <Avatar style={{ backgroundColor: "blue", marginRight: "4%",textTransform:"uppercase" }}>{rowData.username[0]}</Avatar> */}
                <Typography variant="h5">
                 {
                    rowData.name
                 }
                </Typography>
              </Box>
    
            )
          }
        },
        {
          title: 'Email Address', field: 'Email', render: (rowData) => {
            return (
              <div style={{ display: 'flex', alignItems: "center" }}>
                <Typography variant="h5">
                
                {
                    rowData.email
                }
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
      icon: () => <Delete style={{ color:"red" }} />,
    //   className: classes.actionBlueButton,
      tooltip: "Delete",
      onClick: ()=>{},
    }),
    row => ({
      icon: () => <Edit style={{ color: blue[500] }} />,
    //   className: classes.actionBlueButton,
      tooltip: 'Detailed Information',
      onClick: ()=>{},
    }),
  ];


    return (
        <Box  width={'100%'}>
            <Box mb="5vh">
                <FormControlLabel checked={isChecked} control={<Checkbox />} label={'Send Monthly Reports To'} onChange={(e) => {
                    let { checked } = e.target
                    setIsChecked(checked)
                }} />
                <br/>
                <TextField
                    type="text"
                    label={'Email Address'}
                    name="email"
                    style={{width:"30%"}}
                    margin="normal"
                    variant="outlined"
                    required
                    disabled={!isChecked}
                />
                <br />
                <br/>
                <Button variant='contained' color='primary' disabled={!isChecked} onClick={(e) => {
                    MySwal.fire('Success', 'Settings Saved', 'success');
                }}> Save </Button>
            </Box>

            <br />
        <MaterialTable
          tableRef={tableRef}
          icons={tableIcons}
          title="Users List"
          columns={columns}
          actions={actions}
          data={[
            { name: 'Ali Hassan', email: 'ali.hassan.stu@gmail', index: 1},
            { name: 'google', email: 'google@gmail.com', index: 2},
          ]} 
        //   data={async (query) => {
        //     try {
        //       var { orderBy, orderDirection, page, pageSize, search } = query;
        //       const data = await getData({ orderBy: orderBy ? orderBy.field : null, orderDirection, page: (page + 1), pageSize, search });
        //       return new Promise((resolve, reject) => {
        //         resolve({
        //           data,
        //           page: query.page,
        //           totalCount: data.length //? state.totalAssociations : 5//state.totalAssociations
        //         })
        //       })
        //     } catch (e) {
        //       return new Promise((resolve, reject) => {
        //         resolve({
        //           data: [],
        //           page: query.page,
        //           totalCount: 0 //? state.totalAssociations : 5//state.totalAssociations
        //         })
        //       })
        //     }
        //   }}
          page={1}

          options={{
            actionsColumnIndex: -1,
            showSelectAllCheckbox: true,
            draggable: false,
            sorting: false,
            headerStyle: {
              backgroundColor:"rgba(58,24,229)",
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
        </Box>
    );
};


export default Report;
import React, { useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { alpha } from '@material-ui/core/styles';
import 'react-virtualized/styles.css';
import { useState } from 'react';
import TableGrid from './TableGrid';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Divider, Breadcrumbs, Tooltip, Box, IconButton, TextField, InputAdornment } from '@material-ui/core';
import Fade from 'react-reveal/Fade';
import AddNew from './AddNew';
import Edit from './Edit';
import Schedule from '../../ScheduleDialog';
import { FaHome, MdDriveFileMoveOutline, BiAddToQueue, FcFolder, BsFillPlayFill, TbSearch, BsFolderPlus, FaEdit, GrSchedulePlay, RiDeleteBin7Line } from 'react-icons/all'
import MultiRun from './MultiRun';
import MoveToFolder from './MoveToFolder';
import Tests from './Tests';
import qs from 'qs';

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

const styles = theme => ({
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
});

export default function ReactVirtualizedTable() {
  const [selectedIdx, setSelectedIdx] = useState([]);
  const [busy, setBusy] = useState(true);
  const [showCF, setShowCF] = useState(false);
  const [search, setSearch] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [reload, setReload] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [parent, setParent] = useState(null);
  const [paths, setPaths] = useState([]);
  const [data, setData] = useState([]);
  const [tests, setTests] = useState([]);
  const [reset, setReset] = useState(false);
  const org = useSelector(({ org }) => org);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showMultiRun, setShowMultiRun] = useState(false);
  const [showMove, setShowMove] = useState(false);

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
            item.name = { name: item.name, icon: 1, type: 2 }
          })
          let tests = tempData.tests
          tests.map(item => {
            item.kind = 'test'
            item.name = { name: item.name, icon: 2, type: 1 }
          })
          setData(groups.concat(tests));
          setTests(tests)
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
    if (reload)
      setReload(false)

    if (parent) {
      let params = {
        search,
        parent,
        org_id: org._id,
        pageSize: 1000,
        page: 1,
        status: "1"
      }
      getData(params);
    }
  }, [parent, search, org, reload])


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

  const onCreateFolderClick = async (e) => {
    e.preventDefault();
    setShowCF(true)
  }

  const onEditFolderClick = async (e) => {
    e.preventDefault();
    setShowEdit(true)
  }

  const deleteCall = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post('group/delete', data).then(ans => {
        if (ans.data.status) {
          setReload(true)
          resolve(ans.data.message)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        reject(e)
      })
    })
  }

  const onDeleteFolderClick = async (e) => {
    e.preventDefault();
    let message = '';
    if (rowData.name.type == 1)
      message = 'Do You Really Want To Remove Selected Test Case From This Group ?'
    else
      message = 'Do You Want To Delete Selected Group ? It Will Remove All Groups And Tests Inside.';

    MySwal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {
          setBusy(true)
          let dataToSubmit = {};
          if (rowData.name.type === 2) {
            dataToSubmit = { id: rowData._id, type: 1 }
          } else {
            dataToSubmit = { id: rowData._id, type: 2, group_id: parent }
          }
          const result = await deleteCall(dataToSubmit)
          MySwal.fire('Success', result, 'success');
          setBusy(false)
        } catch (e) {
          setBusy(false)
          MySwal.fire('Error', e, 'error');
        }
      }
    });
  }

  const scheduleRowClick = async () => {
    setTimeout(() => {
      setShowSchedule(true)
    }, 10);
  }

  const testRunSync = (params) => {
    return new Promise((resolve, reject) => {
      let { test_id, browser } = params
      let data = qs.stringify({
        test_id,
        browser,
        org_id: org._id,
        type: rowData.name.type
      });

      var config = {
        method: 'post',
        url: '/test/bulk-run',
        data: data
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
          resolve(ans.data.message)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    })
  }

  const testRunAsync = (params) => {
    return new Promise((resolve, reject) => {
      let { test_id, browser } = params
      let data = qs.stringify({
        test_id,
        browser,
        org_id: org._id,
        type: rowData.name.type
      });

      var config = {
        method: 'post',
        url: '/test/bulk-run-concurrent',
        data: data
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
          resolve(ans.data.message)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    })
  }

  const onRunButtonClick = (e) => {
    setTimeout(() => {
      setShowMultiRun(true)
    }, 10);
  }

  const testRunCallMulti = async (browser, type) => {
    try {
      let params = {
        test_id: rowData._id,
        browser,
      }
      if (type == 1) {
        testRunSync(params)
      } else {
        testRunAsync(params)
      }
      if (rowData.name.type == 2)
        MySwal.fire('Success', 'Tests Under Root Of Selected Group Are Running Please Check Tests View After Few Minutes', 'success');
      else
        MySwal.fire('success', 'Selected Test Is Running Please Check Tests View After Few Minutes', 'success')
    } catch (e) {
      showMessage('error', e, 'error')
    }
  }

  const onAddTestClick = (e) => {
    setTimeout(() => {
      setShowTests(true)
    }, 10);
  }

  const moveFolderRowClick = async () => {
    setTimeout(() => {
      setShowMove(true)
      // setShowSchedule(true)
    }, 10);
  }

  return (
    <div>
      <Box display={'flex'} justifyContent={'right'} mt={-5}>
        {selectedIdx.length > 0 && rowData &&
          <Fade right opposite cascade >
            <Tooltip
              title={"Run Test"}
            >
              <IconButton size="medium" color="default" aria-label="add" onClick={onRunButtonClick} disabled={busy}>
                <BsFillPlayFill style={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          </Fade>
        }

        {selectedIdx.length > 0 && rowData &&
          <Fade right opposite cascade >
            <Tooltip
              title={"Move To Folder"}
            >
              <IconButton size="medium" color="default" aria-label="add" onClick={moveFolderRowClick} disabled={busy}>
                <MdDriveFileMoveOutline style={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          </Fade>
        }

        {selectedIdx.length > 0 && rowData && rowData.name.icon === 1 &&
          <Fade right opposite cascade >
            <Tooltip
              title={"Schedule Group"}
            >
              <IconButton size="medium" color="default" aria-label="add" onClick={scheduleRowClick} disabled={busy}>
                <GrSchedulePlay style={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          </Fade>
        }

        {selectedIdx.length > 0 && rowData && rowData.name.icon === 1 &&
          <Fade right opposite cascade >
            <Tooltip
              title={"Edit Selected Group"}
            >
              <IconButton size="medium" color="default" aria-label="add" onClick={onEditFolderClick} disabled={busy}>
                <FaEdit style={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          </Fade>
        }

        {selectedIdx.length > 0 && rowData && //rowData.name.icon === 1 &&
          <Fade right opposite cascade >
            <Tooltip
              title={"Delete Selected Group"}
            >
              <IconButton size="medium" color="default" aria-label="add" onClick={onDeleteFolderClick} disabled={busy}>
                <RiDeleteBin7Line style={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          </Fade>
        }

        <Fade right opposite cascade >
          <Tooltip
            title={"Add Tests Here"}
          >
            <IconButton size="medium" color="default" aria-label="add" onClick={onAddTestClick} disabled={busy}>
              <BiAddToQueue style={{ color: 'black' }} />
            </IconButton>
          </Tooltip>
        </Fade>

        <Fade right opposite cascade >
          <Tooltip
            title={"Create New Group"}
          >
            <IconButton size="medium" color="default" aria-label="add" onClick={onCreateFolderClick} disabled={busy}>
              <BsFolderPlus style={{ color: 'black' }} />
            </IconButton>
          </Tooltip>
        </Fade>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'start' }} mt={-15}>
        <TextField
          type="text"
          label={'Search'}
          name="search"
          onChange={(e) => {
            e.preventDefault();
            let { value } = e.target;
            setSearch(value)
          }}
          value={search}
          margin="normal"
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TbSearch size={20} />
              </InputAdornment>
            ),
          }}
        />
        {/* <TbSearch size={20} style={{ color: 'black' }} />
        <TextField
          type="text"
          label={'Search'}
          name="search"
          onChange={(e) => {
            e.preventDefault();
            let { value } = e.target;
            setSearch(value)
          }}
          value={search}
          margin="normal"
          variant="standard"
        /> */}
      </Box>

      <Breadcrumbs aria-label="breadcrumb">
        {paths.map((item, index) => {
          return (
            <Box className=' not-select' display='flex' justifyContent={'center'} alignItems={'center'} key={index}>
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
      <Paper style={{ height: 400, width: '100%' }}>
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
              // let tempArr = selectedIdx;
              // if (!tempArr.includes(index)) {
              //   tempArr.push(index)
              // } else {
              //   tempArr = tempArr.filter(item => item !== index)
              // }
              // setSelectedIdx(tempArr)
              // setReset(true)
            } else {
              if (rowData.name.icon === 1)
                getMore(rowData)
            }
          }}

          containerStyle={{
            width: "100%",
            maxWidth: "100%"
          }}
          style={{
            width: "100%"
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

        {showCF && <AddNew busy={busy} setBusy={setBusy} org_id={org._id} parent={parent} showDialog={setShowCF} setReload={setReload} />}
        {showEdit && <Edit busy={busy} setBusy={setBusy} showDialog={setShowEdit} setReload={setReload} rowData={rowData} />}
        {showSchedule && <Schedule hideDialog={setShowSchedule} groupId={rowData._id} testId={null} link={"create-group"} />}
        {showMultiRun && <MultiRun showDialog={setShowMultiRun} testRunCall={testRunCallMulti} />}
        {showTests && <Tests showDialog={setShowTests} group_id={parent} setReload={setReload} tests={tests} />}
        {showMove && <MoveToFolder hideDialog={setShowMove} setRefereshData={setReload} selectedRowData={rowData} sourceId={parent} />}

      </Paper>
    </div >
  );
}

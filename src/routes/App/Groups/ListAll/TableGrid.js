import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles, alpha } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import { Box, CircularProgress } from '@material-ui/core';
import { FcFolder, AiOutlineFile } from 'react-icons/all'
import { blue } from '@material-ui/core/colors';


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
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
    width: '100%',
  },
  tableRowHover: {

  },
  selected: {
    backgroundColor: theme.palette.primary.main,
  },
  notSelected: {
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.05),
    },
  },
  tableCell: {
    flex: 1,
    width: '100%',
    color: 'black',
  },
  tableCellWhite: {
    flex: 1,
    width: '100%',
    color: 'white'
  },
  whiteColor: {
    color: 'white'
  },
  blackColor: {
    color: 'black'
  },
  noClick: {
    cursor: 'initial',
  },
});

const getIcon = (icon) => {
  // FcFolder,AiOutlineFile
  if (icon == 1) {
    return <FcFolder size={'20'} />
  } else
    return <AiOutlineFile size={'20'} style={{ color: blue[500] }} />
}

const MuiVirtualizedTable2 = (props) => {
  const { classes, columns, rowHeight, headerHeight, busy, reset, setReset, ...tableProps } = props;

  useEffect(() => {
    if (reset)
      setReset(false)
  }, [busy, reset, setReset])

  const getRowClassName = ({ index }) => {
    const { classes, onRowClick, selectedIdx } = props;
    let selected = selectedIdx.includes(index);

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
      [classes.selected]: selected,
      [classes.notSelected]: !selected,
      [classes.whiteColor]: selected,
      [classes.blackColor]: !selected,
    });
  };

  const cellRenderer = (params) => {
    const { columns, classes, rowHeight, onRowClick, selectedIdx } = props;
    const { cellData, columnIndex, rowIndex } = params;
    let selected = selectedIdx.includes(rowIndex);
    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
          // [classes.selected]: selected,
        }) + ' not-select'}
        variant="body"
        style={{ height: rowHeight, color: selected ? 'white' : 'black', width: '100%' }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}>
        {columnIndex === 0 ?
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            {getIcon(cellData.icon)}
            &nbsp;&nbsp;
            {cellData.name}
          </Box>
          :
          cellData
        }
      </TableCell>
    );
  };

  const headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes, } = props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick) + ' not-select'}
        variant="head"
        style={{ height: headerHeight, width: '100%' }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}>
        <span>{label}</span>
      </TableCell>
    );
  };

  {/* {busy && <CircularProgress size={'300'} variant='determinate' />} */ }
  if (busy)
    return <Box
      display={'flex'}
      width={'100%'}
      height={'100%'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <CircularProgress size={50} />
    </Box>
  else
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
          // headerClassName={classes.header}
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            className={classes.table}

            {...tableProps}
            rowClassName={getRowClassName}>
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  style={{ width: '100%' }}
                  width={200}
                  headerRenderer={headerProps =>
                    headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer >
    );
}

MuiVirtualizedTable2.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  selectedIdx: PropTypes.array,
  rowHeight: PropTypes.number,
};


export default withStyles(styles)(MuiVirtualizedTable2);

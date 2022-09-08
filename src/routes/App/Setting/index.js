import React, { useState } from 'react';
import { Divider, Box, Grid } from '@material-ui/core';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { makeStyles, withStyles, alpha, useTheme, lighten } from '@material-ui/core/styles';
import CLI from "./CLI"
import Intigration from "./Intigration"
import Report from "./Report"
import GridContainer from '@jumbo/components/GridContainer';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: '100%',
        // padding: '2%',
        // margin: '0 auto',
        backgroundColor: theme.palette.background.paper,
    },
    titleRoot: {
        marginBottom: 14,
        color: theme.palette.text.primary,
    },
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.common.dark, 0.12),
        }
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

    rootLoading: {
        maxWidth: '100vh',
        padding: '2%',
        margin: '0 auto',
        backgroundColor: lighten(theme.palette.background.paper, 0.1),

    },
    button: {
        marginRight: theme.spacing(2),
    },
    pageMainTitle: {
        color: theme.palette.text.primary,
        fontWeight: 800,
        lineHeight: 1.5,
        marginBottom: 20,
        textShadow: '2px 4px 4px hsla(0,0%,45.9%,.8)',
        width: '100%',
        // textAlign: 'center'
    },
    backButton: {
        marginRight: theme.spacing(2),
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    avatar: {
        boxShadow: '6px 6px 6px hsla(0,0%,45.9%,.8)',
        borderRadius: '50%'
    },
}));


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}>
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </Box>
    );
}

const AntTabs = withStyles({
    root: {
        borderBottom: '2px solid #e8e8e8',
    },
    indicator: {
        backgroundColor: '#6A03DD',
        // height: 2.5,
        // fontWeight: 400,
        // marginLeft: 20,
        // marginRight: 20
    },
})(Tabs);

const AntTabNormal = withStyles(theme => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        flexGrow: 1,
        fontWeight: theme.typography.fontWeightMedium,
        marginRight: theme.spacing(1),
        fontSize: 16,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: '#640AF8',
            opacity: 1,
        },
        '&$selected': {
            color: '#853FF9',
            fontWeight: theme.typography.fontWeightBold,
        },
        '&:focus': {
            color: '#640AF8',
        },
    },
    indicatorColor: {
        backgroundColor: '#640AF8',
    },
    selected: {},
}))(props => <Tab  {...props} />);

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`
        // centered: true
    };
}

const Setting = () => {
    const classes = useStyles();
    const [showBorder, setShowBorder] = useState([true, false, false])
    const [value, setValue] = React.useState(0);
    const theme = useTheme();

    const handleChangeIndex = index => {
        setValue(index);
        // alert('here')
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <PageContainer>
            <GridContainer>
                <Grid item xs={12}>
                    <div>
                        <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
                            Settings
                        </Box>
                    </div>
                    <Divider />
                    <br />
                </Grid>
            </GridContainer>

            <Box className={classes.root}>
                <Box position="static" color="default">
                    <AntTabs value={value} onChange={handleChange} aria-label="ant example">
                        <AntTabNormal label="CLI"   {...a11yProps(0)} />
                        <AntTabNormal label="Integrations"   {...a11yProps(1)} />
                        <AntTabNormal label="Reports"   {...a11yProps(2)} />
                    </AntTabs>
                </Box>
                
                <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex} >
                    <TabPanel value={value} index={0}>
                        <Grid>
                            <CLI />
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Grid>
                            <Intigration />
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Grid>
                            <Report />
                        </Grid>
                    </TabPanel>
                </SwipeableViews>
            </Box>

            {/* <Box display="flex" alignItems="center" width="40%" height="4vh">
                <span
                    style={{ borderBottom: showBorder[0] && "1px solid blue", color: showBorder[0] && "blue", marginRight: "5%" }}
                    onClick={() => { setShowBorder([true, false, false]) }}
                    className={classes.hover}><Typography variant="h5" className={classes.typo}> CLI </Typography></span>
                <span
                    style={{ borderBottom: showBorder[1] && "1px solid blue", color: showBorder[1] && "blue", marginRight: "5%" }}
                    onClick={() => { setShowBorder([false, true, false]) }}
                    className={classes.hover}><Typography variant="h5" className={classes.typo}> Intigration </Typography></span>
                <span
                    style={{ borderBottom: showBorder[2] && "1px solid blue", color: showBorder[2] && "blue" }}
                    onClick={() => { setShowBorder([false, false, true]) }}
                    className={classes.hover}><Typography variant="h5" className={classes.typo}> Report </Typography></span>

            </Box>
            <Box>
                <br />
                <br />
                <br />
                {
                    showBorder[0] && <CLI />
                }
                {
                    showBorder[1] && < Intigration />
                }
                {
                    showBorder[2] && <Report />
                }
            </Box> */}
        </PageContainer>
    );
};

export default Setting;

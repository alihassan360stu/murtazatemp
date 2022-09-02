import React, { useState } from 'react';
import { Divider, Box, Typography } from '@material-ui/core';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import CLI from "./CLI"
import Intigration from "./Intigration"
import Report from "./Report"

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100vh',
        padding: '2%',
        margin: '0 auto',
        backgroundColor: lighten(theme.palette.background.paper, 0.1),
    },
    typo: {
        fontSize: "1.2rem",
    },
    hover: {
        cursor: "pointer",
        padding: ".5vh 8%",
        "&:hover": {
            textShadow: "1px 1px black",
            borderBottom:"1px solid blue",
            color:"blue"
        }
    }
}));

const Setting = () => {
    const classes = useStyles();
    const [showBorder, setShowBorder] = useState([true, false, false])

    return (
        <PageContainer heading={`Setting`}>
            <Box display="flex" alignItems="center" width="40%" height="4vh">
                <span
                    style={{ borderBottom:showBorder[0] && "1px solid blue",color:showBorder[0]&&"blue" , marginRight:"5%" }}
                    onClick={() => { setShowBorder([true, false, false]) }}
                    className={classes.hover}><Typography variant="h5" className={classes.typo}> CLI </Typography></span>
                <span
                    style={{  borderBottom:showBorder[1] && "1px solid blue",color:showBorder[1]&&"blue",marginRight:"5%" }}
                    onClick={() => { setShowBorder([false, true, false]) }}
                    className={classes.hover}><Typography variant="h5" className={classes.typo}> Intigration </Typography></span>
                <span
                    style={{  borderBottom:showBorder[2] && "1px solid blue",color:showBorder[2]&&"blue" }}
                    onClick={() => { setShowBorder([false, false, true]) }}
                    className={classes.hover}><Typography variant="h5" className={classes.typo}> Report </Typography></span>

            </Box>
            <Box>
                <br/>
                <br/>
                <br/>
                {
                    showBorder[0] && <CLI />
                }
                {
                    showBorder[1] && < Intigration />
                }
                {
                    showBorder[2] && <Report />
                }
            </Box>
        </PageContainer>
    );
};

export default Setting;

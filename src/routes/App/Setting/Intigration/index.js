import React, { useState } from 'react';
import { Divider, Box, Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, CardActions, Collapse, } from '@material-ui/core';
import { Typography, Button } from '@mui/material';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import BugReportIcon from '@material-ui/icons/BugReport';
import { Link } from 'react-router-dom';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';
const useStyles = makeStyles(theme => ({
    button: {
        color: "black",
        backgroundColor: "blue",
        padding: "1vh 5%",
    },
    hover: {
        cursor: "pointer",
        padding: ".5vh 8%",
        "&:hover": {
            textShadow: "1px 1px black",
            borderBottom: "1px solid blue",
            color: "blue"
        }
    }, media: {
        height: "80px",

        paddingTop: '56.25%', // 16:9,
        marginTop: '30',

    },    hoverEffect:{
        "&:hover": {
          boxShadow:"1px 1px 1px 1px ",
          cursor:"pointer"
        }
    }
}));





const Intigration = () => {

    const classes = useStyles();
    const [buttonSelection, setButtonSelection] = useState(1)
    return (

        <Box minHeight="60vh" width="100%" >
            <Box>
                <Typography variant="h4">
                    Integrations
                </Typography>
                <Typography variant="h6">
                    Edit your preferences below (visit our docs for more info):
                </Typography>
            </Box>
            <br />
            <Box>
                <Button onClick={() => { setButtonSelection(1) }} style={{ cursor: "pointer", color: "blue", marginRight: "5%" }} variant="outlined">GENERAL</Button>
                <Button onClick={() => { setButtonSelection(2) }} style={{ cursor: "pointer", color: "blue", marginRight: "5%" }} variant="outlined">BUG TRACKER</Button>
                <Button onClick={() => { setButtonSelection(3) }} style={{ cursor: "pointer", color: "blue" }} variant="outlined">TEST MANAGMENT</Button>
            </Box>
            {
                buttonSelection === 1 && <Box marginTop="4vh" width="100%" display="flex" >
                    <Card style={{ width: "20%", height: "50vh", marginRight: "5%" }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                                    G
                                </Avatar>
                            }
                            title="GitHub"
                        />
                        <hr />
                        <CardMedia
                            className={classes.media}
                            image={require("./All Logos/github.png")} // require image
                            title="Contemplative Reptile"

                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Please login to Github to start the integration
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card style={{ width: "20%", height: "50vh", marginRight: "8%" }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                                    B
                                </Avatar>
                            }
                            title="BitBucket"
                        />
                        <hr />
                        <CardMedia
                            className={classes.media}
                            image={require("./All Logos/bitBucket.png")}// require image
                            title="Contemplative Reptile"

                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Please login to BitBucket to start the integration
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card style={{ width: "20%", height: "50vh", marginRight: "8%" }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                                    A
                                </Avatar>
                            }
                            title="Applitools"
                        />
                        <hr />
                        <CardMedia
                            className={classes.media}
                            image={require("./All Logos/Applitools.png")} // require image
                            title="Contemplative Reptile"

                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Want to use the full capabilities of our app? Contact
                                us and we will help you maximize your testings.
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card style={{ width: "20%", height: "50vh", marginRight: "8%" }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                                    S
                                </Avatar>
                            }
                            title="Slack"
                        />
                        <hr />
                        <CardMedia
                            className={classes.media}
                            image={require("./All Logos/Slack.png")}// require image
                            title="Contemplative Reptile"

                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Want to use the full capabilities of our app? Contact
                                us and we will help you maximize your testings.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

            }
           {
                buttonSelection === 2
                &&
                <Box display="flex" justifyContent="space-evenly" alignItems="center" width="50%" flexDirection="column">
                    <BugReportIcon style={{ marginTop: "5vh", fontSize: "3rem" }} />

                    <Typography variant='body1'>
                        Hello Gul!
                    </Typography>

                    <Typography variant='body1'>
                        This is the first bug you publish.
                    </Typography>

                    <Typography variant='body1'>
                        This is the first bug you publish.
                        Choose your tracker to publish bug automatically
                    </Typography>
                    <Box  mt="5vh" width="80%" height="15vh" display="flex" justifyContent="space-evenly" >
                        <Box className={classes.hoverEffect} boxShadow={1} width="20%" display="flex" justifyContent="space-evenly" alignItems="center">
                            <img style={{ width: "40px" }} src={require("./All Logos/jira.png")} alt='pic' />
                            < Typography>Jira</Typography>
                           
                        </Box>
                        <Box className={classes.hoverEffect} boxShadow={1} width="20%" display="flex" justifyContent="space-evenly" alignItems="center">
                            <img style={{ width: "40px" }} src={require("./All Logos/Trello.png")} alt='pic' />
                            < Typography> Trello</Typography>
                        </Box>
                        <Box className={classes.hoverEffect} boxShadow={1} width="20%" display="flex" justifyContent="space-evenly" alignItems="center">
                            <img style={{ width: "40px" }}src={require("./All Logos/Slack.png")} alt='pic' />
                            < Typography>Slack</Typography>
                        </Box>
                       
                        <Box className={classes.hoverEffect} boxShadow={1} width="20%" display="flex" justifyContent="space-evenly" alignItems="center">
                            <img style={{ width: "40px" }} src={require("./All Logos/github.png")} alt='pic' />
                            < Typography>GitHub</Typography>
                        </Box>
                    </Box>



                </Box>
            }
            {
                buttonSelection === 3 && <Box marginTop="4vh" width="100%" display="flex" >
                    <Card style={{ width: "20%", height: "50vh", marginRight: "5%" }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                                    T
                                </Avatar>
                            }
                            title="TestRail"
                        />
                        <hr />
                        <CardMedia
                            className={classes.media}
                            image={require("./All Logos/TestRail.png")} // require image
                            title="Contemplative Reptile"

                        />

                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Please login to TestRail to start the integration
                            </Typography>
                        </CardContent>
                    </Card>


                </Box>
            }


        </Box>

    );
};

export default Intigration;
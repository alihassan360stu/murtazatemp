import React from 'react';
import { Divider, Box , Typography} from '@material-ui/core';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { Link } from 'react-router-dom';
const Report = () => {


    return (

        <Box minHeight="60vh" width="100%" boxShadow={1} bgcolor="green">
            <Box>
                <Typography variant="h2">
                Integrations
                </Typography>
                <br/>
                <Typography variant="h6">
                Edit your preferences below (visit our docs for more info):
                </Typography>
            </Box>

        </Box>

    );
};

export default Report;
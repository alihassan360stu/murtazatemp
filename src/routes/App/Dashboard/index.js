import React from 'react';
import { Divider, Grid, Typography } from '@material-ui/core';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Tests from './Tests'
import YearWiseChart from './YearWiseChart'
import moment from 'moment';
import { useSelector } from 'react-redux';


const NewsDashboard = () => {

  const org = useSelector(({ org }) => org);


  return (
    <PageContainer>
      <h1>Insight {org ? org.name : ''}</h1>
      <Divider />
      <br />
      <Typography variant="h4" color="textPrimary">
        Tests Run Statistics
      </Typography>
      <br />
      <Tests />
      <br />
      <Typography variant="h4" color="textPrimary">
        {moment().utc().local().format('YYYY')} Run Detail
      </Typography>
      <br />
      <YearWiseChart />
    </PageContainer>
  );
};

export default NewsDashboard;

import React, { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import {  Route, Switch, withRouter } from 'react-router';
import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import AppLayout from './AppLayout';
import Dashboard from './Dashboard'
import { ListTests } from './Tests'
import { ListOrgs } from './Organizations'
import { ListGroups } from './Groups'
import UnderConstruction from './UnderConstruction';
import Setting from './Setting';
import TestHistory from './TestHistory';
import RunDetails from './RunDetails';
import Schedules from './Schedules';
import TestRuns from './TestRuns';
import Members from "./Members"
import Policies from "./Policies"
import APITesting from "./ApiTesting"

import { useEffect } from 'react';

const Routes = () => {
  const requestedUrl = '/app/'
  const orgs = useSelector(({ orgs }) => orgs);
  const [routes, setRoutes] = useState([])

  const getRoutes = () => {
    setTimeout(() => {
      let tempRoutes = []
      if (orgs.length > 0) {
        tempRoutes.push(<Route path={requestedUrl + `dashboard`} component={Dashboard} />)
        tempRoutes.push(<Route path={requestedUrl + `settings`} component={Setting} />)
        tempRoutes.push(<Route path={requestedUrl + `editor`} component={UnderConstruction} />)
        tempRoutes.push(<Route path={requestedUrl + `tests`} component={ListTests} />)
        tempRoutes.push(<Route path={requestedUrl + `runs`} component={TestRuns} />)
        tempRoutes.push(<Route path={requestedUrl + `groups`} component={ListGroups} />)
        tempRoutes.push(<Route path={requestedUrl + `members`} component={Members} />)
        tempRoutes.push(<Route path={requestedUrl + `schedules`} component={Schedules} />)
        tempRoutes.push(<Route path={requestedUrl + `policies`} component={Policies} />)
        tempRoutes.push(<Route path={requestedUrl + `testruns/:id`} component={TestHistory} />)
        tempRoutes.push(<Route path={requestedUrl + `apitesting`} component={APITesting} />)
       
        tempRoutes.push(<Route path={requestedUrl + `rundetail/:id`} component={RunDetails} />)
      }
      setRoutes(tempRoutes)
    }, 1000);
  }

  useEffect(() => {
    getRoutes();
  }, [orgs])

  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          {routes}
          <Route path={requestedUrl + `orgs`} component={ListOrgs} />
          <Route component={lazy(() => import('./404'))} />
        </Switch>
      </Suspense>
    </AppLayout>
  );
};

export default withRouter(Routes);

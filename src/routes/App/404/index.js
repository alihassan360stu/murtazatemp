import React from 'react';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginTop: '10%',
  },
  errorNumber: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 30,
    textShadow: '10px 6px 8px hsla(0,0%,45.9%,.8)',
  }
}));

const Error404 = () => {
  const classes = useStyles();
  const { authUser } = useSelector(({ auth }) => auth);
  const orgs = useSelector(({ orgs }) => orgs);
  const org = useSelector(({ org }) => org);
  const location = useLocation();
  const history = useHistory();

  setTimeout(() => {
    if (authUser) {
      // authUser.oranizations && authUser.oranizations.length < 1
      if (!org) {
        history.push('/app/orgs');
      }
    }
  }, 1000);

  return (
    <Box className={classes.root}>
      <Box fontSize={{ xs: 60, sm: 60 }} className={classes.errorNumber}>
        AUTON8
      </Box>
      <Box fontSize={{ xs: 60, sm: 60 }} className={classes.errorNumber}>
        <CircularProgress size={50} />
      </Box>
    </Box>
  );
};

export default Error404;

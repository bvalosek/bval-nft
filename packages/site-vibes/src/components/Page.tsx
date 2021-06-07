import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

import './styles/reset.css';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    page: {
      background: theme.palette.background.main,
      color: theme.palette.foreground.main,
      fontFamily: theme.font,
      minHeight: '100vh',
    },
  };
});

export const Page: FunctionComponent = (props) => {
  const classes = useStyles();
  return <div className={classes.page}>{props.children}</div>;
};

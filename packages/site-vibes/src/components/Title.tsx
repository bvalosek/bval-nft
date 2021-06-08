import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    header: {
      fontSize: theme.scaledSpacing(4.5),
      margin: theme.scaledSpacing(5),
      textDecoration: 'underline',
      textAlign: 'center',
    },
  };
});

export const Title: FunctionComponent = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.header}>{children}</div>;
};

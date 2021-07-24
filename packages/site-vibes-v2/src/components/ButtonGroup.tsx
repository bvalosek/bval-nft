import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      display: 'grid',
      gap: theme.spacing(4),
      textAlign: 'center',
    },
  };
});

export const ButtonGroup: FunctionComponent = (props) => {
  const classes = useStyles();
  return <div className={classes.container}>{props.children}</div>;
};

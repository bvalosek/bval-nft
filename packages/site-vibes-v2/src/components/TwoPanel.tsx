import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    panel: {
      '@media(min-width: 800px)': {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      },
      '@media(max-width:799px)': {
        '& div:first-child': { marginBottom: theme.spacing(4) },
      },
    },
  };
});

export const TwoPanel: FunctionComponent = (props) => {
  const classes = useStyles();
  return <div className={classes.panel}>{props.children}</div>;
};

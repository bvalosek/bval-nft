import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    stats: {
      '@media(max-width: 799px)': {
        fontSize: theme.spacing(3.5),
      },
    },
  };
});

export const Stats: FunctionComponent = (props) => {
  const classes = useStyles();
  return <div className={classes.stats}>{props.children}</div>;
};

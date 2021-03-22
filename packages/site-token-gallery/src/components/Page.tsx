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
      position: 'absolute',
      overflow: 'auto',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      '& code': {
        fontFamily: theme.monoFont,
      },
    },
  };
});

/** primary page wrapper */
export const Page: FunctionComponent = (props) => {
  const classes = useStyles();
  return <div className={classes.page}>{props.children}</div>;
};

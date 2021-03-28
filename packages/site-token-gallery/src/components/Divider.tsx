import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';

import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
    },
    divider: {
      width: theme.scaledSpacing(60, 5),
      backgroundColor: theme.palette.foreground.dark,
      height: '2px',
    },
  };
});

/** basic hr-style divider */
export const Divider: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.container}>
        <div className={classes.divider} />
      </div>
    </>
  );
};

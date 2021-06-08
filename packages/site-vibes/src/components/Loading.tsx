import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      fontSize: theme.scaledSpacing(10),
      textAlign: 'center',
    },
  };
});

export const Loading: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <p>⌛️</p>
    </div>
  );
};

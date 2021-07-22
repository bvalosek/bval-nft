import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';

import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
      paddingBottom: theme.spacing(20),
      whiteSpace: 'nowrap',
      width: '100%',
    },
  };
});

/** basic hr-style divider */
export const Divider: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.container}>* * *</div>
    </>
  );
};

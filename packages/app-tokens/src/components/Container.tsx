import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';

import { ThemeConfig } from '../Theme';

interface Props {
  row?: boolean;
}

const useStyles = makeStyles<ThemeConfig, Props>((theme) => {
  return {
    container: {
      display: 'flex',
      gap: theme.spacing(4),
      flexDirection: (props) => (props.row ? 'row' : 'column'),
    },
  };
});

export const Container: FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  return <div className={classes.container}>{props.children}</div>;
};

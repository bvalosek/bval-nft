import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

interface Props {
  accent?: boolean;
}

const useStyles = makeStyles<ThemeConfig, Props>((theme) => {
  return {
    vibes: {
      color: (props) => (props.accent === false ? theme.palette.foreground.main : theme.palette.accent.main),
      fontWeight: 'bold',
    },
  };
});

export const Vibes: FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  return <span className={classes.vibes}>VIBES</span>;
};

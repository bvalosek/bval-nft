import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

interface Props {
  align?: 'center' | 'left' | 'right';
}

const useStyles = makeStyles<ThemeConfig, Props>((theme) => {
  return {
    header: {
      fontSize: theme.spacing(4.5),
      '@media(min-width: 800px)': { fontSize: theme.spacing(5.5) },
      margin: theme.scaledSpacing(5),
      textDecoration: 'underline',
      fontWeight: 'bold',
      textAlign: (props) => props.align ?? 'center',
      color: theme.palette.accent.secondary,
    },
  };
});

export const Title: FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  return <div className={classes.header}>{props.children}</div>;
};
import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

interface Props {
  align?: 'center' | 'left' | 'right';
}

const useStyles = makeStyles<ThemeConfig, Props>((theme) => {
  return {
    header: {
      fontSize: theme.scaledSpacing(4.5),
      margin: theme.scaledSpacing(5),
      textDecoration: 'underline',
      textAlign: (props) => props.align ?? 'center',
    },
  };
});

export const Title: FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  return <div className={classes.header}>{props.children}</div>;
};

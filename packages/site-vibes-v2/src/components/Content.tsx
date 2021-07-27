import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    content: {
      fontSize: theme.spacing(4),
      gap: theme.spacing(5),
      '@media(min-width: 800px)': {
        fontSize: theme.spacing(5),
        gap: theme.spacing(10),
      },
      display: 'grid',
      '& a': {
        color: theme.palette.accent.tertiary,
        textDecoration: 'underline',
      },
      '& strong': {
        fontWeight: 'bold',
        color: theme.palette.accent.secondary,
      },
    },
  };
});

export const Content: FunctionComponent = (props) => {
  const classes = useStyles();
  return <div className={classes.content}>{props.children}</div>;
};

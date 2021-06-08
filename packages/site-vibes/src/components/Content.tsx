import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    content: {
      fontSize: theme.scaledSpacing(4),
      display: 'grid',
      gap: theme.spacing(10),
      '& a': {
        color: theme.palette.accent.secondary,
      },
      '& strong': {
        color: theme.palette.accent.tertiary,
      },
    },
  };
});

export const Content: FunctionComponent = (props) => {
  const classes = useStyles();
  return <div className={classes.content}>{props.children}</div>;
};

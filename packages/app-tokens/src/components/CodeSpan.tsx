import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent, HTMLProps } from 'react';
import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    code: {
      fontSize: theme.spacing(3.2),
      fontFamily: '"Menlo", "Monaco", monospace',
      padding: theme.spacing(0.5, 1.5),
      borderRadius: theme.spacing(1),
    },
  };
});

export const CodeSpan: FunctionComponent<HTMLProps<HTMLSpanElement>> = (props) => {
  const classes = useStyles();
  const className = `${classes.code} ${props.className ?? ''}`;
  return (
    <span {...props} className={className}>
      {props.children}
    </span>
  );
};

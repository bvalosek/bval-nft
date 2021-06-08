import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

type Props = React.HtmlHTMLAttributes<HTMLSpanElement>;

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    inner: {
      '&:hover': {
        background: theme.palette.accent.main,
        color: theme.palette.foreground.main,
      },
    },
    button: {
      cursor: 'pointer',
    },
  };
});

export const Button: FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const { ...attr } = props;
  const className = `${props.className ?? ''} ${classes.button}`;
  return (
    <span {...attr} className={className}>
      [<span className={classes.inner}>{props.children}</span>]
    </span>
  );
};

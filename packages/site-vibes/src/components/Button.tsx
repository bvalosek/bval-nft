import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { ThemeConfig } from '../Theme';

type Props = React.HtmlHTMLAttributes<HTMLSpanElement> & {
  navTo?: string;
  externalNavTo?: string;
};

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
  const history = useHistory();

  const { navTo, externalNavTo, ...attr } = props;
  const className = `${props.className ?? ''} ${classes.button}`;

  if (navTo) {
    attr.onClick = () => {
      history.push(navTo);
    };
  } else if (externalNavTo) {
    attr.onClick = () => window.open(externalNavTo, '_blank');
  }

  return (
    <span {...attr} className={className}>
      [<span className={classes.inner}>{props.children}</span>]
    </span>
  );
};

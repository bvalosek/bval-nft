import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { ThemeConfig } from '../Theme';

type Props = React.HtmlHTMLAttributes<HTMLSpanElement> & {
  navTo?: string;
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

  const { navTo, ...attr } = props;
  const className = `${props.className ?? ''} ${classes.button}`;

  if (navTo) {
    attr.onClick = () => {
      history.push(navTo);
    };
  }

  return (
    <span {...attr} className={className}>
      [<span className={classes.inner}>{props.children}</span>]
    </span>
  );
};

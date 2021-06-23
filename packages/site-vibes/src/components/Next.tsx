import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { ThemeConfig } from '../Theme';

interface Props {
  label?: string;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    notFlash: {
      color: theme.palette.accent.quadriarylolwhat,
    },
    flash: {
      color: theme.palette.accent.tertiary,
    },
  };
});

export const New: FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const flash = useRef(0);
  const [isFlash, setIsFlash] = useState(false);
  const flashStart = 5;
  const flashEnd = 7;
  const clickTime = 100;

  useEffect(() => {
    const h = setInterval(() => {
      flash.current = (flash.current + 1) % flashEnd;
      setIsFlash(flash.current >= flashStart);
    }, clickTime);

    return () => clearInterval(h);
  }, []);

  return <span className={isFlash ? classes.flash : classes.notFlash}>{(props.label ?? '☀ NEW!').toUpperCase()}</span>;
};

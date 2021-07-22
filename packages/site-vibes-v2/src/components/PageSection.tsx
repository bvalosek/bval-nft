import { makeStyles } from '@material-ui/styles';

import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

interface Props {
  maxWidth?: number | string;
  padding?: number | string;
  className?: string;
}

const useStyles = makeStyles<ThemeConfig, Props>((theme) => {
  return {
    section: {
      display: 'flex',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      maxWidth: (props) => props.maxWidth ?? theme.maxWidth,
      '@media(max-width: 999px)': {
        padding: (props) => props.padding ?? theme.spacing(4),
      },
      paddingTop: (props) => props.padding ?? theme.spacing(4),
      paddingBottom: (props) => props.padding ?? theme.spacing(4),
    },
  };
});

/** centered / max-width page section */
export const PageSection: FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  const className = `${props.className ?? ''} ${classes.section}`;
  return (
    <div className={className}>
      <div className={classes.container}>{props.children}</div>
    </div>
  );
};

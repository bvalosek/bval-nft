import { makeStyles } from '@material-ui/styles';

import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

interface Props {
  backgroundColor?: string;
}

const useStyles = makeStyles<ThemeConfig, Props>((theme) => {
  return {
    section: {
      display: 'flex',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      maxWidth: theme.maxWidth,
      padding: theme.scaledSpacing(4, 1.5),
    },
  };
});

/** centered / max-width page section */
export const PageSection: FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  return (
    <div className={classes.section}>
      <div className={classes.container}>{props.children}</div>
    </div>
  );
};

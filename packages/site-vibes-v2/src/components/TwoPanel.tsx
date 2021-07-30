import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

interface Props {
  template?: string;
  alignItems?: string;
}

const useStyles = makeStyles<ThemeConfig, Props>((theme) => {
  return {
    panel: {
      '@media(min-width: 800px)': {
        display: 'grid',
        alignItems: (props) => props.alignItems ?? 'flex-start',
        gridTemplateColumns: (props) => props.template ?? '1fr 1fr',
        gap: theme.spacing(8),
      },
      '@media(max-width:799px)': {
        '& > div:first-child': { marginBottom: theme.spacing(4) },
      },
    },
  };
});

export const TwoPanel: FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  return <div className={classes.panel}>{props.children}</div>;
};

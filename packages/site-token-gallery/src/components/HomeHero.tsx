import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/styles';

import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    hero: {
      minHeight: '35vh',
      '& h1': {
        textTransform: 'uppercase',
        lineHeight: 1,
        fontSize: theme.scaledSpacing(10, 4),
      },
      '& h2': {
        fontWeight: 'normal',
        fontSize: theme.scaledSpacing(5),
      },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.palette.accent.main,
    },
    container: {
      maxWidth: theme.maxWidth,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
    },
  };
});

/** home page hero header */
export const HomeHero: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <div className={classes.hero}>
      <div className={classes.container}>
        <h1>
          Brandon
          <br />
          Valosek
        </h1>
        <h2>Experiments in Tokenization</h2>
      </div>
    </div>
  );
};

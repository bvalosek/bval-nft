import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    hero: {
      minHeight: '15vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      '& h1': {
        textTransform: 'lowercase',
        textDecoration: 'underline',
        lineHeight: 1,
        fontSize: theme.scaledSpacing(6, 4),
        letterSpacing: theme.scaledSpacing(4),
        marginLeft: theme.scaledSpacing(4),
        color: theme.palette.accent.main,
      },
      container: {
        maxWidth: theme.maxWidth,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
      },
    },
  };
});

export const Hero: FunctionComponent = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.hero}>
      <div className={classes.container}>
        <h1>
          <span>{children}</span>
        </h1>
      </div>
    </div>
  );
};

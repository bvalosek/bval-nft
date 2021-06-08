import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeConfig } from '../Theme';
import { PageSection } from './PageSection';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      textTransform: 'uppercase',
      fontSize: theme.scaledSpacing(4),
    },
    activeLink: {
      color: theme.palette.accent.secondary,
      opacity: 1,
    },
  };
});

export const Menu: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <PageSection maxWidth="600px">
      <div className={classes.container}>
        <div>
          <NavLink exact to="/info" activeClassName={classes.activeLink}>
            Info
          </NavLink>
        </div>
        <div>
          <NavLink to="/tokens" activeClassName={classes.activeLink}>
            Tokens
          </NavLink>
        </div>
        <div>
          <NavLink to="/stats" activeClassName={classes.activeLink}>
            Stats
          </NavLink>
        </div>
      </div>
    </PageSection>
  );
};

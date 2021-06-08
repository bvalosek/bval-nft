import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useWallet } from '../hooks/wallet';
import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { PageSection } from './PageSection';
import { Vibes } from './Vibes';
import { WalletButton } from './WalletButton';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      fontSize: theme.scaledSpacing(3),
      '& > div:first-child': {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
      },
      paddingTop: theme.scaledSpacing(2, 2),
      paddingLeft: theme.scaledSpacing(4, 1.5),
      paddingRight: theme.scaledSpacing(4, 1.5),
    },
    logo: {
      background: theme.palette.accent.main,
      padding: `${theme.scaledSpacing(0)} ${theme.scaledSpacing(1)}`,
      marginRight: theme.scaledSpacing(1),
    },
    cut: {
      display: 'none',
      '@media(min-width: 800px)': {
        display: 'inherit',
      },
    },
    navs: {
      display: 'flex',
      '& > div': {
        marginLeft: theme.scaledSpacing(3),
        cursor: 'pointer',
        '& *:hover': {
          background: theme.palette.accent.main,
          color: theme.palette.foreground.main,
        },
      },
    },
    activeLink: {
      color: theme.palette.accent.secondary,
    },
  };
});

export const NavBar: FunctionComponent = () => {
  const classes = useStyles();
  const { state } = useWallet();
  return (
    <PageSection padding="0" maxWidth="1200px">
      <div className={classes.container}>
        <div>
          <Button>
            <Link to="/">
              <Vibes accent={false} />
            </Link>
          </Button>
        </div>
        <div className={classes.navs}>
          <div className={classes.cut}>
            [
            <NavLink to="/tokens" activeClassName={classes.activeLink}>
              TOKENS
            </NavLink>
            ]
          </div>
          <div className={classes.cut}>
            [
            <NavLink to="/info" activeClassName={classes.activeLink}>
              INFO
            </NavLink>
            ]
          </div>
          <div>
            [
            {state === 'ready' ? (
              <NavLink to="/wallet" activeClassName={classes.activeLink}>
                <WalletButton />
              </NavLink>
            ) : (
              <WalletButton />
            )}
            ]
          </div>
        </div>
      </div>
    </PageSection>
  );
};

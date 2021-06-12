import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useWallet } from '../hooks/wallet';
import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { PageSection } from './PageSection';
import { Vibes } from './Vibes';
import { WalletButton } from './WalletButton';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    section: {
      position: 'fixed',
      width: '100%',
      background: theme.palette.background.main,
      padding: theme.spacing(3.5),
      '@media(min-width: 800px)': { fontSize: theme.spacing(4.5) },
      zIndex: 1000,
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      '& > div:first-child': {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
      },
    },
    navs: {
      display: 'flex',
      '& > *': {
        marginLeft: theme.spacing(4),
      },
    },
    menu: {
      background: theme.palette.background.main,
      marginTop: theme.spacing(5.5),
      minHeight: '100vh',
      textAlign: 'right',
      '& > *': {
        marginBottom: theme.spacing(3),
      },
    },
  };
});

export const NavBar: FunctionComponent = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withClose = (fn: () => any) => () => {
    setOpen(false);
    fn();
  };

  return (
    <PageSection padding="0" className={classes.section}>
      <div className={classes.container}>
        <div>
          {!open && (
            <Button>
              <Link to="/">
                <Vibes accent={false} />
              </Link>
            </Button>
          )}
        </div>
        <div className={classes.navs}>
          {!open && <WalletButton />}
          <div>
            <Button onClick={() => setOpen(!open)}>{open ? 'close' : '..'}</Button>
          </div>
        </div>
      </div>
      {open && (
        <div className={classes.menu}>
          <div>
            <Button onClick={withClose(() => history.push('/info'))}>info</Button>
          </div>
          <div>
            <Button onClick={withClose(() => history.push('/tokens'))}>tokens</Button>
          </div>
          <div>
            <Button onClick={withClose(() => history.push('/wallet'))}>wallet</Button>
          </div>
        </div>
      )}
    </PageSection>
  );
};

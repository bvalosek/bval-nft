import { makeStyles } from '@material-ui/styles';
import { Link } from 'gatsby';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';
import { PageSection } from './PageSection';
// import { WalletBalance } from './WalletBalance';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center',
      gap: theme.scaledSpacing(5),
      textTransform: 'uppercase',
    },
    logo: {
      background: theme.palette.accent.main,
      color: theme.palette.foreground.main,
      fontSize: theme.scaledSpacing(3.5),
      fontWeight: 'bold',
      padding: theme.scaledSpacing(2),
      display: 'inline',
    },
    title: {
      fontSize: theme.scaledSpacing(3.5),
      fontWeight: 'bold',
      display: 'none',
      '@media(min-width:800px)': { display: 'inherit' },
    },
    link: {
      fontSize: theme.scaledSpacing(3.5),
      color: theme.palette.foreground.main,
      display: 'none',
      '@media(min-width:800px)': { display: 'inherit' },
    },
  };
});

export const MenuBar: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <>
      <PageSection>
        <div className={classes.container}>
          <div>
            <Link to="/">
              <div className={classes.logo}>@bvalosek</div>
            </Link>
          </div>
          <div className={classes.title}>
            <Link to="/">Experiments in Tokenization</Link>
          </div>
        </div>
      </PageSection>
    </>
  );
};

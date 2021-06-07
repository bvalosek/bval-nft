import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
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
  };
});

export const Menu: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <PageSection maxWidth="600px">
      <div className={classes.container}>
        <div>Info</div>
        <div>Tokens</div>
        <div>Stats</div>
      </div>
    </PageSection>
  );
};

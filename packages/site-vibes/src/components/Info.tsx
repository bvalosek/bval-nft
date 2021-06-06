import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    content: {
      fontSize: theme.scaledSpacing(4),
      display: 'grid',
      gap: theme.spacing(5),
    },
  };
});

export const Info: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <PageSection>
      <div className={classes.content}>
        <p>🐇 The journey continues.</p>
      </div>
    </PageSection>
  );
};

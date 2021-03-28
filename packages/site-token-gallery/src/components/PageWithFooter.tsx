import React, { FunctionComponent } from 'react';
import { Footer } from './Footer';
import { Page } from './Page';

import { makeStyles } from '@material-ui/styles';
import { Divider } from './Divider';
import { PageSection } from './PageSection';

const useStyles = makeStyles(() => {
  return {
    container: {
      display: 'grid',
      minHeight: '100vh',
      gridTemplateRows: '1fr auto',
    },
  };
});

/**
 * a Page component that is height-padded to ensure footer is at the bottom of
 * the page
 */
export const PageWithFooter: FunctionComponent = (props) => {
  const classes = useStyles();
  return (
    <Page>
      <div className={classes.container}>
        <div>{props.children}</div>
        <PageSection>
          <Divider />
        </PageSection>
        <Footer />
      </div>
    </Page>
  );
};

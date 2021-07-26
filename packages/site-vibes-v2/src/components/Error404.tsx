import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { Connect } from './Connect';
import { Content } from './Content';
import { Title } from './Title';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';

export const Error404: FunctionComponent = () => {
  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <Title>⚠️ Page Not Found</Title>
            <p>The request page was not found</p>
            <ButtonGroup>
              <Button onClick={() => window.history.back()}>BACK</Button>
            </ButtonGroup>
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};

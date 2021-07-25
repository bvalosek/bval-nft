import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { Connect } from './Connect';
import { Content } from './Content';
import { Title } from './Title';

export const ManageSQNCRs: FunctionComponent = () => {
  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <Title>Manage SQNCRs</Title>
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};

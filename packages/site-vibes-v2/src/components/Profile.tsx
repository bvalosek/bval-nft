import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { PageSection } from './PageSection';
import { Address } from './Address';
import { Content } from './Content';
import { Title } from './Title';

interface Params {
  address: string;
}

export const Profile: FunctionComponent = () => {
  const { address } = useParams<Params>();
  return (
    <PageSection>
      <Content>
        <Title>
          <Address address={address} />
        </Title>
      </Content>
    </PageSection>
  );
};

import { Card, Tabs } from '@geist-ui/react';
import React, { FunctionComponent } from 'react';
import { Deploy } from './Deploy';
import { ManageFaucet } from './ManageFaucet';
import { Tasks } from './Tasks';

export const MainScreen: FunctionComponent = () => {
  return (
    <Card>
      <Tabs initialValue="3">
        <Tabs.Item label="BVAL721 Tasks" value="1">
          <Tasks />
        </Tabs.Item>
        <Tabs.Item label="Deploy BVAL721" value="2">
          <Deploy />
        </Tabs.Item>
        <Tabs.Item label="Manage VIBES Faucet" value="3">
          <ManageFaucet />
        </Tabs.Item>
      </Tabs>
    </Card>
  );
};

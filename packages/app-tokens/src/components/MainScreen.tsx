import { Card, Tabs } from '@geist-ui/react';
import React, { FunctionComponent } from 'react';
import { Deploy } from './Deploy';

export const MainScreen: FunctionComponent = () => {
  return (
    <Card>
      <Tabs initialValue="1">
        <Tabs.Item label="BVAL721 Tasks" value="1">
          <p>Tasks</p>
        </Tabs.Item>
        <Tabs.Item label="Deploy BVAL721" value="2">
          <Deploy />
        </Tabs.Item>
      </Tabs>
    </Card>
  );
};

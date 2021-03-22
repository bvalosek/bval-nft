import { Card, Tabs } from '@geist-ui/react';
import React, { FunctionComponent } from 'react';

export const MainScreen: FunctionComponent = () => {
  return (
    <Card>
      <Tabs initialValue="1">
        <Tabs.Item label="BVAL721 Tasks" value="1">
          <p>Tasks</p>
        </Tabs.Item>
        <Tabs.Item label="Deploy BVAL721" value="2">
          <p>Deploy</p>
        </Tabs.Item>
        <Tabs.Item label="Deploy BVAL20" value="3">
          <p>Deploy</p>
        </Tabs.Item>
      </Tabs>
    </Card>
  );
};

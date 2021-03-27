import React, { FunctionComponent } from 'react';

export const SequencePage: FunctionComponent = (props) => {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
};

export default SequencePage;
